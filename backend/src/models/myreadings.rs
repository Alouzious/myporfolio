// src/models/myreadings.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{NaiveDate, DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct MyReadings {
    #[serde(skip_deserializing)]
    pub id: Option<Uuid>,
    pub title: String,
    pub author: String,
    pub description: Option<String>,
    pub book_url: Option<String>,
    pub read_date: Option<NaiveDate>,
    #[serde(skip_deserializing)]
    pub created_at: Option<DateTime<Utc>>,
}