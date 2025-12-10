// Prevents additional console window on Windows in release
#![cfg_attr(all(not(debug_assertions), windows), windows_subsystem = "windows")]

mod db;
mod crypto;
mod handlers;
mod state;
mod error;

use tauri::Manager;
use log::info;

fn main() {
    env_logger::init();
    
    tauri::Builder::default()
        .setup(|app| {
            info!("Initializing Skill-ED application");
            
            // Initialize database
            let db_path = app.path_resolver()
                .app_data_dir()
                .expect("Failed to resolve app data directory");
            
            tokio::runtime::Runtime::new()
                .unwrap()
                .block_on(async {
                    db::init_db(&db_path).await
                        .expect("Failed to initialize database");
                })
            ;
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            handlers::skill::create_skill,
            handlers::skill::get_skills,
            handlers::skill::update_skill,
            handlers::skill::delete_skill,
            handlers::skill::get_skill_progress,
            handlers::habit::create_habit,
            handlers::habit::log_habit_completion,
            handlers::habit::get_habit_streak,
            handlers::habit::get_habits,
            handlers::auth::set_master_password,
            handlers::auth::verify_master_password,
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| {
            match event {
                tauri::RunEvent::ExitRequested { api, .. } => {
                    api.prevent_exit();
                }
                _ => {}
            }
        });
}
