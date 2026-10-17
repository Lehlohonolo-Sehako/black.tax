/**
 * Arc settlement (system design §2.5): ERC-8183 job escrow in USDC, driven through Circle developer-controlled
 * wallets. The entity secret authorises every wallet operation and only ever comes from the environment.
 *
 * Verified against the reference contract Circle deployed on Arc Testnet (0x0747EEf0706327138c69792bF28Cd525089e4583,
 * docs.arc.io "Create your first ERC-8183 job"), which differs from the draft spec text in two ways that matter here:
 * `fund(uint256,bytes)` takes no expected-budget argument, and only the provider may call `setBudget`.
 *
 * Roles: the lending stokvel's wallet is client and evaluator; the borrowing stokvel's wallet is provider.
 * Flow: L createJob → B setBudget → L approve USDC → L fund → B submit → L complete (USDC reaches B).
 * Every step must reach COMPLETE before the next one starts. Each call carries a deterministic idempotency key, so a
 * retried request can't create a second job or a second escrow.
 *
 * Two rails:
 * - CircleArcRail (ARC_MODE=circle): real Arc Testnet transactions.
 * - MockArcRail (default when credentials are missing): same shapes, no network, clearly labelled as mock.
 */
import { createHash, randomBytes } from 'node:crypto';

export interface FundInput {
  ref: string;
  zarCents: number;
  borrowerWallet?: string;
}

export interface FundResult {
  status: 'FUNDED' | 'SUBMITTED';
  /** COMPLETED once `complete` has paid the borrower; FUNDED if disbursement is left to the treasurer. */
  escrow: 'FUNDED' | 'COMPLETED';
  jobId: string;
  /** Hash of the transaction that moved the money last (fund, or complete when disbursed). Never a Circle UUID. */
  txHash?: string;
  transactions: { step: string; txHash?: string }[];
  explorerUrl?: string;
  usdcAmount: string;
  rail: 'circle' | 'mock';
}

export interface ArcRail {
  mode: 'circle' | 'mock';
  fundEscrow(input: FundInput): Promise<FundResult>;
}

const env = (k: string, d = '') => {
  const v = process.env[k];
  return v === undefined || v === '' ? d : v;
};

export const ARC_DEFAULTS = {
  rpc: 'https://rpc.testnet.arc.io',
  explorer: 'https://explorer.testnet.arc.io/tx/',
  escrow: '0x0747EEf0706327138c69792bF28Cd525089e4583',
  usdc: '0x3600000000000000000000000000000000000000',
};
/** keccak256("JobCreated(uint256,address,address,address,uint256,address)") */
export const JOB_CREATED_TOPIC = '0xb0f0239bfdd96453e24733e18bfc24b70d8fadf123dd977473518dd577ee79b9';

/** ZAR → USDC. ARC_DEMO_SCALE lets a testnet faucet balance cover rand-sized loans (e.g. 0.001). */
export function toUsdc(zarCents: number): { usdc: string; units: bigint } {
  const rate = Number(env('ZAR_PER_USDC', '18.00'));
  const scale = Number(env('ARC_DEMO_SCALE', '1'));
  const usdc = (zarCents / 100 / rate) * scale;
  const units = BigInt(Math.max(1, Math.round(usdc * 1_000_000))); // USDC's ERC-20 interface on Arc has 6 decimals
  return { usdc: (Number(units) / 1_000_000).toFixed(6), units };
}

/** A UUID v4-shaped key derived from the loan reference and step, so retries reuse it (Circle exactly-once). */
export function idempotencyKey(ref: string, step: string): string {
  const h = createHash('sha256').update(`black.tax:${ref}:${step}`).digest();
  h[6] = (h[6] & 0x0f) | 0x40;
  h[8] = (h[8] & 0x3f) | 0x80;
  const x = h.subarray(0, 16).toString('hex');
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20, 32)}`;
}

/** Circle wants the 32-byte entity secret as 64 hex characters; accept a base64 copy of the same bytes too. */
export function entitySecretHex(secret: string): string {
  const v = secret.trim();
  if (/^[0-9a-fA-F]{64}$/.test(v)) return v.toLowerCase();
  const b = Buffer.from(v, 'base64');
  if (b.length === 32 && b.toString('base64') === v) return b.toString('hex');
  throw new Error('CIRCLE_ENTITY_SECRET must be 32 bytes, as 64 hex characters (or base64)');
}

/** Opaque bytes32 for on-chain fields. No personal information goes on chain. */
export const bytes32 = (s: string) => '0x' + createHash('sha256').update(s).digest('hex');

export class MockArcRail implements ArcRail {
  mode = 'mock' as const;
  async fundEscrow(input: FundInput): Promise<FundResult> {
    const { usdc } = toUsdc(input.zarCents);
    const tx = () => '0x' + randomBytes(32).toString('hex');
    const steps = ['createJob', 'setBudget', 'approve', 'fund', 'submit', 'complete'].map((step) => ({ step, txHash: tx() }));
    return {
      status: 'FUNDED', escrow: 'COMPLETED', jobId: `mock-${input.ref}`, txHash: steps[steps.length - 1].txHash,
      transactions: steps, usdcAmount: usdc, rail: 'mock',
    };
  }
}

type CircleClient = {
  createContractExecutionTransaction(input: Record<string, unknown>): Promise<{ data?: { id?: string; state?: string } }>;
  getTransaction(input: { id: string }): Promise<{ data?: { transaction?: { state?: string; txHash?: string } } }>;
};

const DONE = new Set(['COMPLETE', 'CONFIRMED', 'CLEARED']);
const DEAD = new Set(['FAILED', 'DENIED', 'CANCELLED', 'STUCK']);

export class CircleArcRail implements ArcRail {
  mode = 'circle' as const;
  constructor(private client: CircleClient) {}

  static async create(): Promise<CircleArcRail> {
    const { initiateDeveloperControlledWalletsClient } = await import('@circle-fin/developer-controlled-wallets');
    const client = initiateDeveloperControlledWalletsClient({ apiKey: env('CIRCLE_API_KEY'), entitySecret: entitySecretHex(env('CIRCLE_ENTITY_SECRET')) });
    return new CircleArcRail(client as unknown as CircleClient);
  }

  private async exec(walletId: string, contractAddress: string, abiFunctionSignature: string, abiParameters: unknown[], ref: string, step: string) {
    const res = await this.client.createContractExecutionTransaction({
      walletId,
      contractAddress,
      abiFunctionSignature,
      abiParameters,
      idempotencyKey: idempotencyKey(ref, step),
      refId: `black.tax:${ref}:${step}`,
      fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
    });
    const id = res.data?.id;
    if (!id) throw new Error(`Circle did not accept ${step}`);
    return id;
  }

  /** Poll until the transaction is final. On Arc, contract calls go SENT → COMPLETE (finality is instant). */
  private async wait(id: string, ms: number): Promise<{ txHash?: string; confirmed: boolean }> {
    const end = Date.now() + ms;
    let txHash: string | undefined;
    while (Date.now() < end) {
      const t = (await this.client.getTransaction({ id })).data?.transaction;
      txHash = t?.txHash ?? txHash;
      if (t?.state && DONE.has(t.state) && txHash) return { txHash, confirmed: true };
      if (t?.state && DEAD.has(t.state)) throw new Error(`Arc transaction ${id} ended ${t.state}`);
      await new Promise((r) => setTimeout(r, 1500));
    }
    return { txHash, confirmed: false };
  }

  /** Run one step and require it to be final before the next. */
  private async step(walletId: string, contract: string, sig: string, params: unknown[], ref: string, step: string, ms = 90_000) {
    const r = await this.wait(await this.exec(walletId, contract, sig, params, ref, step), ms);
    if (!r.confirmed || !r.txHash) throw new Error(`Arc didn’t confirm ${step} within ${Math.round(ms / 1000)} seconds`);
    return r.txHash;
  }

  /** jobId is topics[1] of the JobCreated event (topic0 filtered) emitted by the escrow in the createJob receipt. */
  private async jobIdFrom(txHash: string): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const res = await fetch(env('ARC_RPC_URL', ARC_DEFAULTS.rpc), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getTransactionReceipt', params: [txHash] }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`Arc RPC ${res.status}`);
      const body = (await res.json()) as { result?: { logs?: { address: string; topics: string[] }[] }; error?: { message: string } };
      if (body.error) throw new Error(`Arc RPC: ${body.error.message}`);
      const escrow = env('ARC_ESCROW_ADDRESS', ARC_DEFAULTS.escrow).toLowerCase();
      const log = body.result?.logs?.find((l) => l.address.toLowerCase() === escrow && l.topics[0]?.toLowerCase() === JOB_CREATED_TOPIC);
      if (log) return BigInt(log.topics[1]).toString();
      if (body.result) throw new Error('createJob receipt has no JobCreated event');
      await new Promise((r) => setTimeout(r, 1000)); // receipt not indexed yet
    }
    throw new Error('createJob receipt not found');
  }

  async fundEscrow(input: FundInput): Promise<FundResult> {
    const escrow = env('ARC_ESCROW_ADDRESS', ARC_DEFAULTS.escrow);
    const usdcToken = env('ARC_USDC_ADDRESS', ARC_DEFAULTS.usdc);
    const lenderWallet = env('ARC_LENDER_WALLET_ID');
    const borrowerWallet = env('ARC_BORROWER_WALLET_ID');
    const provider = input.borrowerWallet || env('ARC_BORROWER_ADDRESS');
    const evaluator = env('ARC_LENDER_ADDRESS');
    const { usdc, units } = toUsdc(input.zarCents);
    // Expiry is the deadline to disburse, not the loan term: after it, anyone can claimRefund to the lender.
    const expiresAt = Math.floor(Date.now() / 1000) + Number(env('ARC_DISBURSE_WINDOW_SECONDS', '86400'));
    const ref = input.ref;
    const transactions: FundResult['transactions'] = [];
    const record = (step: string, txHash?: string) => (transactions.push({ step, txHash }), txHash);

    const created = record('createJob', await this.step(lenderWallet, escrow, 'createJob(address,address,uint256,string,address)',
      [provider, evaluator, String(expiresAt), `black.tax:${ref}`, '0x0000000000000000000000000000000000000000'], ref, 'createJob'));
    const jobId = await this.jobIdFrom(created!);
    record('setBudget', await this.step(borrowerWallet, escrow, 'setBudget(uint256,uint256,bytes)', [jobId, units.toString(), '0x'], ref, 'setBudget'));
    record('approve', await this.step(lenderWallet, usdcToken, 'approve(address,uint256)', [escrow, units.toString()], ref, 'approve'));
    record('fund', await this.step(lenderWallet, escrow, 'fund(uint256,bytes)', [jobId, '0x'], ref, 'fund'));

    let escrowState: FundResult['escrow'] = 'FUNDED';
    if (env('ARC_AUTO_DISBURSE', 'true') === 'true') {
      // Disbursement: the borrower acknowledges with a deliverable hash, the lender (evaluator) completes and USDC moves.
      record('submit', await this.step(borrowerWallet, escrow, 'submit(uint256,bytes32,bytes)', [jobId, bytes32(`deliverable:${ref}`), '0x'], ref, 'submit'));
      record('complete', await this.step(lenderWallet, escrow, 'complete(uint256,bytes32,bytes)', [jobId, bytes32(`disbursed:${ref}`), '0x'], ref, 'complete'));
      escrowState = 'COMPLETED';
    }
    const last = transactions[transactions.length - 1].txHash;
    return {
      status: 'FUNDED', escrow: escrowState, jobId, txHash: last, transactions,
      explorerUrl: last ? env('ARC_EXPLORER_TX_URL', ARC_DEFAULTS.explorer) + last : undefined, usdcAmount: usdc, rail: 'circle',
    };
  }
}

export async function arcRail(): Promise<ArcRail> {
  const required = ['CIRCLE_API_KEY', 'CIRCLE_ENTITY_SECRET', 'ARC_LENDER_WALLET_ID', 'ARC_BORROWER_WALLET_ID', 'ARC_LENDER_ADDRESS', 'ARC_BORROWER_ADDRESS'];
  const configured = required.every((k) => env(k));
  if (env('ARC_MODE', configured ? 'circle' : 'mock') === 'circle') {
    if (!configured) throw new Error('ARC_MODE=circle needs ' + required.filter((k) => !env(k)).join(', '));
    return CircleArcRail.create();
  }
  return new MockArcRail();
}
