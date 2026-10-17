import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decide, nextPayoutDate } from '../src/decide.ts';
import type { AgentState, Member } from '../src/types.ts';

const m = (id: string, name: string, rate: number, balance: string, status: 'CLEARED' | 'CURRENT' | 'WAITING', extra: Partial<Member> = {}): Member => ({
  id, name, initials: name.slice(0, 2), role: 'MEMBER', contributionAmount: '800.00', mandateStatus: 'ACTIVE', queueStatus: status,
  debt: { creditor: 'Store card', kind: 'Store card', startBalance: '42000.00', balance, interestRate: rate, minimumPayment: '1260.00', status: status === 'CLEARED' ? 'CLEARED' : 'ACTIVE' },
  ...extra,
});

const state = (over: Partial<AgentState> = {}, stokvel: Partial<AgentState['stokvel']> = {}): AgentState => ({
  asOf: '2026-10-17T06:08:00+02:00',
  poolBalance: '6500.00',
  paused: false,
  stokvel: { id: 'masakhane', name: 'Masakhane Debt Freedom', type: 'DEBT_PAYOFF', contributionAmount: '800.00', frequency: 'MONTHLY', reserveFloor: '5000.00', memberCount: 3, autonomous: true, recycling: { enabled: true, percentage: 100, graceMonths: 0 }, ...stokvel },
  members: [m('zanele', 'Zanele Dlamini', 28, '0.00', 'CLEARED'), m('thabo', 'Thabo Nkosi', 24, '40740.00', 'CURRENT'), m('kagiso', 'Kagiso Sithole', 23, '27090.00', 'WAITING')],
  contributions: [],
  ...over,
});

const oct17 = new Date('2026-10-17T00:00:00Z');
const nov2 = new Date('2026-11-02T00:00:00Z');

test('next payout is the 2nd of next month', () => {
  assert.equal(nextPayoutDate(oct17).toISOString().slice(0, 10), '2026-11-02');
});

test('pauses and names the member when a contribution is overdue', () => {
  const s = state({ contributions: [{ id: '1', memberId: 'thabo', period: '2026-10', amount: '800.00', status: 'FAILED', dueDate: '2026-10-14' }] });
  const d = decide(s, 'CONTRIBUTION_WEBHOOK', oct17, 650000);
  assert.equal(d.outcome, 'PAUSE');
  assert.equal(d.type, 'PAUSE');
  assert.match(d.summary, /^Paused\. Thabo Nkosi’s contribution is 3 days overdue\. Pool payout held\.$/);
  assert.match(d.ruleApplied, /holding R6,500/);
  assert.equal(d.ledger, undefined);
});

test('pauses when a mandate is cancelled, and stays quiet while still paused', () => {
  const members = state().members.map((x) => (x.id === 'kagiso' ? { ...x, mandateStatus: 'FAILED' as const } : x));
  const first = decide(state({ members }), 'CONTRIBUTION_WEBHOOK', oct17, 650000);
  assert.equal(first.outcome, 'PAUSE');
  assert.match(first.ruleApplied, /^I paused the 2 Nov payout because Kagiso Sithole’s bank cancelled their DebiCheck mandate\. Your R6,500 is untouched\./);
  const again = decide(state({ members, paused: true }), 'SCHEDULED_TICK', oct17, 650000);
  assert.equal(again.outcome, 'NO_ACTION');
  assert.equal(again.type, undefined);
});

test('pauses below the reserve floor', () => {
  assert.equal(decide(state(), 'MANUAL', oct17, 400000).outcome, 'PAUSE');
});

test('resumes once the reason has gone', () => {
  const d = decide(state({ paused: true }), 'MANUAL', oct17, 650000);
  assert.equal(d.type, 'RESUME');
});

test('pays everything above the reserve to the highest-rate debt', () => {
  const d = decide(state(), 'MANUAL', oct17, 650000);
  assert.equal(d.outcome, 'EXECUTE');
  assert.equal(d.type, 'PAYMENT');
  assert.deepEqual(d.actions, [{ type: 'EFT_PAYMENT', member_id: 'thabo', amount: '1500.00' }]);
  assert.deepEqual(d.ledger, { type: 'DEBT_PAYMENT', description: 'Paid toward Thabo Nkosi’s store card', counterparty: 'Thabo Nkosi', amount: '-1500.00' });
});

test('clears a debt and notes the recycled minimum', () => {
  const members = state().members.map((x) => (x.id === 'thabo' ? { ...x, debt: { ...x.debt!, balance: '1200.00' } } : x));
  const d = decide(state({ members }), 'MANUAL', oct17, 650000);
  assert.equal(d.type, 'CLEARED');
  assert.equal(d.ledger?.amount, '-1200.00');
  assert.match(d.ruleApplied, /R1,260 of their freed minimum joins the pool/);
  assert.match(d.outcomeText, /Kagiso Sithole is now first in the queue/);
});

test('scheduled ticks pay from the 2nd, not on the 1st', () => {
  assert.equal(decide(state(), 'SCHEDULED_TICK', new Date('2026-11-01T00:00:00Z'), 650000).outcome, 'NO_ACTION');
  assert.equal(decide(state(), 'SCHEDULED_TICK', nov2, 650000).outcome, 'EXECUTE');
  assert.equal(decide(state(), 'SCHEDULED_TICK', oct17, 650000).outcome, 'EXECUTE');
});

test('targets the highest-rate open debt even if core marks someone else current', () => {
  const members = state().members.map((x) => (x.id === 'kagiso' ? { ...x, queueStatus: 'CURRENT' as const, debt: { ...x.debt!, interestRate: 30 } } : x.id === 'thabo' ? { ...x, queueStatus: 'WAITING' as const } : x));
  assert.equal(decide(state({ members }), 'MANUAL', oct17, 650000).actions[0].member_id, 'kagiso');
});

test('a pending contribution more than two days overdue pauses', () => {
  const s2 = state({ contributions: [{ id: '1', memberId: 'thabo', period: '2026-10', amount: '800.00', status: 'PENDING', dueDate: '2026-10-01' }] });
  assert.equal(decide(s2, 'SCHEDULED_TICK', oct17, 650000).outcome, 'PAUSE');
});

test('amounts in reasoning keep their cents', () => {
  assert.match(decide(state(), 'MANUAL', oct17, 650050).ruleApplied, /R1,500\.50/);
});

test('proposes instead of paying in approval mode', () => {
  const d = decide(state({}, { autonomous: false }), 'MANUAL', oct17, 650000);
  assert.equal(d.outcome, 'PROPOSE');
  assert.equal(d.ledger, undefined);
  assert.deepEqual(d.actions, []);
});

test('is a pure function: same inputs, same decision', () => {
  assert.deepEqual(decide(state(), 'MANUAL', oct17, 650000), decide(state(), 'MANUAL', oct17, 650000));
});
