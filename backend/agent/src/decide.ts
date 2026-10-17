/**
 * The decision loop (system design §2.3 and §4). A pure function of its inputs: no I/O, no clock, no state.
 * Same inputs → same decision, so every decision in the ledger can be replayed.
 */
import type { AgentState, DecisionType, KeyValue, LedgerEntryType, Member, Trigger } from './types.ts';
import { cents, daysBetween, first, rand, shortDate, str } from './money.ts';

export interface Decision {
  outcome: 'EXECUTE' | 'PAUSE' | 'PROPOSE' | 'NO_ACTION';
  /** When set, the decision is written to core (and the ledger, if `ledger` is set). Unset means a quiet tick. */
  type?: DecisionType;
  summary: string;
  inputs: KeyValue[];
  /** What I decided — first person, plain language. */
  ruleApplied: string;
  /** What happened. */
  outcomeText: string;
  actions: { type: 'ARC_ESCROW_RELEASE' | 'EFT_PAYMENT' | 'RECYCLE_MINIMUM' | 'NOTIFY'; member_id?: string; amount?: string }[];
  ledger?: { type: LedgerEntryType; description: string; counterparty: string; amount: string };
}

const quiet = (reason: string): Decision => ({ outcome: 'NO_ACTION', summary: reason, inputs: [], ruleApplied: reason, outcomeText: reason, actions: [] });

/** The 2nd of the month after `today` (or this month's, if it hasn't passed). Debt-payoff payouts go out on the 2nd. */
export function nextPayoutDate(today: Date): Date {
  const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 2));
  return today.getUTCDate() <= 2 ? d : new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 2));
}

export function decide(state: AgentState, trigger: Trigger, today: Date, poolCents: number): Decision {
  const s = state.stokvel;
  if (s.type === 'DEBT_PAYOFF') return decideDebtPayoff(state, trigger, today, poolCents);
  return decideLending(state, today);
}

function decideDebtPayoff(state: AgentState, trigger: Trigger, today: Date, pool: number): Decision {
  const s = state.stokvel;
  const reserve = cents(s.reserveFloor);
  const payout = nextPayoutDate(today);
  const members = state.members;
  // Highest rate first, unless the constitution drew lots (then core's queue order decides).
  const open = members.filter((m) => m.debt && m.debt.status !== 'CLEARED' && cents(m.debt.balance) > 0);
  const current = s.queueOrder === 'DRAWN_LOTS'
    ? members.find((m) => m.queueStatus === 'CURRENT')
    : [...open].sort((a, b) => (b.debt!.interestRate - a.debt!.interestRate) || ((a.queuePosition ?? 0) - (b.queuePosition ?? 0)))[0];
  const nextPay = current
    ? `${shortDate(payout)}, ${rand(members.filter((m) => m.mandateStatus === 'ACTIVE').reduce((a, m) => a + cents(m.contributionAmount), 0) + Math.max(0, pool - reserve))} to ${first(current.name)}’s lender`
    : '—';

  // Step 1: preconditions. The constitution only allows a payout when every mandate is active and every
  // contribution for the month is in, and never from the reserve floor.
  const failedMandate = members.find((m) => m.mandateStatus === 'FAILED');
  if (failedMandate) {
    if (state.paused) return quiet(`Still paused: ${failedMandate.name}’s mandate isn’t active yet.`);
    const n = failedMandate.name;
    return {
      outcome: 'PAUSE',
      type: 'PAUSE',
      summary: `Paused the ${shortDate(payout)} payout. ${n}’s mandate was cancelled by their bank.`,
      inputs: [
        { label: `${first(n)}’s mandate`, value: 'Cancelled by bank' },
        { label: 'Next payout', value: nextPay },
        { label: 'Pool', value: `${rand(pool)} · reserve ${rand(reserve)}` },
        { label: 'Constitution', value: 'All mandates active before a payout' },
      ],
      ruleApplied: `I paused the ${shortDate(payout)} payout because ${n}’s bank cancelled their DebiCheck mandate. Your ${rand(pool)} is untouched. I’ll resume when they re-approve it, and I’ve sent them a WhatsApp link.`,
      outcomeText: 'Payout on hold. Nothing has left the pool. I’ll resume as soon as their new mandate is active.',
      actions: [{ type: 'NOTIFY', member_id: failedMandate.id }],
    };
  }

  // Overdue: a failed collection, or one still pending more than two days after its due date.
  const failed = (state.contributions ?? []).filter((c) => c.status === 'FAILED'
    || (c.status === 'PENDING' && !!c.dueDate && daysBetween(new Date(c.dueDate + 'T00:00:00Z'), today) > 2));
  if (failed.length > 0) {
    const m = members.find((x) => x.id === failed[0].memberId);
    const name = m?.name ?? 'A member';
    const due = failed[0].dueDate ? new Date(failed[0].dueDate + 'T00:00:00Z') : today;
    const overdue = Math.max(0, daysBetween(due, today));
    if (state.paused) return quiet(`Still paused: ${name}’s contribution is ${overdue} days overdue.`);
    const collected = (state.contributions ?? []).filter((c) => c.status === 'COLLECTED' || c.status === 'RETRIED');
    return {
      outcome: 'PAUSE',
      type: 'PAUSE',
      summary: `Paused. ${name}’s contribution is ${overdue} ${overdue === 1 ? 'day' : 'days'} overdue. Pool payout held.`,
      inputs: [
        { label: 'Collected', value: `${collected.length} of ${members.length}` },
        { label: name, value: `${rand(cents(failed[0].amount))} failed, ${overdue} ${overdue === 1 ? 'day' : 'days'} overdue` },
        { label: 'Pool held', value: rand(pool) },
      ],
      ruleApplied: `A payout only goes out when every contribution for the month is in. ${name}’s ${rand(cents(failed[0].amount))} is ${overdue} ${overdue === 1 ? 'day' : 'days'} overdue, so I’m holding ${rand(pool)} in the pool and sent them a WhatsApp reminder about the retry.`,
      outcomeText: 'Payout held. Nothing has left the pool.',
      actions: [{ type: 'NOTIFY', member_id: m?.id }],
    };
  }

  if (pool < reserve) {
    if (state.paused) return quiet(`Still paused: the pool is ${rand(reserve - pool)} below the reserve floor.`);
    return {
      outcome: 'PAUSE',
      type: 'PAUSE',
      summary: `Paused payouts. The pool is ${rand(reserve - pool)} below the reserve floor.`,
      inputs: [{ label: 'Pool', value: rand(pool) }, { label: 'Reserve floor', value: rand(reserve) }],
      ruleApplied: `The reserve floor is never paid out. The pool holds ${rand(pool)}, below the ${rand(reserve)} floor, so I paused payouts until contributions rebuild it.`,
      outcomeText: 'Payouts on hold. Nothing has left the pool.',
      actions: [],
    };
  }

  // Preconditions pass. If we were paused, say so first; the payout follows on the next evaluation.
  if (state.paused) {
    return {
      outcome: 'NO_ACTION',
      type: 'RESUME',
      summary: 'Resumed payouts. Every mandate is active and every contribution is in.',
      inputs: [
        { label: 'Mandates', value: `${members.filter((m) => m.mandateStatus === 'ACTIVE').length} of ${members.length} active` },
        { label: 'Pool', value: rand(pool) },
      ],
      ruleApplied: 'The reason for the pause no longer applies, so payouts can go ahead as the constitution says.',
      outcomeText: 'Payouts resumed.',
      actions: [],
    };
  }

  // Step 2: the target is the highest-rate active debt.
  if (!current || !current.debt) return quiet('Every debt in the queue is cleared.');
  if (trigger === 'CONTRIBUTION_WEBHOOK') return quiet('Contribution recorded. Payouts go out on the 2nd.');
  // Payouts go out from the 2nd; a tick later in the month still pays what's above the reserve (e.g. after a resume).
  if (trigger === 'SCHEDULED_TICK' && today.getUTCDate() < 2) return quiet(`Next payout on ${shortDate(payout)}.`);
  const available = pool - reserve;
  if (available <= 0) return quiet('Nothing above the reserve floor to pay out.');
  const balance = cents(current.debt.balance);
  const pay = Math.min(available, balance);
  const clears = pay >= balance;
  const n = current.name;
  const kind = current.debt.kind.toLowerCase();
  const rate = current.debt.interestRate;

  // Step 3: recycling effect.
  const recycling = s.recycling?.enabled
    ? Math.round((cents(current.debt.minimumPayment) * (s.recycling.percentage ?? 100)) / 100)
    : 0;
  const recycleNote = clears && recycling > 0 ? ` From their next debit date, ${rand(recycling)} of their freed minimum joins the pool.` : '';
  const nextUp = [...open].filter((m) => m !== current).sort((a, b) => b.debt!.interestRate - a.debt!.interestRate)[0];

  const inputs: KeyValue[] = [
    { label: 'Pool', value: rand(pool) },
    { label: 'Reserve floor', value: rand(reserve) },
    { label: 'Available to pay', value: rand(available) },
    { label: `${first(n)}’s balance`, value: `${rand(balance)} at ${rate}%` },
  ];
  const rule = clears
    ? `${first(n)} has the highest rate in the queue. ${rand(pay)} clears their balance in full and keeps the pool above the reserve floor, so I paid it.${recycleNote}`
    : `${first(n)} has the highest rate in the queue. Everything above the reserve floor, ${rand(pay)}, goes to their lender.`;

  // Step 4: execute, or propose when the constitution wants the treasurer to approve.
  if (!s.autonomous) {
    return {
      outcome: 'PROPOSE',
      type: clears ? 'CLEARED' : 'PAYMENT',
      summary: `Proposed paying ${rand(pay)} toward ${n}’s ${kind}. Waiting for the treasurer.`,
      inputs,
      ruleApplied: rule,
      outcomeText: 'Nothing has moved. The payment goes out when the treasurer approves it.',
      actions: [],
    };
  }
  return {
    outcome: 'EXECUTE',
    type: clears ? 'CLEARED' : 'PAYMENT',
    summary: clears ? `Cleared ${n}’s ${kind} at ${rate}%.` : `Paid ${rand(pay)} toward ${n}’s ${kind}.`,
    inputs,
    ruleApplied: rule,
    outcomeText: `Paid ${rand(pay)} to their lender by EFT.` + (clears && nextUp ? ` ${nextUp.name} is now first in the queue.` : ''),
    actions: [{ type: 'EFT_PAYMENT', member_id: current.id, amount: str(pay) }],
    // Step 5: what the ledger records.
    ledger: {
      type: clears ? 'DEBT_CLEARED' : 'DEBT_PAYMENT',
      description: clears ? `Cleared ${n}’s ${kind}` : `Paid toward ${n}’s ${kind}`,
      counterparty: n,
      amount: str(-pay),
    },
  };
}

/** Grocery / investment / burial: the only autonomous call is to stop lending close to the payout. */
function decideLending(state: AgentState, today: Date): Decision {
  const s = state.stokvel;
  if (!s.lendingEnabled) return quiet('Lending is off.');
  if (s.payoutDate) {
    const left = daysBetween(today, new Date(s.payoutDate + 'T00:00:00Z'));
    if (left <= (s.lendingCutoffDays ?? 14)) return quiet(`Lending stopped: the payout is ${left} days away.`);
  }
  return quiet('Watching the pool. Loan requests are assessed as they arrive.');
}

export type { Member };
