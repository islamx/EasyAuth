# Build and run @easyauth/api (monorepo: needs pnpm + workspace)
FROM node:20-bookworm-slim AS base
RUN apt-get update -y && apt-get install -y --no-install-recommends libatomic1 && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace and API + shared package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/api apps/api

# Install and build (shared then api)
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @easyauth/shared build && pnpm --filter @easyauth/api build

# Run the API (from repo root so node resolves @easyauth/shared)
WORKDIR /app/apps/api
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/main.js"]
