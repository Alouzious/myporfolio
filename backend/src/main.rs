// src/main.rs
use actix_cors::Cors;
use actix_web::{http::header, web, App, HttpServer};
use dotenv::from_filename;
use std::env;

mod db;
mod auth;
mod email;
mod models;
mod routes;

use db::connect;
use routes::{
    about::about_routes,
    achievements::achievement_routes,
    auth_routes::auth_route_config,
    chat::chat_routes,
    contact::contact_routes,
    experience::experience_routes,
    health::health_routes,
    myreadings::myreadings_routes,
    projects::project_routes,
    research::research_routes,
    skills::skill_routes,
    social_links::social_links_routes,
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load .env explicitly
    from_filename(".env").ok();

    println!("DATABASE_URL loaded: {}", env::var("DATABASE_URL").is_ok());

    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let db_pool = connect().await;

    println!("Server running on http://0.0.0.0:{port}");

    let allowed_origins = env::var("ALLOWED_ORIGINS").unwrap_or_else(|_| {
        "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174"
            .to_string()
    });

    let origins: Vec<String> = allowed_origins
        .split(',')
        .map(|s| s.trim().to_string())
        .collect();

    HttpServer::new(move || {
        let mut cors = Cors::default()
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
            .allowed_headers(vec![
                header::CONTENT_TYPE,
                header::AUTHORIZATION,
                header::ACCEPT,
            ])
            .supports_credentials()
            .max_age(3600);

        for origin in &origins {
            cors = cors.allowed_origin(origin);
        }

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(db_pool.clone()))
            .service(
                web::scope("/api")
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
                    .configure(chat_routes),
            )
    })
    .bind(("0.0.0.0", port.parse::<u16>().unwrap()))?
    .run()
    .await
}