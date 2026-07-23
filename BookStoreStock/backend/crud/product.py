from sqlalchemy.orm import Session
from models.product import Product
from schemas.product import ProductCreate

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: ProductCreate):
    # Cálculo comercial: Precio Bruto = Precio Neto + (Precio Neto * IVA / 100)
    gross_price = product.net_price + (product.net_price * (product.iva_percentage / 100.0))
    
    db_product = Product(
        name=product.name,
        description=product.description,
        net_price=product.net_price,
        iva_percentage=product.iva_percentage,
        gross_price=gross_price,
        stock_quantity=product.stock_quantity
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product