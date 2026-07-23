from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Ejemplo de cadena de conexión para Oracle (Thin mode por defecto con oracledb):
# "oracle+oracledb://usuario:contraseña@host:puerto/?service_name=nombre_de_servicio"
DATABASE_URL = "oracle+oracledb://system:ides@localhost:1521/?service_name=XEPDB1"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()