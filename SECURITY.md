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

**This is not fully mitigated — there is a real, open XSS vector today:**
- `apps/website/src/app/blog-detail/[id]/page.js` and
  `apps/website/src/app/job-detail-one/[id]/page.js` render blog/job content via
  `dangerouslySetInnerHTML` with **no server-side or client-side sanitization**
  (no DOMPurify or equivalent) of the stored HTML.
- That HTML is authored through the TipTap-based `RichTextEditor`
  (`apps/website/src/componants/admin/ui/RichTextEditor.js`), which constrains
  output to its own schema (bold/italic/headings/lists/links, etc.) — but the
  admin API accepts arbitrary HTML in `content`/`jobDescription` directly, so
  anything hitting the API outside the editor (a compromised admin account, a
  bug, a future integration) is rendered on public pages unsanitized.
- Since blog/job creation and edits now require `SUPER_ADMIN`/`ADMIN` role
  (see `RolesGuard`), the practical exposure is currently gated behind
  compromising or misusing an admin account — but a compromised admin account
  is exactly the kind of thing an attacker chaining XSS-to-token-theft would
  go after, so this isn't a strong mitigation on its own.
- There is no Content-Security-Policy configured in `apps/website/next.config.js`.

**To actually close this risk, in order of impact:**
1. Sanitize HTML server-side on write (e.g. `sanitize-html`/DOMPurify in
   `blogs.service.ts`/`jobs` equivalent) so stored content can't carry
   `<script>`, `javascript:` hrefs, event handler attributes, etc., regardless
   of what produced it.
2. Add a `Content-Security-Policy` header (at minimum restrict `script-src`) via
   Next.js `headers()` config.
3. If/when the effort is justified, migrate refresh tokens (at least) to an
   httpOnly, `Secure`, `SameSite=Lax` cookie, keeping the access token
   short-lived and in memory rather than `localStorage`.

## Ownership

This file is a running log, not a compliance document. Add an entry whenever a
security tradeoff is knowingly accepted, and update it when the tradeoff changes.
