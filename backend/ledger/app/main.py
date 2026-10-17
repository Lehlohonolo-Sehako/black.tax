"""black.tax ledger service.

A thin, append-only wrapper around Beancount. One `.beancount` file per stokvel.
Two operations: append(entry) and query(bql). Nothing is ever updated or deleted.
"""
from __future__ import annotations

import hashlib
import hmac
import os
import re
import threading
from datetime import datetime
from decimal import Decimal
from pathlib import Path
from typing import Optional

from beancount import loader
from typing import Literal

from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel, Field, field_validator

LEDGER_DIR = Path(os.environ.get("LEDGER_DIR", "./data"))
LEDGER_DIR.mkdir(parents=True, exist_ok=True)
OPERATING_CURRENCY = "ZAR"

SERVICE_TOKEN = os.environ.get("SERVICE_TOKEN", "")
app = FastAPI(title="black.tax ledger", version="1.0.0")


def require_token(x_service_token: str = Header(default="")) -> None:
    """Only core and the agent may read or write the ledger. Unset token = locked, never open."""
    if not SERVICE_TOKEN or not hmac.compare_digest(x_service_token.encode(), SERVICE_TOKEN.encode()):
        raise HTTPException(401, "service token required")
_locks: dict[str, threading.Lock] = {}
_locks_guard = threading.Lock()

STOKVEL_ID = re.compile(r"^[a-z0-9_-]{1,64}$")
ACCOUNT = re.compile(r"^(Assets|Liabilities|Equity|Income|Expenses)(:[A-Z][A-Za-z0-9-]*)+$")


class Posting(BaseModel):
    account: str
    amount: Decimal = Field(max_digits=14, decimal_places=2)
    # Pinned: the currency is written into the Beancount file, so it must never carry free text.
    currency: Literal["ZAR"] = OPERATING_CURRENCY

    @field_validator("account")
    @classmethod
    def valid_account(cls, v: str) -> str:
        if not ACCOUNT.match(v):
            raise ValueError(f"invalid Beancount account name: {v}")
        return v


class AppendRequest(BaseModel):
    stokvel_id: str
    timestamp: datetime
    type: str
    description: str
    entries: list[Posting] = Field(default_factory=list)
    reasoning: Optional[str] = None
    arc_tx_hash: Optional[str] = None
    agent_decision_id: Optional[str] = None
    entry_id: Optional[str] = None
    flagged: bool = False  # failed collections: `!` transaction with no postings

    @field_validator("timestamp")
    @classmethod
    def sane_date(cls, v: datetime) -> datetime:
        if not 2000 <= v.year <= 2100:
            raise ValueError("timestamp must be between 2000 and 2100")
        return v

    @field_validator("type")
    @classmethod
    def valid_type(cls, v: str) -> str:
        if not re.fullmatch(r"[A-Z_]{1,40}", v):
            raise ValueError("type must be an upper-case entry type")
        return v

    @field_validator("entry_id")
    @classmethod
    def valid_entry_id(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not re.fullmatch(r"[A-Za-z0-9:._-]{1,200}", v):
            raise ValueError("entry_id has invalid characters")
        return v

    @field_validator("stokvel_id")
    @classmethod
    def valid_stokvel(cls, v: str) -> str:
        if not STOKVEL_ID.match(v):
            raise ValueError("stokvel_id must be lowercase letters, digits, - or _")
        return v


class AppendResponse(BaseModel):
    stokvel_id: str
    hash: str
    beancount: str
    entries_in_file: int
    duplicate: bool = False


def _find_entry(text: str, entry_id: str) -> Optional[str]:
    marker = f"  entry-id: {_q(entry_id)}"
    for block in text.split("\n\n"):
        if marker in block.split("\n"):
            return block.strip()
    return None


class QueryRequest(BaseModel):
    stokvel_id: str
    bql: str


def _lock(stokvel_id: str) -> threading.Lock:
    with _locks_guard:
        return _locks.setdefault(stokvel_id, threading.Lock())


def _path(stokvel_id: str) -> Path:
    return LEDGER_DIR / f"{stokvel_id}.beancount"


def _q(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ") + '"'


def _hash(path: Path) -> str:
    return "sha256:" + hashlib.sha256(path.read_bytes()).hexdigest()


def _header(stokvel_id: str) -> str:
    return (
        f'option "title" "black.tax ledger: {stokvel_id}"\n'
        f'option "operating_currency" "{OPERATING_CURRENCY}"\n\n'
    )


def _opened_accounts(text: str) -> set[str]:
    return set(re.findall(r"^\d{4}-\d{2}-\d{2} open (\S+)", text, flags=re.M))


def render(req: AppendRequest, existing: str) -> str:
    """Render one request as Beancount text, opening any account it uses for the first time."""
    day = req.timestamp.date().isoformat()
    opened = _opened_accounts(existing)
    lines: list[str] = []
    for p in req.entries:
        if p.account not in opened:
            lines.append(f"{day} open {p.account}")
            opened.add(p.account)
    if lines:
        lines.append("")

    meta = [
        f"  entry-id: {_q(req.entry_id)}" if req.entry_id else None,
        f"  type: {_q(req.type)}",
        f"  timestamp: {_q(req.timestamp.isoformat())}",
        f"  reasoning: {_q(req.reasoning)}" if req.reasoning else None,
        f"  agent-decision: {_q(req.agent_decision_id)}" if req.agent_decision_id else None,
        f"  arc-tx: {_q(req.arc_tx_hash)}" if req.arc_tx_hash else None,
    ]
    meta = [m for m in meta if m]

    if req.type == "CONSTITUTION_CHANGE":
        lines.append(f'{day} custom "constitution-change" {_q(req.description)}')
        lines.extend(meta)
    elif not req.entries:
        flag = "!" if req.flagged else "*"
        lines.append(f"{day} {flag} {_q(req.description)}")
        lines.extend(meta)
    else:
        total = sum((p.amount for p in req.entries), Decimal("0"))
        if total != 0:
            raise HTTPException(422, f"postings do not balance (off by {total})")
        lines.append(f"{day} {'!' if req.flagged else '*'} {_q(req.description)}")
        lines.extend(meta)
        for p in req.entries:
            lines.append(f"  {p.account:<36}{p.amount:>12.2f} {p.currency}")
    return "\n".join(lines) + "\n\n"


def _count_entries(text: str) -> int:
    return len(re.findall(r"^\d{4}-\d{2}-\d{2} (\*|!|custom) ", text, flags=re.M))


@app.get("/health")
def health() -> dict:
    return {"status": "UP", "dir": str(LEDGER_DIR)}


@app.post("/ledger/append", response_model=AppendResponse, dependencies=[Depends(require_token)])
def append(req: AppendRequest) -> AppendResponse:
    path = _path(req.stokvel_id)
    with _lock(req.stokvel_id):
        existing = path.read_text() if path.exists() else _header(req.stokvel_id)
        if req.entry_id:
            # Idempotent on entry_id: a retry gets the original entry back, never a second posting.
            prior = _find_entry(existing, req.entry_id)
            if prior is not None:
                return AppendResponse(stokvel_id=req.stokvel_id, hash=_hash(path), beancount=prior,
                                      entries_in_file=_count_entries(existing), duplicate=True)
        chunk = render(req, existing)
        candidate = existing + chunk
        # Validate the whole file before committing; a bad entry must never reach disk.
        _, errors, _ = loader.load_string(candidate)
        real = [e for e in errors if "custom" not in str(e.message).lower()]
        if real:
            raise HTTPException(422, "; ".join(str(e.message) for e in real))
        if not path.exists():
            path.write_text(existing)
        with path.open("a") as f:  # append-only
            f.write(chunk)
        return AppendResponse(stokvel_id=req.stokvel_id, hash=_hash(path), beancount=chunk.strip(),
                              entries_in_file=_count_entries(candidate))


@app.post("/ledger/query", dependencies=[Depends(require_token)])
def query(req: QueryRequest) -> dict:
    if not STOKVEL_ID.match(req.stokvel_id):
        raise HTTPException(422, "invalid stokvel_id")
    path = _path(req.stokvel_id)
    if not path.exists():
        return {"columns": [], "rows": []}
    from beanquery import query as bq  # imported lazily; heavy

    entries, _, options = loader.load_file(str(path))
    try:
        types, rows = bq.run_query(entries, options, req.bql)
    except Exception as e:  # BQL syntax / compile errors
        raise HTTPException(400, "BQL error: the query could not be parsed") from e
    columns = [getattr(t, "name", t[0] if isinstance(t, tuple) else str(t)) for t in types]
    return {"columns": columns, "rows": [[_jsonable(v) for v in r] for r in rows]}


@app.get("/ledger/{stokvel_id}/balance", dependencies=[Depends(require_token)])
def balance(stokvel_id: str, account: str = "Assets:Pool:Cash") -> dict:
    """Convenience read used by the agent: the balance of one account, in ZAR."""
    if not ACCOUNT.fullmatch(account):  # interpolated into BQL below, so it must be a plain account name
        raise HTTPException(422, "invalid account name")
    res = query(QueryRequest(stokvel_id=stokvel_id, bql=f"SELECT sum(number) AS total WHERE account = '{account}'"))
    total = res["rows"][0][0] if res["rows"] and res["rows"][0][0] is not None else "0"
    return {"stokvel_id": stokvel_id, "account": account, "balance": str(total), "currency": OPERATING_CURRENCY}


@app.get("/ledger/{stokvel_id}/file", dependencies=[Depends(require_token)])
def file(stokvel_id: str) -> dict:
    if not STOKVEL_ID.match(stokvel_id):
        raise HTTPException(422, "invalid stokvel_id")
    path = _path(stokvel_id)
    if not path.exists():
        raise HTTPException(404, "no ledger for this stokvel")
    return {"stokvel_id": stokvel_id, "hash": _hash(path), "beancount": path.read_text()}


def _jsonable(v):
    if isinstance(v, Decimal):
        return str(v)
    if hasattr(v, "isoformat"):
        return v.isoformat()
    if v is None or isinstance(v, (int, float, str, bool)):
        return v
    return str(v)
