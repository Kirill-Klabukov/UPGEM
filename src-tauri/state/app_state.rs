use parking_lot::Mutex;
use std::sync::Arc;

/// Application state shared across the Tauri runtime
#[derive(Clone)]
pub struct AppState {
    /// Master encryption key (only in memory when user is logged in)
    pub master_key: Arc<Mutex<Option<[u8; 32]>>>,
    /// Whether user has authenticated
    pub is_authenticated: Arc<Mutex<bool>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            master_key: Arc::new(Mutex::new(None)),
            is_authenticated: Arc::new(Mutex::new(false)),
        }
    }

    pub fn set_master_key(&self, key: [u8; 32]) {
        *self.master_key.lock() = Some(key);
        *self.is_authenticated.lock() = true;
    }

    pub fn clear_master_key(&self) {
        *self.master_key.lock() = None;
        *self.is_authenticated.lock() = false;
    }

    pub fn get_master_key(&self) -> Option<[u8; 32]> {
        *self.master_key.lock()
    }

    pub fn is_authenticated(&self) -> bool {
        *self.is_authenticated.lock()
    }
}

impl Default for AppState {
    fn default() -> Self {
        Self::new()
    }
}
