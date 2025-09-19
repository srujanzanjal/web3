from fastapi import APIRouter, HTTPException, Header, Depends
from ..schemas import SIWEMessage, JWTResponse, UserProfile
from ..models import SessionLocal, User, init_db
from ..services.web3_service import avatar_seed_from_wallet
import os, jwt, datetime
from eth_account.messages import encode_defunct
from eth_account import Account
from web3 import Web3

router = APIRouter()
JWT_SECRET = os.getenv("JWT_SECRET", "dev_secret")
JWT_ALG = os.getenv("JWT_ALG", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "43200"))

init_db()

def issue_jwt(wallet: str) -> str:
    exp = datetime.datetime.utcnow() + datetime.timedelta(minutes=JWT_EXPIRE_MINUTES)
    return jwt.encode({"sub": wallet, "exp": exp}, JWT_SECRET, algorithm=JWT_ALG)

def require_wallet(authorization: str = Header(default="")) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        return Web3.to_checksum_address(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/siwe", response_model=JWTResponse)
def siwe_auth(payload: SIWEMessage):
    try:
        parts = dict([tuple(p.split(":", 1)) for p in payload.message.split(";") if ":" in p])
        address = parts.get("address")
        if not address:
            raise ValueError("No address in message")
        msg = encode_defunct(text=payload.message)
        recovered = Account.recover_message(msg, signature=payload.signature)
        if Web3.to_checksum_address(recovered) != Web3.to_checksum_address(address):
            raise HTTPException(status_code=401, detail="Invalid signature")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid SIWE payload") from e

    db = SessionLocal()
    user = db.get(User, Web3.to_checksum_address(address))
    if not user:
        db.add(User(wallet_address=Web3.to_checksum_address(address)))
        db.commit()
    db.close()
    return JWTResponse(token=issue_jwt(Web3.to_checksum_address(address)))

@router.get("/me")
def me(wallet: str = Depends(require_wallet)):
    db = SessionLocal()
    user = db.get(User, wallet)
    if not user:
        db.close(); raise HTTPException(status_code=404, detail="User not found")
    profile = UserProfile(wallet_address=user.wallet_address, join_date=user.join_date, ens_name=None, avatar_seed=avatar_seed_from_wallet(user.wallet_address))
    db.close()
    return {"wallet_address": wallet, "profile": profile}
