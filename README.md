# CRM Application — .NET 10 + React 19 + PostgreSQL

## Architecture Overview

Clean Architecture with Docker-based deployment.

```
crm/
├── CRM.Api/              # Presentation Layer — Controllers, Middleware, Dockerfile
├── CRM.Application/      # Application Layer — Command Handlers, DTOs
├── CRM.Domain/           # Domain Layer — Entities, Enums, Business Rules
├── CRM.Infrastructure/   # Infrastructure Layer — EF Core, Repositories
├── CRM.Web/              # Frontend — React 19 TypeScript, Dockerfile
├── CRM.Database/         # Raw SQL schema scripts (PostgreSQL)
├── docker/db-init/       # DB initialization shell script
└── nginx/                # Reverse proxy config (production)
```

**Dependency flow:** `Api → Application → Domain ← Infrastructure`

---

## Quick Start

### Prerequisites
- Docker Desktop
- `.env` file in the project root (see below)

### 1. Create the environment file

```bash
cp .env.example .env   # then fill in the values
```

### 2. Start Docker

```bash
# Development (docker-compose.override.yml is auto-merged)
docker compose up -d

# Production (VPS — without override.yml)
docker compose up -d
```

### 3. Access the application

| Service | URL |
|---------|-----|
| Frontend | `http://localhost` |
| API Swagger | `http://localhost/api/swagger/index.html` |

---

## Development (Local — dotnet run)

Run the DB in Docker and the API on the host for hot reload:

```bash
# Start infrastructure (DB + frontend)
docker compose up -d

# Run API on host (override.yml exposes DB on localhost:5432)
dotnet run --project CRM.Api
```

`EnvFileLoader` loads the root `.env` at startup. Variables already set in the process (Docker-injected) are never overwritten.

API: `http://localhost:5000` — Swagger: `http://localhost:5000/swagger/index.html`

### Frontend development

```bash
cd CRM.Web
npm run dev       # Dev server on http://localhost:5500 — reads CRM.Web/.env
npm run build     # Production build
npm run lint      # ESLint (max-warnings 0)
```

---

## Environment Files

All sensitive configuration lives in two gitignored `.env` files — never in `appsettings.json`.

| File | Purpose |
|------|---------|
| `.env` | Single source of truth for Docker Compose and the API's `EnvFileLoader` |
| `CRM.Web/.env` | Frontend-only vars read by Vite during `npm run dev` |

### Key variables

| Variable | Description |
|----------|-------------|
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `ConnectionStrings__DefaultConnection` | Full DB connection string |
| `Jwt__Key` | JWT signing key (min 32 chars) |
| `DefaultValues__Admin_User_Password` | Initial admin password |
| `VITE_AZURE_CLIENT_ID` | Azure AD client ID |
| `VITE_AZURE_TENANT_ID` | Azure AD tenant ID |
| `ELASTIC_PASSWORD` | Elasticsearch `elastic` user password (used when Elastic logging is enabled manually) |

> `ConnectionStrings__DefaultConnection` in `.env` uses `Host=localhost` for `dotnet run`.
> Docker Compose overrides this at the service level to `Host=db` (internal service name).

### How the app loads config

```
dotnet run          → EnvFileLoader reads .env from project root
                      (process env vars set by Docker take precedence)

docker compose up   → .env is auto-loaded by Docker Compose for variable
                      interpolation (${VAR}) and injected into containers
                      via env_file: .env
```

---

## Docker Environments

### Local dev (`docker-compose.override.yml` auto-merged)

`docker-compose.override.yml` is automatically merged when both files exist. It:
- Exposes `localhost:5432` so `dotnet run` from the host can reach the DB
- Sets `ASPNETCORE_ENVIRONMENT: Development` for the API container
- Sets `VITE_ENVIRONMENT: development` build arg for the frontend

```bash
docker compose up -d
```

### Production VPS (only `docker-compose.yml`)

Do NOT copy `docker-compose.override.yml` to the VPS. Without it, the DB has no exposed ports.
Update `.env` with production values before deploying.

```bash
docker compose up -d
```

### Useful commands

```bash
docker compose logs -f api                  # Stream API logs
docker compose up -d --build api            # Rebuild API
docker compose up -d --build frontend       # Rebuild frontend
docker compose ps                           # Service status
docker compose down                         # Stop (volumes preserved)
docker compose down -v                      # Stop + delete volumes (DB wiped!)
```

---

## Network Isolation

| Network | Services | External access |
|---------|----------|-----------------|
| `app_net` | nginx, frontend, api | Yes (via nginx :80) |
| `db_net` | api, db | No (internal) |

PostgreSQL has no published ports in production — fully isolated inside Docker networks.

> **Elasticsearch / Kibana:** Removed from the default compose setup. Use `docker-compose-elastic.yml` as reference if you want to run them manually alongside the stack.

---

## Logging

Serilog writes structured logs via three optional sinks, all controlled by `appsettings.json` / `.env` overrides:

| Sink | Config key | Default |
|------|-----------|---------|
| Console | — | always on |
| File (rolling daily) | `Logging:File:Enabled` | `true` |
| PostgreSQL (`app_log` table) | `Logging:Database:Enabled` | `true` |
| Elasticsearch | `Logging:Elastic:Enabled` | `false` |

**MinimumLevel options:** `Verbose` · `Debug` · `Information` · `Warning` · `Error` · `Fatal`

**File logs** roll daily to `logs/crm-api-YYYYMMDD.log` (31-day retention). In Docker they are persisted in the `api_logs` named volume at `/app/logs` inside the container.

**Elasticsearch** is disabled by default. To enable, point a running ES instance and set:
```
Logging__Elastic__Enabled=true
Logging__Elastic__Url=http://<your-es-host>:9200
```
See `docker-compose-elastic.yml` for the full Elastic + Kibana Docker setup.

---

## Database

Schema managed via raw SQL scripts in `CRM.Database/`. On first container start, `docker/db-init/01-init.sh` runs scripts in dependency order:

```
Identity.sql → Contact.sql → Lead.sql → products.sql → Account.sql → opportunities.sql → Activity.sql → Logs.sql
```

Seed data (created by `DbInitializerHostedService` on API startup):
1. Default Organization (HQ — Headquarters)
2. Personal Role (user-level access)
3. Manager Role (organizational access)
4. Administrator Role (full access)
5. Admin user (`admin` / configurable via `DefaultValues__Admin_User_Password`)

---

## Environment Summary

| | `dotnet run` | Docker (dev) | Docker (prod) |
|---|---|---|---|
| **Env file** | `.env` (root) | `.env` (root) | `.env` (root) |
| **Loaded by** | EnvFileLoader | docker-compose auto | docker-compose auto |
| **DB host** | `localhost` | `db` | `db` |
| **Swagger** | ✓ | ✗ | ✗ |
| **Log files** | `logs/` (local) | `api_logs` volume | `api_logs` volume |
