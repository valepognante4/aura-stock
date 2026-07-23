from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import product_router  # Importás el router que acabamos de armar

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vortex Inventory API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4300", "http://127.0.0.1:4300", "http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrás el router en la aplicación principal
app.include_router(product_router.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido al backend de Vortex Inventory"}