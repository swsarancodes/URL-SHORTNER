# Caching Strategy

## Why cache

Redirect lookups are read-heavy and often repeatedly access popular short codes.

## V0

Use PostgreSQL directly. Do not introduce cache complexity before measuring the baseline.

## Cache abstraction

Backend code can define an interface such as:

```
get(short_code)
set(short_code, mapping, ttl)
delete(short_code)
```

The initial implementation may be `NoOpCache`.

## Why process memory is insufficient

A dictionary inside a Vercel function instance is ephemeral and not shared among instances. It can improve isolated warm-instance behavior but cannot be treated as a consistent distributed cache.

## Future distributed cache

A shared Redis/KV-compatible service could cache:

```
short_code -> original_url + active/expiration metadata
```

## Cache-aside flow

```
lookup short code
  -> cache hit: redirect
  -> cache miss: query Postgres
  -> store result with TTL
  -> redirect
```

## Invalidation

Disable/update/delete must evict the relevant key. TTL remains a safety net, not the primary invalidation method.

## Negative caching

Short-lived caching of missing codes can protect the database from repeated invalid lookups, but TTLs should be short so newly created codes do not appear missing for long.
