// src/routes/experience.rs
use crate::models::experience::Experience;
use actix_web::{web, HttpResponse};
use serde_json::json;
use sqlx::Row;

pub async fn get_experiences(pool: web::Data<sqlx::PgPool>) -> HttpResponse {
    let result = sqlx::query_as::<_, Experience>(
        "SELECT id, company, role, description, start_date, end_date, is_current, created_at
         FROM experience
         ORDER BY start_date DESC NULLS LAST"
    )
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(experiences) => HttpResponse::Ok().json(experiences),
        Err(e) => {
            eprintln!("Error fetching experiences: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": "Failed to fetch experiences"}))
        }
    }
}

pub async fn create_experience(
    pool: web::Data<sqlx::PgPool>,
    payload: web::Json<Experience>,
) -> HttpResponse {
    let result = sqlx::query(
        "INSERT INTO experience (company, role, description, start_date, end_date, is_current)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, created_at"
    )
    .bind(&payload.company)
    .bind(&payload.role)
    .bind(&payload.description)
    .bind(&payload.start_date)
    .bind(&payload.end_date)
    .bind(&payload.is_current)
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
            eprintln!("Error creating experience: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": "Failed to create experience"}))
        }
    }
}

pub async fn delete_experience(
    pool: web::Data<sqlx::PgPool>,
    path: web::Path<uuid::Uuid>,
) -> HttpResponse {
    let id = path.into_inner();
    let result = sqlx::query("DELETE FROM experience WHERE id = $1")
        .bind(id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(res) => {
            if res.rows_affected() == 0 {
                HttpResponse::NotFound().json(json!({"error": "Experience not found"}))
            } else {
                HttpResponse::Ok().json(json!({"status": "deleted"}))
            }
        }
        Err(e) => {
            eprintln!("Error deleting experience: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": "Failed to delete experience"}))
        }
    }
}

pub fn experience_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .route("/experience", web::get().to(get_experiences))
            .route("/experience", web::post().to(create_experience))
            .route("/experience/{id}", web::delete().to(delete_experience))
    );
}
