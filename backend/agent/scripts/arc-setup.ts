/**
 * One-off Arc Testnet setup for the escrow demo: creates a wallet set and two Circle developer-controlled wallets on
 * ARC-TESTNET (lending stokvel, borrowing stokvel), requests faucet USDC for both, and writes their IDs and addresses
 * into the repo's .env. Idempotent: wallets already in .env are reused. Never prints secrets.
 *
 *   npx tsx scripts/arc-setup.ts            (run from backend/agent)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import { entitySecretHex } from '../src/arc.ts';

const ENV = resolve(import.meta.dirname, '../../../.env');
let text = readFileSync(ENV, 'utf8');
const get = (k: string) => text.match(new RegExp(`^${k}=(.*)$`, 'm'))?.[1]?.trim() ?? '';
const set = (k: string, v: string) => {
  text = new RegExp(`^${k}=.*$`, 'm').test(text) ? text.replace(new RegExp(`^${k}=.*$`, 'm'), `${k}=${v}`) : text + `\n${k}=${v}\n`;
  writeFileSync(ENV, text);
};

const apiKey = get('CIRCLE_API_KEY');
if (!apiKey.startsWith('TEST_API_KEY:')) throw new Error('CIRCLE_API_KEY must be a testnet key (TEST_API_KEY:...)');
const client = initiateDeveloperControlledWalletsClient({ apiKey, entitySecret: entitySecretHex(get('CIRCLE_ENTITY_SECRET')) });

async function main() {
  let lender = { id: get('ARC_LENDER_WALLET_ID'), address: get('ARC_LENDER_ADDRESS') };
  let borrower = { id: get('ARC_BORROWER_WALLET_ID'), address: get('ARC_BORROWER_ADDRESS') };

  if (!lender.id || !borrower.id) {
    let walletSetId = get('ARC_WALLET_SET_ID');
    if (!walletSetId) {
      const existing = (await client.listWalletSets()).data?.walletSets?.find((w) => (w as { name?: string }).name === 'black.tax stokvels');
      if (existing) {
        walletSetId = existing.id;
        set('ARC_WALLET_SET_ID', walletSetId);
        console.log('Reusing wallet set', walletSetId);
      }
    }
    if (!walletSetId) {
      console.log('Creating wallet set…');
      const ws = await client.createWalletSet({ name: 'black.tax stokvels' });
      walletSetId = ws.data?.walletSet?.id ?? '';
      if (!walletSetId) throw new Error('Circle did not return a wallet set id');
      set('ARC_WALLET_SET_ID', walletSetId);
    }
    console.log('Creating lender and borrower wallets on ARC-TESTNET…');
    // Arc support differs by account type; try the simplest working combination and say which one succeeded.
    const attempts: { label: string; input: Record<string, unknown> }[] = [
      { label: 'EOA with names', input: { accountType: 'EOA', metadata: [{ name: 'black.tax lender', refId: 'lender' }, { name: 'black.tax borrower', refId: 'borrower' }] } },
      { label: 'EOA', input: { accountType: 'EOA' } },
      { label: 'SCA', input: { accountType: 'SCA' } },
    ];
    let created: Awaited<ReturnType<typeof client.createWallets>> | undefined;
    for (const a of attempts) {
      try {
        created = await client.createWallets({ walletSetId, blockchains: ['ARC-TESTNET'], count: 2, ...a.input } as Parameters<typeof client.createWallets>[0]);
        console.log(`Created wallets (${a.label})`);
        break;
      } catch (e) {
        console.log(`  ${a.label}: refused (${(e as { status?: number }).status ?? ''} ${(e as Error).message})`);
      }
    }
    if (!created) throw new Error('Circle refused every wallet configuration on ARC-TESTNET');
    const w = created.data?.wallets ?? [];
    if (w.length < 2) throw new Error('Circle did not create two wallets');
    const byRef = (r: string) => w.find((x) => x.refId === r) ?? w[r === 'lender' ? 0 : 1];
    lender = { id: byRef('lender').id, address: byRef('lender').address };
    borrower = { id: byRef('borrower').id, address: byRef('borrower').address };
    set('ARC_LENDER_WALLET_ID', lender.id);
    set('ARC_LENDER_ADDRESS', lender.address);
    set('ARC_BORROWER_WALLET_ID', borrower.id);
    set('ARC_BORROWER_ADDRESS', borrower.address);
    console.log('Saved wallet IDs and addresses to .env');
  } else {
    console.log('Reusing wallets already in .env');
  }
  console.log(`  lender   ${lender.address}`);
  console.log(`  borrower ${borrower.address}`);

  for (const [name, w] of [['lender', lender], ['borrower', borrower]] as const) {
    try {
      await client.requestTestnetTokens({ address: w.address, blockchain: 'ARC-TESTNET', usdc: true });
      console.log(`Requested faucet USDC for the ${name}`);
    } catch (e) {
      const err = e as { status?: number; message?: string; response?: { status?: number; data?: { message?: string } } };
      console.log(`Faucet request for the ${name} was refused (${err.response?.status ?? err.status ?? ''} ${err.response?.data?.message ?? err.message}). Use https://faucet.circle.com instead.`);
    }
  }

  for (let i = 0; i < 20; i++) {
    const bal = async (id: string) => {
      const r = await client.getWalletTokenBalance({ id });
      return (r.data?.tokenBalances ?? []).map((t) => `${t.amount} ${t.token?.symbol}`).join(', ') || '0';
    };
    const [l, b] = [await bal(lender.id), await bal(borrower.id)];
    console.log(`Balances: lender ${l} | borrower ${b}`);
    if (l !== '0' && b !== '0') break;
    await new Promise((r) => setTimeout(r, 6000));
  }

  if (get('ARC_MODE') !== 'circle') set('ARC_MODE', 'circle');
  console.log('ARC_MODE=circle. Restart the agent: docker compose up -d agent');
}

main().catch((e) => {
  const err = e as { response?: { status?: number; data?: unknown }; message?: string };
  const anyErr = e as Record<string, unknown>;
  console.error('Setup failed:', err.response?.status ?? anyErr.status ?? '', JSON.stringify(err.response?.data ?? anyErr.data ?? anyErr.errors ?? err.message), Object.keys(anyErr).join(','));
  process.exit(1);
});
