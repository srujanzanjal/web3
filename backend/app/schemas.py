from pydantic import BaseModel, Field, constr
from typing import Optional, List
from datetime import date, datetime

class SIWEMessage(BaseModel):
    message: str
    signature: str

class JWTResponse(BaseModel):
    token: str

class UserProfile(BaseModel):
    wallet_address: str
    join_date: datetime
    ens_name: Optional[str] = None
    avatar_seed: str

class ActivityCreate(BaseModel):
    activity_type: constr(min_length=2, max_length=32)
    distance: Optional[float] = Field(default=None, ge=0, le=200)
    duration: Optional[int] = Field(default=None, ge=0, le=24*60)
    date: date

class ActivityOut(BaseModel):
    id: int
    wallet_address: str
    activity_type: str
    distance: Optional[float]
    duration: Optional[int]
    date: date
    tokens_awarded: int
    status: str
    class Config:
        from_attributes = True

class PendingReward(BaseModel):
    id: str
    type: str
    title: str
    description: str
    amount: int = 0
    earnedDate: str

class ClaimVoucher(BaseModel):
    domain: dict
    types: dict
    message: dict
    signature: str

class RewardHistoryItem(BaseModel):
    id: int
    reward_type: str
    amount: int
    tx_hash: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

class LeaderboardUser(BaseModel):
    address: str
    ensName: Optional[str]
    activities: int
    tokens: int
    badges: int
    isCurrentUser: bool = False

class Badge(BaseModel):
    id: str
    name: str
    description: str
    emoji: str
    mintDate: str
    tokenId: str
    rarity: str
    ipfsUrl: str
