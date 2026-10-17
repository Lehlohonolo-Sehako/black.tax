/**
 * API DTOs → the view-model shapes the screens were designed around (design/black.tax App.dc.html).
 * Pure functions, no fetching.
 */
import type { Schemas } from './client';
import type { Snapshot } from './snapshot';

const n = (s?: string | null) => (s == null ? 0 : Number(s));
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** SAST wall-clock parts of an ISO timestamp. */
const sast = (iso: string) => {
  const d = new Date(new Date(iso).getTime() + 2 * 3600_000);
  return { date: d.toISOString().slice(0, 10), time: d.toISOString().slice(11, 16) };
};
const dayMon = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00Z');
  return `${d.getUTCDate()} ${MON[d.getUTCMonth()]}`;
};
const dayMonYear = (iso?: string | null) => (iso ? `${dayMon(iso)} ${iso.slice(0, 4)}` : '');

const LEDGER_TYPE: Record<Schemas['LedgerEntryType'], string> = {
  CONTRIBUTION: 'contribution', DEBT_PAYMENT: 'payment', DEBT_CLEARED: 'cleared', RECYCLED: 'recycle', COLLECTION_FAILED: 'failed',
  LOAN_OUT: 'lend', LOAN_REPAID: 'contribution', LOAN_DECLINED: 'declined', CONSTITUTION_CHANGE: 'constitution',
};
const TYPE_NAME: Record<Schemas['StokvelType'], string> = {
  GROCERY: 'Grocery Stokvel', ROTATIONAL: 'Rotational Stokvel', BURIAL: 'Burial Stokvel', INVESTMENT: 'Investment Stokvel', DEBT_PAYOFF: 'Debt-Payoff Stokvel',
};

export const typeName = (t: Schemas['StokvelType']) => TYPE_NAME[t];

export function members(snap: Snapshot) {
  const myIds = new Set(snap.me.memberships.filter((m) => m.stokvelId === snap.stokvel.id).map((m) => m.memberId));
  return snap.members.map((m) => ({
    id: m.id,
    name: m.name,
    ini: m.initials,
    phone: m.phone ?? '',
    you: myIds.has(m.id),
    treasurer: m.role === 'TREASURER',
    mandate: m.mandateStatus,
    mandateId: m.mandateId,
    mandateCreated: m.mandateCreated,
    amount: n(m.contributionAmount),
    queueStatus: m.queueStatus,
    debt0: n(m.debt?.startBalance),
    bal: n(m.debt?.balance),
    rate: m.debt?.interestRate ?? 0,
    kind: (m.debt?.kind ?? '').toLowerCase(),
    min: n(m.debt?.minimumPayment),
    m: m.projectedClearMonth ?? 0,
    clearedOn: m.debt?.clearedDate,
    hasDebt: !!m.debt,
    grocery: !m.debt,
  }));
}

export function ledger(page: Schemas['LedgerPage']) {
  return page.entries.map((e) => ({
    id: e.id,
    ...sast(e.timestamp),
    type: LEDGER_TYPE[e.type],
    who: e.counterparty ?? '',
    desc: e.description,
    amt: n(e.amount),
    failAmt: n(e.failedAmount),
    balance: n(e.runningBalance),
    dec: e.decisionId ?? null,
    arc: e.arcTxHash ? e.arcTxHash.slice(0, 6) + '…' + e.arcTxHash.slice(-4) : null,
    arcFull: e.arcTxHash ?? null,
    bean: e.beancount ?? '',
    hash: e.beancountHash ?? '',
    reasoning: e.reasoning ?? '',
  }));
}

export function decisions(list: Schemas['AgentDecision'][]) {
  return list.map((d) => ({
    id: d.id,
    type: d.type.toLowerCase(),
    when: sast(d.at).date + 'T' + sast(d.at).time,
    summary: d.summary,
    saw: d.inputs.map((kv) => [kv.label, kv.value]),
    decided: d.ruleApplied,
    happened: d.outcome,
    ledger: d.ledgerEntryId ?? null,
    arc: d.arcTxHash ? d.arcTxHash.slice(0, 6) + '…' + d.arcTxHash.slice(-4) : null,
  }));
}

export function requests(list: Schemas['LoanRequest'][]) {
  return list.map((r) => ({
    id: r.id,
    name: r.borrower.name,
    type: TYPE_NAME[r.borrower.type],
    amount: n(r.amount),
    days: r.termDays,
    rate: r.ratePct,
    tier: r.assessment?.tier ?? 'C', // unassessed requests are treated as the most cautious tier
    members: r.borrower.members,
    months: r.borrower.monthsActive,
    due: dayMonYear(r.dueDate),
    interest: n(r.interest),
    note: r.assessment?.note ?? '',
    purpose: r.purpose ?? '',
    record: (r.borrower.contributionRecord ?? '').slice(-12), // never pad: an unknown month is not an on-time month
    loans: r.borrower.priorLoans ?? 0,
    defaults: r.borrower.defaults ?? 0,
    resBal: n(r.borrower.reserveBalance),
    resFloor: n(r.borrower.reserveFloor),
    escrow: r.escrowAddress ?? 'Created on approval',
    recommend: r.assessment?.recommend ?? false,
    reasoning: r.assessment?.reasoning ?? 'Waiting for the agent’s assessment.',
  }));
}

export function loans(list: Schemas['Loan'][]) {
  const status = { ON_TRACK: 'ontrack', DUE_SOON: 'duesoon', OVERDUE: 'overdue', REPAID: 'ontrack' } as const;
  return list.map((l) => ({
    id: l.id, name: l.counterparty, principal: n(l.principal), rate: l.ratePct, days: l.termDays,
    repaid: n(l.repaid), total: n(l.totalDue), due: dayMon(l.dueDate), status: status[l.status],
  }));
}

export function notifications(list: Schemas['Notification'][]) {
  return list.map((x) => {
    const t = sast(x.at);
    const d = new Date(t.date + 'T00:00:00Z');
    return { id: x.id, text: x.text, time: `${d.getUTCDate()} ${MON[d.getUTCMonth()]}, ${t.time}`, dec: x.decisionId ?? null, type: (x.decisionType ?? 'HOLD').toLowerCase(), unread: x.unread };
  });
}

export { dayMon, dayMonYear, n };
