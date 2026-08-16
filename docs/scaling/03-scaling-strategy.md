# Scaling Strategy

## Stage 0 — single logical backend

```
Vite SPA -> Gateway -> Backend -> Neon
```

Goal: correctness.

## Stage 1 — multiple backend origins locally

```
Gateway -> backend-1
        -> backend-2
        -> backend-3
```

Goal: implement load balancing and health checks.

## Stage 2 — resilience

Add:

- upstream timeouts;
- circuit breakers;
- bounded retries for safe requests;
- structured logs.

## Stage 3 — caching

Add distributed cache only when there is a viable shared service and measurements justify it.

## Stage 4 — analytics separation

Click analytics should eventually move off the critical redirect path. At larger scale, emit an event and process asynchronously rather than making redirect success depend on analytics insertion.

## Stage 5 — service decomposition

Split services only when independent scaling, ownership or reliability boundaries justify it. A modular monolith is intentionally preferred first.

## Database scaling

Potential evolution:

- better indexes and query tuning;
- connection pooling compatible with serverless workloads;
- read replicas for read-heavy workloads if supported/needed;
- partitioning analytics tables;
- archival/aggregation.

The free-tier project should document these options without implementing infrastructure that adds cost or unnecessary complexity.
