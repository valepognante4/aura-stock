"""
run_server.py — Punto de entrada para PyInstaller.

Lanza uvicorn programáticamente sobre la app FastAPI de AuraStock.
Carga las variables de entorno desde un `.env` ubicado en el mismo
directorio que el ejecutable (o junto a este script en desarrollo).
"""
import multiprocessing
import os
import sys

# Necesario para que PyInstaller con --onefile funcione con multiprocessing
multiprocessing.freeze_support()

# ── Determinar rutas base ────────────────────────────────────────────────────
if getattr(sys, "frozen", False):
    # Corriendo como .exe compilado por PyInstaller
    # sys._MEIPASS apunta al directorio temporal donde PyInstaller extrae los archivos
    base_dir = sys._MEIPASS  # type: ignore[attr-defined]
    exe_dir = os.path.dirname(sys.executable)
else:
    # Corriendo como script Python normal (desarrollo)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    exe_dir = base_dir

# Agregar el directorio base al sys.path para que funcionen las importaciones
sys.path.insert(0, base_dir)

# ── Cargar variables de entorno ──────────────────────────────────────────────
# Busca un .env junto al .exe en producción, o junto a run_server.py en dev.
# override=False significa que las variables del sistema operativo tienen prioridad.
from dotenv import load_dotenv  # noqa: E402

env_path = os.path.join(exe_dir, ".env")
load_dotenv(dotenv_path=env_path, override=False)

# ── Iniciar servidor ─────────────────────────────────────────────────────────
import uvicorn  # noqa: E402

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        log_level="info",
        # En producción no necesitamos reload
        reload=False,
    )
