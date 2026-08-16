# Request Flows

## Create short URL

```
Browser
  -> POST /api/v1/urls
Gateway
  -> request ID
  -> JWT validation
  -> rate-limit check
  -> select healthy backend
Backend
  -> validate URL
  -> generate short code
  -> insert mapping
Neon
  -> commit
Backend
  -> return URL object
Gateway
  -> return response
Browser
```

The database unique constraint on `short_code` is the final authority on uniqueness. If a generated code collides, generation may retry a small bounded number of times.

## Redirect

```
Browser
  -> GET /{short_code}
Gateway or redirect entry route
  -> backend
Backend
  -> lookup short_code
  -> verify active/not expired
  -> optional analytics event
  -> HTTP 302 Location: original_url
Browser
  -> destination
```

Use 302 initially because destination mappings may be editable/disabled and browsers/CDNs can cache 301 aggressively. A later design can introduce 301 selectively.

## Login

```
POST /api/v1/auth/login
  -> gateway
  -> backend
  -> fetch user by email
  -> verify password hash
  -> issue access token
  -> issue refresh token
  -> return auth result
```

## Refresh

```
POST /api/v1/auth/refresh
  -> validate refresh token
  -> verify token is not revoked/expired
  -> rotate token if rotation is enabled
  -> issue new access token
```

## Backend health

```
Gateway scheduler/checker
  -> GET backend-N /health
  -> success within timeout: healthy
  -> repeated failures: unhealthy
  -> successful recovery probes: healthy again
```
