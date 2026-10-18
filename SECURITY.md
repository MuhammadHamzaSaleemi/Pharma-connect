# Security notes

Decisions and known gaps that don't belong in code comments but should stay visible. Update this file when a tradeoff below is closed or a new one is accepted.

## Auth tokens stored in localStorage

**Decision (2026-07-19):** access and refresh tokens are stored in `localStorage`
(`apps/website/src/services/auth/tokenStorage.js`), not in an httpOnly cookie.

**Risk:** any script that runs on the website's origin — i.e. a successful XSS —
can read `localStorage` and exfiltrate both tokens. An httpOnly cookie would not
be readable by JS at all, closing this off entirely (at the cost of adding CSRF
surface and backend complexity).

**Why we're accepting this for now:** the site is early-stage and the cost of a
full cookie-based auth migration (backend cookie issuance/rotation, CSRF
protection, CORS credential handling) wasn't judged worth it yet relative to
other priorities.

**Rich-text HTML (closed 2026-10-11):** the website renders stored HTML with
`dangerouslySetInnerHTML` (`componants/blogDetail.js`, `componants/jobDetail.js`,
`componants/scholarshipsExplorer.js`) on the same origin as the tokens. Blogs and
scholarships are writable by `EXECUTIVE`, the lowest role, so unsanitized HTML
would let any executive steal a super admin's tokens. Every rich-text DTO field
(`content`, `jobDescription`, `financialBenefits`, `eligibilityCriteria`,
`howToApply`) now carries `@SanitizeHtml()`
(`admin-api/src/common/decorators/sanitize-html.decorator.ts`), which strips
everything outside the TipTap editor's tag set on write, including Excel bulk
uploads. Records saved before this change were not re-sanitized; they were
written through the editor, but rerun them through `sanitizeRichText()` if in doubt.
Any new field rendered as HTML must get the decorator too.

**Still open:**
- There is no Content-Security-Policy in `apps/website/next.config.js`. A useful
  `script-src` needs nonces (middleware + dynamic rendering), since Next's inline
  scripts, gtag and Google Fonts would otherwise force `'unsafe-inline'`.
- If/when the effort is justified, migrate refresh tokens (at least) to an
  httpOnly, `Secure`, `SameSite=Lax` cookie, keeping the access token
  short-lived and in memory rather than `localStorage`.

## Uploads

**(changed 2026-10-11)** Images go to admin-api `POST /uploads/image` (signed-in
users only) or the blog endpoints, both via `common/uploads/image-upload.options.ts`.
The stored extension comes from the MIME allowlist, never the client filename,
so nothing uploaded can be served as HTML/SVG from `/uploads`. The website's old
unauthenticated `/api/upload` route was removed. Files uploaded through it
remain in the website's `public/uploads` and keep their existing URLs.

## Access control notes

- Only a `SUPER_ADMIN` may create, edit, delete or promote to a `SUPER_ADMIN`
  account (`UsersService.assertCanManage`). `ADMIN` manages everyone else.
- Public read endpoints only return `PUBLISHED` blogs and `ACTIVE`
  jobs/scholarships whatever `status` is requested; the dashboard lists through
  the role-guarded `GET <domain>/manage` endpoints.
- Password-reset tokens must never be logged. Reset emails are not sent yet
  (TODO in `AuthService.forgotPassword`), so the flow is currently unusable.

## Ownership

This file is a running log, not a compliance document. Add an entry whenever a
security tradeoff is knowingly accepted, and update it when the tradeoff changes.
