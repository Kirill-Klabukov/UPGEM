use thiserror::Error;
use tauri::InvokeError;

pub type Result<T> = std::result::Result<T, SkillEdError>;

#[derive(Error, Debug)]
pub enum SkillEdError {
    #[error("Database error: {0}")]
    DatabaseError(String),

    #[error("Crypto error: {0}")]
    CryptoError(String),

    #[error("Authentication error: {0}")]
    AuthError(String),

    #[error("Validation error: {0}")]
    ValidationError(String),

    #[error("Not found: {0}")]
    NotFound(String),

    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),

    #[error("Serialization error: {0}")]
    SerializationError(#[from] serde_json::Error),
}

impl From<SkillEdError> for InvokeError {
    fn from(err: SkillEdError) -> Self {
        InvokeError::from(err.to_string())
    }
}
