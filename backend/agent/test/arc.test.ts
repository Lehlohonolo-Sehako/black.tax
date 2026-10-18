import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ARC_DEFAULTS, CircleArcRail, idempotencyKey, JOB_CREATED_TOPIC, toUsdc } from '../src/arc.ts';
import { assessRequest, BadRequest, evaluateRequest, fundRequest } from '../src/validate.ts';

test('defaults point at the live Arc Testnet escrow and RPC', () => {
  assert.equal(ARC_DEFAULTS.escrow, '0x0747EEf0706327138c69792bF28Cd525089e4583');
  assert.equal(ARC_DEFAULTS.rpc, 'https://rpc.testnet.arc.io');
});

test('idempotency keys are stable UUID v4 per loan and step', () => {
  const k = idempotencyKey('grocery-REQ-31', 'fund');
  assert.match(k, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(k, idempotencyKey('grocery-REQ-31', 'fund'));
  assert.notEqual(k, idempotencyKey('grocery-REQ-31', 'approve'));
  assert.notEqual(k, idempotencyKey('grocery-REQ-31', 'fund', 'run-2'));
  assert.equal(idempotencyKey('grocery-REQ-31', 'fund', 'run-2'), idempotencyKey('grocery-REQ-31', 'fund', 'run-2'));
});

test('USDC conversion uses 6 decimals', () => {
  process.env.ZAR_PER_USDC = '20';
  process.env.ARC_DEMO_SCALE = '1';
  assert.deepEqual(toUsdc(2000_00), { usdc: '100.000000', units: 100_000_000n });
});

test('the Circle rail signs each step with the right wallet and the deployed signatures', async () => {
  Object.assign(process.env, { ARC_LENDER_WALLET_ID: 'L', ARC_BORROWER_WALLET_ID: 'B', ARC_LENDER_ADDRESS: '0x' + '1'.repeat(40), ARC_BORROWER_ADDRESS: '0x' + '2'.repeat(40), ARC_AUTO_DISBURSE: 'true' });
  const calls: { walletId: string; sig: string; params: unknown[]; key: string }[] = [];
  let n = 0;
  const client = {
    createContractExecutionTransaction: async (i: Record<string, unknown>) => {
      calls.push({ walletId: i.walletId as string, sig: i.abiFunctionSignature as string, params: i.abiParameters as unknown[], key: i.idempotencyKey as string });
      return { data: { id: 'tx' + ++n } };
    },
    getTransaction: async ({ id }: { id: string }) => ({ data: { transaction: { state: 'COMPLETE', txHash: '0x' + id.padStart(64, '0') } } }),
  };
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response(JSON.stringify({ result: { logs: [{ address: ARC_DEFAULTS.escrow, topics: [JOB_CREATED_TOPIC, '0x' + (42).toString(16).padStart(64, '0')] }] } }))) as typeof fetch;
  try {
    const r = await new CircleArcRail(client).fundEscrow({ ref: 'grocery-REQ-31', zarCents: 8000_00 });
    assert.equal(r.jobId, '42');
    assert.equal(r.escrow, 'COMPLETED');
    assert.deepEqual(calls.map((c) => [c.walletId, c.sig]), [
      ['L', 'createJob(address,address,uint256,string,address)'],
      ['B', 'setBudget(uint256,uint256,bytes)'],
      ['L', 'approve(address,uint256)'],
      ['L', 'fund(uint256,bytes)'],
      ['B', 'submit(uint256,bytes32,bytes)'],
      ['L', 'complete(uint256,bytes32,bytes)'],
    ]);
    assert.deepEqual(calls[3].params, ['42', '0x']);
    assert.equal(calls[0].params[3], 'black.tax:grocery-REQ-31', 'no personal data on chain');
    assert.equal(new Set(calls.map((c) => c.key)).size, 6);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('requests are validated before anything else runs', () => {
  assert.throws(() => fundRequest({}), BadRequest);
  assert.throws(() => fundRequest({ stokvel_id: 'grocery', loan_request_id: 'REQ-1', amount: '-5', term_days: 30, rate_pct: 10, borrower_name: 'x' }), BadRequest);
  assert.throws(() => evaluateRequest({ stokvel_id: '../x', trigger: 'MANUAL' }), BadRequest);
  assert.throws(() => assessRequest({ stokvel_id: 'grocery' }), BadRequest);
  assert.equal(fundRequest({ stokvel_id: 'grocery', loan_request_id: 'REQ-1', amount: '8000.00', term_days: 30, rate_pct: 18, borrower_name: 'Diepkloof' }).amount, '8000.00');
});
