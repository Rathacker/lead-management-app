# Lead Manager

A small full-stack web app for managing sales leads: CRUD, a dashboard with
status breakdowns, search/filter, pipeline reports, and per-user settings.

> **📖 Live API documentation (Swagger UI):** https://rathacker.github.io/lead-management-app/
> **▶️ Run locally (no build):** `docker compose -f docker-compose.prod.yml up -d` → app at http://localhost:5173 · API at http://localhost:4000
> **🔑 Login:** `admin@example.com` / `12345`

- **Frontend:** React + TypeScript (Vite), [Mantine](https://mantine.dev) UI, [Recharts](https://recharts.org) for report charts.
- **Backend:** Node.js + Express + TypeScript, [Prisma](https://www.prisma.io) ORM.
- **Database:** PostgreSQL.
- **Auth:** JWT (single seeded user).
- **API docs:** Swagger UI at `/api-docs`.

All aggregations (dashboard counts, report KPIs, leads-by-source) and list
pagination are computed **server-side in PostgreSQL** — the browser never
aggregates. User settings (theme, rows-per-page, avatars, delete-confirm) are
persisted to the database.

---

## One-line start (no clone, no build)

With only **Docker Desktop** installed, this single command fetches the compose
file and launches everything (Postgres + API + frontend) from published, public
images — no repository checkout required:

**macOS / Linux**
```bash
curl -sSL https://raw.githubusercontent.com/Rathacker/lead-management-app/main/docker-compose.prod.yml | docker compose -f - up -d
```

**Windows (PowerShell)**
```powershell
curl.exe -sSL -o lead-manager.yml https://raw.githubusercontent.com/Rathacker/lead-management-app/main/docker-compose.prod.yml; docker compose -f lead-manager.yml up -d
```

Wait ~15 seconds (first boot runs migrations + seeding), then open
**http://localhost:5173** and log in with `admin@example.com` / `12345`.

To stop: `docker compose -f lead-manager.yml down` (add `-v` to also remove the database).

### Or, from a cloned repo

```bash
docker compose -f docker-compose.prod.yml up -d      # pre-built images, no build
```

## Quick start (build from source)

Requires Docker Desktop.

```bash
cd lead-management-app
docker compose up -d --build
```

This starts three containers and, on the server, automatically runs
`prisma migrate deploy`, seeds an admin user + 10 sample leads, then serves the API.

| Service  | URL                              |
| -------- | -------------------------------- |
| Web app  | http://localhost:5173            |
| API      | http://localhost:4000            |
| Swagger  | http://localhost:4000/api-docs   |
| Postgres | localhost:5432                   |

**Login:** `admin@example.com` / `12345`

Stop with `docker compose down` (add `-v` to also drop the database volume).

---

## Manual setup (without Docker)

Requires Node 20+ and a running PostgreSQL instance.

### 1. Backend

```bash
cd server
cp .env.example .env          # edit DATABASE_URL / JWT_SECRET as needed
npm install
npx prisma migrate deploy     # apply schema
npm run seed                  # seed admin user + sample leads
npm run dev                   # http://localhost:4000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev                   # http://localhost:5173
```

The client talks to `http://localhost:4000/api` by default. Override with a
`VITE_API_URL` env var at build/dev time if the API is elsewhere.

---

## Environment variables (server)

| Variable             | Purpose                              | Default (compose)                |
| -------------------- | ------------------------------------ | -------------------------------- |
| `DATABASE_URL`       | PostgreSQL connection string         | points at the `db` service       |
| `JWT_SECRET`         | Secret used to sign JWTs             | dev value — change in production |
| `JWT_EXPIRES_IN`     | Token lifetime                       | `8h`                             |
| `PORT`               | API port                             | `4000`                           |
| `CORS_ORIGIN`        | Allowed browser origin               | `http://localhost:5173`          |
| `SEED_USER_EMAIL`    | Seeded login email                   | `admin@example.com`              |
| `SEED_USER_PASSWORD` | Seeded login password                | `12345`                      |

---

## API overview

All `/api/leads` and `/api/settings` routes require `Authorization: Bearer <token>`.

| Method | Path                   | Description                                             |
| ------ | ---------------------- | ------------------------------------------------------ |
| POST   | `/api/auth/login`      | Exchange credentials for a JWT                         |
| GET    | `/api/leads`           | List leads — `search`, `status`, `page`, `pageSize`    |
| POST   | `/api/leads`           | Create a lead                                          |
| GET    | `/api/leads/:id`       | Get one lead                                           |
| PUT    | `/api/leads/:id`       | Update a lead (partial)                                |
| DELETE | `/api/leads/:id`       | Delete a lead                                          |
| GET    | `/api/leads/dashboard` | Total + per-status counts (DB-computed)                |
| GET    | `/api/leads/reports`   | Pipeline KPIs + by-status + by-source (DB-computed)    |
| GET    | `/api/settings`        | Current user's settings                                |
| PUT    | `/api/settings`        | Update settings                                        |

`GET /api/leads` returns a paginated envelope:

```json
{ "data": [ ... ], "total": 10, "page": 1, "pageSize": 5, "totalPages": 2 }
```

Full interactive documentation (with schemas and a "Try it out" panel) is served
at **`/api-docs`** (Swagger UI).

A **Postman collection** is also included at
[`docs/Lead-Manager.postman_collection.json`](docs/Lead-Manager.postman_collection.json).
Import it, run **Auth → Login** first (it captures the JWT into a collection
variable), then every other request is authenticated automatically.

---

## Project structure

```
lead-management-app/
├─ docker-compose.yml
├─ server/                 # Express + Prisma API
│  ├─ prisma/
│  │  ├─ schema.prisma     # data model
│  │  ├─ migrations/       # SQL migrations (source of truth for the schema)
│  │  └─ seed.ts           # admin user + 10 sample leads
│  └─ src/
│     ├─ index.ts          # app bootstrap + Swagger
│     ├─ middleware/auth.ts # JWT verification
│     └─ routes/           # auth, leads, settings
└─ client/                 # React + Mantine SPA
   └─ src/
      ├─ api/              # typed service layer over axios
      ├─ hooks/            # useLeads, useReports, useDebounce
      ├─ context/          # Auth, Settings (DB-backed), toast
      ├─ constants/        # theme + status/colour tokens
      ├─ components/
      │  ├─ form/          # JSON-schema-driven FormBuilder + field registry
      │  ├─ layout/        # Mantine AppShell + nav
      │  └─ leads/         # table, toolbar, stat cards, drawer, dialogs
      └─ pages/            # Login, Leads, Reports, Settings
```

See [docs/DATABASE.md](docs/DATABASE.md) for the database schema.
