// AuraStock — Tauri entry point con sidecar FastAPI
//
// Responsabilidades de este módulo:
//  1. Registrar los plugins de Tauri (opener, shell).
//  2. En `setup`: lanzar el sidecar `aurastock-backend` y guardar su handle.
//  3. En `RunEvent::ExitRequested`: matar el proceso del sidecar limpiamente.

use std::sync::Mutex;
use tauri::{AppHandle, Manager, RunEvent};
use tauri_plugin_shell::process::CommandChild;
use tauri_plugin_shell::ShellExt;

// ── Estado global ─────────────────────────────────────────────────────────────
/// Guarda el handle del proceso sidecar para poder terminarlo al salir.
struct BackendProcess(Mutex<Option<CommandChild>>);

// ── Entry point ───────────────────────────────────────────────────────────────
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            // ── Leer variables de entorno de Oracle (si están definidas) ──────
            // Puedes sobrescribir DATABASE_URL en el .env junto al instalador,
            // o mediante variables de entorno del sistema operativo.
            let db_url = std::env::var("DATABASE_URL")
                .unwrap_or_else(|_| {
                    "oracle+oracledb://system:ides@localhost:1521/?service_name=XEPDB1"
                        .to_string()
                });

            let smtp_host = std::env::var("SMTP_HOST")
                .unwrap_or_else(|_| "smtp.gmail.com".to_string());

            let smtp_port = std::env::var("SMTP_PORT")
                .unwrap_or_else(|_| "587".to_string());

            let smtp_user = std::env::var("SMTP_USER")
                .unwrap_or_default();

            let smtp_password = std::env::var("SMTP_PASSWORD")
                .unwrap_or_default();

            let frontend_url = std::env::var("FRONTEND_URL")
                .unwrap_or_else(|_| "tauri://localhost".to_string());

            // ── Construir y lanzar el sidecar ─────────────────────────────────
            let sidecar_cmd = app
                .shell()
                .sidecar("aurastock-backend")
                .expect("[AuraStock] No se encontró el sidecar 'aurastock-backend'. Verificá que el .exe esté en binaries/.")
                // Pasar las variables de entorno al proceso hijo
                .env("DATABASE_URL",   &db_url)
                .env("SMTP_HOST",      &smtp_host)
                .env("SMTP_PORT",      &smtp_port)
                .env("SMTP_USER",      &smtp_user)
                .env("SMTP_PASSWORD",  &smtp_password)
                .env("FRONTEND_URL",   &frontend_url)
                // CORS: permitir el origen de Tauri además de localhost
                .env("CORS_ORIGINS",   "tauri://localhost,http://localhost:4200");

            let (_rx, child) = sidecar_cmd
                .spawn()
                .expect("[AuraStock] No se pudo iniciar el backend FastAPI.");

            println!("[AuraStock] Backend FastAPI iniciado en http://127.0.0.1:8000");

            // Guardar el handle del proceso en el estado de la app
            app.manage(BackendProcess(Mutex::new(Some(child))));

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error al construir AuraStock")
        .run(|app_handle, event| match event {
            // Matar el sidecar cuando el usuario cierra la última ventana
            RunEvent::ExitRequested { .. } => {
                kill_backend(app_handle);
            }
            // Matar el sidecar si Tauri sale por cualquier otra razón
            RunEvent::Exit => {
                kill_backend(app_handle);
            }
            _ => {}
        });
}

// ── Helper ────────────────────────────────────────────────────────────────────
/// Termina el proceso sidecar del backend si todavía está corriendo.
fn kill_backend(app: &AppHandle) {
    if let Some(state) = app.try_state::<BackendProcess>() {
        let mut guard = state.0.lock().unwrap();
        if let Some(child) = guard.take() {
            match child.kill() {
                Ok(_) => println!("[AuraStock] Backend FastAPI detenido correctamente."),
                Err(e) => eprintln!("[AuraStock] Error al detener el backend: {e}"),
            }
        }
    }
}
