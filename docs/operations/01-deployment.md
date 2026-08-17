# Deployment and Local Setup

## Frontend

The frontend is React + TanStack Start + Vite + TypeScript, run with [Bun](https://bun.sh) as the only JavaScript runtime/package manager.

```bash
cd apps/frontend
bun install
bun run dev
```

TanStack Start builds an SSR server bundle (via Nitro) rather than plain static assets, so deployment must target a Node-compatible Vercel runtime rather than a static-only Vercel project.

### Frontend environment

Example:

```
VITE_API_BASE_URL=https://gateway.example.vercel.app
```

Anything prefixed with `VITE_` is available to browser code and must never contain secrets.

## Gateway

Deploy the FastAPI gateway as its own Vercel project/root directory if using separate deployments. Configure backend origin URLs using server-side environment variables.

Example conceptual variables:

```
BACKEND_URLS=https://backend-a...,https://backend-b...
JWT_SECRET=...
UPSTREAM_TIMEOUT_SECONDS=...
```

## Backend

Deploy one or more logical backend origins depending on the experiment. All backend instances use the same application code and Neon database.

## Neon

Store the database connection URL only in server-side environment variables.

```
DATABASE_URL=postgresql+...://...
```

Use an appropriate SQLAlchemy driver and Neon-compatible connection configuration.

## Local workflow

Typical process:

```
frontend: bun run dev
 gateway: uvicorn app.main:app --port 8000
backend1: uvicorn app.main:app --port 8001
backend2: uvicorn app.main:app --port 8002
backend3: uvicorn app.main:app --port 8003
```

Docker Compose can replace the manual backend processes when testing load balancing.

## CORS

During local development allow the known Vite dev server origin, normally `http://localhost:3000`. In deployed environments allow only the intended frontend origin(s).

## Migration deployment

Run Alembic migrations explicitly; do not make every serverless request race to migrate the database.
