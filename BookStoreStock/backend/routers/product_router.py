from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from database import get_db
from schemas.product import ProductCreate, ProductResponse, ProductBulkImport, ProductBulkImportResult
from services.product_service import ProductService
from crud import product as product_crud
from routers.deps import get_current_user_id

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/", response_model=list[ProductResponse])
def list_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    try:
        return product_crud.get_products(db, user_id=user_id, skip=skip, limit=limit)
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Error de conexión o fallo en la base de datos.")


@router.post("/", response_model=ProductResponse)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    try:
        return ProductService.register_product(db, product_in, user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Error de conexión o fallo en la base de datos al guardar.")


@router.post("/import", response_model=ProductBulkImportResult)
def import_products(
    payload: ProductBulkImport,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    if not payload.products:
        raise HTTPException(status_code=400, detail="No se recibieron productos para importar.")

    try:
        return product_crud.bulk_create_products(db, payload.products, user_id)
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Error en la base de datos al importar productos.")


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    try:
        if product_in.net_price < 0 or product_in.stock_quantity < 0:
            raise HTTPException(status_code=400, detail="El precio neto y el stock no pueden ser negativos.")

        updated_product = product_crud.update_product(db, product_id, product_in, user_id)
        if not updated_product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return updated_product
    except HTTPException:
        raise
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Error en la base de datos al actualizar.")


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    try:
        success = product_crud.delete_product(db, product_id, user_id)
        if not success:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return {"message": "Producto eliminado"}
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Error en la base de datos al eliminar.")