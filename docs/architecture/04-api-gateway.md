# API Gateway Design

## Objective

Create an explicit application gateway in FastAPI that demonstrates request routing and resilience patterns while remaining deployable on Vercel and runnable locally.

## Responsibilities

- Public API entry point.
- Request ID creation.
- Authentication policy enforcement.
- Rate limiting.
- Backend selection.
- Upstream forwarding.
- Timeout handling.
- Circuit-breaker integration.
- Logging.

## Request pipeline

```
request
  -> request-id middleware
  -> basic validation
  -> authentication
  -> rate limiter
  -> backend registry
  -> load-balancer selection
  -> circuit breaker
  -> upstream call
  -> response normalization
```

## Forwarded headers

Forward only required headers. Do not blindly trust client-supplied internal headers. The gateway should set its own request ID and may set an internal authenticated-user identifier after JWT verification.

## Timeouts

Every upstream request needs a finite connect/read timeout. A gateway without timeouts can exhaust resources while waiting for failed upstreams.

## Retries

Retries should be conservative. GET requests may be safe to retry. POST URL creation should not be blindly retried unless idempotency is designed, because duplicate writes can occur.

## Statelessness

In-memory gateway state is not globally reliable in a serverless deployment. Local in-memory structures are acceptable for demonstrating algorithms, but production-grade shared rate limits or service discovery would require an external shared store.

## Error boundaries

The gateway should distinguish:

- client validation/authentication errors;
- no healthy upstreams;
- upstream timeout;
- upstream 5xx;
- internal gateway failure.

Each response should include a request ID for correlation.
