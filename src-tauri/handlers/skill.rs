use serde::{Deserialize, Serialize};
use crate::error::Result;

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSkillRequest {
    pub name: String,
    pub category: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSkillRequest {
    pub id: String,
    pub name: Option<String>,
    pub category: Option<String>,
    pub description: Option<String>,
    pub proficiency_level: Option<i32>,
    pub total_hours: Option<f64>,
}

#[tauri::command]
pub fn create_skill(request: CreateSkillRequest) -> Result<String> {
    // Validate inputs
    if request.name.is_empty() {
        return Err(crate::error::SkillEdError::ValidationError(
            "Skill name cannot be empty".to_string(),
        ));
    }

    if request.category.is_empty() {
        return Err(crate::error::SkillEdError::ValidationError(
            "Skill category cannot be empty".to_string(),
        ));
    }

    // TODO: Implement database insertion
    let skill_id = uuid::Uuid::new_v4().to_string();
    Ok(skill_id)
}

#[tauri::command]
pub fn get_skills() -> Result<Vec<String>> {
    // TODO: Implement database query
    Ok(vec![])
}

#[tauri::command]
pub fn update_skill(request: UpdateSkillRequest) -> Result<()> {
    if request.id.is_empty() {
        return Err(crate::error::SkillEdError::ValidationError(
            "Skill ID cannot be empty".to_string(),
        ));
    }

    // TODO: Implement database update
    Ok(())
}

#[tauri::command]
pub fn delete_skill(skill_id: String) -> Result<()> {
    if skill_id.is_empty() {
        return Err(crate::error::SkillEdError::ValidationError(
            "Skill ID cannot be empty".to_string(),
        ));
    }

    // TODO: Implement database deletion
    Ok(())
}

#[tauri::command]
pub fn get_skill_progress(skill_id: String) -> Result<Vec<String>> {
    if skill_id.is_empty() {
        return Err(crate::error::SkillEdError::ValidationError(
            "Skill ID cannot be empty".to_string(),
        ));
    }

    // TODO: Implement database query
    Ok(vec![])
}
