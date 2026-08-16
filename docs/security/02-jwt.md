# JWT Design

## Access token

Recommended initial lifetime: approximately 10–15 minutes.

Example claims:

```json
{
  "sub": "user-uuid",
  "iat": 0,
  "exp": 0,
  "jti": "token-id",
  "type": "access"
}
```

## Validation

Validate:

- signature;
- expiration;
- expected algorithm;
- token type;
- required claims.

Never trust a client-selected algorithm.

## Refresh token

Refresh credentials should live substantially longer than access tokens but remain revocable. Store only a hash server-side when persistence is used.

## Signing

For the first version, a strong environment-provided HMAC secret can keep deployment simple. A later ADR can evaluate asymmetric signing if multiple independently trusted services require verification without sharing signing capability.

## Key rotation

The design should allow changing signing keys. Production-grade rotation normally requires key identifiers and overlapping verification windows; this can be a later milestone.

## JWT scope

JWT proves authentication claims. It does not remove the need for database authorization checks.
