# build_release.ps1
# ─────────────────────────────────────────────────────────────────────────────
# Script de build completo para AuraStock:
#   1. Compila el backend FastAPI con PyInstaller
#   2. Copia el .exe al directorio binaries/ de Tauri con el sufijo correcto
#   3. Ejecuta `tauri build` para generar el instalador final
#
# Uso: Ejecutar desde la carpeta BookStoreStock/
#   .\build_release.ps1
# ─────────────────────────────────────────────────────────────────────────────

$ErrorActionPreference = "Stop"

# ── Rutas ─────────────────────────────────────────────────────────────────────
$BackendDir  = ".\backend"
$BinariesDir = ".\src-tauri\src-tauri\binaries"
$TauriDir    = ".\src-tauri"

# Obtener el triple de arquitectura de Rust automáticamente
$RustTriple = (rustc -Vv | Select-String "host:").ToString().Trim().Replace("host: ", "")
Write-Host "✔ Rust target triple detectado: $RustTriple" -ForegroundColor Cyan

$SidecarName = "aurastock-backend-$RustTriple.exe"

# ── Paso 1: Compilar el backend con PyInstaller ───────────────────────────────
Write-Host ""
Write-Host "── [1/3] Compilando backend FastAPI con PyInstaller ──" -ForegroundColor Yellow

Push-Location $BackendDir
try {
    # Activar el venv
    if (Test-Path ".\venv\Scripts\Activate.ps1") {
        & ".\venv\Scripts\Activate.ps1"
    } else {
        Write-Warning "No se encontró el venv. Asegurate de tener un entorno virtual en backend/venv/"
    }

    # Instalar PyInstaller si no está
    pip install pyinstaller --quiet

    # Compilar
    pyinstaller aurastock_backend.spec --clean --noconfirm

    if (-not (Test-Path ".\dist\aurastock-backend.exe")) {
        throw "PyInstaller no generó el ejecutable en dist/aurastock-backend.exe"
    }

    Write-Host "✔ Backend compilado en: $BackendDir\dist\aurastock-backend.exe" -ForegroundColor Green
} finally {
    Pop-Location
}

# ── Paso 2: Copiar al directorio binaries/ de Tauri ──────────────────────────
Write-Host ""
Write-Host "── [2/3] Copiando sidecar a $BinariesDir\ ──" -ForegroundColor Yellow

New-Item -ItemType Directory -Force $BinariesDir | Out-Null

$SourceExe = Join-Path $BackendDir "dist\aurastock-backend.exe"
$DestExe   = Join-Path $BinariesDir $SidecarName

Copy-Item -Path $SourceExe -Destination $DestExe -Force
Write-Host "✔ Sidecar copiado a: $DestExe" -ForegroundColor Green

# ── Paso 3: Build de Tauri ────────────────────────────────────────────────────
Write-Host ""
Write-Host "── [3/3] Ejecutando tauri build ──" -ForegroundColor Yellow

Push-Location $TauriDir
try {
    npm run tauri build
    Write-Host "✔ Build de Tauri completado." -ForegroundColor Green
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ AuraStock build completo." -ForegroundColor Green
Write-Host "  El instalador estará en: src-tauri/src-tauri/target/release/bundle/" -ForegroundColor Cyan
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Cyan
