use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

/// Represents a tracked skill
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Skill {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub category: String,
    pub proficiency_level: i32, // 0-100
    pub total_hours: f64,
    pub created_at: String,
    pub updated_at: String,
    pub encrypted_notes: Option<String>,
    pub nonce_notes: Option<String>,
}

impl Skill {
    pub fn new(name: String, category: String) -> Self {
        let now = Utc::now().to_rfc3339();
        Self {
            id: Uuid::new_v4().to_string(),
            name,
            description: None,
            category,
            proficiency_level: 0,
            total_hours: 0.0,
            created_at: now.clone(),
            updated_at: now,
            encrypted_notes: None,
            nonce_notes: None,
        }
    }
}

/// Represents a tracked habit
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Habit {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub frequency: String, // "daily", "weekly", "monthly"
    pub streak_count: i32,
    pub best_streak: i32,
    pub created_at: String,
    pub last_completed: Option<String>,
}

impl Habit {
    pub fn new(name: String, frequency: String) -> Self {
        let now = Utc::now().to_rfc3339();
        Self {
            id: Uuid::new_v4().to_string(),
            name,
            description: None,
            frequency,
            streak_count: 0,
            best_streak: 0,
            created_at: now,
            last_completed: None,
        }
    }
}

/// Represents a habit completion record
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct HabitCompletion {
    pub id: String,
    pub habit_id: String,
    pub completed_at: String,
}

impl HabitCompletion {
    pub fn new(habit_id: String) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            habit_id,
            completed_at: Utc::now().to_rfc3339(),
        }
    }
}

/// Represents skill progress over time
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct SkillProgress {
    pub id: String,
    pub skill_id: String,
    pub proficiency_level: i32,
    pub hours_practiced: f64,
    pub recorded_at: String,
}

impl SkillProgress {
    pub fn new(skill_id: String, proficiency_level: i32, hours_practiced: f64) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            skill_id,
            proficiency_level,
            hours_practiced,
            recorded_at: Utc::now().to_rfc3339(),
        }
    }
}

/// Represents user authentication data
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct AuthUser {
    pub id: String,
    pub master_password_hash: String,
    pub master_key_salt: String, // hex-encoded salt
    pub created_at: String,
    pub last_login: Option<String>,
}

/// Represents a milestone or goal
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Milestone {
    pub id: String,
    pub skill_id: Option<String>,
    pub title: String,
    pub description: Option<String>,
    pub target_date: String,
    pub completion_date: Option<String>,
    pub is_completed: bool,
    pub created_at: String,
}

impl Milestone {
    pub fn new(title: String, target_date: String, skill_id: Option<String>) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            skill_id,
            title,
            description: None,
            target_date,
            completion_date: None,
            is_completed: false,
            created_at: Utc::now().to_rfc3339(),
        }
    }
}
