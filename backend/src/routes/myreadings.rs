// src/routes/myreadings.rs
use crate::models::myreadings::MyReadings;
use actix_web::{web, HttpResponse};
use serde_json::json;
use sqlx::Row;

pub async fn get_myreadings(pool: web::Data<sqlx::PgPool>) -> HttpResponse {
    let result = sqlx::query_as::<_, MyReadings>(
        "SELECT id, title, author, description, book_url, read_date, created_at
         FROM myreadings
         ORDER BY read_date DESC NULLS LAST"
    )
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(readings) => HttpResponse::Ok().json(readings),
        Err(e) => {
            eprintln!("Error fetching readings: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": "Failed to fetch readings"}))
        }
    }
}

pub async fn create_myreadings(
    pool: web::Data<sqlx::PgPool>,
    payload: web::Json<MyReadings>
) -> HttpResponse {
    let result = sqlx::query(
        "INSERT INTO myreadings (title, author, description, book_url, read_date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, created_at"
    )
    .bind(&payload.title)
    .bind(&payload.author)
    .bind(&payload.description)
    .bind(&payload.book_url)
    .bind(&payload.read_date)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(row) => {
            let id: uuid::Uuid = row.get("id");
            let created_at: chrono::DateTime<chrono::Utc> = row.get("created_at");
            HttpResponse::Created().json(json!({
                "status": "success",
                "id": id,
                "created_at": created_at
            }))
        }
        Err(e) => {
            eprintln!("Error creating reading: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": "Failed to create reading"}))
        }
    }
}

pub fn myreadings_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .route("/myreadings", web::get().to(get_myreadings))
            .route("/myreadings", web::post().to(create_myreadings))
    );
}