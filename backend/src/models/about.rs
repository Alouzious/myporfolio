// src/models/about.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct About {
    pub id: Uuid,
    pub name: String,
    pub profession: String,
    pub description: String,
    pub image_url: Option<String>,
}