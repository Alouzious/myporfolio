// src/db.rs
use sqlx::{PgPool, postgres::PgPoolOptions};
use std::env;
use dotenv::dotenv;

pub async fn connect() -> PgPool {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env file");

    PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await
        .expect("Failed to connect to PostgreSQL database (Neon)")
}