#!/usr/bin/env python3
"""
Comprehensive database seeding script for CosmicFit
Creates realistic sample data for testing the full application
"""

import os
import sys
import random
from datetime import date, timedelta, datetime
from web3 import Web3

# Add the backend directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.models import SessionLocal, User, Activity, RewardClaim, init_db

def run():
    print("🌱 Starting comprehensive database seeding...")
    
    # Initialize database
    init_db()
    db = SessionLocal()

    # Clear existing data for a clean seed
    print("🧹 Clearing existing data...")
    db.query(RewardClaim).delete()
    db.query(Activity).delete()
    db.query(User).delete()
    db.commit()

    # Sample Users with realistic addresses
    print("👥 Creating sample users...")
    users_data = [
        {
            "address": "0x1234567890123456789012345678901234567890",
            "name": "CosmicRunner",
            "activities_count": 105,  # Gold + Cosmic badges
            "activity_types": ["run", "cycle", "swim"]
        },
        {
            "address": "0x2345678901234567890123456789012345678901", 
            "name": "FitnessGuru",
            "activities_count": 75,   # Gold badge
            "activity_types": ["run", "walk", "yoga", "weightlifting"]
        },
        {
            "address": "0x3456789012345678901234567890123456789012",
            "name": "Stardust",
            "activities_count": 35,   # Silver badge
            "activity_types": ["cycle", "swim", "stretching"]
        },
        {
            "address": "0x4567890123456789012345678901234567890123",
            "name": "MoonWalker",
            "activities_count": 15,   # Bronze badge
            "activity_types": ["walk", "yoga"]
        },
        {
            "address": "0x5678901234567890123456789012345678901234",
            "name": "Nebula",
            "activities_count": 5,    # No badges yet
            "activity_types": ["run", "pushups"]
        }
    ]

    # Create users
    users = []
    for user_data in users_data:
        user = User(wallet_address=Web3.to_checksum_address(user_data["address"]))
        users.append(user)
        db.add(user)
    db.commit()

    print("🏃‍♂️ Creating realistic activities...")
    
    # Activity types with realistic data ranges
    activity_configs = {
        "run": {"distance_range": (1, 15), "duration_range": (10, 90)},
        "walk": {"distance_range": (1, 8), "duration_range": (15, 60)},
        "cycle": {"distance_range": (5, 50), "duration_range": (20, 120)},
        "swim": {"distance_range": (0.5, 3), "duration_range": (15, 60)},
        "pushups": {"distance_range": (10, 100), "duration_range": (5, 30)},
        "yoga": {"distance_range": None, "duration_range": (20, 90)},
        "weightlifting": {"distance_range": None, "duration_range": (30, 120)},
        "stretching": {"distance_range": None, "duration_range": (10, 45)}
    }

    # Token calculation function (same as backend)
    def calculate_tokens(activity_type: str, distance: float = None, duration: int = None) -> int:
        multipliers = {
            "run": 2.0, "walk": 1.0, "cycle": 1.5, "swim": 3.0,
            "pushups": 0.2, "yoga": 1.0, "weightlifting": 2.0, "stretching": 1.0
        }
        
        multiplier = multipliers.get(activity_type, 1.0)
        
        if distance is not None and distance > 0:
            tokens = max(10, int(distance * multiplier))
        elif duration is not None and duration > 0:
            tokens = max(10, int(duration * multiplier))
        else:
            tokens = 10
        
        return tokens

    # Generate activities for each user
    for user_data in users_data:
        user_address = Web3.to_checksum_address(user_data["address"])
        activities_count = user_data["activities_count"]
        preferred_types = user_data["activity_types"]
        
        # Spread activities over the last 3 months
        start_date = date.today() - timedelta(days=90)
        
        for i in range(activities_count):
            # Random date within the last 3 months
            activity_date = start_date + timedelta(days=random.randint(0, 90))
            
            # Choose activity type (prefer user's preferred types)
            if random.random() < 0.7:  # 70% chance for preferred type
                activity_type = random.choice(preferred_types)
            else:
                activity_type = random.choice(list(activity_configs.keys()))
            
            config = activity_configs[activity_type]
            
            # Generate realistic distance/duration
            distance = None
            duration = None
            
            if config["distance_range"]:
                distance = round(random.uniform(*config["distance_range"]), 1)
            if config["duration_range"]:
                duration = random.randint(*config["duration_range"])
            
            # Calculate tokens
            tokens = calculate_tokens(activity_type, distance, duration)
            
            activity = Activity(
                wallet_address=user_address,
                activity_type=activity_type,
                distance=int(distance * 10) if distance else None,  # Store as integer (km * 10)
                duration=duration,
                date=activity_date,
                tokens_awarded=tokens,
                status="pending"
            )
            db.add(activity)
    
    db.commit()
    print(f"✅ Created {sum(user_data['activities_count'] for user_data in users_data)} activities")

    print("🏆 Creating sample reward claims...")
    
    # Add some claimed rewards for the top users
    top_user = users_data[0]  # CosmicRunner
    top_user_address = Web3.to_checksum_address(top_user["address"])
    
    # Claim some badges
    claimed_badges = ["badge-bronze", "badge-silver", "badge-gold"]
    for badge_type in claimed_badges:
        claim = RewardClaim(
            wallet_address=top_user_address,
            reward_type=badge_type,
            amount=0,
            tx_hash=f"0x{random.randint(100000, 999999):06x}claimed"
        )
        db.add(claim)
    
    # Claim some token rewards
    for i in range(3):
        claim = RewardClaim(
            wallet_address=top_user_address,
            reward_type="token",
            amount=100 * (i + 1),
            tx_hash=f"0x{random.randint(100000, 999999):06x}tokens"
        )
        db.add(claim)
    
    db.commit()
    print("✅ Created sample reward claims")

    # Print summary
    print("\n📊 SEEDING SUMMARY:")
    print("=" * 50)
    
    total_users = db.query(User).count()
    total_activities = db.query(Activity).count()
    total_claims = db.query(RewardClaim).count()
    total_tokens = db.query(Activity).with_entities(Activity.tokens_awarded).all()
    total_tokens_sum = sum(t[0] for t in total_tokens)
    
    print(f"👥 Users: {total_users}")
    print(f"🏃‍♂️ Activities: {total_activities}")
    print(f"🏆 Reward Claims: {total_claims}")
    print(f"💰 Total Tokens: {total_tokens_sum}")
    
    print("\n🎯 BADGE PROGRESS:")
    for user_data in users_data:
        address = Web3.to_checksum_address(user_data["address"])
        count = user_data["activities_count"]
        badges = []
        if count >= 10: badges.append("🥉 Bronze")
        if count >= 25: badges.append("🥈 Silver") 
        if count >= 50: badges.append("🥇 Gold")
        if count >= 100: badges.append("🌌 Cosmic")
        
        print(f"  {user_data['name']}: {count} activities → {', '.join(badges) if badges else 'No badges yet'}")

    db.close()
    print("\n✅ Database seeded successfully!")
    print("🚀 Ready for frontend testing!")

if __name__ == "__main__":
    run()
