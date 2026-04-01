# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (.NET)
```bash
cd CRM.Api && dotnet run          # Start API (http://localhost:5000, https://localhost:5001)
dotnet build                       # Build solution
dotnet test                        # Run tests
```
Swagger UI is available at `http://localhost:5000/swagger/index.html`.

### Frontend (React)
```bash
cd CRM.Web
npm run dev       # Start dev server on port 5500
npm run build     # Production build
npm run lint      # ESLint (max-warnings 0 — all warnings are errors)
npm run preview   # Preview production build
```

## Architecture

This is a **Clean Architecture** CRM application with an ASP.NET Core 10.0 backend and React 19 TypeScript frontend.

### Backend (`CRM.Api`, `CRM.Application`, `CRM.Domain`, `CRM.Infrastructure`)

**Dependency flow:** `Api → Application → Domain ← Infrastructure`

- **CRM.Domain** — Entities, enums, interfaces (`ISoftDeleteEntity`, `IAuditableEntity`), and domain-level authorization privilege definitions.
- **CRM.Application** — Command handler classes (one per module: `AccountCommandHandler`, `LeadCommandHandler`, `OpportunityCommandHandler`, `ContactCommandHandler`, `ActivityCommandHandler`, `AuditCommandHandler`, `DashboardStatsCommandHandler`, `ProductCommandHandler`, `UserCommandHandler`, `AuthenticationCommandHandler`). No MediatR — handlers are plain classes wired via DI.
- **CRM.Infrastructure** — EF Core `DatabaseContext`, repository implementations, entity type configurations, `IUnitOfWork`.
- **CRM.Api** — Controllers, middleware (`LoggingMiddleware`, authorization middleware), DI configuration in `Configuration/DependencyInjection.cs`, FluentValidation validators.

**Auth:** JWT Bearer tokens with a refresh token mechanism. Microsoft Azure AD login is supported via Microsoft Graph API (`IMicrosoftGraphService`). Session state is managed by `ISessionService`. Privilege-based authorization is defined in `CRM.Domain/Authorization/`.

**Data:** PostgreSQL via EF Core 10. Entities support soft delete and audit tracking. Migrations/seeds live in `CRM.Database/`.

**Logging:** Serilog with console and optional Elasticsearch sinks.

### Frontend (`CRM.Web/src/`)

**State management:** Zustand stores (with `persist` to localStorage) in `stores/`. One store per entity module: `auth.store.ts`, `lead.store.ts`, `account.store.ts`, `contact.store.ts`, `opportunity.store.ts`, `activity.store.ts`, `process.state.store.ts`.

**API layer:**
- `services/api.client.ts` — Axios instance base configuration.
- `services/api.request.ts` — Wrapper that intercepts 401 responses, auto-refreshes the JWT, and retries the original request.
- `services/*.service.ts` — One service file per module, used by Zustand stores.
- Endpoint paths are centralized in `config/service.paths.ts`; route paths in `config/route.paths.ts`.

**Routing:** React Router v7 with feature-based route files in `routes/` (e.g., `lead.routes.tsx`, `account.routes.tsx`). `ProtectedRoute` guards authenticated pages.

**Module structure (pages/):** Each business module (`lead/`, `account/`, `contact/`, `opportunity/`, `activity/`) contains List, Create, Edit, and Detail page components.

**UI:** Ant Design 6 components throughout. Layout wrappers: `GlobalLayout`, `ContentLayout`, `DetailPageLayout`, `ListPageLayout`. Reusable components include `AuditCard`, `LoadingModal`, `UserPanel`, `EntityLookup`.

**Auth (frontend):** MSAL (`@azure/msal-browser`/`@azure/msal-react`) for Azure AD. MSAL config in `config/msal.config.ts`. Tokens stored via Zustand persist.

### Business Modules
Leads, Accounts, Contacts, Opportunities, Activities (Email / PhoneCall / Task / Appointment), Products, Users, Audit. All entity modules support CRUD, search, assignment, state transitions, and audit history.

### Environment Variables (Frontend)
Configured via `.env.development` / `.env.production`:
- `VITE_API_BASE_URL` — Backend API URL
- `VITE_AZURE_CLIENT_ID` — Azure AD client ID
- `VITE_AZURE_TENANT_ID` — Azure AD tenant ID

### Backend Configuration (`appsettings.json`)
Key sections: `ConnectionStrings` (PostgreSQL), `Jwt` (key/issuer/audience/expiry), `Serilog`, `Elasticsearch`.
