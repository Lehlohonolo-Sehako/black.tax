/**
 * One-time: register the entity secret from .env with Circle (developer-controlled wallets).
 * The recovery file is written OUTSIDE the repo; keep it safe, it's needed to reset the secret.
 *   npx tsx scripts/arc-register-secret.ts [recovery-dir]
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { registerEntitySecretCiphertext } from '@circle-fin/developer-controlled-wallets';
import { entitySecretHex } from '../src/arc.ts';

const text = readFileSync(resolve(import.meta.dirname, '../../../.env'), 'utf8');
const get = (k: string) => text.match(new RegExp(`^${k}=(.*)$`, 'm'))?.[1]?.trim() ?? '';
const dir = process.argv[2] ?? resolve(homedir(), 'circle-recovery');

registerEntitySecretCiphertext({ apiKey: get('CIRCLE_API_KEY'), entitySecret: entitySecretHex(get('CIRCLE_ENTITY_SECRET')), recoveryFileDownloadPath: dir })
  .then(() => console.log(`Entity secret registered. Recovery file saved in ${dir}`))
  .catch((e) => {
    console.error('Registration failed:', e?.response?.status ?? '', JSON.stringify(e?.response?.data ?? e?.message));
    process.exit(1);
  });
