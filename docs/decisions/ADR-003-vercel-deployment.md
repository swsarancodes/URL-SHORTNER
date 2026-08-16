# ADR-003: Deploy on Vercel

## Status

Accepted for the project.

## Context

The project is constrained to free-tier resources and needs public deployment for the Vite frontend and FastAPI components.

## Decision

Use Vercel for frontend, gateway and backend deployments where compatible with the current runtime requirements.

## Consequences

- Vite frontend is deployed as static assets.
- Python services run in Vercel-managed serverless infrastructure.
- Process-local state is ephemeral and not globally shared.
- Our custom load balancer is application-level, not an infrastructure replacement for Vercel routing.
- Background daemons and permanent health-check loops cannot be assumed to behave like a traditional VM service.

## Alternatives

- paid VM/container platforms;
- managed cloud API gateway/load balancer products;
- local-only deployment.

These alternatives conflict with the current free-tier/learning goals.
