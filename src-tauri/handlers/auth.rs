use serde::{Deserialize, Serialize};
use crate::error::Result;
use crate::crypto;
use rand::Rng;

#[derive(Debug, Serialize, Deserialize)]
pub struct SetPasswordRequest {
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VerifyPasswordRequest {
    pub password: String,
}

#[tauri::command]
pub fn set_master_password(request: SetPasswordRequest) -> Result<()> {
    // Validate password strength
    if request.password.len() < 12 {
        return Err(crate::error::SkillEdError::ValidationError(
            "Password must be at least 12 characters long".to_string(),
        ));
    }

    if !request.password.chars().any(|c| c.is_uppercase())
        || !request.password.chars().any(|c| c.is_lowercase())
        || !request.password.chars().any(|c| c.is_numeric())
    {
        return Err(crate::error::SkillEdError::ValidationError(
            "Password must contain uppercase, lowercase, and numeric characters".to_string(),
        ));
    }

    // Generate random salt
    let mut rng = rand::thread_rng();
    let salt: [u8; 16] = rng.gen();

    // Hash password with Argon2
    let password_hash = crypto::hash_password(&request.password)?;

    // Derive master key from password
    let _master_key = crypto::derive_master_key(&request.password, &salt)?;

    // TODO: Store in database
    // - Store password_hash and salt hex-encoded
    // - This is a zero-knowledge operation - salt and hash never leave encrypted storage

    Ok(())
}

#[tauri::command]
pub fn verify_master_password(request: VerifyPasswordRequest) -> Result<bool> {
    // TODO: Retrieve stored password hash from database
    // let stored_hash = get_password_hash_from_db()?;
    // let is_valid = crypto::verify_password(&request.password, &stored_hash)?;

    // For now, return false (not authenticated)
    Ok(false)
}
