# EasyAuth

A production-ready authentication system built with Next.js 14 (App Router) and NestJS, featuring JWT authentication with httpOnly cookies, shared validation, and a premium dark UI.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5.7, Tailwind CSS, React Hook Form, Zod
- **Backend**: NestJS 11, Mongoose, JWT, bcrypt, Passport
- **Database**: MongoDB
- **Monorepo**: pnpm workspaces
- **Testing**: Jest, Supertest, mongodb-memory-server
- **CI/CD**: GitHub Actions

## Features

### Security-First Architecture

- JWT tokens stored in httpOnly cookies (XSS protection), bcrypt hashing (10 rounds), rate limiting on signin
- Helmet security headers, CORS with credentials, no token exposure to client JavaScript

### Single Source of Validation Truth

- All validation rules and schemas defined once in `packages/shared`
- Frontend (Zod) and backend (class-validator) share constants—validation cannot drift

### Production-Grade Error Handling

- Consistent error shape with `requestId` for debugging, deterministic responses, no stack traces in production

### Clean Architecture

- Modular NestJS (guards, filters, strategies), clear app/shared separation, composed React components, edge middleware

## Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm (install with `npm install -g pnpm`)
- MongoDB (local or cloud instance)

### Installation

1. Clone and install:

```bash
git clone <repository-url>
cd easyauth
pnpm install
pnpm --filter @easyauth/shared build
```

2. Set up environment variables (copy from examples):

- Backend: `apps/api/.env.example` → `apps/api/.env`
- Frontend: `apps/web/.env.example` → `apps/web/.env.local`

3. Start MongoDB (optional if using local):

```bash
pnpm mongo
```

4. Run the development servers:

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

## Live API & Testing

**Base API URL:** [https://easyauth-hixc.onrender.com](https://easyauth-hixc.onrender.com) (API hosted on [Render](https://render.com))

### Health check

- **Method & path:** `GET /api/health`

```bash
curl -s https://easyauth-hixc.onrender.com/api/health
```

### Authentication endpoints

| Method | Path | Auth required |
| ------ | ---- | ------------- |
| POST   | `/api/auth/signup`   | No  |
| POST   | `/api/auth/signin`   | No  |
| POST   | `/api/auth/logout`   | No  |
| GET    | `/api/auth/me`       | **Yes** (JWT) |
| GET    | `/api/auth/protected` | **Yes** (JWT) |

**Protected routes:** `GET /api/auth/me` and `GET /api/auth/protected` require a valid JWT (httpOnly cookie); unauthenticated requests return 401. On the web app, `/app` and `/app/*` are protected (the page calls `/auth/me` and redirects to `/signin` on 401).

### Notes

- The API is deployed on [Render](https://render.com); the web app is on [Vercel](https://vercel.com) ([easyauth-generator.vercel.app](https://easyauth-generator.vercel.app)).
- CORS is enabled for:
  - `http://localhost:3000`
  - `https://easyauth-generator.vercel.app`
- When using browser-based API tools, non-browser or proxy mode may be required due to CORS.

Full request/response examples: [docs/API.md](docs/API.md)

## Validation

Validation rules live in `packages/shared` and are used by both frontend (Zod) and backend (class-validator). Rules: email (valid format, lowercase), name (min 3 chars), password (min 8 chars, 1 letter, 1 number, 1 special character @$!%*#?&).

## Security

- **httpOnly cookies**: JWT in httpOnly cookie with 15m expiry (XSS protection, no client JS access)
- **bcrypt hashing**: Passwords hashed with 10 rounds
- **Rate limiting**: Signin endpoint limited to 10 requests/60s per IP
- **Helmet & CORS**: Security headers and credential-enabled CORS
- **Error tracking**: Consistent errors with `requestId` for correlation
- **No sensitive logging**: Passwords, tokens, and auth headers never logged

See [docs/INTERVIEW_NOTES.md](docs/INTERVIEW_NOTES.md) for architectural decisions.

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

Run unit tests (`pnpm test`) for auth service validation and core flows. Run E2E tests (`pnpm test:e2e`) with in-memory MongoDB covering signup, signin, validation errors, protected routes, and logout (11 scenarios).

GitHub Actions runs lint, typecheck, unit tests, E2E tests, and builds on every push/PR.

## Environment Variables

See `apps/api/.env.example` and `apps/web/.env.example` for required configuration.

## Production Deployment

This project’s production stack uses:

- **[MongoDB Atlas](https://cloud.mongodb.com/)** — managed database
- **[Render](https://render.com)** — API hosting (or Railway, Heroku, etc.)
- **[Vercel](https://vercel.com)** — web app hosting (recommended for Next.js)

Deploy with environment variables from `.env.example` files. Ensure HTTPS is enabled and `CORS_ORIGIN` matches your frontend URL exactly.

Full deployment checklist, platform notes, and troubleshooting: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Documentation

- **[docs/INTERVIEW_NOTES.md](docs/INTERVIEW_NOTES.md)**: Architecture decisions and technical discussion notes
- **[docs/API.md](docs/API.md)**: Full API reference with request/response examples
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**: Production deployment guide and troubleshooting

## License

MIT
