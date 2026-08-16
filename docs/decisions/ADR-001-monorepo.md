# ADR-001: Use a Monorepo

## Status

Accepted.

## Context

The project contains a React frontend, FastAPI gateway, FastAPI backend, shared code, infrastructure helpers, tests and documentation. They evolve together and are maintained by one project team.

## Decision

Use one Git repository with top-level `apps`, `packages`, `infra`, `tests` and `docs` directories.

## Alternatives

- Separate repository per deployable service.
- Single flat application directory.

## Consequences

**Positive:**

- atomic changes across contracts;
- easier local setup;
- simpler documentation and CI initially.

**Negative:**

- deployment configuration must choose the correct app root;
- careless shared packages can create tight coupling.
