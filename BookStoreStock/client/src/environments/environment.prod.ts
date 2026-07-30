// environment.prod.ts — Configuración para producción (tauri build)
export const environment = {
  production: true,
  // El sidecar FastAPI siempre corre en 127.0.0.1:8000 dentro del instalador
  apiUrl: 'http://127.0.0.1:8000',
};
