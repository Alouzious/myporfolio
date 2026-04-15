// src/routes/achievements.rs
use crate::models::achievements::Achievement;
use actix_web::{web, HttpResponse};
use serde_json::json;
use sqlx::Row;

pub async fn get_achievements(pool: web::Data<sqlx::PgPool>) -> HttpResponse {
    let result = sqlx::query_as::<_, Achievement>(
        "SELECT id, title, description, date_achieved, certificate_url, created_at 
         FROM achievements 
         ORDER BY date_achieved DESC NULLS LAST"
    )
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(achievements) => HttpResponse::Ok().json(achievements),
        Err(e) => {
            eprintln!("Error fetching achievements: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": "Failed to fetch achievements"}))
        }
    }
}

pub async fn create_achievement(
    pool: web::Data<sqlx::PgPool>,
    payload: web::Json<Achievement>
) -> HttpResponse {
    let result = sqlx::query(
        "INSERT INTO achievements (title, description, date_achieved, certificate_url) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, created_at"
    )
    .bind(&payload.title)
    .bind(&payload.description)
    .bind(&payload.date_achieved)
    .bind(&payload.certificate_url)
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
            eprintln!("Error creating achievement: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": "Failed to create achievement"}))
        }
    }
}

pub fn achievement_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .route("/achievements", web::get().to(get_achievements))
            .route("/achievements", web::post().to(create_achievement))
    );
}