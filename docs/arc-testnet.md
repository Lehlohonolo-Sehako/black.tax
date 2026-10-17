# Arc Testnet escrow

How black.tax settles loans between stokvels in USDC on Arc, and how to set it up yourself.

## The contract and the flow

black.tax uses Circle's deployment of the ERC-8183 *Agentic Commerce* reference contract on Arc Testnet, `0x0747EEf0706327138c69792bF28Cd525089e4583`. ERC-8183 is a job escrow: a client funds a job, a provider submits, and an evaluator completes it, which releases the funds. black.tax maps a loan onto it like this:

- **Lending stokvel's wallet:** client and evaluator.
- **Borrowing stokvel's wallet:** provider.

| # | Call | Signed by | Purpose |
|---|---|---|---|
| 1 | `createJob(address,address,uint256,string,address)` | lender | Opens the job: provider = borrower, evaluator = lender, a disbursement deadline, and an opaque reference (`black.tax:<stokvel>-<request>`, never a name) |
| 2 | `setBudget(uint256,uint256,bytes)` | borrower | Sets the amount. The deployed contract only accepts this from the provider. |
| 3 | `approve(address,uint256)` on USDC `0x3600…0000` | lender | Allows the escrow to pull the amount (6-decimal ERC-20 interface) |
| 4 | `fund(uint256,bytes)` | lender | Moves USDC into escrow (the deployed contract takes no expected-budget argument) |
| 5 | `submit(uint256,bytes32,bytes)` | borrower | Acknowledges the loan with a hashed reference |
| 6 | `complete(uint256,bytes32,bytes)` | lender | Releases USDC to the borrower |

How the rail runs these steps (`backend/agent/src/arc.ts`):

- **Confirmed steps:** each step must be final before the next one starts. On Arc, contract calls go straight from SENT to COMPLETE.
- **Job ID:** read from the `JobCreated` event in the `createJob` receipt (topic0 `0xb0f0239b…79b9`).
- **No duplicates:** every Circle call carries an idempotency key derived from the loan and the step, so a retried approval can't open a second job.
- **Disbursement deadline:** `expiredAt` is `ARC_DISBURSE_WINDOW_SECONDS` from now (24 hours by default), not the loan term. After it passes, anyone can refund the lender.
- **Release:** set `ARC_AUTO_DISBURSE=false` to stop after `fund` and release later.

Rand amounts are converted at `ZAR_PER_USDC` and scaled by `ARC_DEMO_SCALE`, so a rand-sized loan fits a faucet balance. With a scale of 0.001, R8,000 becomes 0.444444 USDC.

## Proof

Job **186928** on 17 Oct 2026, from approving `REQ-31` in the app. All six transactions succeeded:

1. createJob: https://explorer.testnet.arc.io/tx/0x0b5bde14cd91337e5ebab12145a060d2ff0a117d800ef93c629c6fb32dd5ca74
2. setBudget: https://explorer.testnet.arc.io/tx/0xc1fecee2440f0c2e9f27ed22a0bd9474d9af8684699e65bec7b5e3575db6bbe7
3. approve: https://explorer.testnet.arc.io/tx/0xd4b1682b30706a5faa8b867fb99e9ae6d2788af47aaec86dd5e578a1fa4d6412
4. fund: https://explorer.testnet.arc.io/tx/0x48032cfde80c37a32f3240ebc31c6d8ca6e30044ae69c55c24b9296a1faea1b6
5. submit: https://explorer.testnet.arc.io/tx/0x8f865d398aa47a5692abba1dd306b4803db685eebce97f75adcccd8d5633397e
6. complete: https://explorer.testnet.arc.io/tx/0x888e2287b03624d9057d87ccb6dff1eb45bdf4bfb4c3e6c51f93c5983bd7fdea

Lender `0x6a0646ea5e95e264b459ae0b25db6d494a1e5dc8`, borrower `0x420041a5f9366f8653c3599b5c885ca29daac891`.

## Setting it up

1. **Circle account.** At https://console.circle.com create a **Testnet** API key (`TEST_API_KEY:…`) and put it in `.env` as `CIRCLE_API_KEY`.
2. **Entity secret.** Generate 32 random bytes and put them in `.env` as `CIRCLE_ENTITY_SECRET`, either as 64 hex characters or as base64 (e.g. `openssl rand -hex 32`). Then register the secret once:
   ```bash
   cd backend/agent && npx tsx scripts/arc-register-secret.ts      # recovery file goes to ~/circle-recovery/
   ```
   Keep the recovery file safe and out of the repository; it's the only way to reset the secret.
3. **Wallets.** Create the wallet set and the lender and borrower wallets on `ARC-TESTNET`. Their IDs and addresses are written to `.env`, and `ARC_MODE=circle` is set:
   ```bash
   npx tsx scripts/arc-setup.ts
   ```
4. **Fund both wallets** at https://faucet.circle.com (Arc Testnet, USDC). They're EOA wallets that pay gas in USDC, Arc's gas token. Check the balances:
   ```bash
   npx tsx scripts/arc-status.ts
   ```
5. **Restart the agent** (`./scripts/stack.sh restart`). `curl localhost:4100/health` should report `"arcMode":"circle"`.
6. **Approve a loan** in the app. Agent activity shows the LEND decision with every transaction hash.

Without these variables the agent uses a mock rail: the same steps and shapes, no network, and "mock" in every decision and ledger entry.

## Limits and production notes

- **Custody:** the agent signs for both wallets here, so the escrow is custodial in substance. In production each stokvel holds its own keys, and the USDC leg runs behind a licensed crypto-asset service provider.
- **No repayment primitive:** ERC-8183 is a pay-for-work escrow and has no notion of repaying a loan. Repayment would be a USDC transfer back, or a second job with the roles reversed; that isn't implemented yet.
- **SDK version:** the integration uses `@circle-fin/developer-controlled-wallets` 10.8.1. Earlier versions don't know `ARC-TESTNET`.
