use serde::{Deserialize, Serialize};
use crate::error::Result;

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateHabitRequest {
    pub name: String,
    pub frequency: String, // "daily", "weekly", "monthly"
    pub description: Option<String>,
}

#[tauri::command]
pub fn create_habit(request: CreateHabitRequest) -> Result<String> {
    // Validate inputs
    if request.name.is_empty() {
        return Err(crate::error::SkillEdError::ValidationError(
            "Habit name cannot be empty".to_string(),
        ));
    }

    let valid_frequencies = vec!["daily", "weekly", "monthly"];
    if !valid_frequencies.contains(&request.frequency.as_str()) {
        return Err(crate::error::SkillEdError::ValidationError(
            "Invalid frequency. Must be 'daily', 'weekly', or 'monthly'".to_string(),
        ));
    }

    // TODO: Implement database insertion
    let habit_id = uuid::Uuid::new_v4().to_string();
    Ok(habit_id)
}

#[tauri::command]
pub fn log_habit_completion(habit_id: String) -> Result<()> {
    if habit_id.is_empty() {
        return Err(crate::error::SkillEdError::ValidationError(
            "Habit ID cannot be empty".to_string(),
        ));
    }

    // TODO: Implement database insertion and streak update
    Ok(())
}

#[tauri::command]
pub fn get_habit_streak(habit_id: String) -> Result<i32> {
    if habit_id.is_empty() {
        return Err(crate::error::SkillEdError::ValidationError(
            "Habit ID cannot be empty".to_string(),
        ));
    }

    // TODO: Implement streak calculation
    Ok(0)
}

#[tauri::command]
pub fn get_habits() -> Result<Vec<String>> {
    // TODO: Implement database query
    Ok(vec![])
}
