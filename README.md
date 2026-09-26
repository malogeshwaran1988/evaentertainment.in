# EVA Entertainment

Next.js App Router site for [evaentertainment.in](https://evaentertainment.in) — migrated from the static Glory HTML template to an AVR-style stack (Next.js 16, React 19, TypeScript, Tailwind, Sass). Design, content, and colors are preserved. A small admin panel at `/login` manages the Our Projects list.

## Scripts

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
npm run start
npm run lint
```

## Environment

Copy `.env.example` to `.env.local` and set SMTP credentials for contact/booking mail. In development, if SMTP is unset, submissions are logged to the server console instead of failing.

## Admin panel

- Sign in at `/login` with `ADMIN_USERNAME` / `ADMIN_PASSWORD`. `ADMIN_SESSION_SECRET` (32+ random characters) signs the session cookie; changing it logs everyone out.
- `/admin/projects` lists, adds, edits and deletes projects shown on the public `/projects` page. `/admin/profile` shows the account and a logout button.
- Data is saved to `projects.json` in `EVA_DATA_DIR` (default `./storage`, gitignored). It is seeded with sample projects on first run.
- **Production (cPanel / Webhostbox Node app):** set `EVA_DATA_DIR` to a folder outside the app directory, e.g. `/home/<user>/eva-data`, so redeploys don't overwrite saved projects. Back that folder up.
- Project posters (optional, JPG/PNG/WebP/AVIF, max 150 KB, portrait 2:3) are uploaded from the project form and saved to `public/images/our-projects/` (gitignored). Replacing, removing or deleting a project deletes the old file. Files uploaded after `next start` are served by the `/images/our-projects/[file]` route handler.
- **Production:** `public/images/our-projects/` lives inside the app, so back it up and keep it when redeploying (don't delete and re-upload the whole app folder), otherwise the posters referenced in `projects.json` are lost.
- All admin URLs send `noindex, nofollow` (meta tag and `X-Robots-Tag` header) and are not in the sitemap.

## Structure

- `src/app/(web)/` — public marketing routes (own root layout with Glory CSS)
- `src/app/(admin)/` — `/login` and `/admin/*` (own root layout with shadcn/ui)
- `src/app/api/contact` & `booking` — form handlers
- `src/data/` — page copy + SEO constants
- `src/components/` — Header, Footer, forms, hero slider
- `public/` — legacy CSS, images, fonts, media

## Notes

- Phase 1 pages: Home, About, Services, Equipment, Contact
- Deferred: Team, Gallery, Blog, audio waveform player
- Page pattern / SEO / a11y checklist: see [`eva-pages.mdc`](eva-pages.mdc) (place under `.cursor/rules/` if your environment allows)
- Rotate any SMTP password that was previously committed in legacy PHP under `legacy/form/`
