# black.tax

An agentic treasury for South African stokvels. Contributions arrive by DebiCheck, an agent decides what the pool does with them (and explains every decision in the first person), every rand is written to an append-only Beancount ledger, and loans between stokvels settle in USDC through an ERC-8183 escrow on Arc.

Built for the Tameion Agents Hackathon (Canteen × Circle).

```
api/            OpenAPI contracts — the source of truth (API-first)
  core.yaml       core REST API, consumed by the frontend and the agent
  agent.yaml      agent service API, consumed by core
  ledger.yaml     ledger service API, consumed by core and the agent
backend/
  core/           Spring Boot 4 (JHipster 9) · Postgres · JWT · multi-tenant · Stitch webhooks · scheduled jobs
  agent/          Node/TypeScript · stateless decision engine · Circle wallets + ERC-8183 escrow on Arc
  ledger/         Python · FastAPI · Beancount 3 · append-only, one file per stokvel
frontend/         Next.js · screens from the Claude Design handoff · typed client generated from api/core.yaml
design/           the Claude Design prototype the screens were built from
docker-compose.yml
```

## On-chain proof (Arc Testnet)

A real inter-stokvel loan settled through Circle's ERC-8183 escrow (`0x0747EEf0706327138c69792bF28Cd525089e4583`) on 17 Oct 2026: Soweto Grocery Club lent R8,000 to Diepkloof Grocery Society (`REQ-31`), scaled to 0.444444 USDC for the testnet. **Job 186928**, six transactions, all successful:

| # | Step | Transaction |
|---|---|---|
| 1 | `createJob` | [0x0b5bde14…d5ca74](https://explorer.testnet.arc.io/tx/0x0b5bde14cd91337e5ebab12145a060d2ff0a117d800ef93c629c6fb32dd5ca74) |
| 2 | `setBudget` | [0xc1fecee2…b6bbe7](https://explorer.testnet.arc.io/tx/0xc1fecee2440f0c2e9f27ed22a0bd9474d9af8684699e65bec7b5e3575db6bbe7) |
| 3 | `approve` | [0xd4b1682b…4d6412](https://explorer.testnet.arc.io/tx/0xd4b1682b30706a5faa8b867fb99e9ae6d2788af47aaec86dd5e578a1fa4d6412) |
| 4 | `fund` | [0x48032cfd…aea1b6](https://explorer.testnet.arc.io/tx/0x48032cfde80c37a32f3240ebc31c6d8ca6e30044ae69c55c24b9296a1faea1b6) |
| 5 | `submit` | [0x8f865d39…33397e](https://explorer.testnet.arc.io/tx/0x8f865d398aa47a5692abba1dd306b4803db685eebce97f75adcccd8d5633397e) |
| 6 | `complete` | [0x888e2287…d7fdea](https://explorer.testnet.arc.io/tx/0x888e2287b03624d9057d87ccb6dff1eb45bdf4bfb4c3e6c51f93c5983bd7fdea) |

Lender wallet `0x6a0646ea5e95e264b459ae0b25db6d494a1e5dc8` (client and evaluator), borrower wallet `0x420041a5f9366f8653c3599b5c885ca29daac891` (provider). Both are Circle developer-controlled EOA wallets on `ARC-TESTNET`.

## How the pieces talk

```
frontend ──JWT──▶ core (system of record) ──▶ agent ──▶ Arc Testnet (USDC, ERC-8183 via Circle DCW)
                    │   ▲                       │
       Stitch ──────┘   └──── internal API ─────┤ (service token: reads state, writes decisions)
   (signed webhooks)                            ▼
                    core ──────────────────▶ ledger (Beancount; returns the file hash)
```

- **core** owns stokvels, members, contributions, debts, loans, the ledger mirror and agent decisions. Every tenant-owned row carries `tenant_id` (the stokvel) and Hibernate `@TenantId` filters every query; an interceptor checks the caller belongs to the stokvel in the path. `TenantIsolationIT` asserts isolation on every read endpoint (system design §8.3).
- **agent** is a pure function of its inputs (`decide()` in `backend/agent/src/decide.ts`): it reads state from core and the pool balance from Beancount, decides (pause, pay the highest-rate debt, propose, or nothing), appends to the ledger, and writes the decision back to core. The pause names the member, the days overdue and the amount held.
- **ledger** validates the whole file with Beancount before appending, then returns the SHA-256 of the file. Core stores that hash on its mirror row: business record → entry → hash → file state.
- **Stitch** webhooks are verified with HMAC-SHA256 in constant time (`X-Stitch-Signature: t=…,v1=…`), with a replay window and idempotency on event id. The default mock rail sends real signed webhooks to core, so the production path runs locally.

## API-first workflow

1. Change the contract in `api/*.yaml`.
2. Regenerate:
   - core: `cd backend/core && ./mvnw generate-sources` (openapi-generator → `*ApiDelegate` interfaces and `*Dto` models; delegates live in `web/delegate`)
   - agent + frontend: `npm run generate` (openapi-typescript → `src/generated`, `src/api/generated.ts`)
3. The compiler tells you what no longer matches.

## Run it

Control the whole stack (Docker and any native dev processes on its ports) with one script:

```bash
./scripts/stack.sh start [--build]    # start and wait until every service is healthy
./scripts/stack.sh stop               # stop Docker containers and native black.tax processes (others are left alone)
./scripts/stack.sh restart [--build]
./scripts/stack.sh status
./scripts/stack.sh reset              # wipe and reseed the demo data (asks first)
```

Arc helper scripts (from `backend/agent`): `npx tsx scripts/arc-register-secret.ts` (one-time entity secret registration; the recovery file goes outside the repo), `npx tsx scripts/arc-setup.ts` (creates and saves the two wallets), `npx tsx scripts/arc-status.ts` (balances).

Everything in containers:

```bash
cp .env.example .env
docker compose up --build
# frontend http://localhost:3000 · core http://localhost:8080 · agent :4100 · ledger :4200
```

Or natively (fast feedback):

```bash
docker compose up -d postgres                                   # Postgres on :5434
cd backend/ledger && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt \
  && LEDGER_DIR=./data .venv/bin/python -m uvicorn app.main:app --port 4200
cd backend/core && ./mvnw                                       # dev profile: seeds demo data, OTP 123456
npm install && npm run generate
npm run dev:agent
npm run dev:frontend
```

Sign in with **082 555 0147** (treasurer, Naledi) or **061 330 7742** (member, Bongani); the dev OTP is `123456`. The dark demo bar (hide with `NEXT_PUBLIC_DEMO=false`) drives real scenarios through the API: a member's bank cancels their mandate (the agent pauses), they re-approve, a collection fails or succeeds, run the agent.

## Tests

| Part | Command | What it covers |
|---|---|---|
| core | `cd backend/core && ./mvnw verify -Dit.test=TenantIsolationIT` | tenant isolation on every read endpoint, roles, service token, Hibernate filter |
| agent | `npm test -w backend/agent` | decision loop (pause, resume, highest-rate payout, propose, recycling), credit tiers, Arc call sequence and idempotency, request validation |
| ledger | `cd backend/ledger && .venv/bin/python -m pytest` | append + hash, unbalanced entries, service token, injection attempts, idempotency |
| frontend | `npm run smoke -w frontend` (backend running) | every screen, sheet and breakpoint rendered from live API data |

## Security posture

- Sign-in is phone + one-time code only. Codes are compared in constant time, attempts are counted atomically, and requests are rate-limited (5 per 15 minutes per phone). JHipster's password, registration, account and user-listing endpoints are switched off.
- Demo shortcuts (fixed OTP, `/api/dev/*`, seeding) exist only under the `dev` Spring profile. Outside `dev`, core refuses to start with a default `SERVICE_TOKEN` or Stitch webhook secret.
- The ledger and agent require `X-Service-Token`; the ledger validates every field it writes into Beancount (currency pinned to ZAR, account names and dates checked) and is idempotent on `entry_id`. Compose binds the ledger, agent and Postgres to localhost only.
- Loan approval claims the request atomically before any money moves, so concurrent approvals fund once.
- Every request body is validated against its contract before anything runs; malformed input is a 4xx, never a 5xx.

## Contract testing (Schemathesis)

A smoke profile lives in `api/schemathesis/core/schemathesis.toml` (positive cases, no DELETE, no dev endpoints). Run it against a throwaway stack, never the demo one, because it creates data:

```bash
pip install schemathesis
cd api/schemathesis/core
CORE_URL=http://localhost:8080/api SERVICE_TOKEN=... schemathesis run ../../core.yaml
```

## What is real and what is mocked

| Rail | Default | Real mode |
|---|---|---|
| Arc / USDC escrow | **live on Arc Testnet** when `ARC_MODE=circle` (see On-chain proof); mock rail otherwise, labelled "mock" everywhere | `ARC_MODE=circle` (see below). Uses Circle's ERC-8183 reference contract on Arc Testnet, `0x0747EEf0706327138c69792bF28Cd525089e4583`. |
| Stitch DebiCheck | mock rail that delivers signed webhooks | Not finished: Stitch's real API differs (mandates via `paymentConsentRequestCreate`, collections as SFTP batch files, webhooks signed with Svix). See `reports/`. |
| SMS | logged | plug a provider into `AuthDelegate.requestOtp` |

### Running the escrow on Arc Testnet

1. Create a Circle developer account, an API key and an entity secret, and register the entity secret.
2. Create two developer-controlled wallets on `ARC-TESTNET`: one for the lending stokvel, one for the borrowing stokvel. Fund both from https://faucet.circle.com (USDC is Arc's gas token).
3. In `.env` set `ARC_MODE=circle`, `CIRCLE_API_KEY`, `CIRCLE_ENTITY_SECRET`, `ARC_LENDER_WALLET_ID` / `ARC_LENDER_ADDRESS`, `ARC_BORROWER_WALLET_ID` / `ARC_BORROWER_ADDRESS`, and `ARC_DEMO_SCALE` so loan amounts fit the faucet balance.
4. Approve a loan. The agent runs createJob (lender) → setBudget (borrower) → approve + fund (lender) → submit (borrower) → complete (lender); each step must confirm before the next, with deterministic idempotency keys. The decision in Agent activity lists every transaction hash, linking to https://explorer.testnet.arc.io.

The agent signs for both wallets in this demo, which makes the escrow custodial in substance. In production each stokvel would hold its own keys, and the USDC leg would run behind a licensed crypto-asset service provider.
