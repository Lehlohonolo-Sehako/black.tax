# core

The system of record: stokvels, members, contributions, debts, loans, loan requests, agent decisions, notifications, and a mirror of the Beancount ledger. Spring Boot 4 on JHipster 9, with Postgres, Liquibase and JWT.

## API-first

The REST API is defined in [`../../api/core.yaml`](../../api/core.yaml). `openapi-generator` (delegate pattern, `Dto` suffix) generates `tax.black.core.web.api.*Api` interfaces and `service.api.dto.*Dto` models into `target/generated-sources` on every build. The implementations are the delegates in `src/main/java/tax/black/core/web/delegate/`:

| Delegate | Covers |
|---|---|
| `AuthDelegate`, `SessionIssuer` | phone + OTP sign-in issuing JHipster's JWT; `/me` |
| `StokvelsDelegate` | stokvel list, creation, dashboard, constitution changes, queue votes, dissolution proposals |
| `MembersDelegate` | roster, member detail, invitations, contribution changes, pause/resume, removal |
| `LedgerDelegate` | ledger mirror, entry detail with Beancount text and hash, CSV export |
| `AgentDelegate` | decision feed, run the agent, treasurer resume |
| `LendingDelegate` | lendable amount, loan requests (assessed by the agent), approval (escrow on Arc via the agent), decline, loans |
| `WebhooksDelegate` | signed Stitch events |
| `InternalDelegate` | the agent's read (`/internal/.../state`) and write (`/internal/.../decisions`) paths, service-token only |
| `DevDelegate` | demo login and simulated Stitch events, `dev` profile only |

Business logic lives in `tax.black.core.blacktax` (dashboard maths, ledger mirroring, decision effects, Stitch gateways, jobs, seed data).

## Tenancy

- **Tenant column:** every tenant-owned entity has `tenant_id` (the stokvel code) annotated with Hibernate `@TenantId`, so queries are filtered automatically.
- **Membership check:** `TenantAccessInterceptor` checks that the caller belongs to the stokvel in `/api/stokvels/{stokvelId}/…`. Internal paths use the service token instead.
- **Money reads:** reads that affect money (balances, entry codes) also filter by tenant explicitly.
- **Test:** `TenantIsolationIT` covers all of the above.

## Jobs

| Job | When (SAST) | What |
|---|---|---|
| Collections | 06:00 daily (`COLLECTION_CRON`) | Starts DebiCheck collections that fall due today; results arrive as Stitch webhooks |
| Agent tick | 07:00 daily (`AGENT_CRON`) | Asks the agent to evaluate every stokvel |

## Running

The usual way is `./scripts/stack.sh start` from the repo root. To run natively against the compose Postgres on :5434:

```bash
SERVICE_TOKEN=... ./mvnw          # dev profile: seeds demo data, OTP 123456, /api/dev/* enabled
```

Settings are environment variables; see `../../.env.example` and `tax.black.core.blacktax.Settings`. Outside the `dev` profile, demo shortcuts are disabled and core refuses to start with default secrets.

## Tests

```bash
./mvnw verify -Dit.test=TenantIsolationIT     # needs Docker (Testcontainers Postgres)
```

JHipster's own documentation: https://www.jhipster.tech/documentation-archive/v9.0.0
