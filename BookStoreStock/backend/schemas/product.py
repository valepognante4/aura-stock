from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    net_price: float
    iva_percentage: float = 21.0
    stock_quantity: int

class ProductResponse(ProductCreate):
    id: int
    gross_price: float

    class Config:
        from_attributes = True

class ProductBulkImport(BaseModel):
    products: list[ProductCreate]

class ProductBulkImportResult(BaseModel):
    created: int
    errors: list[str]