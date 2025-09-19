from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import select
from typing import List
from ..schemas import ActivityCreate, ActivityOut
from ..models import SessionLocal, Activity
from .auth import require_wallet

router = APIRouter()

def calculate_tokens(activity_type: str, distance: float = None, duration: int = None) -> int:
    """Calculate tokens based on activity type and multipliers"""
    multipliers = {
        "run": 2.0, "walk": 1.0, "cycle": 1.5, "swim": 3.0,
        "pushups": 0.2, "yoga": 1.0, "weightlifting": 2.0, "stretching": 1.0
    }
    
    multiplier = multipliers.get(activity_type, 1.0)
    
    if distance is not None and distance > 0:
        # Distance-based activities
        tokens = max(10, int(distance * multiplier))
    elif duration is not None and duration > 0:
        # Duration-based activities (convert to minutes)
        tokens = max(10, int(duration * multiplier))
    else:
        tokens = 10  # Minimum reward
    
    return tokens

@router.post("/log", response_model=ActivityOut)
def log_activity(data: ActivityCreate, wallet: str = Depends(require_wallet)):
    if data.distance is None and data.duration is None:
        raise HTTPException(status_code=422, detail="Provide distance or duration")
    if data.distance is not None and data.distance == 0 and (data.duration or 0) == 0:
        raise HTTPException(status_code=422, detail="Invalid values")
    
    # Calculate tokens based on activity type and value
    tokens = calculate_tokens(data.activity_type, data.distance, data.duration)
    
    db = SessionLocal()
    activity = Activity(
        wallet_address=wallet, 
        activity_type=data.activity_type, 
        distance=int(data.distance) if data.distance is not None else None, 
        duration=data.duration, 
        date=data.date, 
        tokens_awarded=tokens,
        status="pending"
    )
    db.add(activity); db.commit(); db.refresh(activity)
    out = ActivityOut.model_validate(activity, from_attributes=True)
    db.close(); return out

@router.get("/me", response_model=List[ActivityOut])
def my_activities(wallet: str = Depends(require_wallet)):
    db = SessionLocal()
    res = db.execute(select(Activity).where(Activity.wallet_address == wallet).order_by(Activity.created_at.desc()))
    rows = [r[0] for r in res.fetchall()]
    out = [ActivityOut.model_validate(r, from_attributes=True) for r in rows]
    db.close(); return out
