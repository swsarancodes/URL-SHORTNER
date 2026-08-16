# Indexing Strategy

Indexes should follow query patterns rather than be added speculatively.

## Critical index

```sql
CREATE UNIQUE INDEX ux_urls_short_code ON urls(short_code);
```

This powers redirect lookup and guarantees uniqueness.

## User lookup

```sql
CREATE UNIQUE INDEX ux_users_email ON users(email);
```

## User URL listing

If queries commonly use `WHERE user_id = ? ORDER BY created_at DESC`, use a composite index:

```sql
CREATE INDEX ix_urls_user_created ON urls(user_id, created_at DESC);
```

## Refresh tokens

Lookup depends on implementation. If persisted tokens are represented by a token hash, that hash should be unique and indexed.

## Click events

Likely indexes when analytics is introduced:

```sql
(url_id, occurred_at DESC)
```

Avoid indexing every analytics column because writes become more expensive and storage increases.

## Query verification

Use PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` during performance work. Do not assume an index is used merely because it exists.
