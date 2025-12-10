use chacha20poly1305::{
    aead::{Aead, KeyInit},
    ChaCha20Poly1305, Nonce,
};
use rand::Rng;
use crate::error::Result;

/// Encrypts data using ChaCha20-Poly1305 AEAD cipher
/// Returns (nonce, ciphertext) as hex strings
pub fn encrypt_data(key: &[u8; 32], plaintext: &[u8]) -> Result<(String, String)> {
    if key.len() != 32 {
        return Err(crate::error::SkillEdError::CryptoError("Invalid key length".to_string()));
    }

    let cipher = ChaCha20Poly1305::new_from_slice(key)
        .map_err(|e| crate::error::SkillEdError::CryptoError(e.to_string()))?;

    // Generate random nonce
    let mut rng = rand::thread_rng();
    let nonce_bytes: [u8; 12] = rng.gen();
    let nonce = Nonce::from_slice(&nonce_bytes);

    // Encrypt
    let ciphertext = cipher.encrypt(nonce, plaintext)
        .map_err(|e| crate::error::SkillEdError::CryptoError(format!("Encryption failed: {}", e)))?;

    Ok((hex::encode(nonce_bytes), hex::encode(ciphertext)))
}

/// Decrypts data using ChaCha20-Poly1305 AEAD cipher
pub fn decrypt_data(key: &[u8; 32], nonce_hex: &str, ciphertext_hex: &str) -> Result<Vec<u8>> {
    if key.len() != 32 {
        return Err(crate::error::SkillEdError::CryptoError("Invalid key length".to_string()));
    }

    let cipher = ChaCha20Poly1305::new_from_slice(key)
        .map_err(|e| crate::error::SkillEdError::CryptoError(e.to_string()))?;

    let nonce_bytes = hex::decode(nonce_hex)
        .map_err(|e| crate::error::SkillEdError::CryptoError(format!("Invalid nonce: {}", e)))?;
    
    if nonce_bytes.len() != 12 {
        return Err(crate::error::SkillEdError::CryptoError("Invalid nonce length".to_string()));
    }

    let nonce = Nonce::from_slice(&nonce_bytes);
    
    let ciphertext = hex::decode(ciphertext_hex)
        .map_err(|e| crate::error::SkillEdError::CryptoError(format!("Invalid ciphertext: {}", e)))?;

    let plaintext = cipher.decrypt(nonce, ciphertext.as_ref())
        .map_err(|e| crate::error::SkillEdError::CryptoError(format!("Decryption failed: {}", e)))?;

    Ok(plaintext)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encrypt_decrypt() {
        let key = [42u8; 32];
        let plaintext = b"Hello, Skill-ED!";

        let (nonce, ciphertext) = encrypt_data(&key, plaintext).unwrap();
        let decrypted = decrypt_data(&key, &nonce, &ciphertext).unwrap();

        assert_eq!(plaintext.to_vec(), decrypted);
    }

    #[test]
    fn test_decrypt_with_wrong_key() {
        let key = [42u8; 32];
        let wrong_key = [43u8; 32];
        let plaintext = b"Hello, Skill-ED!";

        let (nonce, ciphertext) = encrypt_data(&key, plaintext).unwrap();
        let result = decrypt_data(&wrong_key, &nonce, &ciphertext);

        assert!(result.is_err());
    }
}
