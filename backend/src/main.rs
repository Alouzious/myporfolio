// src/main.rs
use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use dotenv::dotenv;
use std::env;

mod db;
mod auth;
mod email;
mod models;
mod routes;

use db::connect;
use routes::{
    about::about_routes,
    skills::skill_routes,
    projects::project_routes,
    research::research_routes,
    myreadings::myreadings_routes,
    contact::contact_routes,
    achievements::achievement_routes,
    experience::experience_routes,
    social_links::social_links_routes,
    auth_routes::auth_route_config,
    health::health_routes,
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let db_pool = connect().await;

    println!("Server running on http://0.0.0.0:{}", port);

    let allowed_origins = env::var("ALLOWED_ORIGINS")
        .unwrap_or_else(|_| "http://localhost:5173,http://localhost:5174".to_string());
    let origins: Vec<String> = allowed_origins.split(',').map(|s| s.trim().to_string()).collect();

    HttpServer::new(move || {
        let mut cors = Cors::default()
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
            .allowed_headers(vec!["Content-Type", "Authorization"])
            .max_age(3600);

        for origin in &origins {
            cors = cors.allowed_origin(origin);
        }

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(db_pool.clone()))
            .configure(health_routes)
            .configure(auth_route_config)
            .configure(about_routes)
            .configure(skill_routes)
            .configure(project_routes)
            .configure(research_routes)
            .configure(myreadings_routes)
            .configure(contact_routes)
            .configure(achievement_routes)
            .configure(experience_routes)
            .configure(social_links_routes)
    })
    .bind(("0.0.0.0", port.parse::<u16>().unwrap()))?
    .run()
    .await
}