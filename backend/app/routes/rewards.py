from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import select, func
from typing import List
from ..schemas import PendingReward, ClaimVoucher, RewardHistoryItem
from ..models import SessionLocal, Activity, RewardClaim
from .auth import require_wallet
from ..services.web3_service import EIP712_DOMAIN, CLAIM_TYPES
from eth_account.messages import encode_typed_data
from eth_account import Account
import os
from datetime import date

router = APIRouter()
ADMIN_PRIVATE_KEY = os.getenv("ADMIN_PRIVATE_KEY")
admin_account = Account.from_key(ADMIN_PRIVATE_KEY) if ADMIN_PRIVATE_KEY else None

def compute_pending_rewards(db: SessionLocal, wallet: str) -> List[PendingReward]:
    # Get total activities and total tokens earned
    total_activities = int(db.execute(select(func.count(Activity.id)).where(Activity.wallet_address == wallet)).scalar() or 0)
    total_tokens = int(db.execute(select(func.sum(Activity.tokens_awarded)).where(Activity.wallet_address == wallet)).scalar() or 0)
    
    rewards: List[PendingReward] = []
    
    # Token rewards for every 100 tokens earned
    if total_tokens >= 100 and total_tokens % 100 == 0:
        rewards.append(PendingReward(
            id=f"token-{total_tokens}",
            type="token",
            title="Token Milestone",
            description=f"You earned {total_tokens} FITT tokens",
            amount=total_tokens,
            earnedDate=date.today().isoformat(),
        ))
    
    # Badge milestones: 10, 25, 50, 100 activities
    def add_badge(bid, name, desc, emoji, milestone):
        rewards.append(PendingReward(
            id=bid, type="badge", title=name, description=desc, amount=0, 
            earnedDate=date.today().isoformat()
        ))
    
    if total_activities >= 10: add_badge("badge-bronze", "Bronze Achiever", "Logged 10 activities", "🥉", 10)
    if total_activities >= 25: add_badge("badge-silver", "Silver Voyager", "Logged 25 activities", "🥈", 25)
    if total_activities >= 50: add_badge("badge-gold", "Gold Legend", "Logged 50 activities", "🥇", 50)
    if total_activities >= 100: add_badge("badge-cosmic", "Cosmic Explorer", "Logged 100 activities", "🌌", 100)
    
    # Filter out already claimed badges
    claimed = set(r.reward_type for (r,) in db.execute(select(RewardClaim).where(RewardClaim.wallet_address == wallet)).all())
    return [r for r in rewards if not (r.type == "badge" and r.id in claimed)]

@router.get("/pending", response_model=List[PendingReward])
def pending(wallet: str = Depends(require_wallet)):
    db = SessionLocal(); data = compute_pending_rewards(db, wallet); db.close(); return data

class ClaimBody(BaseModel):
    rewardId: str

@router.post("/claim", response_model=ClaimVoucher)
def claim(body: ClaimBody, wallet: str = Depends(require_wallet)):
    rewardId = body.rewardId
    if rewardId.startswith("token-"):
        reward_type, amount = "token", 100
    elif rewardId in ("badge-bronze", "badge-silver", "badge-gold"):
        reward_type, amount = rewardId, 0
    else:
        raise HTTPException(status_code=404, detail="Unknown reward")

    if not admin_account:
        raise HTTPException(status_code=500, detail="Server signer not configured")

    db = SessionLocal()
    nonce = int(db.execute(select(func.count(RewardClaim.id)).where(RewardClaim.wallet_address == wallet)).scalar() or 0) + 1

    message = {"wallet": wallet, "rewardType": reward_type, "amount": amount, "nonce": nonce}
    typed = {"domain": EIP712_DOMAIN, "primaryType": "Claim", "types": {**CLAIM_TYPES, "EIP712Domain": []}, "message": message}
    encoded = encode_typed_data(full_message=typed)
    signature = Account.sign_message(encoded, private_key=admin_account.key).signature.hex()

    db.add(RewardClaim(wallet_address=wallet, reward_type=reward_type, amount=amount, tx_hash=None)); db.commit(); db.close()
    return {"domain": EIP712_DOMAIN, "types": CLAIM_TYPES, "message": message, "signature": signature}

@router.get("/history", response_model=List[RewardHistoryItem])
def history(wallet: str = Depends(require_wallet)):
    db = SessionLocal()
    rows = [r[0] for r in db.execute(select(RewardClaim).where(RewardClaim.wallet_address == wallet).order_by(RewardClaim.created_at.desc())).all()]
    out = [RewardHistoryItem.model_validate(r, from_attributes=True) for r in rows]
    db.close(); return out
