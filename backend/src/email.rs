// src/email.rs
use lettre::{
    message::{header, Mailbox, Message},
    transport::smtp::authentication::Credentials,
    SmtpTransport, Transport,
};
use std::env;

pub async fn send_email(name: &str, from_email: &str, message_body: &str) -> Result<(), String> {
    let smtp_username = env::var("SMTP_USERNAME").expect("SMTP_USERNAME must be set");
    let smtp_password = env::var("SMTP_PASSWORD").expect("SMTP_PASSWORD must be set");
    let to_email = env::var("CONTACT_RECEIVER_EMAIL").expect("CONTACT_RECEIVER_EMAIL must be set");

    let email = Message::builder()
        .from(
            from_email
                .parse::<Mailbox>()
                .unwrap_or_else(|_| Mailbox::new(None, smtp_username.parse().unwrap())),
        )
        .reply_to(from_email.parse::<Mailbox>().unwrap())
        .to(to_email.parse::<Mailbox>().unwrap())
        .subject(format!("📬 New message from {} via Portfolio", name))
        .header(header::ContentType::TEXT_PLAIN)
        .body(format!(
            "Name: {}\nEmail: {}\n\nMessage:\n{}",
            name, from_email, message_body
        ))
        .map_err(|e| e.to_string())?;

    let creds = Credentials::new(smtp_username.clone(), smtp_password.clone());

    let mailer = SmtpTransport::relay("smtp.gmail.com")
        .map_err(|e| e.to_string())?
        .credentials(creds)
        .build();

    mailer
        .send(&email)
        .map_err(|e| format!("Failed to send email: {}", e))?;

    Ok(())
}