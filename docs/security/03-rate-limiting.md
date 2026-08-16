# Rate Limiting

## Goals

- protect authentication endpoints;
- limit URL creation abuse;
- prevent obvious request floods;
- demonstrate rate-limit algorithms.

## Initial algorithm

Implement token bucket or fixed-window limiting in the gateway for learning. Token bucket is preferred if we want controlled bursts.

Example policies:

| Endpoint group | Policy |
| --- | --- |
| login | strict per IP/email combination |
| register | strict per IP |
| create URL | per authenticated user |
| redirect | high limit or initially unrestricted |

Exact numbers should be measured rather than treated as universal constants.

## Identity

Potential keys:

- authenticated user ID;
- trusted client IP information;
- endpoint group.

Be careful with proxy headers. Only trust headers supplied by a known proxy/platform boundary.

## Serverless limitation

An in-memory limiter is process-local and therefore not globally consistent across serverless instances. It is useful for demonstrating the algorithm locally, but a production distributed limiter requires shared state such as Redis/KV or a platform feature.

## Response

Return HTTP `429` with a stable error code. Optional headers can communicate retry timing.
