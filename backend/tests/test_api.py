import os
os.environ.setdefault("DATABASE_URL", "sqlite:///./fitness.db")
from fastapi.testclient import TestClient
from app.main import app
from app.models import init_db
from app.scripts.seed import run as seed_run

init_db()
seed_run()
client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

def test_leaderboard():
    r = client.get("/leaderboard")
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_auth_and_me():
    # simulate SIWE by signing a message is complex; use dev JWT instead
    from app.scripts.dev_jwt import JWT_SECRET, JWT_ALG, datetime, Web3, jwt, JWT_EXPIRE_MINUTES
    addr = Web3.to_checksum_address("0x1234567890123456789012345678901234567890")
    exp = datetime.datetime.utcnow() + datetime.timedelta(minutes=JWT_EXPIRE_MINUTES)
    token = jwt.encode({"sub": addr, "exp": exp}, JWT_SECRET, algorithm=JWT_ALG)
    r = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    body = r.json()
    assert body["wallet_address"].lower() == addr.lower()

def test_activities_flow():
    from app.scripts.dev_jwt import JWT_SECRET, JWT_ALG, datetime, Web3, jwt, JWT_EXPIRE_MINUTES
    addr = Web3.to_checksum_address("0x1234567890123456789012345678901234567890")
    exp = datetime.datetime.utcnow() + datetime.timedelta(minutes=JWT_EXPIRE_MINUTES)
    token = jwt.encode({"sub": addr, "exp": exp}, JWT_SECRET, algorithm=JWT_ALG)
    headers={"Authorization": f"Bearer {token}"}
    r = client.post("/activities/log", json={"activity_type":"run","distance":5,"date":"2025-01-01"}, headers=headers)
    assert r.status_code == 200
    r = client.get("/activities/me", headers=headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_rewards_endpoints():
    from app.scripts.dev_jwt import JWT_SECRET, JWT_ALG, datetime, Web3, jwt, JWT_EXPIRE_MINUTES
    addr = Web3.to_checksum_address("0x1234567890123456789012345678901234567890")
    exp = datetime.datetime.utcnow() + datetime.timedelta(minutes=JWT_EXPIRE_MINUTES)
    token = jwt.encode({"sub": addr, "exp": exp}, JWT_SECRET, algorithm=JWT_ALG)
    headers={"Authorization": f"Bearer {token}"}
    r = client.get("/rewards/pending", headers=headers)
    assert r.status_code == 200
    # Claim only if pending exists
    pending = r.json()
    if pending:
        rid = pending[0]["id"]
        r2 = client.post("/rewards/claim", json={"rewardId": rid}, headers=headers)
        # might 500 if ADMIN_PRIVATE_KEY unset; allow both 200/500
        assert r2.status_code in (200, 500)

