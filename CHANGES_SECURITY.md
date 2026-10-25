# Security hardening — branch `security-hardening` (base b41e2ae)

## Changes
**1. Dependencies**
- `next` 16.3.6 → 16.4.2. This fixes the cache-poisoning and draft-mode leak advisories and sharp 0.35.5 comes in with it (fixes the librsvg CVE).
- `nodemailer` 9 → 10.1.2, `eslint-config-next` 15.1.4 → 16.4.2 and `@types/nodemailer` updated to match.
- Added `bcryptjs`, `otpauth` and `@upstash/redis`.
- `npm audit` went from 14 issues (11 high, 3 moderate) to 10 (7 high, 3 moderate).
  - Every remaining issue is in build/lint tooling only: `braces` via tailwindcss 3 (chokidar, micromatch, fast-glob) and via `@next/eslint-plugin-next`, plus `postcss-selector-parser`.
  - None of these packages ship in the production server bundle and npm has no patched version for them yet.
  - The full fix is moving to Tailwind v4 later.
- Lint: `next lint` no longer exists in Next 16, so `npm run lint` now runs `eslint .` with a native flat config. Two new React Compiler rules (`set-state-in-effect`, `purity`) are set to warn so existing UI code doesn't need refactoring. Result: 0 errors.

**2. Public forms** (`/api/contact`, `/api/booking`)
- `src/lib/security/form-request.ts` adds a shared gate:
  - same-origin check on `Origin`; JSON content-type required; 16 KB body cap
  - durable rate limit
  - honeypot field (`website`) plus a timing check (rejects submissions under 3 s or older than 6 h). Bots get a fake `200 ok` so they learn nothing.
  - Cloudflare Turnstile verified on the server (`src/lib/security/turnstile.ts`). If `TURNSTILE_SECRET_KEY` is unset, this step is skipped and the forms keep working.
- `src/utils/rateLimit.ts`: rate limits are stored in Upstash Redis (`UPSTASH_REDIS_REST_*` or `KV_REST_API_*`) so they hold across Vercel instances. If Redis is missing or down, it falls back to memory.
- Input cleaning (`form-guard.ts`): per-field length limits, control characters and CR/LF stripped from single-line fields, phone format check.
- Mail (`src/utils/mail.ts`): stricter email check (rejects CR/LF, `<>,;"`), header-safe subject and reply-to and nodemailer `disableFileAccess` / `disableUrlAccess` turned on. Header injection is blocked; I tested it.
- Client (`src/components/common/FormShield.tsx`): hidden honeypot, render timestamp and the explicit Turnstile widget, which renders only when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set. Added to both forms.

**3. Admin**
- `ADMIN_PASSWORD_HASH` (bcrypt, cost 12) is now the preferred password. A dummy hash is compared when the username is wrong, so timing doesn't reveal valid usernames. Plain `ADMIN_PASSWORD` still works as a fallback but logs a warning.
- Optional TOTP 2FA: when `ADMIN_TOTP_SECRET` is set, the login page shows an "Authenticator code" field.
- Login limits (Redis-backed): 5 attempts per IP per 15 min. After 10 failures per account in an hour, the account is locked. Counters reset when a login succeeds.
- Session cookie: httpOnly, Secure in production, `SameSite=Strict`, high priority, signed HS256 JWT, 8 h lifetime (unchanged).

**4. Headers** (`next.config.ts`)
- **CSP:** `default-src 'self'`, with explicit allowlists for:
  - Google Tag Manager / Analytics
  - Google Fonts
  - Google Maps iframe
  - Cloudflare Turnstile
  - WebAssembly for the admin's AVIF encoder
- The CSP also sets `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'self'` and `upgrade-insecure-requests`.
- Inline scripts are still allowed (`'unsafe-inline'`) because the pages are statically prerendered, so per-request nonces aren't possible.
- The wildcard CORS header is replaced with `Access-Control-Allow-Origin: https://evaentertainment.in`.
- `Referrer-Policy: strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy: same-origin` and a tighter `Permissions-Policy` (adds `usb=()`, `browsing-topics=()`).
- `X-Powered-By` removed. HSTS, nosniff and X-Frame-Options kept.

**5. Poster-from-URL SSRF fix** (`src/lib/admin/fetch-poster-url.ts`)
- Global `fetch` (which followed redirects anywhere) replaced with a Node http(s) request that uses a vetted DNS lookup.
- The IP that gets checked is the same IP the socket connects to, so DNS rebinding can't slip through.
- Blocked: loopback, RFC1918 private ranges, link-local including cloud metadata 169.254.169.254, CGNAT, reserved/benchmark/doc ranges, multicast, IPv6 ULA/link-local, IPv4-mapped addresses, `localhost`, `*.local` and `*.internal`.
- Only http/https on ports 80/443; no credentials in URLs; URLs up to 2048 characters.
- At most 3 redirects, each one re-validated.
- 20 s timeout; streaming 25 MB cap (aborts mid-download).
- The file must pass a magic-byte image check; the server no longer trusts the Content-Type header alone. The filename is sanitised.
- Still admin-only (`requireAdmin()`) and the action now checks that the input is a string.

## New environment variables (set in Vercel → Project → Settings → Environment Variables)
| Var | Required | Notes |
|---|---|---|
| `ADMIN_PASSWORD_HASH` | yes (recommended) | bcrypt hash. Remove `ADMIN_PASSWORD` once set. In a local `.env`, escape each `$` as `\$` |
| `ADMIN_TOTP_SECRET` | optional | base32 secret, added to an authenticator app |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | recommended | Cloudflare dashboard → Turnstile → add site `evaentertainment.in` |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | recommended | Vercel Marketplace → Upstash Redis (free tier) |
| `ADMIN_SESSION_SECRET` | rotate | New 48-byte random value. This logs out existing sessions |

## Deploy steps
1. Apply the patch: `git checkout -b security-hardening b41e2ae && git am security-hardening.patch`, then run `npm ci`.
2. Generate the bcrypt hash, the TOTP secret (optional) and a new session secret (`openssl rand -base64 48`). Create the Turnstile widget and Upstash database.
3. Add the env vars to Vercel for both Production and Preview.
4. Push the branch to get a Vercel Preview build, then check it:
   - the contact and booking forms send email and the Turnstile widget shows
   - admin login works (with the 2FA code, if set)
   - poster upload and poster-from-URL work
   - the browser console shows no CSP errors (GTM, maps and fonts load)
5. Merge to main. After that, delete `ADMIN_PASSWORD` from Vercel.
6. Verify: `curl -sI https://evaentertainment.in | grep -i -E "content-security|access-control"`.

## DNS: email authentication (Cloudflare, Google Workspace)
Add these as TXT records in Cloudflare DNS. DNS-only, so no proxy setting applies to TXT records.

| Type | Name | Content |
|---|---|---|
| TXT | `@` | `v=spf1 include:_spf.google.com include:webhostbox.net ~all` |
| TXT | `google._domainkey` | Value from Google Admin → Apps → Google Workspace → Gmail → Authenticate email → Generate new record (2048-bit, selector `google`). Paste it exactly, then click **Start authentication** in Google Admin |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc-reports@evaentertainment.in; fo=1; adkim=r; aspf=r; pct=100` |

Notes:
- **SPF:** the website sends form mail through `md-64.webhostbox.net` (`SMTP_HOST`), so that host must be covered. Confirm the exact SPF include with the webhostbox provider; often it is `include:webhostbox.net` or that server's IP as `ip4:x.x.x.x`. If form mail is moved to Google Workspace SMTP (`smtp.gmail.com`, 465, with an app password), keep only `include:_spf.google.com`.
- **DKIM:** the key is generated inside the Google Admin console. It cannot be made up in advance.
- **DMARC rollout:**
  1. Start at `p=none` and watch the reports for 2–4 weeks.
  2. Then move to `p=quarantine; pct=25`, then 100.
  3. Then `p=reject`.

  Create the `dmarc-reports@` mailbox or group first or use a free DMARC report service address.
