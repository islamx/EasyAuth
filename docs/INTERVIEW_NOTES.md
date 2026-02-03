# Interview Notes — EasyAuth

Short decision-focused notes for technical discussion. Not documentation.

---

## Architecture

- **Monorepo and shared contract.** The repo is a pnpm workspace with `apps/api`, `apps/web`, and `packages/shared`. I put validation constants and Zod schemas in `shared` so the frontend and backend cannot drift: the API DTOs import the same constants and messages. Types and response shapes are also shared so the client and server stay aligned without duplication.

- **Single API client and cookie-based auth.** The frontend has one `api()` helper that always uses `credentials: 'include'` so the httpOnly cookie is sent on every request. The token is never read or stored in JS—the browser handles it. Protected routes are enforced in Next.js middleware by checking for the presence of the cookie; no token parsing on the client.

- **Backend auth flexibility.** The JWT strategy reads the token from the cookie first, then falls back to the `Authorization: Bearer` header. That keeps the browser flow cookie-only while still allowing Swagger and other API clients to use a bearer token.

---

## Security

- **Token storage and transport.** JWTs are set only in an httpOnly, sameSite cookie with a short lifetime (15 minutes). The response body returns only `{ user }`—no token. That reduces XSS impact and avoids storing tokens in localStorage or in React state.

- **Hardening the API.** ValidationPipe is global with `whitelist` and `forbidNonWhitelisted` so extra fields are stripped or rejected. Signin is throttled (e.g. 10 requests per 60 seconds). Helmet and CORS are configured with a single allowed origin and credentials. Passwords are hashed with bcrypt (10 rounds). Signin failures return a generic "Invalid credentials" to avoid user enumeration.

- **Logging and errors.** Pino is configured to redact authorization headers and request body so secrets never appear in logs. Errors return a consistent shape including `requestId` for correlation; no stack traces or internals are exposed to the client.

---

## Validation and UX

- **One place for rules.** Password length, regex, and all validation messages live in `packages/shared`. The frontend uses the same Zod schemas with React Hook Form; the backend uses class-validator with the same constants. Changing a rule (e.g. password policy) is a single change and both sides stay in sync.

- **Deterministic errors.** The API uses a single exception filter and a stable error format (statusCode, message, error, path, timestamp, requestId). The frontend can rely on that shape to show messages and, if needed, pass `requestId` to support.

- **Route protection and redirects.** Middleware runs only on `/app/*`, `/signin`, and `/signup`. Unauthenticated access to `/app` redirects to signin; authenticated access to signin/signup redirects to `/app`. No flash of protected content—the redirect happens at the edge before the page renders.

---

## Scope and Trade-offs

- The focus was on correctness, security, and a clean auth flow within the given time.
- Refresh token rotation, CSRF protection, and role-based authorization were intentionally left out to keep the scope tight and verifiable.
- The current structure is designed to support these additions without refactoring core flows.
