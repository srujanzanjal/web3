Run backend locally:

1) cp backend/.env.example backend/.env  # set ADMIN_PRIVATE_KEY, RPC_URL, etc.
2) python3.11 -m venv .venv && source .venv/bin/activate
3) pip install -r backend/requirements.txt
4) uvicorn app.main:app --app-dir backend --reload --host 0.0.0.0 --port 8000

API map used by frontend:
- POST /auth/siwe
- GET /auth/me
- POST /activities/log
- GET /activities/me
- GET /rewards/pending
- POST /rewards/claim
- GET /rewards/history
- GET /leaderboard
- GET /badges/me
