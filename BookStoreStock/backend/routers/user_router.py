from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from crud import user as user_crud
from database import get_db
from db_bootstrap import ensure_oracle_sequences
from schemas.user import UserCreate, UserLogin, UserLogoUpdate, UserResponse

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
