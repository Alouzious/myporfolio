// src/routes/chat.rs
use actix_web::{web, HttpResponse};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::env;

#[derive(Debug, Deserialize)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Debug, Deserialize)]
pub struct ChatRequest {
    pub message: String,
    #[serde(default)]
    pub history: Vec<ChatMessage>,
}

#[derive(Debug, Serialize)]
struct GroqMessage {
    role: String,
    content: String,
}

#[derive(Debug, Serialize)]
struct GroqRequest {
    model: String,
    messages: Vec<GroqMessage>,
    max_tokens: u32,
    temperature: f32,
}

fn build_system_prompt() -> String {
    "You are a helpful AI assistant for a personal portfolio website. \
    The portfolio belongs to a full-stack developer with expertise in AI/ML, \
    Rust, React, Python, Web3/Blockchain (Stellar, Soroban), and modern backend systems. \
    Answer questions about the developer's skills, projects, experience, and background. \
    Be concise, professional, and friendly. If asked about something outside the portfolio context, \
    redirect the conversation back to the portfolio topics.".to_string()
}

fn keyword_response(message: &str) -> String {
    let msg = message.to_lowercase();

    if msg.contains("skill") || msg.contains("technolog") || msg.contains("stack") {
        return "My core skills span multiple domains: \
            **Frontend** — React, TypeScript, Tailwind CSS; \
            **Backend** — Rust (Actix/Axum), Python (Django/Flask), Node.js; \
            **AI/ML** — LLM integration, prompt engineering, TensorFlow; \
            **Blockchain** — Stellar, Soroban smart contracts, Solidity; \
            **Databases** — PostgreSQL, Neon; \
            **DevOps** — Docker, Vercel, Render. \
            Which area would you like to know more about?".to_string();
    }

    if msg.contains("project") || msg.contains("work") || msg.contains("built") || msg.contains("made") {
        return "I've built projects across several domains: AI-powered applications with LLM integration, \
            decentralized apps on Stellar blockchain with Soroban smart contracts, \
            full-stack web dashboards with React + Rust backends, \
            and this portfolio itself! Check out the Projects page for a detailed showcase.".to_string();
    }

    if msg.contains("experience") || msg.contains("job") || msg.contains("work history") || msg.contains("career") {
        return "My professional experience includes full-stack development roles, \
            developer community leadership, speaking at tech events, \
            and working on innovative projects in AI, Web3, and backend systems. \
            Visit the Experience page for the full timeline.".to_string();
    }

    if msg.contains("rust") {
        return "I'm passionate about Rust! I use it for building high-performance backend services \
            with Actix-web and Axum. Rust's memory safety, concurrency model, and performance make it \
            perfect for systems programming and API development.".to_string();
    }

    if msg.contains("ai") || msg.contains("machine learning") || msg.contains("ml") || msg.contains("llm") {
        return "AI and ML are a major focus! I work with large language models, \
            build AI-integrated applications, and explore prompt engineering techniques. \
            I'm particularly interested in practical AI applications that solve real problems.".to_string();
    }

    if msg.contains("blockchain") || msg.contains("web3") || msg.contains("stellar") || msg.contains("crypto") {
        return "I work with blockchain technologies, particularly Stellar and Soroban for smart contracts. \
            I'm interested in DeFi, tokenization, and how blockchain can enable trustless systems. \
            I also have experience with Solidity for Ethereum-compatible chains.".to_string();
    }

    if msg.contains("contact") || msg.contains("hire") || msg.contains("reach") || msg.contains("email") {
        return "You can reach me through the Contact section on the home page. \
            I'm open to interesting projects, collaborations, and opportunities in AI, \
            Web3, or full-stack development!".to_string();
    }

    if msg.contains("credential") || msg.contains("certif") || msg.contains("award") || msg.contains("achievement") {
        return "I've earned certifications in cloud development, blockchain, and full-stack engineering. \
            Check out the Credentials page for a complete list of my certifications, courses, and achievements, \
            plus a resume download!".to_string();
    }

    if msg.contains("lab") || msg.contains("research") || msg.contains("reading") || msg.contains("learning") {
        return "In My Lab, I explore research on LLMs in production, zero-knowledge proofs, \
            distributed system patterns, and Rust systems programming. \
            I'm also an avid reader — currently exploring books on data-intensive applications \
            and distributed systems. Check out My Lab page for more!".to_string();
    }

    if msg.contains("hello") || msg.contains("hi") || msg.contains("hey") || msg.contains("greet") {
        return "Hello! I'm the portfolio assistant. I can tell you about skills, projects, \
            experience, credentials, and more. What would you like to know?".to_string();
    }

    "That's a great question! I can tell you about skills, projects, experience, credentials, \
    and research interests in this portfolio. What would you like to explore?".to_string()
}

async fn call_groq(api_key: &str, message: &str, history: &[ChatMessage]) -> Result<String, String> {
    let client = reqwest::Client::new();

    let mut messages = vec![GroqMessage {
        role: "system".to_string(),
        content: build_system_prompt(),
    }];

    for h in history.iter().take(MAX_HISTORY_MESSAGES) {
        messages.push(GroqMessage {
            role: h.role.clone(),
            content: h.content.clone(),
        });
    }

    messages.push(GroqMessage {
        role: "user".to_string(),
        content: message.to_string(),
    });

    let request_body = GroqRequest {
        model: env::var("GROQ_MODEL").unwrap_or_else(|_| "llama3-8b-8192".to_string()),
        messages,
        max_tokens: 500,
        temperature: 0.7,
    };

    let response = client
        .post("https://api.groq.com/openai/v1/chat/completions")
        .bearer_auth(api_key)
        .json(&request_body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err(format!("Groq API error: {}", response.status()));
    }

    let body: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;

    let reply = body["choices"][0]["message"]["content"]
        .as_str()
        .unwrap_or("I couldn't generate a response. Please try again.")
        .to_string();

    Ok(reply)
}

const MAX_MESSAGE_LENGTH: usize = 1000;
const MAX_HISTORY_MESSAGES: usize = 10;

pub async fn chat_handler(payload: web::Json<ChatRequest>) -> HttpResponse {
    let message = payload.message.trim().to_string();

    if message.is_empty() {
        return HttpResponse::BadRequest().json(json!({ "error": "Message cannot be empty" }));
    }

    if message.len() > MAX_MESSAGE_LENGTH {
        return HttpResponse::BadRequest().json(json!({ "error": "Message too long" }));
    }

    // Try Groq first if API key is configured
    if let Ok(api_key) = env::var("GROQ_API_KEY") {
        if !api_key.is_empty() {
            match call_groq(&api_key, &message, &payload.history).await {
                Ok(reply) => {
                    return HttpResponse::Ok().json(json!({ "reply": reply }));
                }
                Err(e) => {
                    eprintln!("Groq API error: {}", e);
                    // Fall through to keyword-based response
                }
            }
        }
    }

    // Fallback: keyword-based response
    let reply = keyword_response(&message);
    HttpResponse::Ok().json(json!({ "reply": reply }))
}

pub fn chat_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .route("/chat", web::post().to(chat_handler))
    );
}
