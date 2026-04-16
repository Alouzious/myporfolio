// src/models/social_link.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct SocialLink {
    #[serde(skip_deserializing)]
    pub id: Option<Uuid>,
    pub platform: String,
    pub url: String,
    pub icon: Option<String>,
}
