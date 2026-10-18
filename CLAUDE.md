# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

npm workspaces monorepo (`apps/*`), two apps:

- `apps/admin-api`: NestJS 11 + Prisma 6 (PostgreSQL), TypeScript. REST API for jobs, scholarships, blogs, and admin auth.
- `apps/website`: Next.js 14 App Router, plain JavaScript (no TS). Holds the public site and the admin dashboard (`src/app/dashboard/*`).

The root `SECURITY.md` records accepted security tradeoffs and open gaps: localStorage tokens and the missing CSP. Rich-text fields that the website renders with `dangerouslySetInnerHTML` are sanitized on write by the `@SanitizeHtml()` DTO decorator, so any new HTML field needs it too. Read SECURITY.md before touching auth, uploads or rich-text rendering, and update it when you close or accept a gap.

## Commands

From the repo root:

```bash
npm run dev:admin-api      # nest start --watch
npm run dev:website        # next dev
npm run build | lint | test   # runs across all workspaces
```

In `apps/admin-api`:

```bash
npx jest path/to/file.spec.ts        # single unit test (specs live next to source as *.spec.ts under src/)
npx jest -t "test name"
npm run test:e2e                     # boots AppModule with Prisma stubbed (no DB needed)
npm run lint                         # --max-warnings=0, so warnings fail
npx prisma migrate dev --name <name> # schema change -> new migration in prisma/migrations
npm run seed                         # prisma/seed.ts
```

`postinstall` runs `prisma generate`. Rerun it after you edit `prisma/schema.prisma`. The husky pre-commit hook runs `lint:fix` and `format` (Prettier).

In `apps/website`, `npm run lint` runs `next lint` (`next/core-web-vitals`). The website has no Prettier config and no tests. `eslint.ignoreDuringBuilds` is on, so lint errors will not fail a build; CI (`.github/workflows/ci.yml`) runs lint separately, plus admin-api tsc/lint/unit/e2e.

### Local ports

The API defaults to `PORT=3000`, which collides with `next dev`. `.env.example` sets `PORT=5000`, and the website's `NEXT_PUBLIC_API_URL` defaults to `http://localhost:5000/api/v1`, so copy `.env.example` to `.env` in `apps/admin-api`. The API binds to `127.0.0.1` only. Swagger is served at `/docs` when not in production.

## admin-api architecture

- **Global setup** (`src/main.ts`): the `api/v1` prefix, a strict `ValidationPipe` (`whitelist` + `forbidNonWhitelisted`, which rejects unknown DTO fields), `AllExceptionsFilter`, and `ResponseInterceptor`. Static files are served from `uploads/` at `/uploads`.
- **Response envelope**: every response is wrapped as `{ success, message, data, meta }`. A handler that returns `{ data, meta }` (paginated) has those fields lifted into the envelope. Any other return value becomes `data`. Set the message with `@ResponseMessage('...')`.
- **Env config**: env vars are validated with Joi in `app.module.ts`. A new env var must be added both there and in `src/config/configuration.ts`, and you read it through `ConfigService` using the nested keys from that file (e.g. `jwt.secret`).
- **Module pattern** (`src/modules/<domain>/`): `controller -> service -> repositories/<domain>.repository.ts (Prisma access only) -> transformers/<domain>.transformer.ts` (extends `common/transformers/base.transformer.ts` to map Prisma entities to response DTOs). DTOs live in `dto/`, and domain enums in `src/common/enums/<domain>/`. Copy an existing module such as `jobs` when adding a new one.
- **Auth**: there is no global auth guard. Controllers opt in with `@UseGuards(JwtAuthGuard, RolesGuard)` plus `@Roles(...)`. `@Public()` marks public read endpoints (job/blog/scholarship list and detail), which only ever return ACTIVE jobs/scholarships and PUBLISHED blogs; the dashboard lists through the role-guarded `GET <domain>/manage` endpoints instead. Only a SUPER_ADMIN may manage SUPER_ADMIN accounts. Refresh tokens are stored hashed on `User`, and changing `tokenValidFrom` invalidates earlier tokens.
- **Global rate limiting**: `ThrottlerGuard` is registered as `APP_GUARD`.
- **Scheduled cleanup** (daily at midnight, `@nestjs/schedule`): `JobsService.removeExpiredJobs` deletes jobs 21 days after `createdAt`; `ScholarshipsService.expirePastDeadline` marks ACTIVE scholarships past `endDate` as EXPIRED.
- **Dashboard stats**: the `stats` endpoints of jobs/scholarships/blogs/users feed both the section stat cards and the dashboard home page (breakdowns, "needs attention" lists, recent items).
- **Image uploads**: `POST uploads/image` (any signed-in user) and the blog endpoints store files via `common/uploads/image-upload.options.ts`, served from `/uploads`. The extension comes from the MIME allowlist, never the client's filename.
- **Bulk upload**: jobs support Excel bulk upload (`POST jobs/bulk-upload`, parsed with `exceljs`, and each row is validated with class-validator).
- **Path aliases**: `@common/*`, `@modules/*`, `@config/*`, `@database/*` are defined in both tsconfig and the jest `moduleNameMapper`. Existing code mostly uses relative imports.

## website architecture

Follow `apps/website/STANDARDS.md`. Its key rules:

- Routes live in `src/app/<route>/page.js`. The original theme's demo routes have been removed; every remaining route is real.
- Shared components go in `src/componants/`. The misspelling is intentional, so keep it and don't create a `components/` folder. Admin dashboard UI lives in `src/componants/admin/`.
- Every API call goes through `src/services/<domain>/`, using this file set per domain:
  - `*.api.js`: raw calls through `services/http/httpClient.js`
  - `*.keys.js`: React Query keys
  - `*.queries.js`: `useQuery`/`useMutation` hooks, with separate `usePublic*` variants that send no token
  - `*.form.js`, `*.types.js`
  - Don't call `fetch` inline in components.
- `httpClient.js` handles silent access-token refresh on 401 (one shared in-flight refresh) and uses `cache: 'no-store'` on purpose, so SSR pages always show live data.
- Server state uses TanStack React Query (`src/providers/QueryProvider.js`), and auth state lives in `src/context/AuthContext.js`. Tokens are stored in localStorage (`services/auth/tokenStorage.js`).
- Styling mixes Bootstrap 5, SCSS (`src/app/assets/scss`), and Tailwind, which the dashboard uses (`dashboard/tailwind.css`).
- Import alias: `@/*` maps to `src/*`.
- SEO: `src/lib/site.js` holds the canonical origin (`NEXT_PUBLIC_SITE_URL`), `pageMetadata()` (title/description/canonical/OG for a page), and URL builders. Always link with `jobPath(job)` (`/jobs/<title-slug>-<id>`) and `blogPath(post)` (`/blogs/<slug>`). The detail pages 308-redirect any other form to these URLs and 404 for non-ACTIVE jobs and non-PUBLISHED blogs. `app/sitemap.js` and `app/robots.js` generate the crawler files, and JSON-LD renders through `componants/jsonLd.js` (`Breadcrumb` emits a BreadcrumbList automatically). The private areas (`/dashboard`, `/login`) get `X-Robots-Tag: noindex` from `NOINDEX_ROUTES` in `next.config.js`.
- `next.config.js` builds `output: 'standalone'`, and the `postbuild` script flattens the monorepo standalone output. It uses `cp`/`rm`, so it needs a POSIX shell.
