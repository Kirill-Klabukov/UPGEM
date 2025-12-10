use argon2::{
    password_hash::{SaltString, PasswordHasher, PasswordHash, PasswordVerifier},
    Argon2,
};
use rand::rngs::OsRng;
use crate::error::Result;

/// Hashes a password using Argon2id with secure random salt
pub fn hash_password(password: &str) -> Result<String> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();

    let password_hash = argon2.hash_password(password.as_bytes(), &salt)
        .map_err(|e| crate::error::SkillEdError::CryptoError(e.to_string()))?
        .to_string();

    Ok(password_hash)
}

/// Verifies a password against its hash
pub fn verify_password(password: &str, hash: &str) -> Result<bool> {
    let parsed_hash = PasswordHash::new(hash)
        .map_err(|e| crate::error::SkillEdError::CryptoError(e.to_string()))?;

    let argon2 = Argon2::default();
    let result = argon2.verify_password(password.as_bytes(), &parsed_hash);

    match result {
        Ok(_) => Ok(true),
        Err(argon2::password_hash::Error::Password) => Ok(false),
        Err(e) => Err(crate::error::SkillEdError::CryptoError(e.to_string())),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hash_and_verify() {
        let password = "SecurePassword123!";
        let hash = hash_password(password).unwrap();
        let is_valid = verify_password(password, &hash).unwrap();
        assert!(is_valid);
    }

    #[test]
    fn test_verify_wrong_password() {
        let password = "SecurePassword123!";
        let hash = hash_password(password).unwrap();
        let is_valid = verify_password("WrongPassword", &hash).unwrap();
        assert!(!is_valid);
    }
}
