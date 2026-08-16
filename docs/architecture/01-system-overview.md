# System Overview

## Purpose

Build a URL-shortening platform that converts a long URL into a compact short URL and redirects visitors efficiently while providing authentication, ownership, expiration and basic analytics.

The project deliberately implements several infrastructure concepts at the application layer for learning: API gateway behavior, load balancing, health checks, rate limiting and circuit breaking.

## Functional requirements

### Must have

- Register and authenticate users.
- Create a short URL from a valid HTTP/HTTPS URL.
- Resolve a short code and redirect to the original URL.
- List URLs owned by the authenticated user.
- Disable or delete an owned URL.
- Optional expiration time.
- Health endpoints for backend instances.

### Later

- Custom aliases.
- Click analytics.
- Referrer and user-agent metadata.
- URL expiration jobs or lazy expiration.
- Cache layer.
- Abuse detection.

## Non-functional requirements

- Redirect latency should be low.
- Short codes must be unique.
- Backend instances should be stateless where possible.
- A failed backend instance should stop receiving traffic from the custom gateway.
- Database credentials and JWT secrets must never be exposed to the browser.
- The project must remain deployable using free-tier-friendly services.

## High-level architecture

```
React + Vite SPA
       |
       v
FastAPI API Gateway
       |
       +---- auth/rate-limit/request-id
       |
       v
Application Load Balancer
       |
   +---+---+
   |       |
Backend A Backend B ...
   |       |
   +---+---+
       |
       v
Neon PostgreSQL
```

## Important platform boundary

Vercel provides deployment, runtime scheduling and infrastructure-level request handling. Therefore, the custom load balancer in this repository is an application-level learning component. It chooses among configured backend deployments or local backend instances; it does not replace Vercel's physical network load balancing.

## Read/write characteristics

A mature URL shortener is usually read-heavy because redirects occur more frequently than URL creation. This influences indexing and future caching choices.

## Consistency

Creation requires strong uniqueness for the selected short code. Redirect reads may eventually tolerate cache staleness for a very short period, but disabled or security-sensitive links may require cache invalidation.

## Availability target

For this free-tier project, no formal SLA is promised. The architecture should nevertheless demonstrate graceful failure, health checks, timeouts and observable errors.
