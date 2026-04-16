// src/routes/auth_routes.rs
use crate::auth::create_jwt;
use actix_web::{web, HttpResponse};
use serde::Deserialize;
use serde_json::json;
use std::env;

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

pub async fn login(payload: web::Json<LoginRequest>) -> HttpResponse {
    let admin_username = env::var("ADMIN_USERNAME").unwrap_or_else(|_| "admin".to_string());
    let admin_password = env::var("ADMIN_PASSWORD").unwrap_or_else(|_| "admin".to_string());

    if payload.username == admin_username && payload.password == admin_password {
        let token = create_jwt(&payload.username);
        HttpResponse::Ok().json(json!({
            "token": token,
            "message": "Login successful"
        }))
    } else {
        HttpResponse::Unauthorized().json(json!({
            "error": "Invalid credentials"
        }))
    }
}

pub async fn verify_token(
    _user: crate::auth::AuthenticatedUser,
) -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "valid": true
    }))
}

pub fn auth_route_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/auth")
            .route("/login", web::post().to(login))
            .route("/verify", web::get().to(verify_token)),
    );
}