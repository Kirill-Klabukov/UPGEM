use argon2::{Argon2, Params};
use sha2::{Sha256, Digest};
use crate::error::Result;

/// Derives a 256-bit encryption key from a master password using Argon2
pub fn derive_master_key(password: &str, salt: &[u8; 16]) -> Result<[u8; 32]> {
    let mut output = [0u8; 32];
    
    let params = Params::new(19456, 2, 1, Some(32))
        .map_err(|e| crate::error::SkillEdError::CryptoError(e.to_string()))?;
    
    let argon2 = Argon2::new(argon2::Algorithm::Argon2id, argon2::Version::V0x13, params);

    argon2.hash_password_into(password.as_bytes(), salt, &mut output)
        .map_err(|e| crate::error::SkillEdError::CryptoError(e.to_string()))?;

    Ok(output)
}

/// Derives a domain-specific key from the master key using HKDF-like expansion
pub fn derive_key(master_key: &[u8; 32], domain: &str) -> [u8; 32] {
    let mut hasher = Sha256::new();
    hasher.update(master_key);
    hasher.update(domain.as_bytes());
    
    let result = hasher.finalize();
    let mut output = [0u8; 32];
    output.copy_from_slice(&result);
    output
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_derive_master_key() {
        let password = "MySecurePassword123!";
        let salt = [1u8; 16];
        let key = derive_master_key(password, &salt).unwrap();
        assert_eq!(key.len(), 32);
    }

    #[test]
    fn test_derive_key_deterministic() {
        let master_key = [42u8; 32];
        let domain = "skills";
        
        let key1 = derive_key(&master_key, domain);
        let key2 = derive_key(&master_key, domain);
        
        assert_eq!(key1, key2);
    }

    #[test]
    fn test_derive_key_different_domains() {
        let master_key = [42u8; 32];
        let key1 = derive_key(&master_key, "skills");
        let key2 = derive_key(&master_key, "habits");
        
        assert_ne!(key1, key2);
    }
}
