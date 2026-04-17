// src/db.rs
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::env;

pub async fn connect() -> PgPool {
    let database_url =
        env::var("DATABASE_URL").expect("DATABASE_URL must be set in .env file");

    PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await
        .expect("Failed to connect to PostgreSQL database (Neon)")
}