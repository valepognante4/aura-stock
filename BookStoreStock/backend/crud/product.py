from sqlalchemy.orm import Session
from models.product import Product
from schemas.product import ProductCreate


def get_products(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    """Devuelve únicamente los productos que pertenecen al usuario autenticado."""
    return (
        db.query(Product)
        .filter(Product.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_product(db: Session, product: ProductCreate, user_id: int):
    """Crea un producto asociado al usuario autenticado."""
    # Cálculo comercial: Precio Bruto = Precio Neto + (Precio Neto * IVA / 100)
    gross_price = product.net_price + (product.net_price * (product.iva_percentage / 100.0))

    db_product = Product(
        name=product.name,
        description=product.description,
        net_price=product.net_price,
        iva_percentage=product.iva_percentage,
        gross_price=gross_price,
        stock_quantity=product.stock_quantity,
        user_id=user_id,
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_product(db: Session, product_id: int, product: ProductCreate, user_id: int):
    """Actualiza un producto solo si pertenece al usuario autenticado."""
    db_product = (
        db.query(Product)
        .filter(Product.id == product_id, Product.user_id == user_id)
        .first()
    )
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


def delete_product(db: Session, product_id: int, user_id: int):
    """Elimina un producto solo si pertenece al usuario autenticado."""
    db_product = (
        db.query(Product)
        .filter(Product.id == product_id, Product.user_id == user_id)
        .first()
    )
    if not db_product:
        return False
    db.delete(db_product)
    db.commit()
    return True


def bulk_create_products(db: Session, products: list[ProductCreate], user_id: int):
    """Crea múltiples productos asociados al usuario autenticado."""
    created = 0
    errors: list[str] = []

    for index, product in enumerate(products, start=1):
        try:
            if product.net_price < 0 or product.stock_quantity < 0:
                errors.append(f"Fila {index}: precio o stock no pueden ser negativos")
                continue
            if not product.name.strip():
                errors.append(f"Fila {index}: el nombre es obligatorio")
                continue

            create_product(db, product, user_id)
            created += 1
        except Exception as exc:
            db.rollback()
            errors.append(f"Fila {index}: {exc}")

    return {"created": created, "errors": errors}