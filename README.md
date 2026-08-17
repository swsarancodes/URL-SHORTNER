# URL Shortener

A production-minded URL shortener built as a learning-focused system design project using only free-tier friendly infrastructure.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React + TanStack Start + Vite + TypeScript (Bun runtime) |
| API Gateway | FastAPI |
| Backend | FastAPI |
| Authentication | JWT access tokens + refresh tokens |
| Database | Neon PostgreSQL |
| ORM | SQLAlchemy |
| Migrations | Alembic |
| Deployment | Vercel |
| Local multi-instance environment | Docker Compose |

## Goals

This repository is not intended to be only a CRUD application. It is designed to explore the architecture behind a URL-shortening system, including API gateway behavior, application-level load balancing, health checking, rate limiting, circuit breaking, short-code generation, database indexing, observability, caching strategy, failure handling, and scaling trade-offs.

## Repository layout

```
apps/
  frontend/        React + Vite SPA
  gateway/         FastAPI API gateway
  backend/         FastAPI URL-shortener backend
packages/
  shared_python/   Shared Python utilities
  shared_types/    Shared frontend types/contracts where useful
infra/
  docker/          Local Docker images
  scripts/         Local helper scripts
docs/              Architecture and engineering documentation
tests/
  integration/
  load/
```

## Initial request path

```
Browser
  -> Vercel static frontend
  -> FastAPI Gateway
  -> Backend instance selected by gateway
  -> Neon PostgreSQL
```

Vercel still provides the physical hosting, edge routing and serverless runtime. The custom gateway and load balancer in this project operate at the application layer so that the algorithms can be implemented, tested and discussed explicitly.

## Milestones

| Milestone | Scope |
| --- | --- |
| V0 | URL creation and redirect |
| V1 | Users, login and JWT authentication |
| V2 | API gateway and request routing |
| V3 | Multiple backend instances, round-robin balancing and health checks |
| V4 | Rate limiting, circuit breaker and request tracing |
| V5 | Analytics, cache abstraction and load testing |

## Local development

Install frontend dependencies with [Bun](https://bun.sh) (`cd apps/frontend && bun install && bun run dev`), install Python dependencies in the gateway and backend, configure `.env` files from their examples, then run the services locally.

## Documentation

Start with [docs/README.md](docs/README.md) and [docs/architecture/01-system-overview.md](docs/architecture/01-system-overview.md).
