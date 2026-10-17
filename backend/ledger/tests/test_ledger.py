from fastapi.testclient import TestClient


TOKEN = "test-token"


def client(tmp_path, monkeypatch):
    monkeypatch.setenv("LEDGER_DIR", str(tmp_path))
    monkeypatch.setenv("SERVICE_TOKEN", TOKEN)
    import importlib
    import app.main as m
    importlib.reload(m)
    return TestClient(m.app, headers={"X-Service-Token": TOKEN}), m


def test_append_query_and_hash_chain(tmp_path, monkeypatch):
    c, _ = client(tmp_path, monkeypatch)
    r = c.post("/ledger/append", json={
        "stokvel_id": "masakhane", "timestamp": "2026-08-01T06:04:00+02:00", "type": "CONTRIBUTION",
        "description": "August contributions", "entry_id": "L-0002",
        "entries": [{"account": "Assets:Pool:Cash", "amount": "8000.00"}, {"account": "Equity:Contributions", "amount": "-8000.00"}]})
    assert r.status_code == 200, r.text
    h1 = r.json()["hash"]
    r = c.post("/ledger/append", json={
        "stokvel_id": "masakhane", "timestamp": "2026-08-02T09:00:00+02:00", "type": "DEBT_PAYMENT",
        "description": "Paid toward Zanele Dlamini's payday loan", "agent_decision_id": "D-01",
        "reasoning": "Highest rate first.",
        "entries": [{"account": "Liabilities:MemberDebt:Zanele", "amount": "3000.00"}, {"account": "Assets:Pool:Cash", "amount": "-3000.00"}]})
    assert r.status_code == 200, r.text
    assert r.json()["hash"] != h1
    bal = c.get("/ledger/masakhane/balance").json()
    assert bal["balance"] == "5000.00"
    q = c.post("/ledger/query", json={"stokvel_id": "masakhane", "bql": "SELECT account, sum(number) GROUP BY account ORDER BY account"})
    assert q.status_code == 200, q.text
    assert ["Assets:Pool:Cash", "5000.00"] in q.json()["rows"]


def test_rejects_unbalanced_and_keeps_file(tmp_path, monkeypatch):
    c, _ = client(tmp_path, monkeypatch)
    ok = {"stokvel_id": "g", "timestamp": "2026-10-01T06:00:00+02:00", "type": "CONTRIBUTION", "description": "x",
          "entries": [{"account": "Assets:Pool:Cash", "amount": "10"}, {"account": "Equity:Contributions", "amount": "-10"}]}
    h = c.post("/ledger/append", json=ok).json()["hash"]
    bad = dict(ok, entries=[{"account": "Assets:Pool:Cash", "amount": "10"}, {"account": "Equity:Contributions", "amount": "-9"}])
    assert c.post("/ledger/append", json=bad).status_code == 422
    assert c.get("/ledger/g/file").json()["hash"] == h


def test_flagged_failed_collection_and_constitution(tmp_path, monkeypatch):
    c, _ = client(tmp_path, monkeypatch)
    r = c.post("/ledger/append", json={"stokvel_id": "m", "timestamp": "2026-10-01T06:02:00+02:00", "type": "COLLECTION_FAILED",
                                        "description": "Thabo Nkosi's contribution (failed)", "flagged": True, "entries": []})
    assert r.status_code == 200 and r.json()["beancount"].startswith("2026-10-01 !")
    r = c.post("/ledger/append", json={"stokvel_id": "m", "timestamp": "2026-10-17T06:11:00+02:00", "type": "CONSTITUTION_CHANGE",
                                        "description": "Treasurer updated reserve floor from R5,000 to R6,000"})
    assert r.status_code == 200 and 'custom "constitution-change"' in r.json()["beancount"]


OK = {"stokvel_id": "s", "timestamp": "2026-10-01T06:00:00+02:00", "type": "CONTRIBUTION", "description": "x",
      "entries": [{"account": "Assets:Pool:Cash", "amount": "10"}, {"account": "Equity:Contributions", "amount": "-10"}]}


def test_requires_service_token(tmp_path, monkeypatch):
    c, m = client(tmp_path, monkeypatch)
    anon = TestClient(m.app)
    assert anon.post("/ledger/append", json=OK).status_code == 401
    assert anon.get("/ledger/s/balance").status_code == 401
    assert anon.get("/health").status_code == 200


def test_currency_injection_is_rejected(tmp_path, monkeypatch):
    c, _ = client(tmp_path, monkeypatch)
    forged = dict(OK, entries=[{"account": "Assets:Pool:Cash", "amount": "10", "currency": 'ZAR\n\n2026-10-01 * "x"\n  Assets:Pool:Cash 100000 ZAR'},
                              {"account": "Equity:Contributions", "amount": "-10"}])
    assert c.post("/ledger/append", json=forged).status_code == 422


def test_bql_injection_in_balance_is_rejected(tmp_path, monkeypatch):
    c, _ = client(tmp_path, monkeypatch)
    c.post("/ledger/append", json=OK)
    assert c.get("/ledger/s/balance", params={"account": "x' OR account ~ 'Liab"}).status_code == 422


def test_entry_id_makes_append_idempotent(tmp_path, monkeypatch):
    c, _ = client(tmp_path, monkeypatch)
    first = c.post("/ledger/append", json=dict(OK, entry_id="agent:D-07:PAYMENT:thabo:-1500.00")).json()
    again = c.post("/ledger/append", json=dict(OK, entry_id="agent:D-07:PAYMENT:thabo:-1500.00")).json()
    assert again["duplicate"] is True and again["hash"] == first["hash"]
    assert c.get("/ledger/s/balance").json()["balance"] == "10.00"


def test_rejects_absurd_dates_and_sub_cent_amounts(tmp_path, monkeypatch):
    c, _ = client(tmp_path, monkeypatch)
    assert c.post("/ledger/append", json=dict(OK, timestamp="0298-01-01T00:00:00+00:00")).status_code == 422
    sub = dict(OK, entries=[{"account": "Assets:Pool:Cash", "amount": "0.001"}, {"account": "Equity:Contributions", "amount": "-0.001"}])
    assert c.post("/ledger/append", json=sub).status_code == 422
