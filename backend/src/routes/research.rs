// src/routes/research.rs
use crate::models::research::Research;
use actix_web::{web, HttpResponse};
use serde_json::json;
use sqlx::Row;

pub async fn get_research(pool: web::Data<sqlx::PgPool>) -> HttpResponse {
    let result = sqlx::query_as::<_, Research>(
        "SELECT id, title, description, paper_url, published_date, authors, created_at, updated_at 
         FROM research 
         ORDER BY published_date DESC NULLS LAST"
    )
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(research) => HttpResponse::Ok().json(research),
        Err(e) => {
            eprintln!("Error fetching research: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": "Failed to fetch research"}))
        }
    }
}

pub async fn create_research(
    pool: web::Data<sqlx::PgPool>,
    payload: web::Json<Research>
) -> HttpResponse {
    let result = sqlx::query(
        "INSERT INTO research (title, description, paper_url, published_date, authors) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, created_at, updated_at"
    )
    .bind(&payload.title)
    .bind(&payload.description)
    .bind(&payload.paper_url)
    .bind(&payload.published_date)
    .bind(&payload.authors)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(row) => {
            let id: uuid::Uuid = row.get("id");
            let created_at: chrono::DateTime<chrono::Utc> = row.get("created_at");
            let updated_at: chrono::DateTime<chrono::Utc> = row.get("updated_at");
            HttpResponse::Created().json(json!({ 
                "status": "success", 
                "id": id,
                "created_at": created_at,
                "updated_at": updated_at
            }))
        }
        Err(e) => {
            eprintln!("Error creating research: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": "Failed to create research"}))
        }
    }
}

pub fn research_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .route("/research", web::get().to(get_research))
            .route("/research", web::post().to(create_research))
    );
}