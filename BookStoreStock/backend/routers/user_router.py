import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from crud import user as user_crud
from database import get_db
from db_bootstrap import ensure_oracle_sequences
from schemas.user import (
    UserCreate,
    UserLogin,
    UserLogoUpdate,
    UserResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from services.email_service import send_reset_email

logger = logging.getLogger("aurastock")

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if user_crud.get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    if user_crud.get_user_by_username(db, user_in.username):
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso")

    try:
        ensure_oracle_sequences()
        return user_crud.create_user(db, user_in)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="El email o nombre de usuario ya está registrado",
        )
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Error de conexión con la base de datos.",
        )


@router.post("/login", response_model=UserResponse)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    try:
        user = user_crud.get_user_by_email(db, user_in.email)
        if not user or not user_crud.pwd_context.verify(
            user_in.password, user.hashed_password
        ):
            raise HTTPException(status_code=400, detail="Credenciales inválidas")

        return user
    except HTTPException:
        raise
    except SQLAlchemyError:
        raise HTTPException(
            status_code=500,
            detail="Error de conexión con la base de datos.",
        )


@router.put("/{user_id}/logo", response_model=UserResponse)
def update_logo(user_id: int, logo_in: UserLogoUpdate, db: Session = Depends(get_db)):
    try:
        user = user_crud.update_user_logo(db, user_id, logo_in.company_logo)
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return user
    except HTTPException:
        raise
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Error de conexión con la base de datos.",
        )


# ── Password Recovery ─────────────────────────────────────────────────────────

@router.post("/forgot-password", status_code=200)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Verifica si el email existe en Oracle y, si existe, envía un correo
    con el enlace de recuperación de contraseña.
    Siempre devuelve el mismo mensaje para no revelar si el email está registrado.
    """
    generic_response = {
        "message": "Si el correo está registrado, recibirás un enlace de recuperación en los próximos minutos."
    }

    try:
        user = user_crud.get_user_by_email(db, payload.email)
        if not user:
            # Respuesta genérica por seguridad (no revelar si el email existe)
            return generic_response

        token = user_crud.create_reset_token(db, user.id)
        send_reset_email(user.email, token)
        logger.info("Correo de recuperación enviado a: %s", user.email)
        return generic_response

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Error de conexión con la base de datos.",
        )
    except Exception as exc:
        logger.error("Error al enviar correo de recuperación: %s", exc)
        raise HTTPException(
            status_code=500,
            detail="No se pudo enviar el correo. Verificá las credenciales SMTP en el archivo .env.",
        )


@router.post("/reset-password", status_code=200)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Valida el token y actualiza la contraseña del usuario.
    """
    try:
        token_record = user_crud.get_valid_reset_token(db, payload.token)
        if not token_record:
            raise HTTPException(
                status_code=400,
                detail="El enlace de recuperación es inválido o ya expiró.",
            )

        user = user_crud.get_user_by_id(db, token_record.user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado.")

        user_crud.update_user_password(db, user, payload.new_password)
        user_crud.mark_token_used(db, token_record)

        return {"message": "Contraseña actualizada correctamente."}

    except HTTPException:
        raise
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Error de conexión con la base de datos.",
        )
