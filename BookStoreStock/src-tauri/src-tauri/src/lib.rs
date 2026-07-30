// AuraStock — Tauri application entry point (Opción C: frontend shell)
// El backend FastAPI corre por separado en 127.0.0.1:8000

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error al iniciar AuraStock");
}
