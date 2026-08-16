# Application Load Balancer

## Goal

Implement backend selection ourselves for system-design learning.

## V1 algorithm — round robin

For healthy targets `[A, B, C]`:

```
request 1 -> A
request 2 -> B
request 3 -> C
request 4 -> A
```

Only targets currently marked healthy are eligible.

## Backend registry

Each target contains at least:

- stable identifier;
- base URL;
- health state;
- consecutive failures;
- last successful check;
- optional circuit state.

## Health checks

A target becomes unhealthy after a configurable number of consecutive failures. It should not flap after one transient error. Recovery should require one or more successful probes.

## Concurrency

The round-robin index must be protected from unsafe concurrent mutation inside a long-running process. In a serverless environment, separate function instances can each hold different counters, which is acceptable for this educational application-level balancer but must be documented.

## Future algorithms

- Random selection.
- Weighted round robin.
- Least outstanding requests.
- Consistent hashing.

Do not add algorithms until measurements or learning goals justify them.

## Local demonstration

Docker Compose is the best environment for visibly testing this component. Kill one backend container, observe failed health probes, confirm it leaves the healthy pool, then restart it and verify recovery.

## Limitation

This component does not control Vercel's physical instances. It routes HTTP requests among logical backend origins/deployments or locally running service instances.
