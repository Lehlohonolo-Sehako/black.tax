/** HTTP surface of the agent (api/agent.yaml). Stateless: every request reads fresh state from core and the ledger. */
import express, { type NextFunction, type Request, type Response } from 'express';
import { timingSafeEqual } from 'node:crypto';
import { decide } from './decide.ts';
import { assess } from './assess.ts';
import { arcRail, type ArcRail } from './arc.ts';
import { core, ledger, NotFound, SERVICE_TOKEN, Upstream } from './clients.ts';
import { postings } from './postings.ts';
import { cents, day, rand, str } from './money.ts';
import { assessRequest, BadRequest, evaluateRequest, fundRequest } from './validate.ts';
import type { AssessResponse, EvaluateResponse, FundLoanResponse, RecordDecisionRequest } from './types.ts';

SERVICE_TOKEN(); // fail fast at start-up if unset

const app = express();
app.use(express.json({ limit: '64kb' }));
let rail: ArcRail;

app.get('/health', (_req, res) => res.json({ status: 'UP', arcMode: rail?.mode ?? 'starting' }));

app.use('/agent', (req: Request, res: Response, next: NextFunction) => {
  const got = Buffer.from(req.header('X-Service-Token') ?? '');
  const want = Buffer.from(SERVICE_TOKEN());
  if (got.length !== want.length || !timingSafeEqual(got, want)) return res.status(401).json({ error: 'unauthorized' });
  next();
});

/** One evaluation or funding at a time per stokvel, so a cron tick and a manual run can't both pay. */
const locks = new Map<string, Promise<unknown>>();
function serial<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(key) ?? Promise.resolve();
  const run = prev.catch(() => undefined).then(fn);
  // The stored tail must never reject: an unobserved rejection would crash the process.
  const tail = run.then(() => undefined, () => undefined);
  locks.set(key, tail);
  tail.then(() => { if (locks.get(key) === tail) locks.delete(key); });
  return run;
}

const wrap = (fn: (req: Request, res: Response) => Promise<unknown>) => (req: Request, res: Response) =>
  fn(req, res).catch((e: Error) => {
    if (e instanceof BadRequest) return res.status(400).json({ error: 'bad_request', detail: e.message });
    if (e instanceof NotFound) return res.status(404).json({ error: 'not_found', detail: e.message });
    console.error(e);
    if (e instanceof Upstream) return res.status(502).json({ error: 'upstream', detail: 'A dependency did not answer. Nothing was recorded.' });
    res.status(500).json({ error: 'internal', detail: 'The agent hit an error. Nothing was recorded.' });
  });

/** "Today" in SAST, overridable for replay via context.today. */
const today = (ctx?: Record<string, unknown>) => (typeof ctx?.today === 'string' ? new Date(ctx.today + 'T00:00:00Z') : day(new Date().toISOString()));
/** Ledger timestamps are written in SAST so entries land on the South African calendar day. */
const sastNow = () => new Date(Date.now() + 2 * 3600_000).toISOString().replace('Z', '+02:00');

app.post('/agent/evaluate', wrap(async (req, res) => {
  const body = evaluateRequest(req.body);
  const out = await serial(body.stokvel_id, async () => {
    const state = await core.state(body.stokvel_id);
    const pool = cents((await ledger.poolBalance(body.stokvel_id)).balance);
    const d = decide(state, body.trigger, today(body.context), pool);
    let decisionId: string | undefined;
    let ledgerEntry: Record<string, unknown> | undefined;

    if (d.type) {
      const record: RecordDecisionRequest = {
        trigger: body.trigger,
        type: d.type,
        decision: d.outcome,
        summary: d.summary,
        inputs: d.inputs,
        ruleApplied: d.ruleApplied,
        outcome: d.outcomeText,
        actions: d.actions.map((a) => ({ type: a.type, memberId: a.member_id, amount: a.amount })),
      };
      if (d.ledger && d.outcome === 'EXECUTE') {
        // The agent writes its own ledger entries (§3.2). The entry id is derived from the state it decided on,
        // so a retry after a failed core write returns the same entry instead of paying twice.
        const appended = await ledger.append({
          stokvel_id: body.stokvel_id,
          entry_id: `agent:${state.lastDecisionId ?? 'genesis'}:${d.type}:${d.actions[0]?.member_id ?? ''}:${d.ledger.amount}`,
          timestamp: sastNow(),
          type: d.ledger.type,
          description: d.ledger.description,
          entries: postings(d.ledger.type, d.ledger.amount, d.ledger.counterparty),
          reasoning: d.ruleApplied,
          flagged: false,
        });
        record.ledger = { ...d.ledger, beancount: appended.beancount, beancountHash: appended.hash };
        ledgerEntry = { ...d.ledger, hash: appended.hash };
      }
      decisionId = (await core.record(body.stokvel_id, record)).id;
    }
    const result: EvaluateResponse = { decision: d.outcome, reasoning: d.ruleApplied, decision_id: decisionId, actions: d.actions, ledger_entry: ledgerEntry };
    return result;
  });
  res.json(out);
}));

app.post('/agent/assess', wrap(async (req, res) => {
  const body = assessRequest(req.body);
  const r = body.request;
  const a = assess(r.borrower, r.amount, r.termDays, r.ratePct, r.dueDate, body.payout_date, body.lendable);
  const decision = await core.record(body.stokvel_id, {
    trigger: 'MANUAL',
    type: 'ASSESS',
    decision: 'PROPOSE',
    summary: `Assessed ${r.borrower.name} as Tier ${a.tier}.`,
    inputs: a.inputs,
    ruleApplied: a.reasoning,
    outcome: 'Sent you the request to review.',
  });
  const out: AssessResponse = { tier: a.tier, recommend: a.recommend, reasoning: a.reasoning, note: a.note, decision_id: decision.id };
  res.json(out);
}));

app.post('/agent/loans/fund', wrap(async (req, res) => {
  const body = fundRequest(req.body);
  const out = await serial(body.stokvel_id, async () => {
    const zar = cents(body.amount);
    let funded;
    try {
      funded = await rail.fundEscrow({ ref: `${body.stokvel_id}-${body.loan_request_id}`, zarCents: zar, borrowerWallet: body.borrower_wallet });
    } catch (e) {
      console.error(e);
      throw new Upstream('Arc did not confirm the escrow: ' + (e as Error).message);
    }
    const description = `You lent to ${body.borrower_name}`;
    const disbursed = funded.escrow === 'COMPLETED';
    const rule = `${body.borrower_name} repays ${rand(zar)} plus ${body.rate_pct}% over ${body.term_days} days. I created ERC-8183 job ${funded.jobId} on Arc, funded the escrow with ${funded.usdcAmount} USDC`
      + (disbursed ? ' and released it to them' : '') + (funded.rail === 'mock' ? ' (mock rail: no Arc credentials configured).' : '.');
    const appended = await ledger.append({
      stokvel_id: body.stokvel_id,
      entry_id: `loan:${body.loan_request_id}`,
      timestamp: sastNow(),
      type: 'LOAN_OUT',
      description,
      entries: postings('LOAN_OUT', str(zar), body.borrower_name),
      reasoning: rule,
      arc_tx_hash: funded.txHash,
      flagged: false,
    });
    const decision = await core.record(body.stokvel_id, {
      trigger: 'MANUAL',
      type: 'LEND',
      decision: 'EXECUTE',
      summary: `Lent ${rand(zar)} to ${body.borrower_name} for ${body.term_days} days.`,
      inputs: [
        { label: 'Request', value: `${rand(zar)} · ${body.term_days} days · ${body.rate_pct}%` },
        { label: 'Escrow', value: `ERC-8183 job ${funded.jobId}${funded.rail === 'mock' ? ' (mock)' : ''}` },
        { label: 'Settlement', value: `${funded.usdcAmount} USDC on Arc` },
        ...funded.transactions.filter((t) => t.txHash).map((t) => ({ label: `Arc ${t.step}`, value: t.txHash! })),
      ],
      ruleApplied: rule,
      outcome: disbursed ? 'USDC released to the borrower through the Arc escrow.' : 'USDC escrow funded on Arc. Release it when the borrower is ready.',
      actions: [{ type: 'ARC_ESCROW_RELEASE', jobId: funded.jobId, amount: str(zar), txHash: funded.txHash }],
      ledger: { type: 'LOAN_OUT', description, counterparty: body.borrower_name, amount: str(-zar), beancount: appended.beancount, beancountHash: appended.hash, arcTxHash: funded.txHash },
    });
    const result: FundLoanResponse = {
      status: funded.status, job_id: funded.jobId, tx_hash: funded.txHash, explorer_url: funded.explorerUrl, usdc_amount: funded.usdcAmount, decision_id: decision.id,
    };
    return result;
  });
  res.json(out);
}));

// Malformed JSON bodies get a JSON 400, not Express's HTML stack trace.
app.use((err: Error & { type?: string; status?: number }, _req: Request, res: Response, next: NextFunction) => {
  if (err?.type === 'entity.parse.failed' || err?.type === 'entity.too.large') return res.status(err.status ?? 400).json({ error: 'bad_request', detail: 'The body is not valid JSON.' });
  next(err);
});

process.on('unhandledRejection', (e) => console.error('Unhandled rejection (kept running):', e));

const port = Number(process.env.PORT ?? 4100);
arcRail()
  .then((r) => {
    rail = r;
    app.listen(port, () => console.log(`agent listening on :${port} (arc rail: ${r.mode})`));
  })
  .catch((e) => {
    console.error('Agent could not start:', e.message);
    process.exit(1);
  });
