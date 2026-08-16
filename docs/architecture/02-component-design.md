# Component Design

## Frontend — React + Vite

**Responsibilities:**

- Render authentication and URL-management interfaces.
- Store short-lived access-token state safely in application memory where practical.
- Call only the API gateway, not backend instances directly.
- Handle 401 responses and refresh/login flows.
- Display created URLs and analytics returned by APIs.

The frontend is a static SPA. It must not contain database credentials, JWT signing secrets or backend service secrets. Vite variables exposed to browser code use the `VITE_` prefix and therefore must be treated as public configuration.

## API Gateway — FastAPI

**Responsibilities:**

- Single public API entry point.
- Generate or propagate request IDs.
- Validate authentication where appropriate.
- Apply rate-limit policies.
- Select healthy backend targets.
- Forward method, path, query parameters, safe headers and body.
- Enforce upstream timeout.
- Normalize gateway errors.
- Emit structured logs.

The gateway should not own URL-shortening business rules.

## Backend — FastAPI

**Responsibilities:**

- Auth business logic.
- URL creation and ownership.
- Short-code generation.
- Redirect lookup.
- Persistence through repositories.
- Health endpoint.
- Analytics persistence when introduced.

The backend follows a layered structure:

```
routes -> services -> repositories -> database
          |
          +-> utility/domain functions
```

## Database — Neon PostgreSQL

**Responsibilities:**

- Durable user data.
- Durable URL mappings.
- Refresh-token state where used.
- Click-event records when analytics is enabled.

## Shared packages

Shared Python code should contain genuinely shared constants, error types or contracts. Avoid making the shared package a dumping ground that tightly couples the gateway and backend.

## Local infrastructure

Docker Compose can run multiple backend containers so the custom load balancer can be tested realistically. For example:

```
gateway:8000
backend-1:8001
backend-2:8002
backend-3:8003
```

All instances can point to the same Neon database during development.
