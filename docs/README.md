# Documentation Index

This directory records the architecture, contracts, trade-offs and operating assumptions for the URL shortener.

## Architecture

- [architecture/01-system-overview.md](architecture/01-system-overview.md) — requirements and high-level design
- [architecture/02-component-design.md](architecture/02-component-design.md) — responsibilities of each component
- [architecture/03-request-flows.md](architecture/03-request-flows.md) — end-to-end flows
- [architecture/04-api-gateway.md](architecture/04-api-gateway.md) — gateway design
- [architecture/05-load-balancer.md](architecture/05-load-balancer.md) — custom load-balancer design

## API

- [api/01-api-contracts.md](api/01-api-contracts.md) — HTTP endpoints and payloads
- [api/02-authentication.md](api/02-authentication.md) — authentication flows
- [api/03-error-model.md](api/03-error-model.md) — consistent errors

## Database

- [database/01-schema.md](database/01-schema.md) — PostgreSQL schema
- [database/02-indexing.md](database/02-indexing.md) — indexes and query patterns
- [database/03-migrations.md](database/03-migrations.md) — Alembic migration process

## Security

- [security/01-security-model.md](security/01-security-model.md) — threat model
- [security/02-jwt.md](security/02-jwt.md) — token design
- [security/03-rate-limiting.md](security/03-rate-limiting.md) — rate-limiting design

## Scaling

- [scaling/01-capacity-estimation.md](scaling/01-capacity-estimation.md) — capacity assumptions
- [scaling/02-caching-strategy.md](scaling/02-caching-strategy.md) — cache design
- [scaling/03-scaling-strategy.md](scaling/03-scaling-strategy.md) — evolution path

## Operations

- [operations/01-deployment.md](operations/01-deployment.md) — Vercel, Neon and local deployment
- [operations/02-observability.md](operations/02-observability.md) — logs and metrics
- [operations/03-failure-scenarios.md](operations/03-failure-scenarios.md) — expected failures and behavior

## Architecture Decision Records

ADRs record decisions that should remain understandable months later. Each ADR describes context, decision, alternatives and consequences.

- [decisions/ADR-001-monorepo.md](decisions/ADR-001-monorepo.md)
- [decisions/ADR-002-neon-postgresql.md](decisions/ADR-002-neon-postgresql.md)
- [decisions/ADR-003-vercel-deployment.md](decisions/ADR-003-vercel-deployment.md)
- [decisions/ADR-004-short-code-generation.md](decisions/ADR-004-short-code-generation.md)
