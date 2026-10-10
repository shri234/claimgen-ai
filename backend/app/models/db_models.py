import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=True)
    plan_tier = Column(String(50), default="free")
    appeal_credits = Column(Integer, default=3)
    stripe_customer_id = Column(String(255), nullable=True)
    razorpay_customer_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    claims = relationship("Claim", back_populates="user", cascade="all, delete-orphan")


class Claim(Base):
    __tablename__ = "claims"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    patient_identifier = Column(String(100), nullable=True)
    claim_number = Column(String(100), nullable=True, index=True)
    denial_code = Column(String(50), nullable=True, index=True)
    eob_file_url = Column(Text, nullable=True)
    appeal_letter_content = Column(Text, nullable=True)
    status = Column(String(50), default="draft")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="claims")


class PayerRuleKB(Base):
    __tablename__ = "payer_rules_kb"

    id = Column(Integer, primary_key=True, autoincrement=True)
    denial_code = Column(String(20), nullable=False, index=True)
    payer_name = Column(String(100), nullable=True)
    guideline_text = Column(Text, nullable=False)
    appeal_strategy = Column(Text, nullable=False)
    embedding = Column(Vector(1536), nullable=True)
