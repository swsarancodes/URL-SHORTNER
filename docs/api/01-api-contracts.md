# API Contracts

Base prefix for API endpoints: `/api/v1`.

## Authentication

### `POST /api/v1/auth/register`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "strong-password"
}
```

**Response 201:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "created_at": "2026-08-16T00:00:00Z"
}
```

### `POST /api/v1/auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "strong-password"
}
```

**Response 200:**

```json
{
  "access_token": "jwt",
  "token_type": "bearer",
  "expires_in": 900
}
```

Refresh-token transport will be finalized in the authentication document. Prefer an HttpOnly secure cookie for browser clients when the deployment model supports it.

### `POST /api/v1/auth/refresh`

Returns a new access token when the refresh credential is valid.

### `POST /api/v1/auth/logout`

Revokes or invalidates the active refresh session.

## URL management

### `POST /api/v1/urls`

Authentication required.

**Request:**

```json
{
  "original_url": "https://example.com/some/long/path",
  "custom_alias": null,
  "expires_at": null
}
```

**Response 201:**

```json
{
  "id": "uuid-or-id",
  "short_code": "aZ81K",
  "short_url": "https://sho.rt/aZ81K",
  "original_url": "https://example.com/some/long/path",
  "created_at": "2026-08-16T00:00:00Z",
  "expires_at": null,
  "is_active": true
}
```

### `GET /api/v1/urls`

Returns the authenticated user's URLs. Add cursor pagination before large datasets.

### `GET /api/v1/urls/{id}`

Returns an owned URL resource.

### `PATCH /api/v1/urls/{id}`

Allows explicitly supported mutable fields such as active state or expiration.

### `DELETE /api/v1/urls/{id}`

Prefer soft disable initially if analytics/history should be retained.

## Redirect

### `GET /{short_code}`

Public.

**Responses:**

- `302` when active mapping exists.
- `404` when code does not exist.
- `410` when a known mapping is expired or intentionally gone, if that distinction is exposed.

## Health

### `GET /health`

**Response:**

```json
{
  "status": "ok",
  "service": "backend"
}
```

Health endpoints should remain lightweight.
