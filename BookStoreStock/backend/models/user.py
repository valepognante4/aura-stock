from sqlalchemy import Column, Integer, String, Sequence
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, Sequence('user_id_seq'), primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)