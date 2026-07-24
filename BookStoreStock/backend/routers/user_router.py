from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from database import get_db
from schemas.user import UserCreate, UserResponse
from crud import user as user_crud

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    try:
        existing_user = user_crud.get_user_by_email(db, user_in.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="El email ya está registrado")
        
        return user_crud.create_user(db, user_in)
    except SQLAlchemyError as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/login", response_model=UserResponse)
def login(user_in: UserCreate, db: Session = Depends(get_db)):
    try:
        # Simplificación para el login (recibe UserCreate y verifica email y contraseña)
        user = user_crud.get_user_by_email(db, user_in.email)
        if not user:
            raise HTTPException(status_code=400, detail="Credenciales inválidas")
        
        # Validar password
        if not user_crud.pwd_context.verify(user_in.password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Credenciales inválidas")
            
        return user
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Error de conexión con la base de datos.")
