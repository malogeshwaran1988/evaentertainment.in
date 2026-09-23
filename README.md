# EVA Entertainment

Next.js App Router site for [evaentertainment.in](https://evaentertainment.in) — migrated from the static Glory HTML template to an AVR-style stack (Next.js 16, React 19, TypeScript, Tailwind, Sass). Design, content, and colors are preserved; there is no admin panel in this phase.

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

## Structure

- `src/app/(web)/` — public marketing routes
- `src/app/api/contact` & `booking` — form handlers
- `src/data/` — page copy + SEO constants
- `src/components/` — Header, Footer, forms, hero slider
- `public/` — legacy CSS, images, fonts, media

## Notes

- Phase 1 pages: Home, About, Services, Equipment, Contact
- Deferred: Team, Gallery, Blog, audio waveform player, admin CMS
- Page pattern / SEO / a11y checklist: see [`eva-pages.mdc`](eva-pages.mdc) (place under `.cursor/rules/` if your environment allows)
- Rotate any SMTP password that was previously committed in legacy PHP under `legacy/form/`
