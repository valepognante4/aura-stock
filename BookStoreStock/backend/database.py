import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Oracle (oracledb thin): oracle+oracledb://usuario:clave@host:puerto/?service_name=SERVICIO
# Sobrescribir con la variable de entorno DATABASE_URL si hace falta otro esquema/host.
DEFAULT_DATABASE_URL = (
    "oracle+oracledb://system:ides@localhost:1521/?service_name=XEPDB1"
)
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=1800,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
