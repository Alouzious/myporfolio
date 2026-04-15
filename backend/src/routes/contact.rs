// src/routes/contact.rs
use crate::models::contact::Contact;
use actix_web::{web, HttpResponse};
use serde_json::json;
use sqlx::Row;

pub async fn get_contacts(pool: web::Data<sqlx::PgPool>) -> HttpResponse {
    let result = sqlx::query_as::<_, Contact>(
        "SELECT id, name, email, message, created_at, status 
         FROM contact 
         ORDER BY created_at DESC"
    )
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(contacts) => HttpResponse::Ok().json(contacts),
        Err(e) => {
            eprintln!("Error fetching contacts: {:?}", e);
            HttpResponse::InternalServerError().json(json!({
                "error": "Failed to fetch contacts"
            }))
        }
    }
}

pub async fn create_contact(
    pool: web::Data<sqlx::PgPool>,
    payload: web::Json<Contact>,
) -> HttpResponse {
    let result = sqlx::query(
        "INSERT INTO contact (name, email, message) 
         VALUES ($1, $2, $3) 
         RETURNING id, created_at"
    )
    .bind(&payload.name)
    .bind(&payload.email)
    .bind(&payload.message)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(row) => {
            let id: uuid::Uuid = row.get("id");
            let created_at: chrono::DateTime<chrono::Utc> = row.get("created_at");

            HttpResponse::Created().json(json!({
                "status": "success",
                "id": id,
                "created_at": created_at,
                "message": "Your message has been received!"
            }))
        }
        Err(e) => {
            eprintln!("Error creating contact: {:?}", e);
            HttpResponse::InternalServerError().json(json!({
                "error": "Failed to create contact"
            }))
        }
    }
}

pub fn contact_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .route("/contact", web::get().to(get_contacts))
            .route("/contact", web::post().to(create_contact))
    );
}