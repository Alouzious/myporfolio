// src/routes/about.rs
use crate::models::about::About;
use actix_web::{web, HttpResponse};
use serde_json::json;

pub async fn get_about(pool: web::Data<sqlx::PgPool>) -> HttpResponse {
    let result = sqlx::query_as::<_, About>(
        "SELECT id, name, profession, description, image_url FROM about LIMIT 1"
    )
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(about) => HttpResponse::Ok().json(about),
        Err(e) => {
            eprintln!("Error fetching about: {:?}", e);
            HttpResponse::InternalServerError().json(json!({
                "error": "Failed to fetch about"
            }))
        }
    }
}

pub async fn update_about(
    pool: web::Data<sqlx::PgPool>,
    payload: web::Json<About>,
) -> HttpResponse {
    let result = sqlx::query(
        "UPDATE about SET name=$1, profession=$2, description=$3, image_url=$4 WHERE id=$5"
    )
    .bind(&payload.name)
    .bind(&payload.profession)
    .bind(&payload.description)
    .bind(&payload.image_url)
    .bind(&payload.id)
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(res) => HttpResponse::Ok().json(json!({
            "updated_rows": res.rows_affected()
        })),
        Err(e) => {
            eprintln!("Error updating about: {:?}", e);
            HttpResponse::InternalServerError().json(json!({
                "error": "Failed to update"
            }))
        }
    }
}

pub fn about_routes(cfg: &mut web::ServiceConfig) {
    cfg.route("/about", web::get().to(get_about))
        .route("/about", web::post().to(update_about));
}