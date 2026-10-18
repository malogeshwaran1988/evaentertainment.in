<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# EVA Entertainment notes

- Follow [`eva-pages.mdc`](eva-pages.mdc) for public page / SEO / a11y patterns (AVR-style).
- Preserve existing design, colors, and copy from `public/css`.
- Images: the first visible image on a page is eager + `fetchPriority="high"`, every other image is lazy; use `imageLoading(i)` from `src/lib/image-loading.ts` (see eva-pages.mdc).
- Public analytics is only Google Tag Manager (`GtmHead` / `GtmNoscript` in `src/app/(web)/layout.tsx`, also on `src/app/global-not-found.tsx`). New public pages go under `(web)` so they inherit GTM automatically — never paste GTM snippets into a `page.tsx`. If you add another root HTML layout outside `(web)`, mount `GtmHead` first in `<head>` and `GtmNoscript` first in `<body>`. Admin layouts stay without GTM.
- Admin panel (Our Projects only) lives in the `(admin)` route group: `/login` and `/admin/*`, with its own root layout, shadcn/ui (`src/components/ui`) and Tailwind v4 theme in `src/styles/admin.css`. Never import `admin.css` or shadcn components into `(web)` pages, or Glory CSS into admin pages.
- When admin project form fields change (`ProjectForm` / `ProjectInput`), update `ProjectsTable` and `ProjectPreviewDialog` in the same change so the list view stays in sync.
- Every admin page must stay noindex/nofollow and call `requireAdmin()`; every admin server action must call `requireAdmin()` too (the proxy is not a security boundary).
- Projects and posters go through `src/lib/projects-store.ts` and `src/lib/project-posters.ts` (150 KB cap, magic-byte type check).
  - When `BLOB_READ_WRITE_TOKEN` is set (Vercel), both are stored in the private Blob store under `eva/` via `src/lib/blob.ts`. Local tests with the real token must set `EVA_BLOB_PREFIX=eva-test/`.
  - Posters use branded basenames via `src/lib/project-seo.ts` (`…-dubbing-eva-entertainment.avif`, `-2`/`-3` on clash) with a `?v=` version in the stored path; each project also has a public `slug` for `/projects/[slug]`. Project names must be unique.
  - Otherwise (local dev), they're stored in `${EVA_DATA_DIR:-./storage}/projects.json` and `public/images/our-projects/`.
  - Never write to the app's own files on Vercel; they're read-only.
- Posters are always referenced as `/images/our-projects/<name>` and served by the route handler. Render them unoptimized/`<img>`.
- After finishing each task, commit and push to `origin logeshwaran` with a descriptive message (a summary line plus bullet notes), and share the notes in chat. Fetch or rebase first, never force-push, and never commit `.env`, `storage/` or uploaded posters.

## Layout rules (mandatory)

- **Max content width is 1536px site-wide** (`--eva-content-max` in `src/styles/globals.scss`). Header, footer and every section cap their inner content (`.container`, `.eva-header-bar`, footer inners) at it with the existing 15px side padding; full-bleed backgrounds stay viewport-wide. Use `.container` (or the variable) for new sections; never hard-code another max width. Admin is out of scope.

## Vercel Blob quota (Hobby, mandatory)

- Local dev/tests/builds use the disk store; remote Blob only on Vercel or with `BLOB_USE_REMOTE=1`.
- Public reads go through the cached loaders (`unstable_cache`, tags in `src/lib/cache-tags.ts`, 1 day) with one `get()` and no `head()`; admin save actions call `updateTag()` and use the `*Fresh` readers. Never add `list()`/`head()` on a request path. Blob-backed image/OG routes must send `immutable` with a `?v=` versioned URL.

## SEO rules (mandatory)

- **Whenever a page URL is added or changed, update the sitemap; it lists only index, follow pages.**
- **Status pages are never indexed.** Every success, failure, error, confirmation or status page
  (thank-you, sent/failed, error, not-found, booking confirmation, login/admin) must render
  `noindex, follow` and must not appear in `sitemap.xml`. Use `buildStatusPageMetadata()` or
  `buildPageMetadata({ ..., noindex: true })` / `STATUS_PAGE_ROBOTS` from `src/lib/seo.ts`, and add
  the route to `NOINDEX_ROUTES` (the sitemap filters on it). Form success/failure shown inline (no
  URL) needs nothing extra.
- **Thin project pages are noindex.** `/projects/[slug]` is indexed and listed in the sitemap only
  when its unique content (description + page-content fields) reaches
  `PROJECT_INDEX_MIN_WORDS` (default 150, env `NEXT_PUBLIC_PROJECT_INDEX_MIN_WORDS`). The admin
  shows a Thin/Indexable badge. Language hubs (`/dubbing/<from>-to-<to>`) are indexed only with
  3+ projects.
- **One ALT pattern:** use `projectSeoAlt()` everywhere (Title Case, “… – From to To Dubbing”).
- **Poster file names:** the ALT/title stem is capped at `POSTER_STEM_MAX` (50) characters.
- **Structured data:** EVA is a `contributor`/`translator`, never the film's `productionCompany`.
- **Static lastmod:** `npm run build` regenerates `src/data/static-lastmod.json` from git history;
  commit it when it changes.

## UX & accessibility rules (mandatory)

- Standard: WCAG 2.2 AA plus the `laws-of-ux-review`, `user-centered-design` and `wcag-22-aa-audit`
  skills. No a11y npm packages; native HTML first, ARIA only where needed.
- Every `(web)` page's `<main>` has `id="main-content" tabIndex={-1}` (target of the skip link in
  `(web)/layout.tsx`). Admin content is `#admin-content`.
- Text on brand green `#70b615` is near-black `#0b0d10` (white is 2.5:1). Focus rings: gold + dark
  ring (see the a11y block at the end of `globals.scss`); never remove outlines without a replacement.
- Targets ≥ 24×24 px, primary actions ≥ 44 px. Respect `prefers-reduced-motion`; carousels need a
  pause button.
- Public forms use `useFormValidation` (`src/components/common/useFormValidation.ts`): visible
  labels, `required`, blur validation, `aria-invalid` + `aria-describedby`, focus first error,
  `role="status"` while sending, `role="alert"` for server errors.
- Admin status pills use `StatusBadge`/`VisibilityBadge`/`CategoryBadge`/`SeoBadge`
  (`src/components/admin/ui/StatusBadge.tsx`): icon + text + AA-contrast tones, never colour alone.

## Blog rules (mandatory)

- **Public switch:** `NEXT_PUBLIC_BLOG_ENABLED` (`src/lib/blog/enabled.ts`), default off. Off: `/blog` renders "Coming soon" (200, `noindex, follow`), `/blog/<slug>` 307s to `/blog`, `/og/blog/*` 404s, no blog URLs in the sitemap; admin blog and `/preview/blog` keep working. To launch: set `NEXT_PUBLIC_BLOG_ENABLED=true` in Vercel (Production) and redeploy — it is baked in at build time.

- Posts live in one JSON file (`blog.json`, Blob or `storage/`) via `src/lib/blog/store.ts`. Admin pages are addressed by post **id**, never slug.
- Slugs: always go through `slugifyBlog` / `validateBlogSlug` (`src/lib/blog/slug.ts`) on client and server. Slugs are unique across current **and former** slugs.
- Once a post has been published (`firstPublishedAt`), its slug is locked unless the editor explicitly unlocks it; the old slug is kept in `previousSlugs` and `/blog/<old>` 301s to the new URL in `src/proxy.ts` (page-level `permanentRedirect` is the fallback).
- Only `blogPostIsPublic` posts (published and publish date reached, IST) render, appear on `/blog` or go in the sitemap. Everything else 404s with `noindex`.
- Editor HTML is sanitised on save with `sanitizeBlogHtml` — never render unsanitised post HTML. Embeds: YouTube (rewritten to youtube-nocookie) and Vimeo only; keep CSP `frame-src` in sync.
- Images: AVIF on the client, ≤150 KB, branded `…-eva-entertainment.<ext>` names; ALT falls back to "<title> – EVA Entertainment".
