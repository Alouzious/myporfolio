// src/models/experience.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{NaiveDate, DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Experience {
    #[serde(skip_deserializing)]
    pub id: Option<Uuid>,
    pub company: String,
    pub role: String,
    pub description: String,
    pub start_date: Option<NaiveDate>,
    pub end_date: Option<NaiveDate>,
    pub is_current: Option<bool>,
    #[serde(skip_deserializing)]
    pub created_at: Option<DateTime<Utc>>,
}
