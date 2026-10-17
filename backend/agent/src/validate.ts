/** Request validation for api/agent.yaml. Every endpoint validates before it touches core, the ledger or Arc. */
export class BadRequest extends Error {}

const ID = /^[a-z0-9_-]{1,64}$/;
const MONEY = /^\d{1,9}(\.\d{1,2})?$/;
const TRIGGERS = ['SCHEDULED_TICK', 'CONTRIBUTION_WEBHOOK', 'MANUAL'] as const;

type Obj = Record<string, unknown>;
const obj = (v: unknown, what: string): Obj => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw new BadRequest(`${what} must be a JSON object`);
  return v as Obj;
};
const str = (o: Obj, k: string, re?: RegExp, max = 200): string => {
  const v = o[k];
  if (typeof v !== 'string' || v.trim() === '' || v.length > max || (re && !re.test(v))) throw new BadRequest(`${k} is missing or invalid`);
  return v;
};
const int = (o: Obj, k: string, min: number, max: number): number => {
  const v = o[k];
  if (typeof v !== 'number' || !Number.isInteger(v) || v < min || v > max) throw new BadRequest(`${k} must be an integer from ${min} to ${max}`);
  return v;
};
const num = (o: Obj, k: string, min: number, max: number): number => {
  const v = o[k];
  if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max) throw new BadRequest(`${k} must be a number from ${min} to ${max}`);
  return v;
};
const money = (o: Obj, k: string): string => {
  const v = str(o, k, MONEY, 20);
  if (Number(v) <= 0) throw new BadRequest(`${k} must be above zero`);
  return v;
};

export function evaluateRequest(body: unknown) {
  const b = obj(body, 'body');
  const trigger = str(b, 'trigger') as (typeof TRIGGERS)[number];
  if (!TRIGGERS.includes(trigger)) throw new BadRequest('trigger must be one of ' + TRIGGERS.join(', '));
  const context = b.context === undefined ? undefined : obj(b.context, 'context');
  if (context?.today !== undefined && (typeof context.today !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(context.today))) throw new BadRequest('context.today must be YYYY-MM-DD');
  return { stokvel_id: str(b, 'stokvel_id', ID), trigger, context };
}

export function assessRequest(body: unknown) {
  const b = obj(body, 'body');
  const r = obj(b.request, 'request');
  const borrower = obj(r.borrower, 'request.borrower');
  const record = borrower.contributionRecord ?? '';
  if (typeof record !== 'string' || !/^[olm]{0,12}$/.test(record)) throw new BadRequest('borrower.contributionRecord must be up to 12 of o, l, m');
  const optMoney = (k: string) => (borrower[k] === undefined ? undefined : str(borrower, k, MONEY, 20));
  return {
    stokvel_id: str(b, 'stokvel_id', ID),
    payout_date: b.payout_date === undefined ? undefined : str(b, 'payout_date', /^\d{4}-\d{2}-\d{2}$/),
    lendable: b.lendable === undefined ? undefined : str(b, 'lendable', MONEY, 20),
    request: {
      id: r.id === undefined ? undefined : str(r, 'id', /^[A-Za-z0-9_-]{1,64}$/),
      amount: money(r, 'amount'),
      termDays: int(r, 'termDays', 7, 365),
      ratePct: num(r, 'ratePct', 0, 100),
      dueDate: str(r, 'dueDate', /^\d{4}-\d{2}-\d{2}$/),
      borrower: {
        name: str(borrower, 'name', undefined, 120),
        members: int(borrower, 'members', 1, 10_000),
        monthsActive: int(borrower, 'monthsActive', 0, 1200),
        contributionRecord: record,
        priorLoans: borrower.priorLoans === undefined ? 0 : int(borrower, 'priorLoans', 0, 1000),
        defaults: borrower.defaults === undefined ? 0 : int(borrower, 'defaults', 0, 1000),
        reserveBalance: optMoney('reserveBalance'),
        reserveFloor: optMoney('reserveFloor'),
      },
    },
  };
}

export function fundRequest(body: unknown) {
  const b = obj(body, 'body');
  return {
    stokvel_id: str(b, 'stokvel_id', ID),
    loan_request_id: str(b, 'loan_request_id', /^[A-Za-z0-9_-]{1,64}$/),
    amount: money(b, 'amount'),
    term_days: int(b, 'term_days', 7, 365),
    rate_pct: num(b, 'rate_pct', 0, 100),
    borrower_name: str(b, 'borrower_name', undefined, 120),
    borrower_wallet: b.borrower_wallet === undefined ? undefined : str(b, 'borrower_wallet', /^0x[0-9a-fA-F]{40}$/),
  };
}
