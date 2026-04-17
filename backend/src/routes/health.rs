// src/routes/health.rs
use actix_web::{web, HttpResponse};
use serde_json::json;

pub async fn health_check() -> HttpResponse {
    HttpResponse::Ok().json(json!({"status": "ok"}))
}

pub fn health_routes(cfg: &mut web::ServiceConfig) {
    cfg.route("/health", web::get().to(health_check));
}