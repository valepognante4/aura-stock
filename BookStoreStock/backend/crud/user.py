import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from models.user import User, PasswordResetToken
from schemas.user import UserCreate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

TOKEN_EXPIRY_HOURS = 1


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        company_name=user.company_name,
    )
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except SQLAlchemyError:
        db.rollback()
        raise


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def update_user_logo(db: Session, user_id: int, company_logo: str):
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return None
    db_user.company_logo = company_logo
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except SQLAlchemyError:
        db.rollback()
        raise


# ── Password Reset Token ──────────────────────────────────────────────────────

def create_reset_token(db: Session, user_id: int) -> str:
    """Genera un token seguro, lo guarda en Oracle y retorna el token en texto plano."""
    token = secrets.token_urlsafe(48)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRY_HOURS)

    # Invalida tokens anteriores del mismo usuario
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user_id,
        PasswordResetToken.used == False,  # noqa: E712
    ).update({"used": True})

    db_token = PasswordResetToken(
        user_id=user_id,
        token=token,
        expires_at=expires_at,
        used=False,
    )
    try:
        db.add(db_token)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise
    return token


def get_valid_reset_token(db: Session, token: str) -> PasswordResetToken | None:
    """Devuelve el token si existe, no está usado y no expiró."""
    now = datetime.now(timezone.utc)
    record = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token == token,
            PasswordResetToken.used == False,  # noqa: E712
            PasswordResetToken.expires_at > now,
        )
        .first()
    )
    return record


def mark_token_used(db: Session, token_record: PasswordResetToken) -> None:
    token_record.used = True
    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise


def update_user_password(db: Session, user: User, new_password: str) -> None:
    user.hashed_password = pwd_context.hash(new_password)
    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise
