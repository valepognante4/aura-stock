# -*- mode: python ; coding: utf-8 -*-
# aurastock_backend.spec
#
# Archivo de configuración de PyInstaller para el sidecar de AuraStock.
# Ejecutar desde el directorio BookStoreStock/backend/ con el venv activado:
#
#   pyinstaller aurastock_backend.spec --clean
#
# El ejecutable final estará en:  dist/aurastock-backend.exe

block_cipher = None

a = Analysis(
    # Punto de entrada
    ["run_server.py"],
    pathex=["."],
    binaries=[],
    datas=[
        # Módulos propios del backend (se copian al directorio raíz del bundle)
        ("database.py",    "."),
        ("db_bootstrap.py", "."),
        ("drop_tables.py", "."),
        ("models",         "models"),
        ("routers",        "routers"),
        ("schemas",        "schemas"),
        ("services",       "services"),
        ("crud",           "crud"),
    ],
    hiddenimports=[
        # uvicorn internals que PyInstaller no detecta automáticamente
        "uvicorn",
        "uvicorn.logging",
        "uvicorn.loops",
        "uvicorn.loops.auto",
        "uvicorn.loops.asyncio",
        "uvicorn.protocols",
        "uvicorn.protocols.http",
        "uvicorn.protocols.http.auto",
        "uvicorn.protocols.http.h11_impl",
        "uvicorn.protocols.websockets",
        "uvicorn.protocols.websockets.auto",
        "uvicorn.lifespan",
        "uvicorn.lifespan.on",
        "uvicorn.main",
        "uvicorn.config",
        "uvicorn.server",
        "uvicorn._types",

        # FastAPI / Starlette
        "fastapi",
        "starlette",
        "starlette.routing",
        "starlette.middleware",
        "starlette.middleware.cors",

        # Oracle driver (thin mode — no requiere Oracle Client instalado)
        "oracledb",
        "oracledb.driver_mode",

        # SQLAlchemy
        "sqlalchemy",
        "sqlalchemy.dialects.oracle",
        "sqlalchemy.dialects.oracle.oracledb",

        # Auth / crypto
        "passlib",
        "passlib.handlers",
        "passlib.handlers.bcrypt",
        "bcrypt",

        # Email
        "email_validator",
        "dns",
        "dns.resolver",

        # Otros
        "dotenv",
        "python_dotenv",
        "multipart",
        "pydantic",
        "pydantic_core",
        "cryptography",
        "cffi",
        "h11",
        "anyio",
        "anyio._backends._asyncio",
        "sniffio",
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        # Excluir módulos innecesarios para reducir tamaño
        "tkinter",
        "matplotlib",
        "numpy",
        "pandas",
        "PIL",
        "wx",
        "PyQt5",
        "PySide2",
    ],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    # ── Nombre del ejecutable ────────────────────────────────────────────────
    # Tauri buscará: aurastock-backend-x86_64-pc-windows-msvc.exe
    # El sufijo lo agrega Tauri; aquí solo el nombre base.
    name="aurastock-backend",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    # console=True  → muestra ventana de consola (útil para depuración)
    # console=False → ejecuta en segundo plano sin consola (para producción)
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
