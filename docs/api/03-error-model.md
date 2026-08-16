# Error Model

All APIs should return a predictable JSON error shape.

## Format

```json
{
  "error": {
    "code": "URL_NOT_FOUND",
    "message": "Short URL was not found.",
    "request_id": "req_...",
    "details": null
  }
}
```

## Rules

- `code` is stable and machine readable.
- `message` is safe for clients.
- `request_id` correlates logs across gateway and backend.
- `details` may contain field-validation information but never secrets.

## Suggested status mapping

| Status | Meaning |
| --- | --- |
| 400 | malformed request or business validation |
| 401 | missing/invalid authentication |
| 403 | authenticated but not permitted |
| 404 | resource does not exist |
| 409 | uniqueness/conflict |
| 410 | expired/gone short URL when intentionally differentiated |
| 422 | schema validation where FastAPI uses it |
| 429 | rate limit exceeded |
| 502 | invalid/upstream failure at gateway |
| 503 | no healthy backend |
| 504 | upstream timeout |
| 500 | unexpected internal failure |

Do not leak stack traces, SQL text, secrets or internal URLs in public errors.
