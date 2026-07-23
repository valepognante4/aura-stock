from sqlalchemy import Column, Integer, String, Float, Sequence
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, Sequence('product_id_seq'), primary_key=True)
    name = Column(String(100), index=True, nullable=False)
    description = Column(String(255), nullable=True)
    
    # Precios y Comercialización
    net_price = Column(Float, nullable=False)      # Precio Neto (sin IVA)
    iva_percentage = Column(Float, default=21.0)   # IVA por defecto (ej: 21%)
    gross_price = Column(Float, nullable=False)    # Precio Bruto (calculado con IVA)
    
    # Stock e Inventario
    stock_quantity = Column(Integer, default=0)    # Cantidad disponible