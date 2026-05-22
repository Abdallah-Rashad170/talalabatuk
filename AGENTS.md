# AI Agent Guidance for طلباتك مكانك

## Purpose
This repository uses a static frontend and a Node.js/Express backend.
AI agents should focus on backend implementation, database setup, API routing, and project documentation.

## Recommended agent
- `Backend Developer Assistant` — defined in `.github/agents/backend-development.agent.md`
- Use this agent for work in `backend/**`, `database/**`, `README.md`, and `PROJECT-DOCS.md`.

## Key areas
- `backend/app.js` — Express setup, static asset serving, CORS, rate limiting, API fallback
- `backend/server.js` — environment loading, HTTP server, Socket.IO initialization
- `backend/src/routes` — route definitions and API wiring
- `backend/src/controllers` — request handlers for auth, customers, orders, payments, restaurants, riders, reports, dashboard
- `backend/src/middleware` — authentication, validation, role checks
- `backend/src/config/database.js` — MySQL connection pool configuration
- `backend/src/services/socketService.js` — WebSocket/socket.io setup
- `backend/src/utils` — shared helpers and validators
- `backend/.env.example` — required environment variables
- `database/schema.sql` — database schema definition

## Project conventions
- The frontend is currently static HTML in `index.html` and `admin-dashboard.html`.
- Do not assume a React, Vue, or Angular frontend exists.
- APIs are mounted under `/api`; non-API routes are served by `index.html`.
- The backend uses rate limiting on `/api` and serves static files from the repository root.
- Docker Compose is the supported local MySQL setup using `docker compose -p talabatk up -d`.

## Common commands
- `npm run backend:dev` — start backend from repository root
- `npm run backend:install` — install backend dependencies
- `npm run docker:up` / `npm run docker:down` — manage the local MySQL container

## Documentation sources
- `README.md` — startup and architecture overview
- `PROJECT-DOCS.md` — current project status and notes

## When to create more customization
- Add a separate skill or agent if you introduce a new frontend framework or a distinct mobile/web client.
- Add a hook or instruction file for deployment, database seeding, or API contract work if the repo grows.
