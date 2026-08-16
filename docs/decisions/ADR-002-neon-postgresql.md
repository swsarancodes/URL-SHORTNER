# ADR-002: Use Neon PostgreSQL

## Status

Accepted.

## Context

The project needs relational persistence with uniqueness constraints, indexing, transactions and a free-tier-friendly hosted database.

## Decision

Use Neon PostgreSQL as the durable data store.

## Why PostgreSQL fits

- strong uniqueness constraints for short codes;
- mature indexing;
- transactions;
- straightforward SQLAlchemy/Alembic support;
- good fit for users, URLs, refresh sessions and early analytics.

## Alternatives

- local PostgreSQL only;
- document database;
- managed key-value database.

## Consequences

The application must handle serverless connection behavior carefully and keep analytics retention bounded so free-tier storage is not consumed unnecessarily.
