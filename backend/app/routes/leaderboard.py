from fastapi import APIRouter, Depends
from typing import List, Optional
from sqlalchemy import select, func
from ..models import SessionLocal, Activity
from ..schemas import LeaderboardUser
from web3 import Web3
from .auth import require_wallet

router = APIRouter()

@router.get("/leaderboard", response_model=List[LeaderboardUser])
def leaderboard(wallet: Optional[str] = Depends(lambda authorization: require_wallet(authorization) if authorization else None)):
    db = SessionLocal()
    res = db.execute(select(Activity.wallet_address, func.count(Activity.id)).group_by(Activity.wallet_address).order_by(func.count(Activity.id).desc()))
    rows = res.fetchall(); users: List[LeaderboardUser] = []
    for addr, count in rows:
        badges = (1 if count >= 10 else 0) + (1 if count >= 50 else 0) + (1 if count >= 100 else 0)
        users.append(LeaderboardUser(address=addr, ensName=None, activities=int(count), tokens=int(count)*50, badges=badges, isCurrentUser=False if not wallet else Web3.to_checksum_address(addr) == Web3.to_checksum_address(wallet)))
    db.close(); return users
