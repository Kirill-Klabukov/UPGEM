/// Database schema initialization and migration SQL
/// This module contains all CREATE TABLE statements for the Skill-ED database

pub const CREATE_TABLES_SQL: &str = r#"
-- Users and Authentication
CREATE TABLE IF NOT EXISTS auth_user (
    id TEXT PRIMARY KEY,
    master_password_hash TEXT NOT NULL,
    master_key_salt TEXT NOT NULL,
    created_at TEXT NOT NULL,
    last_login TEXT
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    proficiency_level INTEGER DEFAULT 0,
    total_hours REAL DEFAULT 0.0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    encrypted_notes TEXT,
    nonce_notes TEXT,
    UNIQUE(name)
);

-- Skill Progress History
CREATE TABLE IF NOT EXISTS skill_progress (
    id TEXT PRIMARY KEY,
    skill_id TEXT NOT NULL,
    proficiency_level INTEGER NOT NULL,
    hours_practiced REAL DEFAULT 0.0,
    recorded_at TEXT NOT NULL,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    INDEX idx_skill_id (skill_id),
    INDEX idx_recorded_at (recorded_at)
);

-- Habits Table
CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    frequency TEXT NOT NULL CHECK(frequency IN ('daily', 'weekly', 'monthly')),
    streak_count INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    last_completed TEXT,
    UNIQUE(name)
);

-- Habit Completions
CREATE TABLE IF NOT EXISTS habit_completions (
    id TEXT PRIMARY KEY,
    habit_id TEXT NOT NULL,
    completed_at TEXT NOT NULL,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    INDEX idx_habit_id (habit_id),
    INDEX idx_completed_at (completed_at)
);

-- Milestones and Goals
CREATE TABLE IF NOT EXISTS milestones (
    id TEXT PRIMARY KEY,
    skill_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    target_date TEXT NOT NULL,
    completion_date TEXT,
    is_completed BOOLEAN DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE SET NULL,
    INDEX idx_skill_id (skill_id),
    INDEX idx_target_date (target_date)
);

-- Application Settings (encrypted)
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    encrypted_value TEXT NOT NULL,
    nonce TEXT NOT NULL
);

-- Data Export History
CREATE TABLE IF NOT EXISTS exports (
    id TEXT PRIMARY KEY,
    export_type TEXT NOT NULL,
    created_at TEXT NOT NULL,
    file_path TEXT NOT NULL
);
"#;
