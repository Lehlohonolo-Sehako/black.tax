/** HTTP clients for core (api/core.yaml, internal tag) and the ledger service (api/ledger.yaml). */
import type { AgentDecision, AgentState, RecordDecisionRequest } from './types.ts';
import type { components as Ledger } from './generated/ledger.ts';

const env = (k: string, d: string) => process.env[k] || d;
const CORE = () => env('CORE_URL', 'http://localhost:8080');
const LEDGER = () => env('LEDGER_URL', 'http://localhost:4200');

/** Shared secret with core and the ledger. Required: an unset token would let anyone call the agent. */
export const SERVICE_TOKEN = () => {
  const t = process.env.SERVICE_TOKEN;
  if (!t) throw new Error('SERVICE_TOKEN is not set');
  return t;
};

/** Upstream failure: reported to callers as 502 without internal detail. */
export class Upstream extends Error {}
/** The stokvel (or resource) doesn't exist upstream: reported as 404. */
export class NotFound extends Error {}

async function json<T>(p: Promise<Response>, what: string): Promise<T> {
  let res: Response;
  try {
    res = await p;
  } catch (e) {
    throw new Upstream(`${what}: ${(e as Error).message}`);
  }
  if (res.status === 404) throw new NotFound('No such stokvel.');
  if (!res.ok) throw new Upstream(`${what}: ${res.status} ${(await res.text()).slice(0, 300)}`);
  return (await res.json()) as T;
}
const opts = (init: RequestInit = {}): RequestInit => ({ ...init, signal: AbortSignal.timeout(15_000) });
const enc = encodeURIComponent;

export const core = {
  state: (stokvelId: string) =>
    json<AgentState>(fetch(`${CORE()}/api/internal/stokvels/${enc(stokvelId)}/state`, opts({ headers: { 'X-Service-Token': SERVICE_TOKEN() } })), 'core state'),
  record: (stokvelId: string, body: RecordDecisionRequest) =>
    json<AgentDecision>(
      fetch(`${CORE()}/api/internal/stokvels/${enc(stokvelId)}/decisions`, opts({
        method: 'POST',
        headers: { 'X-Service-Token': SERVICE_TOKEN(), 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })),
      'core record decision',
    ),
};

export type AppendRequest = Ledger['schemas']['AppendRequest'];
export type AppendResponse = Ledger['schemas']['AppendResponse'] & { duplicate?: boolean };

const ledgerHeaders = (extra: Record<string, string> = {}) => ({ 'X-Service-Token': SERVICE_TOKEN(), ...extra });

export const ledger = {
  /** Idempotent on entry_id: a retry with the same id returns the original entry instead of writing a second one. */
  append: (body: AppendRequest) =>
    json<AppendResponse>(fetch(`${LEDGER()}/ledger/append`, opts({ method: 'POST', headers: ledgerHeaders({ 'content-type': 'application/json' }), body: JSON.stringify(body) })), 'ledger append'),
  /** The pool is whatever Beancount says Assets:Pool:Cash holds. */
  poolBalance: (stokvelId: string) =>
    json<{ balance: string }>(fetch(`${LEDGER()}/ledger/${enc(stokvelId)}/balance?account=Assets:Pool:Cash`, opts({ headers: ledgerHeaders() })), 'ledger balance'),
};
