# EasyAuth

A production-ready authentication system built with Next.js 14 (App Router) and NestJS, featuring JWT authentication with httpOnly cookies, shared validation, and a premium dark UI.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, React Hook Form, Zod
- **Backend**: NestJS, Mongoose, JWT, bcrypt, Passport
- **Database**: MongoDB
- **Monorepo**: pnpm workspaces
- **Testing**: Jest, Supertest, mongodb-memory-server
- **CI/CD**: GitHub Actions

## Features

### Security-First Architecture

- **httpOnly Cookies**: JWT tokens stored in httpOnly cookies prevent XSS attacks
- **bcrypt Hashing**: Passwords hashed with bcrypt (10 rounds)
- **Rate Limiting**: Signin endpoint rate-limited to 10 requests per 60 seconds
- **Helmet**: Security headers enabled globally
- **CORS**: Configured with credentials support
- **No Token Exposure**: Tokens never exposed to client JavaScript

### Single Source of Validation Truth

- All validation constants and schemas defined in `packages/shared`
- Frontend uses Zod schemas directly
- Backend DTOs use class-validator with imported constants
- Impossible for validation rules to drift between client and server

### Production-Grade Error Handling

- Consistent error shape with `requestId` for debugging
- All error cases have deterministic responses
- No stack traces leak in production
- Request correlation via UUID

### Clean Architecture

- Modular NestJS structure with guards, filters, strategies
- Clear separation between apps and shared code
- Small focused React components with composition
- Edge middleware for route protection

## Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm (install with `npm install -g pnpm`)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd easyauth
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the shared package:

```bash
pnpm --filter @easyauth/shared build
```

4. Set up environment variables:

**Backend** (`apps/api/.env`):

```bash
MONGO_URI=mongodb://localhost:27017/easyauth
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=15m
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (`apps/web/.env.local`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

5. Start MongoDB (if running locally):

```bash
pnpm mongo
```

Or run Docker directly: `docker run -d -p 27017:27017 mongo`

6. Run the development servers:

```bash
pnpm dev
```

This starts both the API (port 4000) and web app (port 3000) concurrently.

## Available Scripts

| Command           | Description                                     |
| ----------------- | ----------------------------------------------- |
| `pnpm dev`        | Start both API and web app in development mode  |
| `pnpm dev:api`    | Start only the API in development mode          |
| `pnpm dev:web`    | Start only the web app in development mode      |
| `pnpm mongo`      | Start MongoDB in Docker (docker compose up -d)   |
| `pnpm build`      | Build all packages and apps                     |
| `pnpm lint`       | Lint all packages                               |
| `pnpm typecheck`  | Type check all packages                         |
| `pnpm test`       | Run unit tests (API only)                       |
| `pnpm test:e2e`   | Run E2E tests with mongodb-memory-server        |
| `pnpm format`     | Format code with Prettier                       |

## API Documentation

### Swagger UI

Interactive API documentation available at: **http://localhost:4000/api/docs** (disabled in production)

### Endpoints

#### GET `/api/health`

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

#### POST `/api/auth/signup`

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

#### POST `/api/auth/signin`

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

#### POST `/api/auth/logout`

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

#### GET `/api/auth/me`

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

#### GET `/api/auth/protected`

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

## Validation Rules

Validation is defined once in `packages/shared` and used by both frontend and backend:

- **Email**: Valid email format, converted to lowercase, trimmed
- **Name**: Minimum 3 characters, trimmed
- **Password**: Minimum 8 characters, must contain at least 1 letter, 1 number, and 1 special character (@$!%*#?&)

## Security Notes

### Authentication Flow

1. User submits credentials to `/api/auth/signup` or `/api/auth/signin`
2. Backend validates credentials and generates JWT
3. JWT stored in httpOnly cookie (client JavaScript cannot access)
4. Cookie sent automatically with subsequent requests
5. Backend validates JWT on protected routes
6. Token expires after 15 minutes (no refresh token)

### Cookie Attributes

- `httpOnly: true` - Prevents JavaScript access (XSS protection)
- `secure: true` (production) - Only sent over HTTPS
- `sameSite: 'lax'` - CSRF protection
- `path: '/'` - Available to entire app
- `maxAge: 900000` (15 minutes)

### Route Protection

- **Frontend**: Next.js middleware intercepts routes before rendering
  - `/app/*` requires authentication, redirects to `/signin` if missing
  - `/signin` and `/signup` redirect to `/app` if already authenticated
- **Backend**: JWT guard validates token on protected endpoints

### Password Security

- Passwords hashed with bcrypt (10 rounds)
- Plain passwords never logged or stored
- Validation enforces strong password requirements

### Rate Limiting

- Signin endpoint: 10 requests per 60 seconds per IP
- Prevents brute force attacks
- Other endpoints not rate limited

### Logging

- Request correlation via UUID (`requestId`)
- Logs: method, path, statusCode, responseTime
- Never logged: passwords, tokens, request bodies, authorization headers

## Project Structure

```
easyauth/
├── apps/
│   ├── api/                  # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/         # Authentication module
│   │   │   ├── users/        # Users module
│   │   │   ├── common/       # Filters, middleware
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── test/             # E2E tests
│   └── web/                  # Next.js frontend
│       ├── src/
│       │   ├── app/          # App Router pages
│       │   ├── components/   # UI components
│       │   ├── lib/          # Utilities
│       │   └── middleware.ts # Route protection
│       └── ...
├── packages/
│   └── shared/               # Shared validation and types
│       └── src/
│           ├── validation.ts # Zod schemas and constants
│           ├── types.ts      # TypeScript types
│           └── index.ts
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI
├── package.json              # Root package.json
├── pnpm-workspace.yaml       # Workspace configuration
└── README.md
```

## Testing

### Unit Tests

Run unit tests for the auth service:

```bash
pnpm test
```

Tests cover:

- Password validation
- User signup (success and duplicate email)
- User signin (success and invalid credentials)

### E2E Tests

Run end-to-end tests with in-memory MongoDB:

```bash
pnpm test:e2e
```

11 test cases covering:

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

### CI/CD

GitHub Actions workflow runs on every push and PR:

1. Install dependencies
2. Build shared package
3. Lint all packages
4. Type check all packages
5. Run unit tests
6. Run E2E tests (with mongodb-memory-server, no external MongoDB needed)
7. Build all apps

## Environment Variables

### Backend (`apps/api/.env`)

| Variable       | Description                           | Default                      |
| -------------- | ------------------------------------- | ---------------------------- |
| `MONGO_URI`    | MongoDB connection string (required)  | -                            |
| `JWT_SECRET`   | Secret key for JWT signing (required) | -                            |
| `JWT_EXPIRES_IN` | JWT expiration time                 | `15m`                        |
| `PORT`         | API server port                       | `4000`                       |
| `NODE_ENV`     | Environment                           | `development`                |
| `CORS_ORIGIN`  | Allowed CORS origin                   | `http://localhost:3000`      |

### Frontend (`apps/web/.env.local`)

| Variable              | Description       | Default                       |
| --------------------- | ----------------- | ----------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL   | `http://localhost:4000/api`   |

## Production Deployment

### Prerequisites

Before deploying to production, ensure you have:

1. A **MongoDB instance** (MongoDB Atlas recommended for managed hosting)
2. A **hosting platform** for the API (Railway, Render, Heroku, AWS, etc.)
3. A **hosting platform** for the web app (Vercel, Netlify, AWS Amplify, etc.)
4. **HTTPS/SSL certificates** (most platforms provide this automatically)

### Deployment Checklist

#### 1. Generate a Secure JWT Secret

Generate a cryptographically secure JWT secret (minimum 32 characters):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save this value securely - you'll need it for the API environment variables.

#### 2. Set Up MongoDB

**Option A: MongoDB Atlas (Recommended)**

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Set up database user credentials
3. Whitelist your API server's IP addresses (or `0.0.0.0/0` for development)
4. Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/easyauth`)

**Option B: Self-hosted MongoDB**

Ensure your MongoDB instance is:
- Accessible from your API server
- Secured with authentication
- Backed up regularly

#### 3. Deploy the API

**Environment Variables (Required)**

Set these on your API hosting platform:

```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/easyauth
JWT_SECRET=<your-generated-secret-from-step-1>
JWT_EXPIRES_IN=15m
PORT=4000  # or your platform's required port
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com  # your frontend URL
```

**Build and Start Commands**

- **Build command**: `pnpm install && pnpm --filter @easyauth/shared build && pnpm --filter @easyauth/api build`
- **Start command**: `pnpm --filter @easyauth/api start:prod`

**Platform-Specific Notes**

- **Railway/Render**: Create a new service, connect your GitHub repo, set environment variables, and deploy
- **Heroku**: Use the Node.js buildpack, set workspace root to `apps/api` if needed
- **AWS/GCP**: Use Elastic Beanstalk, App Engine, or containerize with Docker

**Health Check**

The API includes a health endpoint at `/api/health` that returns:

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456
}
```

Use this endpoint for:
- Load balancer health checks
- Platform readiness probes
- Monitoring and uptime services

#### 4. Deploy the Frontend

**Environment Variables (Required)**

Set these on your web hosting platform:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

**Build and Start Commands**

- **Build command**: `pnpm install && pnpm --filter @easyauth/shared build && pnpm --filter @easyauth/web build`
- **Start command**: `pnpm --filter @easyauth/web start`

**Platform-Specific Notes**

- **Vercel (Recommended)**: Deploy with one click. Vercel auto-detects Next.js and handles builds. Set `NEXT_PUBLIC_API_URL` in project settings.
- **Netlify**: Use the Next.js plugin. Set build command and environment variables in site settings.
- **AWS Amplify**: Connect your repo, configure build settings, and set environment variables.

#### 5. Verify Deployment

After deployment, test the following:

1. **API Health**: Visit `https://your-api-domain.com/api/health` (should return `{"status":"ok",...}`)
2. **Swagger Disabled**: Visit `https://your-api-domain.com/api/docs` (should return 404 in production)
3. **Frontend Loads**: Visit your frontend URL
4. **Sign Up Flow**: Create a new account
5. **Sign In Flow**: Sign in with the account you created
6. **Protected Routes**: Navigate to `/app` (should show authenticated content)
7. **Logout**: Log out and verify redirect to `/signin`
8. **Cookies**: Open browser DevTools → Application/Storage → Cookies - verify `easyauth_token` cookie has:
   - `HttpOnly`: ✓
   - `Secure`: ✓ (only over HTTPS)
   - `SameSite`: Lax

### Security Considerations for Production

- **JWT_SECRET**: Never commit to version control. Use platform environment variables or secrets management.
- **HTTPS Only**: The `secure` cookie flag requires HTTPS. Ensure both API and web app are served over HTTPS.
- **CORS_ORIGIN**: Set to your exact frontend domain. For multiple domains, you'll need to modify the API to accept an array.
- **MongoDB**: Use strong credentials and restrict IP access.
- **Rate Limiting**: Currently only `/api/auth/signin` is rate-limited. Consider adding global rate limiting in production.
- **Monitoring**: Set up logging and error tracking (e.g., Sentry, Datadog, LogRocket).

### Example Deployment Stack

**Recommended for simplicity:**

- **Web**: Vercel (free tier, automatic HTTPS, great Next.js support)
- **API**: Railway (free trial, easy deployment, automatic HTTPS)
- **Database**: MongoDB Atlas (free tier, managed, automatic backups)

**Cost**: Free tier available for all three services (suitable for development and small production workloads).

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `FATAL: JWT_SECRET is set to an insecure placeholder value` | Generate a new secret with the command in step 1 and set it in your API environment variables |
| Cookie not being sent to API | Ensure `CORS_ORIGIN` matches your frontend URL exactly (including protocol and port) |
| `secure` cookie warning | Deploy both API and web over HTTPS (not HTTP) |
| Database connection fails | Check MongoDB connection string, IP whitelist, and credentials |
| 500 errors on API | Check API logs for details. Verify all required environment variables are set |

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a PR.
