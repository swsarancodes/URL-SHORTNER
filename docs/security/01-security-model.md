# Security Model

## Protected assets

- User credentials.
- JWT signing secret/private key.
- Refresh credentials.
- Neon connection string.
- URL ownership data.
- Internal backend addresses.
- Analytics metadata.

## Main threats

### Credential theft

**Mitigations:**

- strong password hashing;
- TLS only in deployed environments;
- short-lived access tokens;
- secure refresh-token handling.

### SQL injection

Use SQLAlchemy parameterized queries. Never construct SQL from untrusted strings.

### Malicious destination URLs

A URL shortener can be abused for phishing and malicious links. At minimum:

- allow only supported schemes such as `http` and `https`;
- enforce maximum URL size;
- prohibit obvious malformed values;
- add abuse reporting later.

Do not claim URL validation makes destinations safe.

### Broken access control

Every update/delete/list operation must filter by authenticated user ownership where appropriate.

### Brute force

Apply stricter rate limits to login and registration routes.

### XSS

React escapes text by default. Avoid unsafe HTML rendering and keep long-lived credentials out of JavaScript-readable storage where possible.

### Secret exposure

Never place secrets in Vite `VITE_*` variables because they are compiled into browser-accessible code.

### Logging

Do not log passwords, authorization headers, raw refresh tokens, database connection strings or unnecessary personal data.
