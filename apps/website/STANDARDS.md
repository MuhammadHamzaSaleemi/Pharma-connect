# Coding Standards — Website

## Linting

ESLint via `next/core-web-vitals` (`.eslintrc.json`). Run `npm run lint` before committing. No Prettier config in this repo — match the formatting of surrounding code.

## Structure

- Routes live under `src/app/<route>` (Next.js App Router) — one folder per route, `page.js` inside.
- API calls go through `src/services/<domain>` (e.g. `services/jobs`, `services/auth`), not inline `fetch` in components. Shared HTTP client is `services/http`.
- Shared UI goes in `src/componants/` (existing spelling — keep consistent, don't introduce `components/` alongside it).
- Cross-cutting state goes in `src/context/` (React Context) or `src/providers/` (e.g. React Query); don't add a new state library for it.
- Static lookup data (enums, country lists, roles) goes in `src/lib/`.

## Data fetching

Use TanStack React Query for server state. Don't reach for `useEffect` + `useState` fetching when a query hook covers it.

## Env vars

Client-exposed vars must be prefixed `NEXT_PUBLIC_`. Never commit real values — `.env.local` is gitignored; document new keys in `README.md`.

## Commits / branches

Follow the same convention as the rest of the `pharma-connect` monorepo (see root `SECURITY.md` for reporting; no separate branching model is enforced here — ask before introducing one).
