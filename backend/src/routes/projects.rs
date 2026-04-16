// src/routes/projects.rs
use crate::models::project::Project;
use actix_web::{web, HttpResponse};
use serde_json::json;
use sqlx::Row;

pub async fn get_projects(pool: web::Data<sqlx::PgPool>) -> HttpResponse {
    let result = sqlx::query_as::<_, Project>(
        "SELECT id, title, description, technologies, github_url, live_url, image_url, created_at, updated_at 
         FROM projects 
         ORDER BY created_at DESC"
    )
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(projects) => HttpResponse::Ok().json(projects),
        Err(e) => {
            eprintln!("Error fetching projects: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": "Failed to fetch projects"}))
        }
    }
}

pub async fn create_project(
    pool: web::Data<sqlx::PgPool>,
    payload: web::Json<Project>
) -> HttpResponse {
    let result = sqlx::query(
        "INSERT INTO projects (title, description, technologies, github_url, live_url, image_url) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, created_at, updated_at"
    )
    .bind(&payload.title)
    .bind(&payload.description)
    .bind(&payload.technologies)
    .bind(&payload.github_url)
    .bind(&payload.live_url)
    .bind(&payload.image_url)
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
            eprintln!("Error creating project: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": "Failed to create project"}))
        }
    }
}

pub async fn delete_project(
    pool: web::Data<sqlx::PgPool>,
    path: web::Path<uuid::Uuid>,
) -> HttpResponse {
    let id = path.into_inner();
    let result = sqlx::query("DELETE FROM projects WHERE id = $1")
        .bind(id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(res) => {
            if res.rows_affected() == 0 {
                HttpResponse::NotFound().json(json!({"error": "Project not found"}))
            } else {
                HttpResponse::Ok().json(json!({"status": "deleted"}))
            }
        }
        Err(e) => {
            eprintln!("Error deleting project: {:?}", e);
            HttpResponse::InternalServerError().json(json!({"error": "Failed to delete project"}))
        }
    }
}

pub fn project_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .route("/projects", web::get().to(get_projects))
            .route("/projects", web::post().to(create_project))
            .route("/projects/{id}", web::delete().to(delete_project))
    );
}