from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from database import get_db
from schemas.product import ProductCreate, ProductResponse
from services.product_service import ProductService
from crud import product as product_crud

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=list[ProductResponse])
def list_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        return product_crud.get_products(db, skip=skip, limit=limit)
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Error de conexión o fallo en la base de datos.")

@router.post("/", response_model=ProductResponse)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    try:
        return ProductService.register_product(db, product_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Error de conexión o fallo en la base de datos al guardar.")

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product_in: ProductCreate, db: Session = Depends(get_db)):
    try:
        updated_product = product_crud.update_product(db, product_id, product_in)
        if not updated_product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return updated_product
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Error en la base de datos al actualizar.")

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    try:
        success = product_crud.delete_product(db, product_id)
        if not success:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return {"message": "Producto eliminado"}
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Error en la base de datos al eliminar.")