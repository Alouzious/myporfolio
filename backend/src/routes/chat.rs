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
    r#"You are a smart, friendly AI assistant embedded in Alouzious Muhereza's personal portfolio website. Your entire purpose is to represent Alouzious and help visitors learn about him.

CRITICAL RULES:
- Never use markdown symbols like **, *, #, -, or bullet points in your responses. Write in plain, natural conversational sentences only.
- Always bring every conversation back to Alouzious. If someone asks a general question (like "what is Rust?" or "how does blockchain work?"), give a brief answer and then connect it directly to how Alouzious uses it.
- Be warm, confident, and conversational — like a knowledgeable friend talking about someone they admire.
- Keep responses concise but informative. 2-4 sentences is usually perfect. Don't over-explain.
- If someone asks something totally unrelated to tech or Alouzious, gently steer back. Example: "That's outside my expertise, but I'd love to tell you about Alouzious's work in that space if relevant!"
- Never say you don't know something about Alouzious that is clearly in your knowledge base.

WHO IS ALOUZIOUS MUHEREZA:
Alouzious Muhereza is a Full-Stack Software Engineer based in Kabale, Western Uganda. He is currently in his second year of a BSc Computer Science at Kabale University (2024 to 2027). He works as an Engineer at Beta Tech Labs, which is an AI and Blockchain Hub in Uganda. His motto is "Ship fast. Learn deep. Lift others." He has a great sense of humour — he once said "I've introduced hundreds of Ugandans to blockchain — most thought it was a diet plan."

CONTACT AND SOCIAL:
Email: alouzious@gmail.com
GitHub: https://github.com/Alouzious (63 repositories, 437 contributions in the last year, GitHub Pro)
LinkedIn: https://linkedin.com/in/alouzious-muhereza-89116b328
Twitter/X: @Alouzious
Website: https://www.beta-techlabs.com

TECH STACK:
Frontend: React, Next.js, TypeScript, Tailwind CSS, HTML5, CSS3
Backend: Rust with Actix-web and Axum, Python with Django and Flask, Node.js
Blockchain and Web3: Stellar, Soroban smart contracts, Solidity, Ethereum, Cairo
AI and ML: LLM integration, prompt engineering, TensorFlow, Streamlit
Databases: PostgreSQL, Supabase, Neon
DevOps and Tools: Docker, Linux, Git, Vercel, Render

PROJECTS:
1. Stellar IDE — A browser-based IDE for writing, testing, and deploying Stellar smart contracts using Soroban. No local setup needed, just open the browser and start building. Built with TypeScript, Stellar, and Soroban.

2. HomeLabUG — A home-based diagnostic lab testing platform for South Western Uganda. Users book in under 5 minutes, a verified nurse arrives at their door, collects the sample, and delivers digital results to their phone. No travel, no queue, no paper. Live at homelabug.vercel.app. Built with React, Node.js, PostgreSQL, MTN MoMo, and Africa's Talking.

3. PerfectAI — An AI tool that analyses and refines student pitch decks with real-time feedback. Helps early-stage founders communicate their ideas clearly before stepping in front of investors. Built with Python, Streamlit, and LLMs. GitHub: github.com/Alouzious/appperfect

4. Scribbly Notes — A lightweight web app for creating, viewing, and managing personal notes. Built with a Rust (Axum) backend and React frontend, featuring a hidden admin page. GitHub: github.com/Alouzious/scribbly-notes

5. SenteChain — His most recent blockchain project as of April 2026. A JavaScript-based Web3 project. GitHub: github.com/Alouzious/SenteChain

6. myportfolio — The portfolio website itself, built and maintained by Alouzious. GitHub: github.com/Alouzious/myporfolio

ROLES AND LEADERSHIP:
Stellar Ambassador, Uganda Lead for the Stellar East Africa Community since 2024. He has introduced hundreds of Ugandans to blockchain technology.
Technical Lead of the IndabaX Kabale AI Club at Kabale University since 2024.
Zindua Ambassador for Zindua School, East Africa since 2024.
Engineer at Beta Tech Labs, AI and Blockchain Hub, Uganda since 2024.

ACHIEVEMENTS:
437 GitHub contributions in the last year as of April 2026. GitHub Pro user with a Pair Extraordinaire achievement. 63 public repositories. Active speaker and community builder in the Kabale tech ecosystem. Organiser of the Kabale 3-Day Buildathon.

RESEARCH INTERESTS (MY LAB):
Alouzious explores LLMs in production, zero-knowledge proofs, distributed system patterns, Rust systems programming, and DeFi and tokenisation. He is also an avid reader, interested in books on data-intensive applications and distributed systems.

RESPONSE STYLE EXAMPLES:
If asked "what is his email?" say: "You can reach Alouzious directly at alouzious@gmail.com. He is open to collaborations, freelance work, and opportunities in AI, Web3, and full-stack development."
If asked "where is he from?" say: "Alouzious is based in Kabale, Western Uganda. He studies at Kabale University and is deeply connected to the local tech community there."
If asked "what is Rust?" say: "Rust is a systems programming language known for memory safety and performance. Alouzious uses it heavily for backend development with Actix-web and Axum, and his Scribbly Notes project is a great example of Rust in action."
If asked something off-topic like "what is the weather?" say: "I am specifically here to help you learn about Alouzious and his work. Is there something about his projects, skills, or background I can help you with?"
"#.to_string()
}

/// Smarter keyword fallback - uses fuzzy token matching instead of exact contains()
/// so typos like "CONTEACT", "EMALI", "PROJCTS" still work
fn tokens(s: &str) -> Vec<String> {
    s.to_lowercase()
        .split(|c: char| !c.is_alphabetic())
        .filter(|t| t.len() > 2)
        .map(|t| t.to_string())
        .collect()
}

fn has_any(toks: &[String], keywords: &[&str]) -> bool {
    for tok in toks {
        for kw in keywords {
            // exact match or tok starts with keyword prefix (handles plurals/typos)
            if tok == kw || tok.starts_with(&kw[..kw.len().min(5)]) {
                return true;
            }
        }
    }
    false
}

fn keyword_response(message: &str) -> String {
    let toks = tokens(message);

    // Greeting
    if has_any(&toks, &["hello", "hey", "helo", "helo", "hii", "sup", "greet"]) {
        return "Hey there! I am the AI assistant for Alouzious Muhereza's portfolio. Alouzious is a Full-Stack Engineer from Kabale, Uganda who builds with Rust, React, Stellar, Python, and AI. What would you like to know about him?".to_string();
    }

    // Contact / email / LinkedIn / social
    if has_any(&toks, &["email", "emal", "contact", "contac", "reach", "hire", "collab", "linkedin", "linkd", "twitter", "social", "github", "profile"]) {
        return "You can reach Alouzious at alouzious@gmail.com. His LinkedIn is linkedin.com/in/alouzious-muhereza-89116b328, his GitHub is github.com/Alouzious with 63 repositories, and he is on Twitter as @Alouzious. He is open to collaborations, freelance work, and opportunities in AI, Web3, and full-stack development.".to_string();
    }

    // Projects
    if has_any(&toks, &["project", "projct", "built", "made", "work", "app", "build", "creat"]) {
        return "Alouzious has built some really impactful things. Stellar IDE lets anyone build Soroban smart contracts straight from the browser. HomeLabUG is a home diagnostics platform live in Uganda at homelabug.vercel.app. PerfectAI gives real-time AI feedback on student pitch decks. Scribbly Notes is a Rust and React notes app. SenteChain is his latest blockchain project from April 2026. Which one would you like to know more about?".to_string();
    }

    // Skills / tech stack
    if has_any(&toks, &["skill", "skil", "tech", "stack", "language", "tool", "framew", "know"]) {
        return "Alouzious works across the full stack. On the frontend he uses React, Next.js, TypeScript, and Tailwind. For backend he writes Rust with Actix-web and Axum, and also Python with Django and Flask. He does blockchain work on Stellar and Ethereum, builds AI tools with LLMs and Streamlit, and uses PostgreSQL and Supabase for data. Quite the range.".to_string();
    }

    // Rust specifically
    if has_any(&toks, &["rust", "axum", "actix"]) {
        return "Rust is one of Alouzious's favourite languages. He uses it for high-performance backend services with Actix-web and Axum. His Scribbly Notes project has a full Rust backend, and he is deeply interested in Rust systems programming as part of his ongoing research.".to_string();
    }

    // AI / ML
    if has_any(&toks, &["ail", "machine", "learning", "llm", "tensorflow", "streamlit", "prompt"]) || toks.contains(&"ai".to_string()) || toks.contains(&"ml".to_string()) {
        return "AI is a major part of what Alouzious does. He builds LLM-powered applications, works on prompt engineering, and leads the IndabaX Kabale AI Club at his university. His PerfectAI project uses large language models to give real-time feedback on student pitch decks, specifically to help African founders prepare before meeting investors.".to_string();
    }

    // Blockchain / Web3
    if has_any(&toks, &["blockchain", "block", "web3", "stellar", "soroban", "solidity", "ethereum", "crypto", "defi", "token"]) {
        return "Blockchain is central to Alouzious's work. He is the Stellar Ambassador for Uganda and has introduced hundreds of Ugandans to the technology. He builds with Stellar and Soroban smart contracts, and also works with Solidity and Ethereum-compatible chains. His Stellar IDE project lets anyone build Soroban contracts straight from the browser, and SenteChain is his latest Web3 project.".to_string();
    }

    // HomeLabUG
    if has_any(&toks, &["homelab", "health", "nurse", "diagnos", "homelabug"]) {
        return "HomeLabUG is one of Alouzious's most impactful projects. It is a home-based diagnostic lab testing platform for South Western Uganda. You book online, a verified nurse comes to your door, collects the sample, and sends your results digitally to your phone. No travel, no queue, no paper. It is live at homelabug.vercel.app and built with React, Node.js, PostgreSQL, MTN MoMo, and Africa's Talking.".to_string();
    }

    // PerfectAI
    if has_any(&toks, &["perfect", "pitch", "deck", "investor", "founder"]) {
        return "PerfectAI is an AI tool Alouzious built to analyse and refine student pitch decks with real-time feedback. It is designed to help early-stage founders, especially in Africa, communicate their ideas clearly before stepping in front of investors. It is built with Python, Streamlit, and LLMs, and the code is on GitHub at github.com/Alouzious/appperfect.".to_string();
    }

    // Stellar IDE
    if has_any(&toks, &["stellar", "ide", "soroban", "stellaride"]) {
        return "Stellar IDE is one of Alouzious's flagship projects. It is a browser-based IDE for writing, testing, and deploying Soroban smart contracts on the Stellar blockchain. You do not need any local setup at all, just open a browser and start building. It is built with TypeScript and the Stellar and Soroban stack.".to_string();
    }

    // SenteChain
    if has_any(&toks, &["sente", "sentechain"]) {
        return "SenteChain is Alouzious's most recent blockchain project, active as of April 2026. It is a JavaScript-based Web3 project. You can find it on his GitHub at github.com/Alouzious/SenteChain for more details.".to_string();
    }

    // Experience / roles
    if has_any(&toks, &["experi", "job", "career", "role", "work", "ambassad", "leader", "indabax", "zindua", "beta"]) {
        return "Alouzious works as an Engineer at Beta Tech Labs, which is Uganda's AI and Blockchain Hub. He is also the Stellar Ambassador for Uganda, leading the Stellar East Africa community, the Technical Lead of the IndabaX Kabale AI Club at Kabale University, and a Zindua Ambassador for East Africa. He is doing all of this while completing his BSc in Computer Science.".to_string();
    }

    // Location / background
    if has_any(&toks, &["where", "from", "locat", "kabale", "uganda", "africa", "live"]) {
        return "Alouzious is based in Kabale, Western Uganda. He studies at Kabale University and is deeply rooted in the local tech community there. His work at Beta Tech Labs and his Stellar ambassadorship extend his reach across all of East Africa.".to_string();
    }

    // Education
    if has_any(&toks, &["univers", "study", "student", "degree", "bsc", "kabale", "school"]) {
        return "Alouzious is studying BSc Computer Science at Kabale University from 2024 to 2027. While studying, he is also working as an engineer, leading community clubs, and shipping real products. He is the Technical Lead of the IndabaX Kabale AI Club on campus.".to_string();
    }

    // Credentials / achievements
    if has_any(&toks, &["certif", "credential", "award", "achiev", "github", "contribut"]) {
        return "Alouzious has 437 GitHub contributions in the last year, is a GitHub Pro user, and has earned the Pair Extraordinaire achievement. He holds certifications in cloud development, blockchain, and full-stack engineering. He has 63 public repositories and is an active speaker in the Kabale tech ecosystem.".to_string();
    }

    // Research / lab
    if has_any(&toks, &["research", "lab", "reading", "book", "learn", "zeroknow", "distribut"]) {
        return "In his personal lab, Alouzious explores LLMs in production, zero-knowledge proofs, distributed system patterns, and Rust systems programming. He is also an avid reader, currently into books on data-intensive applications and distributed systems.".to_string();
    }

    // Default - always helpful and on-topic
    "I am here to tell you all about Alouzious Muhereza. You can ask me about his projects like HomeLabUG, Stellar IDE, or PerfectAI, his tech skills in Rust, React, AI, and blockchain, his roles as Stellar Ambassador and engineer, how to contact him, or anything else about his background. What would you like to know?".to_string()
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

    let model = env::var("GROQ_MODEL").unwrap_or_else(|_| "llama-3.3-70b-versatile".to_string());

    let request_body = GroqRequest {
        model,
        messages,
        max_tokens: 600,
        temperature: 0.65,
    };

    let response = client
        .post("https://api.groq.com/openai/v1/chat/completions")
        .bearer_auth(api_key)
        .json(&request_body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        let status = response.status();
        let body = response.text().await.unwrap_or_default();
        return Err(format!("Groq API error {}: {}", status, body));
    }

    let body: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;

    let raw_reply = body["choices"][0]["message"]["content"]
        .as_str()
        .unwrap_or("I could not generate a response. Please try again.")
        .to_string();

    // Strip markdown symbols from LLM response
    let clean_reply = strip_markdown(&raw_reply);

    Ok(clean_reply)
}

/// Remove common markdown symbols from LLM output so text is plain and natural
fn strip_markdown(text: &str) -> String {
    let mut result = String::with_capacity(text.len());
    let mut chars = text.chars().peekable();

    while let Some(c) = chars.next() {
        match c {
            // Remove bold/italic markers: ** and *
            '*' => {
                if chars.peek() == Some(&'*') {
                    chars.next(); // skip second *
                }
                // just skip the * entirely
            }
            // Remove heading markers at line start
            '#' => {
                // skip all # characters
                while chars.peek() == Some(&'#') {
                    chars.next();
                }
                // skip the space after #
                if chars.peek() == Some(&' ') {
                    chars.next();
                }
            }
            // Convert bullet list markers to plain text
            '-' => {
                // Only strip if it looks like a list item (preceded by newline/start)
                let last = result.chars().last();
                if last == Some('\n') || last.is_none() {
                    // skip the dash and optional space
                    if chars.peek() == Some(&' ') {
                        chars.next();
                    }
                } else {
                    result.push(c);
                }
            }
            // Remove backticks
            '`' => {
                if chars.peek() == Some(&'`') {
                    chars.next();
                    if chars.peek() == Some(&'`') {
                        chars.next();
                    }
                }
                // skip single backtick
            }
            // Remove underscores used for emphasis
            '_' => {
                if chars.peek() == Some(&'_') {
                    chars.next();
                }
                // skip
            }
            // Remove bracket/link syntax [text](url) — keep text, drop url
            '[' => {
                // collect link text
                let mut link_text = String::new();
                while let Some(&nc) = chars.peek() {
                    if nc == ']' {
                        chars.next();
                        break;
                    }
                    link_text.push(chars.next().unwrap());
                }
                // skip (url) part if present
                if chars.peek() == Some(&'(') {
                    chars.next();
                    while let Some(&nc) = chars.peek() {
                        if nc == ')' {
                            chars.next();
                            break;
                        }
                        chars.next();
                    }
                }
                result.push_str(&link_text);
            }
            other => result.push(other),
        }
    }

    // Clean up multiple blank lines into a single line break
    let mut cleaned = String::new();
    let mut prev_empty = false;
    for line in result.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            if !prev_empty {
                cleaned.push('\n');
            }
            prev_empty = true;
        } else {
            cleaned.push_str(trimmed);
            cleaned.push('\n');
            prev_empty = false;
        }
    }

    cleaned.trim().to_string()
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
                    eprintln!("Groq API error (falling back to keyword): {}", e);
                }
            }
        }
    }

    // Fallback: smarter keyword-based response
    let reply = keyword_response(&message);
    HttpResponse::Ok().json(json!({ "reply": reply }))
}

pub fn chat_routes(cfg: &mut web::ServiceConfig) {
    cfg.route("/chat", web::post().to(chat_handler));
}