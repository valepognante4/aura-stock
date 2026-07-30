from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy import event
from database import Base


class User(Base):
    __tablename__ = "users"

    # Oracle creó la tabla con trigger trg_users_id que asigna el ID desde
    # user_id_seq automáticamente en cada INSERT. SQLAlchemy no debe intentar
    # resolver la secuencia por su cuenta; simplemente declaramos la PK sin Sequence().
    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100), unique=True, index=True, nullable=False)
    email    = Column(String(150), unique=True, index=True, nullable=False)

    # La tabla USERS en Oracle fue generada por SQLAlchemy, por lo que la
    # columna física realmente se llama "hashed_password" (y no password_hash
    # como decía el script SQL original).
    hashed_password = Column(String(255), nullable=False)

    # Columnas agregadas posteriormente via ensure_user_company_columns()
    company_name = Column(String(200), nullable=False)
    company_logo = Column(Text, nullable=True)


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    # Igual que User: el trigger asigna el ID; SQLAlchemy no maneja la secuencia.
    id      = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    token   = Column(String(255), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    used    = Column(Boolean, default=False, nullable=False)