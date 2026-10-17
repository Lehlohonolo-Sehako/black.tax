# Testing

| Part | Command | What it covers |
|---|---|---|
| core | `cd backend/core && ./mvnw verify -Dit.test=TenantIsolationIT` | Two tenants against a real Postgres (Testcontainers). Every tenant-scoped read endpoint refuses another stokvel and returns only its own rows; members can read but not change the constitution; internal endpoints need the service token; Hibernate's tenant filter scopes repository reads. |
| agent | `npm test -w backend/agent` | The decision loop (pause on a failed mandate or overdue contribution, resume, highest-rate payout, approval mode, recycling, exact amounts), credit tiers, the Arc call sequence (which wallet signs each step, deployed signatures, idempotency keys, no personal data on chain) and request validation |
| ledger | `cd backend/ledger && .venv/bin/python -m pytest` | Append and hash, unbalanced postings rejected, flagged and constitution entries, service token required, currency and BQL injection rejected, idempotent `entry_id`, date and amount bounds |
| frontend | `npm run smoke -w frontend` | Signs in through the dev endpoint, loads live snapshots, and server-renders every screen, sheet and breakpoint for a treasurer and a member (2,106 renders) |

The agent's Docker image runs its tests during the build.

## Contract testing with Schemathesis

The OpenAPI contracts are the source of truth, so they're tested directly. [Schemathesis](https://schemathesis.readthedocs.io) generates requests from each spec and checks for server errors, schema-conforming responses and correct content types.

```bash
pip install schemathesis
TOKEN=$(grep '^SERVICE_TOKEN=' .env | cut -d= -f2)

# core: smoke profile in api/schemathesis/core/schemathesis.toml (positive cases, no DELETE, no dev endpoints)
cd api/schemathesis/core && CORE_URL=http://localhost:8080/api SERVICE_TOKEN=$TOKEN schemathesis run ../../core.yaml; cd -

# agent and ledger
schemathesis run api/agent.yaml  --url http://localhost:4100 -H "X-Service-Token: $TOKEN" -n 30 --checks not_a_server_error
schemathesis run api/ledger.yaml --url http://localhost:4200 -H "X-Service-Token: $TOKEN" -n 30 --checks not_a_server_error
```

Latest results (17 Oct 2026): core 2,101/2,101, agent 241/241, ledger 293/293.

Schemathesis creates data and calls mutating endpoints, so **run it against a throwaway stack**. Afterwards, `./scripts/stack.sh reset` restores the demo data. In CI, use `-n` to bound runs rather than `--max-time`, which keeps fuzzing until the time runs out.

## Before a demo

```bash
./scripts/stack.sh reset --yes && npm run smoke -w frontend
```
