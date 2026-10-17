import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assess } from '../src/assess.ts';

const diepkloof = { name: 'Diepkloof Grocery Society', members: 12, monthsActive: 18, contributionRecord: 'oooooooooooo', priorLoans: 3, defaults: 0, reserveBalance: '4200.00', reserveFloor: '2000.00' };

test('Tier A, approve when repayment lands before the payout', () => {
  const a = assess(diepkloof, '8000.00', 30, 18, '2026-11-16', '2026-11-28', '15750.00');
  assert.equal(a.tier, 'A');
  assert.equal(a.recommend, true);
  assert.match(a.reasoning, /Repayment is due 16 Nov, 12 days before your payout\. I’d approve at 18%\.$/);
});

test('decline a term that runs past the payout', () => {
  const a = assess({ ...diepkloof, name: 'Kagiso Investment Collective', monthsActive: 24, members: 8 }, '15000.00', 90, 16, '2027-01-15', '2026-11-28', '15750.00');
  assert.equal(a.tier, 'A');
  assert.equal(a.recommend, false);
  assert.match(a.reasoning, /offer 30 days instead/);
});

test('one late month is Tier B; two missed is Tier C', () => {
  assert.equal(assess({ ...diepkloof, contributionRecord: 'oooooolooooo', reserveBalance: '2600.00', reserveFloor: '2500.00' }, '3000.00', 30, 22, '2026-11-16', '2026-11-28').tier, 'B');
  const c = assess({ ...diepkloof, contributionRecord: 'oommoo', monthsActive: 7 }, '6000.00', 45, 20, '2026-11-25', '2026-11-28');
  assert.equal(c.tier, 'C');
  assert.equal(c.recommend, false);
});
