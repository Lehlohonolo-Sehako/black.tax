# black.tax

**An agent that runs a stokvel's treasury, explains every decision it makes, and settles loans between stokvels in USDC on Arc.**

Built during the [Tameion Agents Hackathon](https://tameion.thecanteenapp.com) (Canteen × Circle, 27 Sep – 17 Oct 2026). Closest fit: **RFB 4, Autonomous Business Operator**, with angles on RFB 1 (treasury) and RFB 3 (escrow).

> **On-chain proof:** a real loan between two stokvels settled through Circle's ERC-8183 escrow on Arc Testnet, as **job 186928** with six successful transactions. [Details and explorer links ↓](#on-chain-proof-arc-testnet)

## Why

About 11 million South Africans save together in roughly 800,000 stokvels, moving around R50 billion a year (NASASA estimates). At the same time, 10.5 million credit-active South Africans (36%) have impaired credit records (NCR, June 2025), and unsecured credit can legally cost repo + 21% a year. Stokvels are already trusted, disciplined pools of money, but they are run by a volunteer treasurer with a notebook and a WhatsApp group.

black.tax gives that treasurer an agent:

- **Debt-Payoff stokvels.** Members pool contributions to clear the group's most expensive debt first. When a member is debt-free, their freed-up minimum payment is recycled into the pool. The agent picks who gets paid, pauses when a contribution or mandate fails, and resumes when it's fixed.
- **Lending between stokvels.** A stokvel with idle cash can lend to another. The agent works out how much can be lent safely, grades each request (Tier A, B or C) with its reasons, and, once the treasurer approves, funds and releases the loan through an ERC-8183 escrow in USDC on Arc.
- **A ledger nobody can quietly edit.** Every rand that moves is appended to a Beancount file. Each entry stores the file's SHA-256 hash, so the business record, the decision behind it and the ledger state can be traced to each other.

## How the agent decides

The agent is policy-bound: rules from the stokvel's constitution, applied by a pure function (`decide()` in `backend/agent/src/decide.ts`). It never holds state, and every decision is written down in three parts: *What I saw*, *What I decided*, *What happened*.

| Situation | What the agent does |
|---|---|
| A member's DebiCheck mandate is cancelled, or a contribution is more than two days overdue | **Pauses** payouts, names the member, the amount held and how many days overdue, and notifies them |
| The pool falls below the reserve floor | **Pauses** payouts; the reserve is never paid out |
| The reason for a pause is resolved | **Resumes** and records why |
| There is money above the reserve | **Pays** the highest-interest debt in the queue, `min(pool − reserve, balance)`; when a debt clears, notes the recycled minimum |
| The constitution requires approval | **Proposes** the payment instead of making it |
| Another stokvel asks to borrow | **Assesses** it (Tier A, B or C) on its contribution record, tenure, repayments and reserve, and recommends approve or decline with its reasons |
| The treasurer approves a loan | **Settles** it on Arc: createJob → setBudget → approve → fund → submit → complete, each step confirmed before the next |

Human escalation is built in. Loans always need the treasurer's approval. Payouts follow fixed rules from the constitution, and a stokvel can switch the agent to approval mode, so it proposes instead of paying. A treasurer can override a pause, and every constitution change is logged. No free-form judgment releases money, in line with Canteen's *Agents and Ledgers* essay.

## On-chain proof (Arc Testnet)

On 17 Oct 2026 the treasurer of Soweto Grocery Club approved a R8,000 loan to Diepkloof Grocery Society (`REQ-31`) in the app. With `ARC_DEMO_SCALE=0.001` it settled as 0.444444 USDC through Circle's ERC-8183 contract `0x0747EEf0706327138c69792bF28Cd525089e4583`. **Job 186928**, all six transactions successful:

| # | Step | Signed by | Transaction |
|---|---|---|---|
| 1 | `createJob` | lender | [0x0b5bde14…d5ca74](https://explorer.testnet.arc.io/tx/0x0b5bde14cd91337e5ebab12145a060d2ff0a117d800ef93c629c6fb32dd5ca74) |
| 2 | `setBudget` | borrower | [0xc1fecee2…b6bbe7](https://explorer.testnet.arc.io/tx/0xc1fecee2440f0c2e9f27ed22a0bd9474d9af8684699e65bec7b5e3575db6bbe7) |
| 3 | `approve` (USDC) | lender | [0xd4b1682b…4d6412](https://explorer.testnet.arc.io/tx/0xd4b1682b30706a5faa8b867fb99e9ae6d2788af47aaec86dd5e578a1fa4d6412) |
| 4 | `fund` | lender | [0x48032cfd…aea1b6](https://explorer.testnet.arc.io/tx/0x48032cfde80c37a32f3240ebc31c6d8ca6e30044ae69c55c24b9296a1faea1b6) |
| 5 | `submit` | borrower | [0x8f865d39…33397e](https://explorer.testnet.arc.io/tx/0x8f865d398aa47a5692abba1dd306b4803db685eebce97f75adcccd8d5633397e) |
| 6 | `complete` | lender | [0x888e2287…d7fdea](https://explorer.testnet.arc.io/tx/0x888e2287b03624d9057d87ccb6dff1eb45bdf4bfb4c3e6c51f93c5983bd7fdea) |

The lender wallet `0x6a0646ea5e95e264b459ae0b25db6d494a1e5dc8` is the job's client and evaluator; the borrower wallet `0x420041a5f9366f8653c3599b5c885ca29daac891` is its provider. Both are Circle developer-controlled wallets on `ARC-TESTNET`. The app's Agent activity screen shows the decision (G-04) with every hash, and the ledger's LOAN_OUT entry carries the final one. To reproduce it, see [docs/arc-testnet.md](docs/arc-testnet.md).

## Architecture

```
frontend ──JWT──▶ core (system of record) ──▶ agent ──▶ Arc Testnet (USDC, ERC-8183, Circle wallets)
                    │   ▲                       │
       Stitch ──────┘   └──── internal API ─────┤   service token: reads state, writes decisions
  (signed webhooks)                             ▼
                    core ──────────────────▶ ledger (Beancount; returns the file hash)
```

```
api/                OpenAPI contracts, the source of truth (API-first)
backend/core/       Spring Boot 4 (JHipster 9) · Postgres · phone-OTP JWT · per-stokvel tenancy · webhooks · daily jobs
backend/agent/      Node/TypeScript · decision engine · credit assessment · ERC-8183 escrow via Circle wallets
backend/ledger/     Python · FastAPI · Beancount 3 · append-only, one file per stokvel
frontend/           Next.js · screens from the Claude Design handoff · typed client generated from api/core.yaml
design/             the Claude Design prototype the screens were built from
docs/               demo guide, Arc setup, testing
scripts/stack.sh    start / stop / restart / status / reset
```

- **API-first.** Contracts live in `api/*.yaml`. Core's Java interfaces and DTOs are generated from them (openapi-generator, delegate pattern), as are the agent's and frontend's TypeScript types (openapi-typescript). Change the contract, regenerate, and the compiler shows what no longer matches.
- **Per-stokvel isolation.** Every tenant-owned row carries the stokvel ID, and Hibernate's `@TenantId` filters every query. An interceptor checks that the caller belongs to the stokvel in the path. `TenantIsolationIT` asserts this on every read endpoint.
- **Ledger chain.** The ledger validates the whole Beancount file before appending, is idempotent on entry ID, and returns the file's hash. Core stores the hash on its mirror row.

Service details: [backend/core](backend/core/README.md) · [backend/agent](backend/agent/README.md) · [backend/ledger](backend/ledger/README.md) · [frontend](frontend/README.md)

## Run it

Requirements: Docker Desktop. Node 22+, Java 21 and Python 3.11 only if you run services natively.

```bash
cp .env.example .env        # set SERVICE_TOKEN and the other secrets
./scripts/stack.sh start --build
```

Open http://localhost:3000 and sign in with **082 555 0147** (treasurer) or **061 330 7742** (member). The code is `123456` in the dev profile.

```bash
./scripts/stack.sh status     # what's running and healthy
./scripts/stack.sh restart    # stop everything (Docker and native dev processes), start again
./scripts/stack.sh stop
./scripts/stack.sh reset      # wipe and reseed the demo data (asks first)
```

[docs/demo.md](docs/demo.md) lists the seeded stokvels, members and loan requests, scenarios to try, and a walkthrough for the demo video. Set `NEXT_PUBLIC_DEMO=true` in `.env` to show the demo bar, which drives those scenarios from the UI.

## Testing

| Part | Command | Covers |
|---|---|---|
| core | `cd backend/core && ./mvnw verify -Dit.test=TenantIsolationIT` | tenant isolation on every read endpoint, roles, service token |
| agent | `npm test -w backend/agent` | decision loop, credit tiers, Arc call sequence and idempotency, input validation (21 tests) |
| ledger | `cd backend/ledger && .venv/bin/python -m pytest` | hash, balancing, service token, injection attempts, idempotency (8 tests) |
| frontend | `npm run smoke -w frontend` | every screen, sheet and breakpoint rendered from live API data |
| contracts | Schemathesis against all three specs | 2,101 core, 241 agent and 293 ledger generated cases, all passing |

See [docs/testing.md](docs/testing.md).

## Security

- **Sign-in:** phone + one-time code. Codes are compared in constant time, attempts are counted atomically, and requests are rate-limited. JHipster's password, registration and user-listing endpoints are switched off.
- **Demo shortcuts:** the fixed code, `/api/dev/*` and seed data exist only under the `dev` Spring profile. Outside it, core won't start with default secrets.
- **Service-to-service calls:** the ledger and agent require a service token and validate every input before anything runs. Compose exposes only the frontend and core; the ledger, agent and Postgres listen on localhost.
- **Loan approval:** a request is claimed atomically before any money moves, so concurrent approvals fund once.
- **Circle secrets:** the entity secret lives only in `.env`, and its recovery file is kept outside the repository. Circle calls carry deterministic idempotency keys, and no personal data goes on chain.

## What is real, what is mocked, and what's next

| Part | Status |
|---|---|
| Arc escrow (USDC, ERC-8183) | **Live on Arc Testnet** with `ARC_MODE=circle`. A mock rail, labelled "mock" wherever it appears, is used when no Circle credentials are set. |
| Agent decisions, ledger, tenancy, auth | Real, running in the stack |
| Stitch DebiCheck | **Mock rail.** It sends signed webhooks to core, so the webhook path runs end to end. Stitch's real API differs: mandates are created with `paymentConsentRequestCreate`, collections are SFTP batch files, and webhooks are Svix-signed. That integration is next. |
| SMS | Logged; plug a provider into `AuthDelegate.requestOtp` |
| Users | Seeded demo stokvels; no real stokvels onboarded yet |

**Honest notes for a production path**

- In this demo the agent signs for both the lender's and the borrower's wallets, which makes the escrow custodial in substance. In production each stokvel would hold its own keys, and the USDC leg would run behind a licensed crypto-asset service provider.
- Interest-bearing loans between stokvels likely require credit-provider registration in South Africa. The rand product (debt payoff and savings) can launch first.
- These are not legal opinions; they need South African counsel.

## Built during Tameion

Everything in this repository was built within the event window (27 Sep – 17 Oct 2026): the screens (from a Claude Design prototype), the API contracts, the four services, the tests and the Arc integration. The commit history and the on-chain transactions above carry their dates.
