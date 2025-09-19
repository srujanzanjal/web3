from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy import select, func
from ..models import SessionLocal, Activity
from ..schemas import Badge
from .auth import require_wallet
from datetime import date

router = APIRouter()

@router.get("/me", response_model=List[Badge])
def my_badges(wallet: str = Depends(require_wallet)):
    db = SessionLocal()
    total = int(db.execute(select(func.count(Activity.id)).where(Activity.wallet_address == wallet)).scalar() or 0)
    db.close()
    badges: List[Badge] = []
    def add(bid, name, desc, emoji, rarity, token_id):
        badges.append(Badge(id=bid, name=name, description=desc, emoji=emoji, mintDate=date.today().isoformat(), tokenId=token_id, rarity=rarity, ipfsUrl=f"ipfs://{bid}"))
    
    # Updated milestones: 10, 25, 50, 100
    if total >= 10: add("badge-bronze","Bronze Achiever","Logged 10 activities","🥉","common","1")
    if total >= 25: add("badge-silver","Silver Voyager","Logged 25 activities","🥈","rare","2")
    if total >= 50: add("badge-gold","Gold Legend","Logged 50 activities","🥇","epic","3")
    if total >= 100: add("badge-cosmic","Cosmic Explorer","Logged 100 activities","🌌","legendary","4")
    return badges
