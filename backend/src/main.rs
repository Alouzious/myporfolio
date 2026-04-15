// src/main.rs
use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use dotenv::dotenv;
use std::env;

mod db;
mod auth;
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
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let db_pool = connect().await;

    println!("🚀 Server running on http://localhost:{}", port);

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(db_pool.clone()))
            .configure(about_routes)
            .configure(skill_routes)
            .configure(project_routes)
            .configure(research_routes)
            .configure(myreadings_routes)
            .configure(contact_routes)
            .configure(achievement_routes)
    })
    .bind(("0.0.0.0", port.parse::<u16>().unwrap()))?
    .run()
    .await
}