# API Documentation

## Interactive Documentation

Swagger UI is available at: **http://localhost:4000/api/docs** (disabled in production)

## Endpoints

### GET `/api/health`

Health check endpoint for monitoring and load balancers.

**Request:**

```bash
curl http://localhost:4000/api/health
```

**Response (200):**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456
}
```

---

### POST `/api/auth/signup`

Create a new user account.

**Request:**

```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "Password123!"
  }'
```

**Response (201):**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

Sets `easyauth_token` cookie with JWT (httpOnly, secure in production, 15 min expiry).

**Error Responses:**

- `400`: Validation error (weak password, invalid email, short name)
- `409`: Email already exists

---

### POST `/api/auth/signin`

Sign in with existing credentials.

**Request:**

```bash
curl -X POST http://localhost:4000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

**Response (200):**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

Sets `easyauth_token` cookie.

**Error Response:**

- `401`: Invalid credentials

**Rate Limit:** 10 requests per 60 seconds.

---

### POST `/api/auth/logout`

Clear the authentication cookie.

**Request:**

```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -b "easyauth_token=<token>"
```

**Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

---

### GET `/api/auth/me`

Get current authenticated user.

**Request:**

```bash
curl http://localhost:4000/api/auth/me \
  -b "easyauth_token=<token>"
```

**Response (200):**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Response:**

- `401`: Unauthorized

---

### GET `/api/auth/protected`

Example protected route.

**Request:**

```bash
curl http://localhost:4000/api/auth/protected \
  -b "easyauth_token=<token>"
```

**Response (200):**

```json
{
  "message": "This is a protected route"
}
```

**Error Response:**

- `401`: Unauthorized

---

## Validation Rules

Validation is defined once in `packages/shared` and used by both frontend and backend:

- **Email**: Valid email format, converted to lowercase, trimmed
- **Name**: Minimum 3 characters, trimmed
- **Password**: Minimum 8 characters, must contain at least 1 letter, 1 number, and 1 special character (@$!%*#?&)

## Test Coverage

### E2E Test Scenarios

The API includes comprehensive E2E tests covering:

1. Signup with valid data (201)
2. Signup with weak password (400)
3. Signup with invalid email (400)
4. Signup with short name (400)
5. Signup with duplicate email (409)
6. Signin with valid credentials (200)
7. Signin with invalid credentials (401)
8. `/auth/me` without cookie (401)
9. `/auth/me` with valid cookie (200)
10. `/auth/protected` with valid cookie (200)
11. Logout clears cookie (200)

Run tests with:

```bash
pnpm test:e2e
```
