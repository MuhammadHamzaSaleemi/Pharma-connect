# PharmaConnect website

Next.js 14 (App Router, plain JavaScript): the public site (jobs, blogs, scholarships, about,
contact) and the admin dashboard under `/dashboard`. All data comes from `apps/admin-api`.

## Setup

```bash
npm install          # from the repo root (npm workspaces)
npm run dev          # or `npm run dev:website` from the repo root; http://localhost:3000
```

Environment (`.env.local`, gitignored):

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api/v1` | admin-api base URL |
| `NEXT_PUBLIC_SITE_URL` | `https://pharmaconnect-pakistan.com` | canonical origin for metadata, sitemap and JSON-LD |

## Checks and build

```bash
npm run lint         # next lint (the build itself ignores lint, so CI runs it separately)
npm run build        # standalone output; postbuild flattens it into .next/standalone (needs a POSIX shell)
```

Coding conventions are in `STANDARDS.md`; architecture notes in the root `CLAUDE.md`.
