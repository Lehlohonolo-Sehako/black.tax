# ledger

An append-only Beancount ledger, one file per stokvel. Contract: [`../../api/ledger.yaml`](../../api/ledger.yaml).

| Endpoint | What it does |
|---|---|
| `POST /ledger/append` | Validates the request, renders it as Beancount, validates the whole file with Beancount, appends it, and returns the file's SHA-256. Idempotent on `entry_id`: a repeat returns the original entry with `duplicate: true`. |
| `POST /ledger/query` | Runs BQL (beanquery) against one stokvel's file |
| `GET /ledger/{stokvel_id}/balance` | Balance of one account (default `Assets:Pool:Cash`) |
| `GET /ledger/{stokvel_id}/file` | The whole file and its hash |
| `GET /health` | Liveness (no token) |

Every other route needs `X-Service-Token`, and the service refuses to serve without one configured.

What gets written into the file is constrained:
- the currency is pinned to ZAR;
- account names, entry types and entry IDs are pattern-checked;
- amounts have at most 2 decimals;
- dates must fall between 2000 and 2100;
- the account in balance queries is validated before it reaches BQL.

Accounts used: `Assets:Pool:Cash`, `Equity:Contributions`, `Equity:Recycled`, `Liabilities:MemberDebt:<Name>`, `Assets:LoansReceivable`. Failed collections are flagged `!` transactions, and constitution changes are `custom "constitution-change"` entries.

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
SERVICE_TOKEN=... LEDGER_DIR=./data .venv/bin/python -m uvicorn app.main:app --port 4200
.venv/bin/python -m pytest        # 8 tests
```
