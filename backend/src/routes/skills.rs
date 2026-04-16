// src/routes/skills.rs
use crate::models::skill::Skill;
use actix_web::{web, HttpResponse};
use serde_json::json;
use sqlx::Row;

pub async fn get_skills(pool: web::Data<sqlx::PgPool>) -> HttpResponse {
    let result = sqlx::query_as::<_, Skill>(
        "SELECT id, name, category, proficiency, created_at 
         FROM skills 
         ORDER BY category, name"
    )
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(skills) => HttpResponse::Ok().json(skills),
        Err(e) => {
            eprintln!("Error fetching skills: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": "Failed to fetch skills"}))
        }
    }
}

pub async fn create_skill(
    pool: web::Data<sqlx::PgPool>,
    payload: web::Json<Skill>
) -> HttpResponse {
    let result = sqlx::query(
        "INSERT INTO skills (name, category, proficiency) 
         VALUES ($1, $2, $3) 
         RETURNING id, created_at"
    )
    .bind(&payload.name)
    .bind(&payload.category)
    .bind(&payload.proficiency)
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
            eprintln!("Error creating skill: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": "Failed to create skill"}))
        }
    }
}

pub async fn delete_skill(
    pool: web::Data<sqlx::PgPool>,
    path: web::Path<uuid::Uuid>,
) -> HttpResponse {
    let id = path.into_inner();
    let result = sqlx::query("DELETE FROM skills WHERE id = $1")
        .bind(id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(res) => {
            if res.rows_affected() == 0 {
                HttpResponse::NotFound().json(json!({"error": "Skill not found"}))
            } else {
                HttpResponse::Ok().json(json!({"status": "deleted"}))
            }
        }
        Err(e) => {
            eprintln!("Error deleting skill: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": "Failed to delete skill"}))
        }
    }
}

pub fn skill_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .route("/skills", web::get().to(get_skills))
            .route("/skills", web::post().to(create_skill))
            .route("/skills/{id}", web::delete().to(delete_skill))
    );
}