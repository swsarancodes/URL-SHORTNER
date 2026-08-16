# ADR-004: Short-Code Generation

## Status

Proposed; finalize during V0 implementation.

## Context

Short codes must be compact, URL-safe and unique. The project also wants enough system-design depth to discuss distributed generation.

## Options

### Random Base62

Generate N random characters from `[0-9A-Za-z]` and rely on a database unique constraint.

**Pros:**

- simple;
- hard to predict;
- no central sequence required.

**Cons:**

- collision probability increases with population;
- requires retry handling.

### Database sequence + Base62

Generate a numeric ID and encode it as Base62.

**Pros:**

- collision-free when sequence is authoritative;
- compact.

**Cons:**

- sequential codes are predictable;
- database participates in ID generation.

### Distributed 64-bit ID + Base62

Generate time/node/sequence-style IDs then encode.

**Pros:**

- useful system-design exercise;
- avoids a central database sequence.

**Cons:**

- more complexity than the free-tier application needs;
- requires careful clock/node assumptions.

## Initial decision

Start with random Base62 plus a unique database constraint and bounded retries so V0 remains simple. Implement a distributed-ID experiment later behind the same short-code generator interface and compare the trade-offs.

## Alphabet

```
0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
```

Avoid characters outside this URL-safe set.
