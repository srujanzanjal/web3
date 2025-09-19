import os
from datetime import date, timedelta
from app.models import SessionLocal, init_db, User, Activity, RewardClaim
from web3 import Web3

def checksum(addr: str) -> str:
    return Web3.to_checksum_address(addr)

def run():
    init_db()
    db = SessionLocal()
    u1 = checksum("0x1234567890123456789012345678901234567890")
    u2 = checksum("0x2345678901234567890123456789012345678901")
    for w in [u1, u2]:
        if not db.get(User, w):
            db.add(User(wallet_address=w))
    db.commit()
    # activities
    base = date.today()
    activities = []
    for i in range(12):
        activities.append(Activity(wallet_address=u1, activity_type="run", distance=5 + i % 3, duration=30 + i, date=base - timedelta(days=i), pending_reward=(i%5!=0)))
    for i in range(7):
        activities.append(Activity(wallet_address=u2, activity_type="walk", distance=2 + i % 2, duration=20 + i, date=base - timedelta(days=i), pending_reward=(i%5!=0)))
    db.add_all(activities)
    db.commit()
    # sample reward claim
    db.add(RewardClaim(wallet_address=u1, reward_type="token", amount=100, tx_hash=None))
    db.commit()
    db.close()
    print("Seeded users, activities, and a reward claim.")

if __name__ == "__main__":
    run()
