/** Double-entry postings per ledger entry type. Mirrors core's LedgerService.postings so both writers agree. */
import type { LedgerEntryType } from './types.ts';
import { cents, str } from './money.ts';

export function postings(type: LedgerEntryType, amount: string, counterparty: string): { account: string; amount: string; currency: 'ZAR' }[] {
  const c = Math.abs(cents(amount));
  if (c === 0) return [];
  const a = str(c), neg = str(-c);
  let who = (counterparty.split(' ')[0] ?? 'Member').replace(/[^A-Za-z0-9]/g, '');
  if (!/^[A-Za-z]/.test(who)) who = 'Member';
  who = who[0].toUpperCase() + who.slice(1);
  switch (type) {
    case 'CONTRIBUTION': return [{ account: 'Assets:Pool:Cash', amount: a, currency: 'ZAR' as const }, { account: 'Equity:Contributions', amount: neg, currency: 'ZAR' as const }];
    case 'RECYCLED': return [{ account: 'Assets:Pool:Cash', amount: a, currency: 'ZAR' as const }, { account: 'Equity:Recycled', amount: neg, currency: 'ZAR' as const }];
    case 'DEBT_PAYMENT':
    case 'DEBT_CLEARED': return [{ account: `Liabilities:MemberDebt:${who}`, amount: a, currency: 'ZAR' as const }, { account: 'Assets:Pool:Cash', amount: neg, currency: 'ZAR' as const }];
    case 'LOAN_OUT': return [{ account: 'Assets:LoansReceivable', amount: a, currency: 'ZAR' as const }, { account: 'Assets:Pool:Cash', amount: neg, currency: 'ZAR' as const }];
    case 'LOAN_REPAID': return [{ account: 'Assets:Pool:Cash', amount: a, currency: 'ZAR' as const }, { account: 'Assets:LoansReceivable', amount: neg, currency: 'ZAR' as const }];
    default: return [];
  }
}
