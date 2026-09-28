<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# EVA Entertainment notes

- Follow [`eva-pages.mdc`](eva-pages.mdc) for public page / SEO / a11y patterns (AVR-style).
- Preserve existing design, colors, and copy from `public/css`.
- Images: the first visible image on a page is eager + `fetchPriority="high"`, every other image is lazy; use `imageLoading(i)` from `src/lib/image-loading.ts` (see eva-pages.mdc).
- Admin panel (Our Projects only) lives in the `(admin)` route group: `/login` and `/admin/*`, with its own root layout, shadcn/ui (`src/components/ui`) and `tailwind.admin.config.ts`. Never import `admin.css` or shadcn components into `(web)` pages, or Glory CSS into admin pages.
- Every admin page must stay noindex/nofollow and call `requireAdmin()`; every admin server action must call `requireAdmin()` too (the proxy is not a security boundary).
- Projects and posters go through `src/lib/projects-store.ts` and `src/lib/project-posters.ts` (150 KB cap, magic-byte type check).
  - When `BLOB_READ_WRITE_TOKEN` is set (Vercel), both are stored in the private Blob store under `eva/` via `src/lib/blob.ts`. Local tests with the real token must set `EVA_BLOB_PREFIX=eva-test/`.
 - Posters are named after the project (`biker.avif`, no random suffix) with a `?v=` version in the stored path; project names must be unique.
  - Otherwise (local dev), they're stored in `${EVA_DATA_DIR:-./storage}/projects.json` and `public/images/our-projects/`.
  - Never write to the app's own files on Vercel; they're read-only.
- Posters are always referenced as `/images/our-projects/<name>` and served by the route handler. Render them unoptimized/`<img>`.
- After finishing each task, commit and push to `origin logeshwaran` with a descriptive message (a summary line plus bullet notes), and share the notes in chat. Fetch or rebase first, never force-push, and never commit `.env`, `storage/` or uploaded posters.
