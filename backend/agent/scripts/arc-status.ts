/** Show the demo's Arc Testnet wallets: account type, address and balances.  npx tsx scripts/arc-status.ts */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import { entitySecretHex } from '../src/arc.ts';

const text = readFileSync(resolve(import.meta.dirname, '../../../.env'), 'utf8');
const get = (k: string) => text.match(new RegExp(`^${k}=(.*)$`, 'm'))?.[1]?.trim() ?? '';
const client = initiateDeveloperControlledWalletsClient({ apiKey: get('CIRCLE_API_KEY'), entitySecret: entitySecretHex(get('CIRCLE_ENTITY_SECRET')) });

async function main() {
  for (const role of ['LENDER', 'BORROWER']) {
    const id = get(`ARC_${role}_WALLET_ID`);
    if (!id) { console.log(`${role}: not set up (run scripts/arc-setup.ts)`); continue; }
    const w = (await client.getWallet({ id })).data?.wallet;
    const b = (await client.getWalletTokenBalance({ id })).data?.tokenBalances ?? [];
    console.log(`${role.padEnd(8)} ${w?.accountType} ${w?.blockchain} ${w?.address}  ${b.map((t) => `${t.amount} ${t.token?.symbol}`).join(', ') || '0 USDC'}`);
  }
}
main().catch((e) => { console.error('Status failed:', (e as { status?: number }).status ?? '', (e as Error).message); process.exit(1); });
