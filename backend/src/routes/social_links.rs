// src/routes/social_links.rs
use crate::models::social_link::SocialLink;
use actix_web::{web, HttpResponse};
use serde_json::json;
use sqlx::Row;

pub async fn get_social_links(pool: web::Data<sqlx::PgPool>) -> HttpResponse {
    let result = sqlx::query_as::<_, SocialLink>(
        "SELECT id, platform, url, icon FROM social_links ORDER BY platform"
    )
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(links) => HttpResponse::Ok().json(links),
        Err(e) => {
            eprintln!("Error fetching social links: {:?}", e);
            HttpResponse::InternalServerError().json(json!({
                "error": "Failed to fetch social links"
            }))
        }
    }
}

pub async fn create_social_link(
    pool: web::Data<sqlx::PgPool>,
    payload: web::Json<SocialLink>,
) -> HttpResponse {
    let result = sqlx::query(
        "INSERT INTO social_links (platform, url, icon) VALUES ($1, $2, $3) RETURNING id"
    )
    .bind(&payload.platform)
    .bind(&payload.url)
    .bind(&payload.icon)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(row) => {
            let id: uuid::Uuid = row.get("id");
            HttpResponse::Created().json(json!({
                "status": "success",
                "id": id
            }))
        }
        Err(e) => {
            eprintln!("Error creating social link: {:?}", e);
            HttpResponse::InternalServerError().json(json!({
                "error": "Failed to create social link"
            }))
        }
    }
}

pub async fn delete_social_link(
    pool: web::Data<sqlx::PgPool>,
    path: web::Path<uuid::Uuid>,
) -> HttpResponse {
    let id = path.into_inner();

    let result = sqlx::query("DELETE FROM social_links WHERE id = $1")
        .bind(id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(res) => {
            if res.rows_affected() == 0 {
                HttpResponse::NotFound().json(json!({
                    "error": "Social link not found"
                }))
            } else {
                HttpResponse::Ok().json(json!({
                    "status": "deleted"
                }))
            }
        }
        Err(e) => {
            eprintln!("Error deleting social link: {:?}", e);
            HttpResponse::InternalServerError().json(json!({
                "error": "Failed to delete social link"
            }))
        }
    }
}

pub fn social_links_routes(cfg: &mut web::ServiceConfig) {
    cfg.route("/social-links", web::get().to(get_social_links))
        .route("/social-links", web::post().to(create_social_link))
        .route("/social-links/{id}", web::delete().to(delete_social_link));
}