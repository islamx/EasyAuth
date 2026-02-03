# Production Deployment Guide

## Prerequisites

Before deploying to production, ensure you have:

1. A **MongoDB instance** (MongoDB Atlas recommended for managed hosting)
2. A **hosting platform** for the API (Railway, Render, Heroku, AWS, etc.)
3. A **hosting platform** for the web app (Vercel, Netlify, AWS Amplify, etc.)
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

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Set up database user credentials
3. Whitelist your API server's IP addresses (or `0.0.0.0/0` for development)
4. Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/easyauth`)

#### Option B: Self-hosted MongoDB

Ensure your MongoDB instance is:
- Accessible from your API server
- Secured with authentication
- Backed up regularly

### 3. Deploy the API

**Note:** Deploy only the API to Railway (or Docker/Render). The web app is deployed separately (e.g. Vercel); see section 4.

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
- **Railway (API only; do not deploy the web app here)**: Use the **repo root** as the service root (do not set root to `apps/api`). Prefer **Dockerfile** as the builder (see `railpack.json`: `"provider": "dockerfile"`) so the repo’s pnpm-based Dockerfile is used. If using Nixpacks, the root `nixpacks.toml` and `packageManager` in root `package.json` ensure pnpm is used. Build: leave default or set to `pnpm --filter @easyauth/shared build && pnpm --filter @easyauth/api build`. Start: **must** set to `pnpm --filter @easyauth/api start:prod` (root has no `start` script).
- **Render**: Create a new service, connect your GitHub repo, set environment variables. Use repo root and pnpm build/start commands as above.
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

- **Vercel (Recommended)**: Deploy with one click. Vercel auto-detects Next.js and handles builds. Set `NEXT_PUBLIC_API_URL` in project settings.
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
- **CORS_ORIGIN**: Set to your exact frontend domain. For multiple domains, you'll need to modify the API to accept an array.
- **MongoDB**: Use strong credentials and restrict IP access.
- **Rate Limiting**: Currently only `/api/auth/signin` is rate-limited. Consider adding global rate limiting in production.
- **Monitoring**: Set up logging and error tracking (e.g., Sentry, Datadog, LogRocket).

## Example Deployment Stack

**Recommended for simplicity:**

- **Web**: Vercel (free tier, automatic HTTPS, great Next.js support)
- **API**: Railway (free trial, easy deployment, automatic HTTPS)
- **Database**: MongoDB Atlas (free tier, managed, automatic backups)

**Cost**: Free tier available for all three services (suitable for development and small production workloads).

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `EUNSUPPORTEDPROTOCOL` / `Unsupported URL Type "workspace:"` | The build is using **npm**; this monorepo requires **pnpm**. Set the service **root to the repository root** (not `apps/api`). Use the repo **Dockerfile** as the builder when possible (Railway: ensure Dockerfile is selected). Root `nixpacks.toml` overrides install to use pnpm only when the build runs from repo root. |
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
