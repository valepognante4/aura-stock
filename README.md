# 📦 AuraStock - Sistema de Control de Stock de Escritorio

**AuraStock** es una aplicación de escritorio moderna y ligera diseñada para la gestión integral de inventarios, cálculo automático de impuestos y control de stock en tiempo real. 

Este proyecto fue desarrollado como una solución integral de punta a punta (Full Stack Desktop), integrando un frontend reactivo con un backend robusto y empaquetado nativamente para escritorio.

---

## 🚀 Tecnologías Utilizadas

### 🎨 Frontend
* **Framework:** Angular 21 (Zoneless)
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS
* **Librerías:** `exceljs` y `file-saver` (para exportación de reportes)

### ⚙️ Backend
* **Framework:** FastAPI (Python)
* **Servidor ASGI:** Uvicorn
* **ORM:** SQLAlchemy (v2.0)
* **Validación:** Pydantic
* **Seguridad:** Passlib (Bcrypt) y Cryptography

### 🗄️ Base de Datos
* **Motor:** Oracle Database
* **Driver:** `oracledb`

### 🖥️ Escritorio Nativo
* **Framework:** Tauri (v2) con Rust

---

## ✨ Características Principales
- 🔐 Sistema de Autenticación y Registro de usuarios.
- 📊 Panel general con métricas de stock y alertas visuales.
- 🔍 Filtros avanzados y búsqueda rápida de productos.
- 🖨️ Exportación de reportes de inventario directamente a Excel.
- 🖥️ Interfaz nativa y fluida gracias a Tauri.

---

## 🛠️ Instalación y Ejecución Local

Si deseas clonar y correr el proyecto en modo de desarrollo, sigue estos pasos:

1. **Clona el repositorio:**
   ```bash
   git clone [https://github.com/valepognante4/aura-stock.git](https://github.com/valepognante4/aura-stock.git)
   cd aura-stock/BookStoreStock
