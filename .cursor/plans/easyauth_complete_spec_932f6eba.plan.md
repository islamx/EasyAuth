---
name: EasyAuth Complete Spec
overview: Complete YAML specification for EasyAuth full-stack authentication monorepo with Next.js, NestJS, MongoDB, JWT - including all standards, DoD, Manual QA, and requirements mapping.
todos:
  - id: review-yaml
    content: Review the YAML spec for completeness against all requirements (A-M)
    status: pending
isProject: false
---

# EasyAuth - Complete Full-Stack Authentication Spec

Below is the complete YAML specification as requested. This single YAML document contains all requirements, mappings, standards, contracts, tests, and verification criteria.

```yaml
# ============================================================================
# EASYAUTH - COMPLETE PROJECT SPECIFICATION
# ============================================================================
name: EasyAuth Full Stack Authentication
overview: >
  Production-ready full-stack authentication monorepo with Next.js 14 (App Router)
  frontend and NestJS backend, using MongoDB for persistence, JWT for auth,
  pnpm workspaces, Tailwind CSS (dark mode), and comprehensive testing.

isProject: true

# ============================================================================
# TODOS - Ordered, Granular, Verifiable
# ============================================================================
todos:
  # Phase 1: Root Setup
  - id: "1.1-root-folder"
    content: "Create E:\\projects\\EasyAuth folder structure"
    status: pending
  - id: "1.2-root-package-json"
    content: "Create root package.json with pnpm workspaces and scripts (dev, dev:web, dev:api, build, lint, format, test)"
    status: pending
  - id: "1.3-pnpm-workspace"
    content: "Create pnpm-workspace.yaml with apps/* pattern"
    status: pending
  - id: "1.4-eslint-config"
    content: "Create root .eslintrc.js with TypeScript + Prettier integration"
    status: pending
  - id: "1.5-prettier-config"
    content: "Create root .prettierrc with consistent formatting rules"
    status: pending
  - id: "1.6-tsconfig-base"
    content: "Create tsconfig.base.json with shared compiler options"
    status: pending
  - id: "1.7-root-env-example"
    content: "Create root .env.example with guidance comments"
    status: pending
  - id: "1.8-gitignore"
    content: "Create .gitignore for node_modules, .env, dist, .next"
    status: pending

  # Phase 2: API Scaffold
  - id: "2.1-api-package-json"
    content: "Create apps/api/package.json with NestJS deps, scripts (start:dev, build, test:e2e)"
    status: pending
  - id: "2.2-api-tsconfig"
    content: "Create apps/api/tsconfig.json extending base"
    status: pending
  - id: "2.3-api-nest-cli"
    content: "Create apps/api/nest-cli.json"
    status: pending
  - id: "2.4-api-env-example"
    content: "Create apps/api/.env.example with PORT=4000, CORS_ORIGIN=http://localhost:3000"
    status: pending
  - id: "2.5-api-main"
    content: "Create apps/api/src/main.ts with Helmet, CORS, ValidationPipe, global filter"
    status: pending
  - id: "2.6-api-app-module"
    content: "Create apps/api/src/app.module.ts with ConfigModule, MongooseModule, ThrottlerModule"
    status: pending

  # Phase 3: Common Utilities
  - id: "3.1-password-policy"
    content: "Create apps/api/src/common/validation/password.policy.ts (canonical regex + messages)"
    status: pending
  - id: "3.2-request-id-middleware"
    content: "Create apps/api/src/common/middleware/request-id.middleware.ts"
    status: pending
  - id: "3.3-logging-interceptor"
    content: "Create apps/api/src/common/interceptors/logging.interceptor.ts (no sensitive data)"
    status: pending
  - id: "3.4-exception-filter"
    content: "Create apps/api/src/common/filters/http-exception.filter.ts with standard error shape"
    status: pending

  # Phase 4: Users Module
  - id: "4.1-user-schema"
    content: "Create apps/api/src/users/schemas/user.schema.ts"
    status: pending
  - id: "4.2-users-service"
    content: "Create apps/api/src/users/users.service.ts (findByEmail, create)"
    status: pending
  - id: "4.3-users-module"
    content: "Create apps/api/src/users/users.module.ts"
    status: pending

  # Phase 5: Auth Module
  - id: "5.1-signup-dto"
    content: "Create apps/api/src/auth/dto/signup.dto.ts using password.policy"
    status: pending
  - id: "5.2-signin-dto"
    content: "Create apps/api/src/auth/dto/signin.dto.ts"
    status: pending
  - id: "5.3-jwt-strategy"
    content: "Create apps/api/src/auth/strategies/jwt.strategy.ts"
    status: pending
  - id: "5.4-jwt-guard"
    content: "Create apps/api/src/auth/guards/jwt-auth.guard.ts"
    status: pending
  - id: "5.5-auth-service"
    content: "Create apps/api/src/auth/auth.service.ts (signup, signin, getProfile)"
    status: pending
  - id: "5.6-auth-controller"
    content: "Create apps/api/src/auth/auth.controller.ts (POST /auth/signup, POST /auth/signin, GET /me)"
    status: pending
  - id: "5.7-auth-module"
    content: "Create apps/api/src/auth/auth.module.ts"
    status: pending

  # Phase 6: Web Scaffold
  - id: "6.1-web-package-json"
    content: "Create apps/web/package.json with Next.js, clsx, tailwind-merge, react-hook-form, zod"
    status: pending
  - id: "6.2-web-tsconfig"
    content: "Create apps/web/tsconfig.json"
    status: pending
  - id: "6.3-web-next-config"
    content: "Create apps/web/next.config.js"
    status: pending
  - id: "6.4-web-tailwind-config"
    content: "Create apps/web/tailwind.config.ts with dark theme (zinc/emerald)"
    status: pending
  - id: "6.5-web-postcss-config"
    content: "Create apps/web/postcss.config.js"
    status: pending
  - id: "6.6-web-env-example"
    content: "Create apps/web/.env.example with NEXT_PUBLIC_API_URL=http://localhost:4000"
    status: pending
  - id: "6.7-web-globals-css"
    content: "Create apps/web/src/app/globals.css (Tailwind directives ONLY)"
    status: pending
  - id: "6.8-web-layout"
    content: "Create apps/web/src/app/layout.tsx with Inter font, dark theme"
    status: pending

  # Phase 7: Web Lib + Hooks
  - id: "7.1-cn-helper"
    content: "Create apps/web/src/lib/cn.ts (clsx + tailwind-merge)"
    status: pending
  - id: "7.2-password-policy-fe"
    content: "Create apps/web/src/lib/passwordPolicy.ts (mirrors backend exactly)"
    status: pending
  - id: "7.3-validations"
    content: "Create apps/web/src/lib/validations.ts (Zod schemas)"
    status: pending
  - id: "7.4-auth-helpers"
    content: "Create apps/web/src/lib/auth.ts (token helpers, NEVER log tokens)"
    status: pending
  - id: "7.5-api-client"
    content: "Create apps/web/src/lib/api.ts (SINGLE fetch wrapper, 401 handling)"
    status: pending
  - id: "7.6-use-auth-guard"
    content: "Create apps/web/src/hooks/useAuthGuard.ts"
    status: pending

  # Phase 8: Web Components + Pages
  - id: "8.1-button-component"
    content: "Create apps/web/src/components/ui/Button.tsx (uses cn())"
    status: pending
  - id: "8.2-input-component"
    content: "Create apps/web/src/components/ui/Input.tsx (uses cn())"
    status: pending
  - id: "8.3-card-component"
    content: "Create apps/web/src/components/ui/Card.tsx (uses cn())"
    status: pending
  - id: "8.4-field-component"
    content: "Create apps/web/src/components/ui/Field.tsx (uses cn())"
    status: pending
  - id: "8.5-brandmark-component"
    content: "Create apps/web/src/components/BrandMark.tsx"
    status: pending
  - id: "8.6-authcard-component"
    content: "Create apps/web/src/components/auth/AuthCard.tsx"
    status: pending
  - id: "8.7-authheader-component"
    content: "Create apps/web/src/components/auth/AuthHeader.tsx"
    status: pending
  - id: "8.8-topbar-component"
    content: "Create apps/web/src/components/TopBar.tsx"
    status: pending
  - id: "8.9-root-page"
    content: "Create apps/web/src/app/page.tsx (redirect logic)"
    status: pending
  - id: "8.10-signin-page"
    content: "Create apps/web/src/app/(auth)/signin/page.tsx"
    status: pending
  - id: "8.11-signup-page"
    content: "Create apps/web/src/app/(auth)/signup/page.tsx"
    status: pending
  - id: "8.12-app-page"
    content: "Create apps/web/src/app/app/page.tsx (protected)"
    status: pending

  # Phase 9: Tests
  - id: "9.1-jest-e2e-config"
    content: "Create apps/api/test/jest-e2e.json"
    status: pending
  - id: "9.2-e2e-tests"
    content: "Create apps/api/test/app.e2e-spec.ts with all test cases"
    status: pending

  # Phase 10: CI + Docs
  - id: "10.1-github-ci"
    content: "Create .github/workflows/ci.yml"
    status: pending
  - id: "10.2-readme"
    content: "Create README.md with all required sections including port defaults"
    status: pending

  # Phase 11: Verification
  - id: "11.1-lint-check"
    content: "Run pnpm lint and fix any issues"
    status: pending
  - id: "11.2-build-check"
    content: "Run pnpm build and verify success"
    status: pending
  - id: "11.3-test-check"
    content: "Run pnpm test and verify all pass"
    status: pending
  - id: "11.4-manual-qa"
    content: "Execute Manual QA Checklist (see spec)"
    status: pending

# ============================================================================
# REQUIREMENTS MAPPING
# ============================================================================
requirements_mapping:
  validation_parity:
    requirement: "Password policy must be identical on frontend and backend"
    satisfied_by:
      - "apps/api/src/common/validation/password.policy.ts"
      - "apps/web/src/lib/passwordPolicy.ts"
    verification: "Both files export identical PASSWORD_REGEX and PASSWORD_MESSAGE"

  jwt_authentication:
    requirement: "JWT-based auth with secure token handling"
    satisfied_by:
      - "apps/api/src/auth/strategies/jwt.strategy.ts"
      - "apps/api/src/auth/guards/jwt-auth.guard.ts"
      - "apps/web/src/lib/auth.ts"
    verification: "Token stored in localStorage, attached via Authorization header, cleared on 401"

  protected_routes:
    requirement: "/app route requires authentication"
    satisfied_by:
      - "apps/web/src/hooks/useAuthGuard.ts"
      - "apps/web/src/app/app/page.tsx"
    verification: "Unauthenticated users redirected to /signin"

  error_handling:
    requirement: "Consistent error response shape with requestId"
    satisfied_by:
      - "apps/api/src/common/filters/http-exception.filter.ts"
      - "apps/api/src/common/middleware/request-id.middleware.ts"
    verification: "All errors return {statusCode, message, error, path, timestamp, requestId}"

  rate_limiting:
    requirement: "Rate limit signin endpoint"
    satisfied_by:
      - "apps/api/src/auth/auth.controller.ts (@Throttle decorator)"
      - "apps/api/src/app.module.ts (ThrottlerModule)"
    verification: "10 requests per 60s on POST /auth/signin"

  tailwind_only:
    requirement: "All styling via Tailwind utilities, no custom CSS"
    satisfied_by:
      - "apps/web/src/app/globals.css (directives only)"
      - "apps/web/src/lib/cn.ts (clsx + tailwind-merge)"
      - "All component files using cn() for class composition"
    verification: "No .module.css, no styled-components, no style={{}}"

  local_dev_ports:
    requirement: "Web on 3000, API on 4000"
    satisfied_by:
      - "apps/api/.env.example (PORT=4000)"
      - "apps/web/.env.example (NEXT_PUBLIC_API_URL=http://localhost:4000)"
      - "README.md (explicit port documentation)"
    verification: "Default dev runs web:3000, api:4000"

  root_scripts:
    requirement: "Complete set of root npm scripts"
    satisfied_by:
      - "package.json (dev, dev:web, dev:api, build, lint, format, test)"
    verification: "All scripts execute successfully"

  cn_helper:
    requirement: "Tailwind class reuse via cn() helper"
    satisfied_by:
      - "apps/web/src/lib/cn.ts"
      - "All UI components in apps/web/src/components/ui/"
    verification: "No repeated large Tailwind class strings across pages"

  e2e_tests:
    requirement: "Backend E2E tests for all auth flows"
    satisfied_by:
      - "apps/api/test/app.e2e-spec.ts"
      - "apps/api/test/jest-e2e.json"
    verification: "7 test cases pass: signup, signin, /me with/without token"

  ci_pipeline:
    requirement: "GitHub Actions CI for lint, build, test"
    satisfied_by:
      - ".github/workflows/ci.yml"
    verification: "CI runs on push/PR, all steps pass"

# ============================================================================
# PROJECT STRUCTURE
# ============================================================================
project_structure:
  root:
    - package.json
    - pnpm-workspace.yaml
    - .eslintrc.js
    - .prettierrc
    - tsconfig.base.json
    - .env.example
    - .gitignore
    - README.md
    - .github/workflows/ci.yml

  apps_api:
    path: "apps/api"
    files:
      - package.json
      - tsconfig.json
      - nest-cli.json
      - .env.example
      - src/main.ts
      - src/app.module.ts
      - src/common/validation/password.policy.ts
      - src/common/middleware/request-id.middleware.ts
      - src/common/interceptors/logging.interceptor.ts
      - src/common/filters/http-exception.filter.ts
      - src/users/schemas/user.schema.ts
      - src/users/users.service.ts
      - src/users/users.module.ts
      - src/auth/dto/signup.dto.ts
      - src/auth/dto/signin.dto.ts
      - src/auth/strategies/jwt.strategy.ts
      - src/auth/guards/jwt-auth.guard.ts
      - src/auth/auth.service.ts
      - src/auth/auth.controller.ts
      - src/auth/auth.module.ts
      - test/jest-e2e.json
      - test/app.e2e-spec.ts

  apps_web:
    path: "apps/web"
    files:
      - package.json
      - tsconfig.json
      - next.config.js
      - tailwind.config.ts
      - postcss.config.js
      - .env.example
      - src/app/globals.css
      - src/app/layout.tsx
      - src/app/page.tsx
      - src/app/(auth)/signin/page.tsx
      - src/app/(auth)/signup/page.tsx
      - src/app/app/page.tsx
      - src/lib/cn.ts
      - src/lib/passwordPolicy.ts
      - src/lib/validations.ts
      - src/lib/auth.ts
      - src/lib/api.ts
      - src/hooks/useAuthGuard.ts
      - src/components/ui/Button.tsx
      - src/components/ui/Input.tsx
      - src/components/ui/Card.tsx
      - src/components/ui/Field.tsx
      - src/components/BrandMark.tsx
      - src/components/auth/AuthCard.tsx
      - src/components/auth/AuthHeader.tsx
      - src/components/TopBar.tsx

# ============================================================================
# UI SPECIFICATION
# ============================================================================
ui_spec:
  theme:
    mode: dark
    background: "zinc-950 (#09090b)"
    surface: "zinc-900 (#18181b)"
    border: "zinc-800 (#27272a)"
    muted: "zinc-500 (#71717a)"
    foreground: "zinc-50 (#fafafa)"
    primary: "emerald-500 (#10b981)"
    primary_hover: "emerald-600 (#059669)"
    error: "red-400 (#f87171)"

  typography:
    font_family: "Inter (Google Fonts)"
    headings: "font-bold tracking-tight"
    body: "text-base text-foreground"
    muted_text: "text-sm text-muted"

  components:
    Button:
      variants:
        primary: "bg-primary text-white hover:bg-primary-hover"
        ghost: "text-muted hover:text-foreground hover:bg-zinc-800"
        outline: "border border-border text-foreground hover:bg-zinc-800"
      states:
        disabled: "opacity-50 cursor-not-allowed"
        loading: "Shows spinner + text"
      sizing: "py-3 px-4 rounded-lg"

    Input:
      base: "w-full bg-background border border-border rounded-lg px-4 py-3"
      focus: "focus:ring-2 focus:ring-primary/50 focus:border-primary"
      error: "border-red-400"
      transition: "transition-colors"

    Card:
      base: "bg-surface border border-border rounded-xl p-8 shadow-xl"

    Field:
      structure: "label + Input + error message"
      label: "block text-sm font-medium mb-2"
      error: "text-red-400 text-sm mt-1"
      accessibility: "aria-describedby links input to error"

  layouts:
    auth_pages:
      container: "min-h-screen flex items-center justify-center"
      card_width: "max-w-[420px] w-full mx-4"
      no_navbar: true
      footer: "mt-4 text-center text-muted"

    protected_page:
      topbar: "sticky top-0 bg-surface/80 backdrop-blur border-b border-border h-16"
      content: "max-w-4xl mx-auto px-4 py-8"

  form_ux:
    labels: "Always visible above input"
    placeholders: "Optional hints only"
    field_errors: "Red text below input on blur/submit"
    api_errors: "Red banner above form"
    submit_button: "Full width, shows loading spinner when submitting"
    disabled_state: "Button disabled when invalid or submitting"

  loading_states:
    auth_pages: "Button shows spinner + 'Signing in...' / 'Creating account...'"
    protected_page: "Full-screen centered spinner while checking auth"

  accessibility:
    - "All inputs have associated label elements"
    - "Focus states visible (ring-2)"
    - "Tab order logical (top to bottom)"
    - "Error messages linked via aria-describedby"
    - "Color contrast WCAG AA (15.6:1 for zinc-50 on zinc-950)"

# ============================================================================
# FRONTEND STANDARDS
# ============================================================================
frontend_standards:
  styling_rules:
    allowed:
      - "Tailwind utility classes"
      - "cn() helper for class composition"
    forbidden:
      - "Custom .css/.scss/.module.css files"
      - "CSS modules (*.module.css)"
      - "styled-components or CSS-in-JS"
      - "Inline style objects (style={{}})"
      - "Repeating large Tailwind class strings across pages"

  globals_css_content: |
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

  cn_helper:
    path: "apps/web/src/lib/cn.ts"
    implementation: |
      import { clsx, type ClassValue } from 'clsx';
      import { twMerge } from 'tailwind-merge';
      
      export function cn(...inputs: ClassValue[]) {
        return twMerge(clsx(inputs));
      }
    usage: "All reusable components MUST use cn() for class composition"

  component_rules:
    ui_primitives:
      - "Button: variants via cn(), not separate CSS"
      - "Input: styled via Tailwind, error state via cn()"
      - "Card: accepts className prop merged via cn()"
      - "Field: composes label + Input + error"
    thin_pages:
      - "Pages only assemble components and call hooks"
      - "No business logic in page components"
      - "No direct fetch calls (use lib/api.ts)"

  form_implementation:
    library: "react-hook-form with @hookform/resolvers"
    validation: "Zod schemas in lib/validations.ts"
    field_errors: "Display via Field component"
    api_errors: "Display in error banner above form"

  security_rules:
    - "NEVER console.log tokens"
    - "NEVER include tokens in error messages"
    - "On 401: immediately clear token and redirect to /signin"
    - "Always verify token with /me endpoint, don't trust localStorage alone"

# ============================================================================
# BACKEND STANDARDS
# ============================================================================
backend_standards:
  architecture:
    controllers: "HTTP shape only (routes, decorators, response types)"
    services: "Business logic (validation, hashing, JWT generation)"
    schemas: "Mongoose schema definitions only"
    dtos: "Request validation shapes"
    guards: "Authentication/authorization checks"
    filters: "Exception handling"
    interceptors: "Request/response transformation, logging"
    middleware: "Request preprocessing (request ID)"

  password_policy:
    path: "apps/api/src/common/validation/password.policy.ts"
    exports:
      PASSWORD_MIN_LENGTH: 8
      PASSWORD_REGEX: '/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/'
      PASSWORD_MESSAGE: "Password must be at least 8 characters with at least 1 letter, 1 number, and 1 special character (@$!%*#?&)"

  security_rules:
    bcrypt_salt_rounds: 10
    jwt_secret: "REQUIRED via env, throw on startup if missing"
    no_default_secrets: "Never hardcode JWT_SECRET fallback"
    no_sensitive_logging: "Never log passwords, tokens, Authorization headers"
    rate_limit_scope: "Only on /auth/signin"
    helmet: "Enabled in main.ts"
    cors_origin: "Configurable via CORS_ORIGIN env var"
    validation_pipe: "Global with whitelist, forbidNonWhitelisted"

  logging_rules:
    must_log:
      - "HTTP method"
      - "Path"
      - "Status code"
      - "Duration (ms)"
      - "Request ID"
    must_not_log:
      - "Request body (may contain password)"
      - "Authorization header"
      - "Tokens"
      - "User credentials"

# ============================================================================
# API CONTRACT
# ============================================================================
api_contract:
  base_url: "http://localhost:4000"

  endpoints:
    signup:
      method: POST
      path: "/auth/signup"
      request_body:
        email: "string (valid email, lowercase)"
        name: "string (min 3 chars)"
        password: "string (min 8 chars, 1 letter, 1 number, 1 special)"
      responses:
        201:
          body:
            accessToken: "string (JWT)"
            user:
              id: "string"
              email: "string"
              name: "string"
        400:
          condition: "Validation error (weak password, invalid email)"
          body: "Standard error shape"
        409:
          condition: "Email already exists"
          body: "Standard error shape"

    signin:
      method: POST
      path: "/auth/signin"
      rate_limit: "10 requests per 60 seconds per IP"
      request_body:
        email: "string"
        password: "string"
      responses:
        200:
          body:
            accessToken: "string (JWT)"
            user:
              id: "string"
              email: "string"
              name: "string"
        401:
          condition: "Invalid credentials"
          body: "Standard error shape"
        429:
          condition: "Rate limit exceeded"
          body: "Standard error shape"

    me:
      method: GET
      path: "/me"
      headers:
        Authorization: "Bearer <token>"
      responses:
        200:
          body:
            id: "string"
            email: "string"
            name: "string"
        401:
          condition: "Missing or invalid token"
          body: "Standard error shape"

# ============================================================================
# ERROR SHAPE
# ============================================================================
error_shape:
  format:
    statusCode: "number (HTTP status code)"
    message: "string | string[] (error messages)"
    error: "string (HTTP status text)"
    path: "string (request path)"
    timestamp: "string (ISO 8601)"
    requestId: "string (UUID)"

  example:
    statusCode: 400
    message:
      - "password must be at least 8 characters"
    error: "Bad Request"
    path: "/auth/signup"
    timestamp: "2026-02-03T12:00:00.000Z"
    requestId: "550e8400-e29b-41d4-a716-446655440000"

# ============================================================================
# ENVIRONMENT VARIABLES
# ============================================================================
environment:
  root_env_example:
    path: ".env.example"
    content: |
      # EasyAuth Environment Variables
      # Copy relevant vars to apps/api/.env and apps/web/.env.local
      # See apps/api/.env.example for backend vars
      # See apps/web/.env.example for frontend vars

  api_env_example:
    path: "apps/api/.env.example"
    content: |
      # MongoDB connection string
      MONGO_URI=mongodb://localhost:27017/easyauth
      
      # JWT Configuration
      JWT_SECRET=your-super-secret-jwt-key-change-in-production
      JWT_EXPIRES_IN=1h
      
      # Server - DEFAULT PORT 4000
      PORT=4000
      
      # CORS - Frontend origin (must match web URL)
      CORS_ORIGIN=http://localhost:3000

  web_env_example:
    path: "apps/web/.env.example"
    content: |
      # API Base URL - DEFAULT PORT 4000
      NEXT_PUBLIC_API_URL=http://localhost:4000

  local_dev_defaults:
    web_url: "http://localhost:3000"
    api_url: "http://localhost:4000"
    note: "These are the default ports. To change, update both .env files to maintain CORS alignment."

# ============================================================================
# ROOT SCRIPTS
# ============================================================================
root_scripts:
  path: "package.json"
  scripts:
    dev:
      command: "concurrently \"pnpm dev:api\" \"pnpm dev:web\""
      description: "Runs both web and api concurrently"
    dev_web:
      command: "pnpm --filter web dev"
      description: "Runs Next.js dev server on port 3000"
    dev_api:
      command: "pnpm --filter api start:dev"
      description: "Runs NestJS dev server on port 4000"
    build:
      command: "pnpm --filter web build && pnpm --filter api build"
      description: "Builds both web and api for production"
    lint:
      command: "pnpm --filter web lint && pnpm --filter api lint"
      description: "Lints both web and api"
    format:
      command: "prettier --write \"apps/**/*.{ts,tsx,js,json}\""
      description: "Formats all TypeScript/JavaScript files with Prettier"
    test:
      command: "pnpm --filter api test:e2e"
      description: "Runs API e2e tests with mongodb-memory-server"

  dependencies:
    devDependencies:
      - concurrently
      - prettier

# ============================================================================
# TESTS SPECIFICATION
# ============================================================================
tests:
  e2e:
    path: "apps/api/test/app.e2e-spec.ts"
    setup:
      - "mongodb-memory-server for isolated test database"
      - "Create test module with all providers"
      - "Clear database between tests"

    test_cases:
      - id: "signup-success"
        description: "Signup with valid data"
        endpoint: "POST /auth/signup"
        input:
          email: "test@example.com"
          name: "Test User"
          password: "SecurePass1!"
        expected_status: 201
        expected_body: "Contains accessToken and user object"

      - id: "signup-weak-password"
        description: "Signup with weak password"
        endpoint: "POST /auth/signup"
        input:
          email: "test@example.com"
          name: "Test User"
          password: "weak"
        expected_status: 400
        expected_body: "Contains password validation error"

      - id: "signup-duplicate"
        description: "Signup with existing email"
        endpoint: "POST /auth/signup"
        input:
          email: "existing@example.com"
          name: "Test User"
          password: "SecurePass1!"
        expected_status: 409
        expected_body: "Email already exists error"

      - id: "signin-success"
        description: "Signin with valid credentials"
        endpoint: "POST /auth/signin"
        input:
          email: "test@example.com"
          password: "SecurePass1!"
        expected_status: 200
        expected_body: "Contains accessToken and user object"

      - id: "signin-invalid"
        description: "Signin with wrong password"
        endpoint: "POST /auth/signin"
        input:
          email: "test@example.com"
          password: "WrongPass1!"
        expected_status: 401
        expected_body: "Invalid credentials error"

      - id: "me-no-token"
        description: "Get /me without token"
        endpoint: "GET /me"
        headers: {}
        expected_status: 401
        expected_body: "Unauthorized error"

      - id: "me-with-token"
        description: "Get /me with valid token"
        endpoint: "GET /me"
        headers:
          Authorization: "Bearer <valid_token>"
        expected_status: 200
        expected_body: "User object (id, email, name)"

# ============================================================================
# CI SPECIFICATION
# ============================================================================
ci:
  path: ".github/workflows/ci.yml"
  triggers:
    - "push to main"
    - "pull_request to main"

  jobs:
    build_and_test:
      runs_on: "ubuntu-latest"
      services:
        mongodb:
          image: "mongo:6"
          ports:
            - "27017:27017"
      steps:
        - "Checkout code"
        - "Setup Node.js 20"
        - "Setup pnpm"
        - "Install dependencies (pnpm install)"
        - "Lint (pnpm lint)"
        - "Build (pnpm build)"
        - "Test (pnpm test)"

# ============================================================================
# README OUTLINE
# ============================================================================
readme_outline:
  sections:
    - title: "EasyAuth"
      content: "1-paragraph overview of the project"

    - title: "Tech Stack"
      content: |
        - Frontend: Next.js 14 (App Router), Tailwind CSS, React Hook Form, Zod
        - Backend: NestJS, MongoDB (Mongoose), JWT, Passport
        - Tooling: pnpm workspaces, TypeScript, ESLint, Prettier

    - title: "Quick Start"
      content: |
        1. Clone the repository
        2. Install dependencies: `pnpm install`
        3. Copy env files: `cp apps/api/.env.example apps/api/.env`
        4. Start MongoDB locally
        5. Run dev: `pnpm dev`

    - title: "Default Ports"
      content: |
        - Web: http://localhost:3000
        - API: http://localhost:4000
        
        To change ports:
        1. Update apps/api/.env (PORT and CORS_ORIGIN)
        2. Update apps/web/.env.local (NEXT_PUBLIC_API_URL)
        3. Ensure CORS_ORIGIN matches the web URL

    - title: "Commands"
      content: |
        - `pnpm dev` - Run both web and api
        - `pnpm dev:web` - Run web only
        - `pnpm dev:api` - Run api only
        - `pnpm build` - Build both
        - `pnpm lint` - Lint both
        - `pnpm format` - Format with Prettier
        - `pnpm test` - Run API e2e tests

    - title: "Environment Setup"
      content: "Instructions for setting up .env files for api and web"

    - title: "API Endpoints"
      content: "curl examples for signup, signin, /me"

    - title: "Error Response Shape"
      content: "JSON example with all fields"

    - title: "Security"
      content: "bcrypt, JWT, Helmet, rate limiting, CORS"

    - title: "Component Architecture"
      content: "Where reusable components live, cn() helper usage"

    - title: "Styling"
      content: "Tailwind classes only, no custom CSS, use cn() for composition"

    - title: "Auth Guard"
      content: "How useAuthGuard works for protected routes"

# ============================================================================
# DEFINITION OF DONE (DoD)
# ============================================================================
definition_of_done:
  criteria:
    code_quality:
      - criterion: "pnpm lint passes with zero errors"
        verification: "Run `pnpm lint` - exit code 0"
      - criterion: "pnpm build succeeds for both apps"
        verification: "Run `pnpm build` - exit code 0"
      - criterion: "No TypeScript errors"
        verification: "Build output shows no type errors"

    tests:
      - criterion: "All 7 E2E test cases pass"
        verification: "Run `pnpm test` - 7 passing"
      - criterion: "Tests run in isolation (mongodb-memory-server)"
        verification: "Tests don't require external MongoDB"

    functionality:
      - criterion: "Signup creates user and returns JWT"
        verification: "POST /auth/signup returns 201 with accessToken"
      - criterion: "Signin validates credentials and returns JWT"
        verification: "POST /auth/signin returns 200 with accessToken"
      - criterion: "/me returns user when authenticated"
        verification: "GET /me with valid token returns 200"
      - criterion: "/me returns 401 when unauthenticated"
        verification: "GET /me without token returns 401"
      - criterion: "Rate limiting works on signin"
        verification: "11th request in 60s returns 429"

    security:
      - criterion: "Passwords are hashed with bcrypt"
        verification: "Database shows hashed passwords, not plaintext"
      - criterion: "JWT_SECRET is required"
        verification: "App fails to start without JWT_SECRET env var"
      - criterion: "No sensitive data in logs"
        verification: "Logs show no passwords or tokens"

    ui:
      - criterion: "Dark theme renders correctly"
        verification: "Visual inspection shows zinc/emerald palette"
      - criterion: "Forms show validation errors"
        verification: "Invalid input shows red error messages"
      - criterion: "Loading states work"
        verification: "Buttons show spinner during submission"
      - criterion: "Protected route redirects unauthenticated users"
        verification: "Accessing /app without token redirects to /signin"

    documentation:
      - criterion: "README contains all required sections"
        verification: "README has quickstart, commands, ports, API examples"
      - criterion: ".env.example files are complete"
        verification: "All required env vars documented with defaults"

# ============================================================================
# MANUAL QA CHECKLIST
# ============================================================================
manual_qa_checklist:
  prerequisites:
    - "MongoDB running locally"
    - "pnpm install completed"
    - "apps/api/.env configured"
    - "apps/web/.env.local configured"
    - "pnpm dev running (web:3000, api:4000)"

  test_cases:
    - id: "QA-01"
      name: "Signup - Valid"
      steps:
        - "Navigate to http://localhost:3000/signup"
        - "Enter email: qa-test@example.com"
        - "Enter name: QA Tester"
        - "Enter password: SecurePass1!"
        - "Click 'Create account'"
      expected_result: "Redirects to /app, shows welcome message"
      expected_status: "201 from API"
      ui_state: "Shows 'Creating account...' during submission"

    - id: "QA-02"
      name: "Signup - Weak Password"
      steps:
        - "Navigate to http://localhost:3000/signup"
        - "Enter email: qa-test2@example.com"
        - "Enter name: QA Tester"
        - "Enter password: weak"
        - "Click 'Create account'"
      expected_result: "Shows password validation error below field"
      expected_status: "400 from API (if submitted) or client-side validation"
      ui_state: "Red error text appears below password field"

    - id: "QA-03"
      name: "Signup - Duplicate Email"
      steps:
        - "Navigate to http://localhost:3000/signup"
        - "Enter email: qa-test@example.com (already exists)"
        - "Enter name: QA Tester"
        - "Enter password: SecurePass1!"
        - "Click 'Create account'"
      expected_result: "Shows error banner 'Email already exists'"
      expected_status: "409 from API"
      ui_state: "Red banner appears above form"

    - id: "QA-04"
      name: "Signin - Valid"
      steps:
        - "Navigate to http://localhost:3000/signin"
        - "Enter email: qa-test@example.com"
        - "Enter password: SecurePass1!"
        - "Click 'Sign in'"
      expected_result: "Redirects to /app, shows welcome message"
      expected_status: "200 from API"
      ui_state: "Shows 'Signing in...' during submission"

    - id: "QA-05"
      name: "Signin - Invalid Password"
      steps:
        - "Navigate to http://localhost:3000/signin"
        - "Enter email: qa-test@example.com"
        - "Enter password: WrongPassword1!"
        - "Click 'Sign in'"
      expected_result: "Shows error banner 'Invalid credentials'"
      expected_status: "401 from API"
      ui_state: "Red banner appears above form"

    - id: "QA-06"
      name: "Verify Token Stored"
      steps:
        - "Complete successful signin (QA-04)"
        - "Open browser DevTools > Application > Local Storage"
        - "Check for token key"
      expected_result: "Token exists in localStorage"
      expected_status: "N/A"
      ui_state: "N/A"

    - id: "QA-07"
      name: "Access /app - Protected (Authenticated)"
      steps:
        - "With valid token in localStorage"
        - "Navigate to http://localhost:3000/app"
      expected_result: "Page loads with TopBar and welcome message"
      expected_status: "200 from /me API call"
      ui_state: "Shows loading spinner briefly, then content"

    - id: "QA-08"
      name: "Access /app - Protected (Unauthenticated)"
      steps:
        - "Clear localStorage (remove token)"
        - "Navigate to http://localhost:3000/app"
      expected_result: "Redirects to /signin"
      expected_status: "N/A (no API call made)"
      ui_state: "Briefly shows loading, then redirects"

    - id: "QA-09"
      name: "Call /me Without Token"
      steps:
        - "Open terminal"
        - "Run: curl http://localhost:4000/me"
      expected_result: "Returns 401 Unauthorized"
      expected_status: "401"
      ui_state: "N/A"

    - id: "QA-10"
      name: "Call /me With Valid Token"
      steps:
        - "Get token from successful signin"
        - "Run: curl http://localhost:4000/me -H 'Authorization: Bearer <token>'"
      expected_result: "Returns user object {id, email, name}"
      expected_status: "200"
      ui_state: "N/A"

    - id: "QA-11"
      name: "Logout"
      steps:
        - "From /app page, click 'Logout' button"
      expected_result: "Redirects to /signin"
      expected_status: "N/A"
      ui_state: "Token removed from localStorage"

    - id: "QA-12"
      name: "Access /app After Logout"
      steps:
        - "After logout (QA-11), navigate to http://localhost:3000/app"
      expected_result: "Redirects to /signin"
      expected_status: "N/A"
      ui_state: "Cannot access protected route"

    - id: "QA-13"
      name: "Error Banner Display"
      steps:
        - "Trigger any API error (e.g., invalid signin)"
      expected_result: "Red banner appears above form with error message"
      expected_status: "Varies (401, 409, etc.)"
      ui_state: "Banner is visible, dismissible or clears on retry"

    - id: "QA-14"
      name: "Field Error Display"
      steps:
        - "On signup form, enter invalid password"
        - "Blur the field or submit"
      expected_result: "Red error text appears below password field"
      expected_status: "N/A (client-side)"
      ui_state: "Error text matches PASSWORD_MESSAGE"

# ============================================================================
# FINAL VERIFICATION
# ============================================================================
final_verification:
  automated_checks:
    - command: "pnpm lint"
      expected: "Exit code 0, no errors"
    - command: "pnpm build"
      expected: "Exit code 0, both apps built"
    - command: "pnpm test"
      expected: "7 tests passing"

  manual_checks:
    - "All 14 QA test cases pass"
    - "README.md contains all required sections"
    - "Both .env.example files have correct defaults (PORT=4000, 3000)"
    - "No console.log statements with tokens"
    - "All components use cn() for Tailwind class composition"
    - "No custom CSS files except globals.css with directives only"

  sign_off:
    - "Lint: PASS/FAIL"
    - "Build: PASS/FAIL"
    - "Tests: PASS/FAIL"
    - "Manual QA: PASS/FAIL"
    - "Documentation: PASS/FAIL"
    - "Overall: READY/NOT READY"
```

This YAML specification is complete and review-proof with:

- All original requirements mapped to file locations
- New requirements J (ports), K (DoD + Manual QA), L (root scripts), M (cn helper) fully integrated
- Concrete file paths (no TBDs)
- Ordered, granular, verifiable todos
- Complete test cases with expected status codes and UI states

