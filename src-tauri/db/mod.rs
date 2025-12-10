mod models;
mod schema;
mod operations;

pub use models::*;
pub use schema::*;
pub use operations::*;

use sqlx::sqlite::{SqlitePool, SqlitePoolOptions, SqliteConnectOptions};
use std::path::Path;
use std::str::FromStr;
use crate::error::Result;
use log::info;
use lazy_static::lazy_static;
use parking_lot::Mutex;

lazy_static! {
    static ref DB_POOL: Mutex<Option<SqlitePool>> = Mutex::new(None);
}

/// Initializes the SQLite database with all required tables
pub async fn init_db(app_data_dir: &Path) -> Result<()> {
    let db_path = app_data_dir.join("skill-ed.db");
    
    // Ensure directory exists
    if !app_data_dir.exists() {
        std::fs::create_dir_all(app_data_dir)?;
    }

    let connection_string = format!(
        "sqlite:{}",
        db_path.to_string_lossy().replace("\\", "/")
    );

    let connect_options = SqliteConnectOptions::from_str(&connection_string)?
        .create_if_missing(true);

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect_with(connect_options)
        .await
        .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    // Create all tables
    sqlx::query(schema::CREATE_TABLES_SQL)
        .execute(&pool)
        .await
        .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    // Store pool in static
    *DB_POOL.lock() = Some(pool);

    info!("Database initialized at: {}", db_path.display());

    Ok(())
}

/// Gets a database connection pool
pub async fn get_pool(app_data_dir: &Path) -> Result<SqlitePool> {
    let db_path = app_data_dir.join("skill-ed.db");
    let connection_string = format!(
        "sqlite:{}",
        db_path.to_string_lossy().replace("\\", "/")
    );

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&connection_string)
        .await
        .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(pool)
}

/// Gets the global database pool
pub fn get_db_pool() -> Result<SqlitePool> {
    DB_POOL.lock()
        .clone()
        .ok_or_else(|| crate::error::SkillEdError::DatabaseError("Database not initialized".to_string()))
}
