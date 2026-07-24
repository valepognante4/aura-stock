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

def update_product(db: Session, product_id: int, product: ProductCreate):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        return None
    
    gross_price = product.net_price + (product.net_price * (product.iva_percentage / 100.0))
    db_product.name = product.name
    db_product.description = product.description
    db_product.net_price = product.net_price
    db_product.iva_percentage = product.iva_percentage
    db_product.gross_price = gross_price
    db_product.stock_quantity = product.stock_quantity
    
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        return False
    db.delete(db_product)
    db.commit()
    return True