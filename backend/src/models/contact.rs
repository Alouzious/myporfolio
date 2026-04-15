// src/models/contact.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Contact {
    #[serde(skip_deserializing)]
    pub id: Option<Uuid>,
    pub name: String,
    pub email: String,
    pub message: String,
    #[serde(skip_deserializing)]
    pub created_at: Option<DateTime<Utc>>,
    #[serde(skip_deserializing)]
    pub status: Option<String>,
}