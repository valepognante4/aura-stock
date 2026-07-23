from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.product import ProductCreate, ProductResponse
from services.product_service import ProductService
from crud import product as product_crud

router = APIRouter(prefix="/products", tags=["Products"])

@app_get_route := router.get("/", response_model=list[ProductResponse])
def list_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return product_crud.get_products(db, skip=skip, limit=limit)

@router.post("/", response_model=ProductResponse)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    try:
        return ProductService.register_product(db, product_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))