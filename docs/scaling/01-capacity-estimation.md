# Capacity Estimation

Capacity estimation is included to reason about architecture, not to pretend the free-tier deployment serves internet-scale traffic.

## Example scenario

Assume eventually:

- 100,000 registered users;
- 1,000,000 stored URLs;
- 10 URL creations per second at peak;
- 500 redirects per second at peak;
- average original URL length around 200 bytes before row/index overhead.

Redirect traffic dominates writes by roughly 50:1 in this illustrative scenario.

## Storage

URL rows include original URL text, short code, owner IDs, timestamps and PostgreSQL overhead. The real row footprint will be larger than raw field lengths. Measure actual database size rather than relying only on arithmetic estimates.

Analytics can outgrow URL mapping storage quickly. At 500 redirects/second, retaining every click indefinitely produces tens of millions of rows per day. Therefore raw click retention must be bounded or aggregated in a free-tier system.

## Bandwidth

Redirect responses are small, but every request still consumes gateway/backend execution and network overhead.

## Key design consequence

Optimize the redirect path first:

- indexed short-code lookup;
- minimal serialization;
- minimal auth work for public redirects;
- future caching for hot links.
