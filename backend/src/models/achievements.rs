// src/models/achievements.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{NaiveDate, DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Achievement {
    #[serde(skip_deserializing)]
    pub id: Option<Uuid>,
    pub title: String,
    pub description: String,
    pub date_achieved: Option<NaiveDate>,
    pub certificate_url: Option<String>,
    #[serde(skip_deserializing)]
    pub created_at: Option<DateTime<Utc>>,
}