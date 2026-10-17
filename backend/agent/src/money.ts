/** Money is a 2-decimal string in rand on the wire; cents internally to avoid float drift. */
export const cents = (s: string | number | undefined | null): number => Math.round(Number(s ?? 0) * 100);
export const str = (c: number): string => (c / 100).toFixed(2);
/** R30,000 for whole rand, R1,500.50 otherwise, so prose amounts match the ledger to the cent. True minus for negatives. */
export const rand = (c: number): string => {
  const abs = Math.abs(Math.round(c));
  const body = abs % 100 === 0 ? (abs / 100).toLocaleString('en-US') : (abs / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (c < 0 ? '\u2212' : '') + 'R' + body;
};
export const first = (name: string): string => name.split(' ')[0];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const shortDate = (d: Date): string => `${d.getUTCDate()} ${MON[d.getUTCMonth()]}`;
export const isoDate = (d: Date): string => d.toISOString().slice(0, 10);
/** Calendar date (UTC midnight) for an ISO date or timestamp, in SAST. */
export const day = (iso: string): Date => {
  const sast = new Date(new Date(iso).getTime() + 2 * 3600_000);
  return new Date(Date.UTC(sast.getUTCFullYear(), sast.getUTCMonth(), sast.getUTCDate()));
};
export const daysBetween = (a: Date, b: Date): number => Math.round((b.getTime() - a.getTime()) / 86_400_000);
