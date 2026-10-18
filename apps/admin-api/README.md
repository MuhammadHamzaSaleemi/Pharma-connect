# PharmaConnect admin-api

NestJS 11 + Prisma 6 (PostgreSQL) REST API behind the PharmaConnect website and dashboard:
jobs, scholarships, blogs, users, image uploads and admin auth. Everything is served under `/api/v1`;
Swagger is at `/docs` outside production.

## Setup

```bash
cp .env.example .env        # then fill in DATABASE_URL and the two JWT secrets
npm install                 # from the repo root (npm workspaces); runs `prisma generate`
npx prisma migrate dev      # apply migrations to your local database
npm run seed                # optional dummy data (refuses to run with NODE_ENV=production)
npm run start:dev           # or `npm run dev:admin-api` from the repo root
```

`.env.example` documents every variable. In production `CORS_ORIGIN` is required and may not be `*`.

## Checks

```bash
npm run lint        # ESLint + Prettier, warnings fail
npx tsc --noEmit
npm test            # unit tests (*.spec.ts next to the source)
npm run test:e2e    # boots the real app with Prisma stubbed; no database needed
```

CI (`.github/workflows/ci.yml` at the repo root) runs all four on every push and pull request.

## Deploying with Docker

Build with `apps/admin-api` as the context. The container binds `0.0.0.0:5000`, runs
`prisma migrate deploy` on start, and stores uploads in `/app/uploads`, which should be a volume:

```bash
docker build -t pharma-admin-api apps/admin-api
docker run -p 5000:5000 --env-file apps/admin-api/.env -v pharma-uploads:/app/uploads pharma-admin-api
```

Architecture notes and conventions live in the root `CLAUDE.md`; security decisions in `SECURITY.md`.
