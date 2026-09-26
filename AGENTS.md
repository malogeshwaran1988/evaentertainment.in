<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# EVA Entertainment notes

- Follow [`eva-pages.mdc`](eva-pages.mdc) for public page / SEO / a11y patterns (AVR-style).
- Preserve existing design, colors, and copy from `public/css`.
- Admin panel (Our Projects only) lives in the `(admin)` route group: `/login` and `/admin/*`, with its own root layout, shadcn/ui (`src/components/ui`) and `tailwind.admin.config.ts`. Never import `admin.css` or shadcn components into `(web)` pages, or Glory CSS into admin pages.
- Every admin page must stay noindex/nofollow and call `requireAdmin()`; every admin server action must call `requireAdmin()` too (the proxy is not a security boundary).
- Projects are stored in `${EVA_DATA_DIR:-./storage}/projects.json` via `src/lib/projects-store.ts`.
- Project posters are uploaded to `public/images/our-projects/` via `src/lib/project-posters.ts` (150 KB cap, magic-byte type check). Render them unoptimized/`<img>`: they can be newer than the running server.
- After finishing each task, commit and push to `origin logeshwaran` with a descriptive message (a summary line plus bullet notes), and share the notes in chat. Fetch or rebase first, never force-push, and never commit `.env`, `storage/` or uploaded posters.
