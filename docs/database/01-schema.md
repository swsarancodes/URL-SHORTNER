# Database Schema

PostgreSQL on Neon is the source of truth.

## users

```
id              UUID PRIMARY KEY
email           VARCHAR UNIQUE NOT NULL
password_hash   TEXT NOT NULL
created_at      TIMESTAMPTZ NOT NULL
updated_at      TIMESTAMPTZ NOT NULL
```

## urls

```
id              UUID or BIGINT PRIMARY KEY
short_code      VARCHAR NOT NULL UNIQUE
original_url    TEXT NOT NULL
user_id         UUID NOT NULL REFERENCES users(id)
created_at      TIMESTAMPTZ NOT NULL
updated_at      TIMESTAMPTZ NOT NULL
expires_at      TIMESTAMPTZ NULL
is_active       BOOLEAN NOT NULL DEFAULT TRUE
```

## refresh_tokens

```
id              UUID PRIMARY KEY
user_id         UUID NOT NULL REFERENCES users(id)
token_hash      TEXT NOT NULL UNIQUE
created_at      TIMESTAMPTZ NOT NULL
expires_at      TIMESTAMPTZ NOT NULL
revoked_at      TIMESTAMPTZ NULL
```

## click_events — later milestone

```
id              BIGINT PRIMARY KEY
url_id          <urls.id> NOT NULL
occurred_at     TIMESTAMPTZ NOT NULL
referrer        TEXT NULL
user_agent      TEXT NULL
ip_hash         TEXT NULL
country         VARCHAR NULL
```

Analytics data should be intentionally bounded because free-tier storage is limited. Raw events may later be aggregated and expired.

## Constraints

- `users.email` unique.
- `urls.short_code` unique.
- expiration timestamps may be null.
- deleting a user requires an explicit retention policy for owned URLs and analytics.

## ID choice

The first implementation may use UUIDs for resource identifiers. Short codes should have their own generation strategy and must not expose sensitive sequential information unless that is an accepted trade-off.
