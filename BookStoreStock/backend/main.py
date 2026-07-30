import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from database import engine, Base
from db_bootstrap import ensure_oracle_sequences, ensure_user_company_columns, ensure_product_user_column
from models import product as product_model  # noqa: F401 — registra metadatos
from models import user as user_model  # noqa: F401 — registra User y PasswordResetToken
from routers import product_router
from routers import user_router

logger = logging.getLogger("aurastock")

DEFAULT_ORIGINS = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "http://localhost:4300",
    "http://127.0.0.1:4300",
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
        ensure_oracle_sequences()
        ensure_user_company_columns()
        ensure_product_user_column()
        logger.info("Tablas y secuencias Oracle verificadas/creadas.")
    except SQLAlchemyError as exc:
        logger.error("No se pudieron inicializar las tablas en Oracle: %s", exc)
    yield


app = FastAPI(title="AuraStock Inventory API", version="1.0.0", lifespan=lifespan)

extra_origins = os.getenv("CORS_ORIGINS", "")
allow_origins = DEFAULT_ORIGINS + [
    origin.strip() for origin in extra_origins.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_router.router)
app.include_router(user_router.router)


@app.get("/")
def read_root():
    return {"message": "AuraStock API — inventario operativo", "docs": "/docs"}


@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.exec_driver_sql("SELECT 1 FROM DUAL")
        return {"status": "ok", "database": "connected"}
    except SQLAlchemyError as exc:
        return {"status": "degraded", "database": "unavailable", "detail": str(exc)}
