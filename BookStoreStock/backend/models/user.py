from sqlalchemy import Column, Integer, String, Sequence, Text, DateTime, Boolean, ForeignKey
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, Sequence('user_id_seq'), primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    company_name = Column(String(200), nullable=False)
    company_logo = Column(Text, nullable=True)


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, Sequence('prt_id_seq'), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    token = Column(String(255), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False, nullable=False)