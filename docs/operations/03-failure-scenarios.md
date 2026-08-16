# Failure Scenarios

## Backend instance is down

**Expected behavior:**

1. Health checker records failures.
2. Target becomes unhealthy after threshold.
3. Load balancer excludes it.
4. Requests use remaining healthy targets.
5. Recovery probes eventually restore it.

## No healthy backend

Gateway returns `503 SERVICE_UNAVAILABLE` with request ID. It should fail quickly rather than hang.

## Upstream timeout

Gateway returns `504` and updates health/circuit-breaker state according to policy.

## Neon unavailable

Backend should return a controlled 5xx error and log the database failure. Redirects cannot be guaranteed unless a shared cache already has the mapping.

## Short-code collision

The unique database constraint rejects the duplicate. Backend retries generation a bounded number of times, then returns an internal error if uniqueness cannot be obtained.

## Expired URL

Backend does not redirect. Return `410 Gone` if product behavior exposes expiration distinctly, otherwise use `404` to reveal less state.

## Rate-limit store unavailable

For an in-memory educational limiter this does not apply globally. A later shared limiter must define fail-open versus fail-closed policy per endpoint.

## JWT signing secret mismatch

Requests may suddenly fail authentication across deployments. Secrets must be consistent among services that verify the same tokens.

## Gateway deployment down

Because the gateway is the intended public entry point, API operations are unavailable. The architecture could later add multi-region/platform redundancy, but this is outside the free-tier project's initial scope.
