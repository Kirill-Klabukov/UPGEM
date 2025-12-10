use crate::db::{Skill, Habit, HabitCompletion, SkillProgress, Milestone};
use crate::error::Result;
use sqlx::SqlitePool;
use chrono::Utc;

// ============ SKILL OPERATIONS ============

pub async fn create_skill(
    pool: &SqlitePool,
    name: String,
    category: String,
    description: Option<String>,
) -> Result<Skill> {
    let skill = Skill::new(name, category);
    
    let query = sqlx::query(
        "INSERT INTO skills (id, name, description, category, proficiency_level, total_hours, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(&skill.id)
    .bind(&skill.name)
    .bind(&description)
    .bind(&skill.category)
    .bind(skill.proficiency_level)
    .bind(skill.total_hours)
    .bind(&skill.created_at)
    .bind(&skill.updated_at);

    query.execute(pool).await
        .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(skill)
}

pub async fn get_all_skills(pool: &SqlitePool) -> Result<Vec<Skill>> {
    let skills = sqlx::query_as::<_, Skill>(
        "SELECT id, name, description, category, proficiency_level, total_hours, created_at, updated_at, encrypted_notes, nonce_notes
         FROM skills ORDER BY created_at DESC"
    )
    .fetch_all(pool)
    .await
    .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(skills)
}

pub async fn get_skill(pool: &SqlitePool, skill_id: &str) -> Result<Option<Skill>> {
    let skill = sqlx::query_as::<_, Skill>(
        "SELECT id, name, description, category, proficiency_level, total_hours, created_at, updated_at, encrypted_notes, nonce_notes
         FROM skills WHERE id = ?"
    )
    .bind(skill_id)
    .fetch_optional(pool)
    .await
    .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(skill)
}

pub async fn update_skill(
    pool: &SqlitePool,
    skill_id: &str,
    name: Option<String>,
    category: Option<String>,
    description: Option<String>,
    proficiency_level: Option<i32>,
    total_hours: Option<f64>,
) -> Result<()> {
    let now = Utc::now().to_rfc3339();
    
    let mut query_str = String::from("UPDATE skills SET updated_at = ?");
    let mut args: Vec<String> = vec![now];

    if let Some(n) = name {
        query_str.push_str(", name = ?");
        args.push(n);
    }
    if let Some(c) = category {
        query_str.push_str(", category = ?");
        args.push(c);
    }
    if let Some(d) = description {
        query_str.push_str(", description = ?");
        args.push(d);
    }
    if let Some(p) = proficiency_level {
        query_str.push_str(", proficiency_level = ?");
        args.push(p.to_string());
    }
    if let Some(h) = total_hours {
        query_str.push_str(", total_hours = ?");
        args.push(h.to_string());
    }

    query_str.push_str(" WHERE id = ?");
    args.push(skill_id.to_string());

    // Execute dynamic query
    let mut query = sqlx::query(&query_str);
    for arg in args {
        query = query.bind(arg);
    }

    query.execute(pool)
        .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(())
}

pub async fn delete_skill(pool: &SqlitePool, skill_id: &str) -> Result<()> {
    sqlx::query("DELETE FROM skills WHERE id = ?")
        .bind(skill_id)
        .execute(pool)
        .await
        .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(())
}

// ============ HABIT OPERATIONS ============

pub async fn create_habit(
    pool: &SqlitePool,
    name: String,
    frequency: String,
    description: Option<String>,
) -> Result<Habit> {
    let habit = Habit::new(name, frequency);

    sqlx::query(
        "INSERT INTO habits (id, name, description, frequency, streak_count, best_streak, created_at, last_completed)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(&habit.id)
    .bind(&habit.name)
    .bind(&description)
    .bind(&habit.frequency)
    .bind(habit.streak_count)
    .bind(habit.best_streak)
    .bind(&habit.created_at)
    .bind(&habit.last_completed)
    .execute(pool)
    .await
    .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(habit)
}

pub async fn get_all_habits(pool: &SqlitePool) -> Result<Vec<Habit>> {
    let habits = sqlx::query_as::<_, Habit>(
        "SELECT id, name, description, frequency, streak_count, best_streak, created_at, last_completed
         FROM habits ORDER BY created_at DESC"
    )
    .fetch_all(pool)
    .await
    .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(habits)
}

pub async fn get_habit(pool: &SqlitePool, habit_id: &str) -> Result<Option<Habit>> {
    let habit = sqlx::query_as::<_, Habit>(
        "SELECT id, name, description, frequency, streak_count, best_streak, created_at, last_completed
         FROM habits WHERE id = ?"
    )
    .bind(habit_id)
    .fetch_optional(pool)
    .await
    .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(habit)
}

pub async fn delete_habit(pool: &SqlitePool, habit_id: &str) -> Result<()> {
    sqlx::query("DELETE FROM habits WHERE id = ?")
        .bind(habit_id)
        .execute(pool)
        .await
        .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(())
}

// ============ HABIT COMPLETION OPERATIONS ============

pub async fn log_habit_completion(
    pool: &SqlitePool,
    habit_id: &str,
) -> Result<HabitCompletion> {
    let completion = HabitCompletion::new(habit_id.to_string());

    sqlx::query(
        "INSERT INTO habit_completions (id, habit_id, completed_at)
         VALUES (?, ?, ?)"
    )
    .bind(&completion.id)
    .bind(&completion.habit_id)
    .bind(&completion.completed_at)
    .execute(pool)
    .await
    .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    // Update habit last_completed and streak
    update_habit_streak(pool, habit_id).await?;

    Ok(completion)
}

pub async fn get_habit_completions(
    pool: &SqlitePool,
    habit_id: &str,
) -> Result<Vec<HabitCompletion>> {
    let completions = sqlx::query_as::<_, HabitCompletion>(
        "SELECT id, habit_id, completed_at FROM habit_completions
         WHERE habit_id = ? ORDER BY completed_at DESC"
    )
    .bind(habit_id)
    .fetch_all(pool)
    .await
    .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(completions)
}

async fn update_habit_streak(pool: &SqlitePool, habit_id: &str) -> Result<()> {
    let now = Utc::now().to_rfc3339();

    sqlx::query("UPDATE habits SET last_completed = ? WHERE id = ?")
        .bind(&now)
        .bind(habit_id)
        .execute(pool)
        .await
        .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(())
}

// ============ SKILL PROGRESS OPERATIONS ============

pub async fn record_skill_progress(
    pool: &SqlitePool,
    skill_id: &str,
    proficiency_level: i32,
    hours_practiced: f64,
) -> Result<SkillProgress> {
    let progress = SkillProgress::new(skill_id.to_string(), proficiency_level, hours_practiced);

    sqlx::query(
        "INSERT INTO skill_progress (id, skill_id, proficiency_level, hours_practiced, recorded_at)
         VALUES (?, ?, ?, ?, ?)"
    )
    .bind(&progress.id)
    .bind(&progress.skill_id)
    .bind(progress.proficiency_level)
    .bind(progress.hours_practiced)
    .bind(&progress.recorded_at)
    .execute(pool)
    .await
    .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    // Update skill totals
    update_skill_totals(pool, skill_id, proficiency_level, hours_practiced).await?;

    Ok(progress)
}

pub async fn get_skill_progress_history(
    pool: &SqlitePool,
    skill_id: &str,
) -> Result<Vec<SkillProgress>> {
    let progress = sqlx::query_as::<_, SkillProgress>(
        "SELECT id, skill_id, proficiency_level, hours_practiced, recorded_at
         FROM skill_progress WHERE skill_id = ? ORDER BY recorded_at DESC"
    )
    .bind(skill_id)
    .fetch_all(pool)
    .await
    .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(progress)
}

async fn update_skill_totals(
    pool: &SqlitePool,
    skill_id: &str,
    proficiency_level: i32,
    hours_practiced: f64,
) -> Result<()> {
    let now = Utc::now().to_rfc3339();

    sqlx::query(
        "UPDATE skills SET proficiency_level = ?, total_hours = total_hours + ?, updated_at = ? WHERE id = ?"
    )
    .bind(proficiency_level)
    .bind(hours_practiced)
    .bind(&now)
    .bind(skill_id)
    .execute(pool)
    .await
    .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(())
}

// ============ MILESTONE OPERATIONS ============

pub async fn create_milestone(
    pool: &SqlitePool,
    title: String,
    target_date: String,
    skill_id: Option<String>,
    description: Option<String>,
) -> Result<Milestone> {
    let milestone = Milestone::new(title, target_date, skill_id);

    sqlx::query(
        "INSERT INTO milestones (id, skill_id, title, description, target_date, is_completed, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(&milestone.id)
    .bind(&milestone.skill_id)
    .bind(&milestone.title)
    .bind(&description)
    .bind(&milestone.target_date)
    .bind(milestone.is_completed)
    .bind(&milestone.created_at)
    .execute(pool)
    .await
    .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(milestone)
}

pub async fn get_all_milestones(pool: &SqlitePool) -> Result<Vec<Milestone>> {
    let milestones = sqlx::query_as::<_, Milestone>(
        "SELECT id, skill_id, title, description, target_date, completion_date, is_completed, created_at
         FROM milestones ORDER BY target_date ASC"
    )
    .fetch_all(pool)
    .await
    .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(milestones)
}

pub async fn complete_milestone(pool: &SqlitePool, milestone_id: &str) -> Result<()> {
    let now = Utc::now().to_rfc3339();

    sqlx::query("UPDATE milestones SET is_completed = 1, completion_date = ? WHERE id = ?")
        .bind(&now)
        .bind(milestone_id)
        .execute(pool)
        .await
        .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(())
}

pub async fn delete_milestone(pool: &SqlitePool, milestone_id: &str) -> Result<()> {
    sqlx::query("DELETE FROM milestones WHERE id = ?")
        .bind(milestone_id)
        .execute(pool)
        .await
        .map_err(|e| crate::error::SkillEdError::DatabaseError(e.to_string()))?;

    Ok(())
}
