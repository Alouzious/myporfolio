# Developer Portfolio Platform

A production-ready developer portfolio system with a public-facing portfolio site, admin dashboard, and Rust backend API.

## Architecture

| Component | Stack | Port |
|-----------|-------|------|
| **Backend** | Rust (Actix-web) + PostgreSQL | `8080` |
| **Frontend** | React 19 + Tailwind CSS 4 + Vite | `5173` |
| **Admin** | React 19 + Tailwind CSS 4 + Vite | `5174` |

## Quick Start

### Prerequisites

- [Rust](https://rustup.rs/) (1.70+)
- [Node.js](https://nodejs.org/) (18+)
- PostgreSQL database ([Neon](https://neon.tech/) recommended)

### 1. Database Setup (Neon PostgreSQL)

1. Create a free database at [neon.tech](https://neon.tech/)
2. Run the migration script to create tables:

```bash
psql "YOUR_NEON_CONNECTION_STRING" -f backend/migrations/001_init.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your actual values (database URL, JWT secret, etc.)
cargo run
```

The backend will start on `http://localhost:8080`.

### 3. Public Portfolio Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Opens at `http://localhost:5173`.

### 4. Admin Dashboard

```bash
cd admin-frontend
cp .env.example .env
npm install
npm run dev
```

Opens at `http://localhost:5174`. Default credentials are set via `ADMIN_USERNAME` and `ADMIN_PASSWORD` in the backend `.env`.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string (with `?sslmode=require`) | Yes |
| `PORT` | Server port (default: `8080`) | No |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | No |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `ADMIN_USERNAME` | Admin login username | Yes |
| `ADMIN_PASSWORD` | Admin login password | Yes |
| `SMTP_USERNAME` | Gmail address for sending contact notifications | No |
| `SMTP_PASSWORD` | Gmail app-specific password | No |
| `CONTACT_RECEIVER_EMAIL` | Email to receive contact form submissions | No |

### Frontend (`frontend/.env`) and Admin (`admin-frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8080` |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/login` | Admin login |
| `GET` | `/api/auth/verify` | Verify JWT token |
| `GET` | `/api/about` | Get about info |
| `POST` | `/api/about` | Update about info |
| `GET/POST` | `/api/skills` | List / create skills |
| `DELETE` | `/api/skills/:id` | Delete a skill |
| `GET/POST` | `/api/projects` | List / create projects |
| `DELETE` | `/api/projects/:id` | Delete a project |
| `GET/POST` | `/api/experience` | List / create experience |
| `DELETE` | `/api/experience/:id` | Delete experience |
| `GET/POST` | `/api/research` | List / create research |
| `DELETE` | `/api/research/:id` | Delete research |
| `GET/POST` | `/api/myreadings` | List / create readings |
| `DELETE` | `/api/myreadings/:id` | Delete a reading |
| `GET/POST` | `/api/achievements` | List / create achievements |
| `DELETE` | `/api/achievements/:id` | Delete an achievement |
| `GET/POST` | `/api/social-links` | List / create social links |
| `DELETE` | `/api/social-links/:id` | Delete a social link |
| `GET/POST` | `/api/contact` | List / submit contact messages |
| `DELETE` | `/api/contact/:id` | Delete a contact message |

## Deployment

### Backend on Render

1. Create a new **Web Service** on [Render](https://render.com/)
2. Connect the repository, set root directory to `backend`
3. **Build command:** `cargo build --release`
4. **Start command:** `./target/release/backend`
5. Add environment variables from `backend/.env.example`
6. Set `ALLOWED_ORIGINS` to your frontend/admin deployed URLs

### Database on Neon

1. Create a project at [neon.tech](https://neon.tech/)
2. Copy the connection string (ensure `?sslmode=require` is appended)
3. Run migration: `psql "CONNECTION_STRING" -f backend/migrations/001_init.sql`
4. Set `DATABASE_URL` in Render environment variables

### Frontends

Deploy as static sites on Vercel, Netlify, Render Static Site, or any static hosting:

**Frontend:**
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to your Render backend URL

**Admin:**
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to your Render backend URL

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── main.rs          # Server entry point
│   │   ├── db.rs            # Database connection
│   │   ├── auth.rs          # JWT authentication
│   │   ├── email.rs         # Email notifications
│   │   ├── models/          # Data models
│   │   └── routes/          # API route handlers
│   ├── migrations/          # SQL migration scripts
│   ├── Cargo.toml
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # UI sections (Hero, About, Skills, etc.)
│   │   ├── api.js           # API client
│   │   ├── App.jsx          # Main app
│   │   └── index.css        # Tailwind entry
│   └── .env.example
├── admin-frontend/
│   ├── src/
│   │   ├── pages/           # CRUD pages for each resource
│   │   ├── components/      # Layout, Sidebar, ProtectedRoute
│   │   ├── context/         # Auth context
│   │   ├── api.js           # API client with auth
│   │   ├── App.jsx          # Router setup
│   │   └── index.css        # Tailwind entry
│   └── .env.example
└── README.md
```
