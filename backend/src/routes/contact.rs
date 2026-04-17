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
    if payload.name.trim().is_empty()
        || payload.email.trim().is_empty()
        || payload.message.trim().is_empty()
    {
        return HttpResponse::BadRequest().json(json!({
            "error": "Name, email, and message are required"
        }));
    }

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

            let name = payload.name.clone();
            let email = payload.email.clone();
            let message = payload.message.clone();

            tokio::spawn(async move {
                if let Err(e) = crate::email::send_email(&name, &email, &message).await {
                    eprintln!("Failed to send email notification: {}", e);
                }
            });

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

pub async fn delete_contact(
    pool: web::Data<sqlx::PgPool>,
    path: web::Path<uuid::Uuid>,
) -> HttpResponse {
    let id = path.into_inner();

    let result = sqlx::query("DELETE FROM contact WHERE id = $1")
        .bind(id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(res) => {
            if res.rows_affected() == 0 {
                HttpResponse::NotFound().json(json!({
                    "error": "Contact not found"
                }))
            } else {
                HttpResponse::Ok().json(json!({
                    "status": "deleted"
                }))
            }
        }
        Err(e) => {
            eprintln!("Error deleting contact: {:?}", e);
            HttpResponse::InternalServerError().json(json!({
                "error": "Failed to delete contact"
            }))
        }
    }
}

pub fn contact_routes(cfg: &mut web::ServiceConfig) {
    cfg.route("/contact", web::get().to(get_contacts))
        .route("/contact", web::post().to(create_contact))
        .route("/contact/{id}", web::delete().to(delete_contact));
}