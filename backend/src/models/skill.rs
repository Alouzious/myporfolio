// src/models/skill.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Skill {
    #[serde(skip_deserializing)]
    pub id: Option<Uuid>,
    pub name: String,
    pub category: String,
    pub proficiency: i32, // 1-100
    #[serde(skip_deserializing)]
    pub created_at: Option<DateTime<Utc>>,
}