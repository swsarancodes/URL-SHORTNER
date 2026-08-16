# Authentication

## Goals

- Authenticate users without managed auth providers.
- Keep access tokens short lived.
- Support session renewal and logout.
- Avoid storing plaintext passwords or refresh tokens.

## Registration

1. Normalize and validate email.
2. Validate password policy.
3. Hash password with Argon2id or bcrypt using a maintained library.
4. Store only the password hash.
5. Return the public user representation.

## Login

1. Fetch user by normalized email.
2. Verify password hash.
3. Issue short-lived access token.
4. Issue refresh credential.
5. Persist refresh-token/session metadata if server-side revocation is required.

## Browser token strategy

Preferred direction:

- **access token:** short lived; keep in application memory where possible;
- **refresh token:** Secure, HttpOnly, SameSite cookie when same-site/cross-site deployment rules are configured correctly.

Avoid `localStorage` for long-lived refresh credentials because JavaScript-accessible storage increases the impact of XSS.

## Authorization

The backend must still enforce resource ownership. Gateway authentication alone is not a substitute for authorization checks in business logic.

## Logout

Revoke the stored refresh-token hash/session identifier and clear the browser cookie.

## Token rotation

Refresh-token rotation can be introduced after the base flow works. When rotated, old refresh credentials should be invalidated to reduce replay risk.
