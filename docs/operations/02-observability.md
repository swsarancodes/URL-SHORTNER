# Observability

## Structured logging

Prefer JSON-compatible structured fields rather than concatenated strings.

Useful fields:

```
timestamp
level
service
request_id
method
path
status_code
duration_ms
backend_target
user_id (when safe/needed)
error_code
```

## Request ID

The gateway creates a request ID when one is not already provided by a trusted boundary. The same ID is forwarded to the backend and returned in error responses.

## Metrics to track

**Gateway:**

- request count;
- latency;
- upstream latency;
- rate-limit rejects;
- healthy backend count;
- upstream timeout count.

**Backend:**

- URL creation count;
- redirect count;
- redirect lookup latency;
- not-found count;
- database error count.

**Database:**

- query latency;
- connection failures;
- storage growth.

## Free-tier approach

Begin with structured platform logs and small internal metrics. Do not add paid observability infrastructure merely to imitate production.

## Privacy

Avoid logging full destination URLs when they may contain sensitive query parameters. Consider logging URL IDs/short codes instead.
