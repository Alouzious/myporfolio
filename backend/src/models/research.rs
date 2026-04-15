// src/models/research.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{NaiveDate, DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Research {
    #[serde(skip_deserializing)]
    pub id: Option<Uuid>,
    pub title: String,
    pub description: String,
    pub paper_url: Option<String>,
    pub published_date: Option<NaiveDate>,
    pub authors: Option<Vec<String>>,
    #[serde(skip_deserializing)]
    pub created_at: Option<DateTime<Utc>>,
    #[serde(skip_deserializing)]
    pub updated_at: Option<DateTime<Utc>>,
}