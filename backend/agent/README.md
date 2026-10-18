# agent

A stateless decision engine. It reads a stokvel's state from core and its pool balance from the ledger, decides, settles on Arc where needed, appends to the ledger, and writes the decision back to core. Contract: [`../../api/agent.yaml`](../../api/agent.yaml).

| File | Role |
|---|---|
| `src/decide.ts` | The decision loop, a pure function: pause (failed mandate, overdue contribution, pool below reserve), resume, pay the highest-rate debt, propose in approval mode |
| `src/assess.ts` | Credit tier (A/B/C) and recommendation for a loan request, with plain-language reasons |
| `src/arc.ts` | ERC-8183 escrow on Arc Testnet through Circle developer-controlled wallets (`CircleArcRail`), or a labelled mock rail |
| `src/server.ts` | `/agent/evaluate`, `/agent/assess`, `/agent/loans/fund`; service token, input validation, one operation per stokvel at a time |
| `src/validate.ts` | Request validation against the contract, before anything else runs |
| `src/clients.ts` | Core (internal API) and ledger clients, with timeouts |
| `scripts/arc-*.ts` | Arc setup: register the entity secret, create the wallets, show balances. See [docs/arc-testnet.md](../../docs/arc-testnet.md). |

Ledger writes carry an `entry_id` derived from the state the decision was made on, so a retry after a failed write to core can't pay twice. Circle calls carry idempotency keys derived from the loan, the step and `ARC_RUN_ID`.

```bash
npm run generate          # types from api/*.yaml into src/generated
npm test                  # 21 tests
npm run dev               # needs SERVICE_TOKEN, CORE_URL, LEDGER_URL; ARC_* for the live rail
```
