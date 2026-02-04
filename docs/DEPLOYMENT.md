# Production Deployment Guide

## Prerequisites

Before deploying to production, ensure you have:

1. A **MongoDB instance** — [MongoDB Atlas](https://cloud.mongodb.com/) (recommended) or self-hosted
2. A **hosting platform** for the API — e.g. [Render](https://render.com), [Railway](https://railway.app), Heroku, AWS
3. A **hosting platform** for the web app — e.g. [Vercel](https://vercel.com), Netlify, AWS Amplify
4. **HTTPS/SSL certificates** (most platforms provide this automatically)

## Deployment Checklist

### 1. Generate a Secure JWT Secret

Generate a cryptographically secure JWT secret (minimum 32 characters):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save this value securely - you'll need it for the API environment variables.

### 2. Set Up MongoDB

#### Option A: MongoDB Atlas (Recommended)

1. Create a free cluster at [MongoDB Cloud / Atlas](https://cloud.mongodb.com/)
2. Set up database user credentials
3. Whitelist your API server's IP addresses (or `0.0.0.0/0` for development)
4. Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/easyauth`)

#### Option B: Self-hosted MongoDB

Ensure your MongoDB instance is:
- Accessible from your API server
- Secured with authentication
- Backed up regularly

### 3. Deploy the API

**Note:** Deploy only the API to [Render](https://render.com), [Railway](https://railway.app), or Docker. The web app is deployed separately (e.g. [Vercel](https://vercel.com)); see section 4.

#### Environment Variables (Required)

Set these on your API hosting platform:

```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/easyauth
JWT_SECRET=<your-generated-secret-from-step-1>
JWT_EXPIRES_IN=15m
PORT=4000  # or your platform's required port
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com  # your frontend URL
```

#### Build and Start Commands

- **Build command**: `pnpm install && pnpm --filter @easyauth/shared build && pnpm --filter @easyauth/api build`
- **Start command**: `pnpm --filter @easyauth/api start:prod`

#### Platform-Specific Notes

- **Docker**: Use the repo root `Dockerfile` (build context = repo root). The image uses **pnpm** and the monorepo layout; do not use a build that only copies `apps/api` and runs `npm install`, or you'll get `Unsupported URL Type "workspace:"`. Build: `docker build -t easyauth-api .` — run with env vars for `MONGO_URI`, `JWT_SECRET`, etc.
- **Railway (API only; do not deploy the web app here)**:
  - **Root Directory**: Must be the **repository root** (leave blank or `.`). If you set root to `apps/api`, Nixpacks will not see the root `nixpacks.toml` and will run `npm i` → you will get `EUNSUPPORTEDPROTOCOL` / `Unsupported URL Type "workspace:"`.
  - **Builder**: Prefer the repo **Dockerfile** so the pnpm-based build is used (see `railpack.json`: `"provider": "dockerfile"`). In Railway: Service → Settings → set **Builder** to **Dockerfile** if available.
  - **If using Nixpacks**: With root at repo root, the root `nixpacks.toml` is used (pnpm install/build/start). Build: leave default or set to `pnpm --filter @easyauth/shared build && pnpm --filter @easyauth/api build`. Start: **must** set to `pnpm --filter @easyauth/api start:prod` (root has no `start` script).
- **[Render](https://render.com)**: Create a new service, connect your GitHub repo, set environment variables. Use **repo root**. Build command must install devDependencies (Nest CLI is needed for `nest build`): use **`NODE_ENV=development pnpm install && pnpm --filter @easyauth/shared build && pnpm --filter @easyauth/api build`**. Start: **`pnpm --filter @easyauth/api start:prod`**. (Render sets NODE_ENV=production at build time, so without NODE_ENV=development for install you get "nest: not found".)
- **Heroku**: Use the Node.js buildpack, set workspace root to `apps/api` if needed
- **AWS/GCP**: Use Elastic Beanstalk, App Engine, or containerize with Docker

#### Health Check

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

### 4. Deploy the Frontend

#### Environment Variables (Required)

Set these on your web hosting platform:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

#### Build and Start Commands

- **Build command**: `pnpm install && pnpm --filter @easyauth/shared build && pnpm --filter @easyauth/web build`
- **Start command**: `pnpm --filter @easyauth/web start`

#### Platform-Specific Notes

- **[Vercel](https://vercel.com) (Recommended)**:
  1. In Vercel project settings, set **Root Directory** to **`apps/web`** (required so Vercel finds the `package.json` that has `next`).
  2. Leave **Build Command** and **Install Command** empty so `apps/web/vercel.json` is used: install `pnpm install`, build `pnpm --filter @easyauth/shared build && pnpm run build`.
  3. Add env var `NEXT_PUBLIC_API_URL=https://your-api-domain.com/api`.
- **Netlify**: Use the Next.js plugin. Set build command and environment variables in site settings.
- **AWS Amplify**: Connect your repo, configure build settings, and set environment variables.

### 5. Verify Deployment

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

## Security Considerations for Production

- **JWT_SECRET**: Never commit to version control. Use platform environment variables or secrets management.
- **HTTPS Only**: The `secure` cookie flag requires HTTPS. Ensure both API and web app are served over HTTPS.
- **CORS_ORIGIN**: Set to your exact frontend domain. Multiple origins are supported as a comma-separated list (e.g. `http://localhost:3000,https://your-app.vercel.app`). Do not use a trailing slash.
- **MongoDB**: Use strong credentials and restrict IP access.
- **Rate Limiting**: Currently only `/api/auth/signin` is rate-limited. Consider adding global rate limiting in production.
- **Monitoring**: Set up logging and error tracking (e.g., Sentry, Datadog, LogRocket).

## Example Deployment Stack

**Recommended for simplicity:**

- **Web**: [Vercel](https://vercel.com) (free tier, automatic HTTPS, great Next.js support)
- **API**: [Render](https://render.com) or [Railway](https://railway.app) (free tiers, automatic HTTPS)
- **Database**: MongoDB Atlas (free tier, managed, automatic backups)

**Cost**: Free tier available for all three services (suitable for development and small production workloads).

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Using Nixpacks"** and install step runs **`npm i`** (then `EUNSUPPORTEDPROTOCOL`) | Nixpacks is not seeing the repo root `nixpacks.toml`. Set **Root Directory** to the repo root (blank or `.`). Or switch the builder to **Dockerfile** so the repo’s pnpm Dockerfile is used. |
| `EUNSUPPORTEDPROTOCOL` / `Unsupported URL Type "workspace:"` | The build is using **npm**; this monorepo requires **pnpm**. **Fix:** Set the service **Root Directory** to the repository root (leave blank or `.`; do not use `apps/api`). Then either use the repo **Dockerfile** as the builder (Railway: Settings → Builder → Dockerfile), or ensure Nixpacks runs from repo root so it picks up `nixpacks.toml` and uses pnpm. |
| **`nest: not found`** (e.g. on Render) | The platform sets NODE_ENV=production during build, so pnpm skips devDependencies and the Nest CLI is not installed. Use build command **`NODE_ENV=development pnpm install && pnpm --filter @easyauth/shared build && pnpm --filter @easyauth/api build`**. |
| `FATAL: JWT_SECRET is set to an insecure placeholder value` | Generate a new secret with the command in step 1 and set it in your API environment variables |
| Cookie not being sent to API | Ensure `CORS_ORIGIN` matches your frontend URL exactly (including protocol and port) |
| `secure` cookie warning | Deploy both API and web over HTTPS (not HTTP) |
| Database connection fails | Check MongoDB connection string, IP whitelist, and credentials |
| 500 errors on API | Check API logs for details. Verify all required environment variables are set |

## Environment Variable Reference

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
