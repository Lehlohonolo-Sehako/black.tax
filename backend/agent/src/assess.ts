/**
 * Credit assessment for inter-stokvel loans (system design §2.3). Output is a tier, not a score:
 * a letter carries no false precision. Pure function.
 */
import { cents, rand } from './money.ts';

export interface Borrower {
  name: string;
  members: number;
  monthsActive: number;
  contributionRecord?: string; // last 12 months: o on time, l late, m missed
  priorLoans?: number;
  defaults?: number;
  reserveBalance?: string;
  reserveFloor?: string;
}

export interface Assessment {
  tier: 'A' | 'B' | 'C';
  recommend: boolean;
  reasoning: string;
  note: string;
  inputs: { label: string; value: string }[];
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDay = (iso: string) => {
  const d = new Date(iso + 'T00:00:00Z');
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()].slice(0, 3)}`;
};

export function assess(b: Borrower, amount: string, termDays: number, ratePct: number, dueDate: string, payoutDate?: string, lendable?: string): Assessment {
  const record = b.contributionRecord ?? '';
  const missed = [...record].filter((c) => c === 'm').length;
  const late = [...record].filter((c) => c === 'l').length;
  const defaults = b.defaults ?? 0;
  const loans = b.priorLoans ?? 0;
  const resBal = cents(b.reserveBalance), resFloor = cents(b.reserveFloor);

  let tier: Assessment['tier'];
  if (defaults > 0 || missed > 0 || late > 2) tier = 'C';
  else if (late === 0 && b.monthsActive >= 12 && resBal >= resFloor) tier = 'A';
  else tier = 'B';

  const beforePayout = !payoutDate || dueDate < payoutDate;
  const fits = !lendable || cents(amount) <= cents(lendable);
  const recommend = tier !== 'C' && beforePayout && fits;

  const parts: string[] = [];
  parts.push(
    missed === 0 && late === 0
      ? `${b.name} has contributed on time for ${b.monthsActive} months across ${b.members} members.`
      : `${b.name} has ${missed ? `${missed} missed` : ''}${missed && late ? ' and ' : ''}${late ? `${late} late` : ''} ${missed + late === 1 ? 'month' : 'months'} in the last 12.`,
  );
  parts.push(loans === 0 ? 'They haven’t borrowed before.' : defaults === 0 ? `They’ve repaid ${loans === 1 ? 'their prior loan' : `all ${loans} prior loans`} without default.` : `They defaulted on ${defaults} of ${loans} prior loans.`);
  if (resFloor > 0) parts.push(resBal >= 2 * resFloor ? 'Their reserve sits at twice its floor or more.' : resBal >= resFloor ? 'Their reserve is only just above its floor.' : 'Their reserve is below its floor.');
  if (payoutDate) {
    const gap = Math.round((new Date(payoutDate).getTime() - new Date(dueDate).getTime()) / 86_400_000);
    parts.push(beforePayout ? `Repayment is due ${fmtDay(dueDate)}, ${gap} days before your payout.` : `${termDays} days runs to ${fmtDay(dueDate)}, past your ${fmtDay(payoutDate)} payout.`);
  }
  if (!fits && lendable) parts.push(`${rand(cents(amount))} is more than the ${rand(cents(lendable))} you can lend safely.`);
  parts.push(
    tier === 'C'
      ? 'Your constitution doesn’t lend to Tier C.'
      : recommend
        ? `I’d approve at ${ratePct}%.`
        : beforePayout
          ? 'I’d decline this amount.'
          : 'I’d decline this term and offer 30 days instead.',
  );

  return {
    tier,
    recommend,
    reasoning: parts.join(' '),
    note: `${b.monthsActive} months active, ${b.members} members, ${missed === 0 && late === 0 ? '0 missed contributions' : `${late} late month${late === 1 ? '' : 's'} this year`}.`,
    inputs: [
      { label: 'Tenure', value: `${b.monthsActive} months` },
      { label: 'Members', value: String(b.members) },
      { label: 'On-time contributions', value: `${record.length - missed - late} of ${record.length || 12} months` },
      { label: 'Prior loans', value: `${loans}, ${defaults === 0 ? 'no defaults' : `${defaults} defaults`}` },
    ],
  };
}
