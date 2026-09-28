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
- Project posters are optional: JPG/PNG/WebP/AVIF, max 150 KB, portrait 2:3. Replacing, removing or deleting a project deletes the old poster. Posters are always served at `/images/our-projects/<name>` by the route handler in `src/app/images/our-projects/[file]/route.ts`.
- Poster files are named after the project (for example "Biker" is saved as `biker.avif`), so two projects can't have the same name; the form shows "A project named … already exists." Renaming a project renames its poster. The stored path carries a `?v=` version so a replaced poster shows up immediately.
- The project list is seeded with sample projects on first run.
- **Production (Vercel):** the project list and posters are saved in the private Vercel Blob store `eva-our-project`, under `eva/projects.json` and `eva/our-projects/`. Connecting the store to the project sets `BLOB_READ_WRITE_TOKEN`, and the app switches to Blob when that variable exists. Vercel's own files are read-only and reset on every deploy, so nothing is saved there. Browse or back up the data from Vercel > Storage.
- **Local development (no `BLOB_READ_WRITE_TOKEN`):** the project list is saved to `projects.json` in `EVA_DATA_DIR` (default `./storage`), and posters to `public/images/our-projects/`. Both are gitignored.
- **Testing against the real Blob store locally:** put `BLOB_READ_WRITE_TOKEN` (Vercel > Storage > eva-our-project > `.env.local` tab) and `EVA_BLOB_PREFIX=eva-test/` in `.env.local`, so test data goes to `eva-test/` instead of the live `eva/` folder. Remove the token again when done.
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
