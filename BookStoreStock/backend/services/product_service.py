from sqlalchemy.orm import Session
from crud import product as product_crud
from schemas.product import ProductCreate

class ProductService:
    @staticmethod
    def register_product(db: Session, product_in: ProductCreate):
        # Validaciones de negocio adicionales si hicieran falta (ej: stock no negativo)
        if product_in.net_price < 0:
            raise ValueError("El precio neto no puede ser negativo.")
        if product_in.stock_quantity < 0:
            raise ValueError("La cantidad en stock no puede ser negativa.")
            
        return product_crud.create_product(db, product_in)