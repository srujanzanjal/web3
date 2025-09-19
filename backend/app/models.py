from datetime import datetime, date
from sqlalchemy import create_engine, String, Integer, Date, Boolean, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker
from sqlalchemy.sql import func
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fitness.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    wallet_address: Mapped[str] = mapped_column(String(42), primary_key=True)
    join_date: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

class Activity(Base):
    __tablename__ = "activities"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    wallet_address: Mapped[str] = mapped_column(String(42), index=True)
    activity_type: Mapped[str] = mapped_column(String(32))
    distance: Mapped[int | None] = mapped_column(Integer, nullable=True)
    duration: Mapped[int | None] = mapped_column(Integer, nullable=True)
    date: Mapped[date] = mapped_column(Date)
    tokens_awarded: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(16), default="pending")  # pending/claimed
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

class RewardClaim(Base):
    __tablename__ = "reward_claims"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    wallet_address: Mapped[str] = mapped_column(String(42), index=True)
    reward_type: Mapped[str] = mapped_column(String(32))  # token or badge-* id
    amount: Mapped[int] = mapped_column(Integer, default=0)
    tx_hash: Mapped[str | None] = mapped_column(String(80), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

def init_db():
    Base.metadata.create_all(engine)
