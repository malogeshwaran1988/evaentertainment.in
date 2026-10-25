# Admin: CSV project import / export

On **/admin/projects**: **Export CSV** downloads every project in this format; **Import CSV** opens the importer (Download template, Column guide, Check file → preview → Import).

- Same rules as Add project (`src/lib/admin/project-validation.ts`), run on the server. Titles must be unique, also against existing projects and other rows.
- **All-or-nothing:** the Import button stays disabled until every row is valid and the server re-checks inside the write queue; if anything is invalid nothing is written.
- New rows are unpublished unless `published` is `true`. A `posterUrl` is fetched (SSRF-safe server fetch) and converted to AVIF in the browser, one at a time; if that fails the row is imported **unpublished without a poster** and reported.
- Limits: 1 MB, 200 rows. One read + one write of projects.json per import (plus one write per poster).
- UTF-8 (BOM ok), RFC 4180 quoting; rows starting with `#` are ignored. Header names are case-insensitive (`sourceLanguage`/`targetLanguages` accepted as aliases).
- The old page-content columns (synopsis, director, cast originalRelease, productionHouse, trailerUrl, whereToWatch, eva*, voiceCast, faqs) were removed with the form section; project SEO is generated automatically. Such stored values are ignored at read time (not deleted).
- Stored projects with an old category are mapped the same way when read (projects.json itself is not rewritten).
- Round trip: an exported row re-imports to identical data (blocked only by the duplicate-title check and by a missing `year` on older projects, which the form requires too). Test: `node scripts/test-project-csv.mjs`.

## Columns (flattening for nested fields)

| column | required | allowed values / format |
|---|---|---|
| `title` | yes | Project name, max 120 characters. Must be unique (also against existing projects). |
| `from` | yes | Source language. One of: English, Tamil, Hindi, Telugu, Malayalam, Kannada, Marathi. |
| `to` | no | Optional target languages separated by ";" (e.g. Hindi;Telugu). Blank = worked on in its own language (the site shows just the source language). Can't include the source language. |
| `category` | yes | One of: Movie Dubbing, TV Series, Documentary, Song Recording. Old values are still accepted: Dubbing → Movie Dubbing; Voice Over / Subtitling → Movie Dubbing with that service ticked. |
| `services` | no | Optional, separated by ";". Any of: Lip-Sync Dubbing, Voice Over, Foley Recording, 5.1 Mixing & Mastering, Subtitling, Song Recording, Translation. |
| `year` | yes | "ongoing" or a year from 1990 to the current year. |
| `audioHours` | no | Optional finished audio hours: above 0, at most 10000, one decimal place. |
| `published` | no | true or false. Blank = false (imported as unpublished). |
| `description` | no | Optional public blurb, max 800 characters. |
| `posterUrl` | no | Optional http(s) image URL. Fetched and converted to AVIF. If it fails, the row is imported unpublished without a poster. |
| `posterAlt` | no | Optional poster ALT name, max 150 characters (only kept when a poster is saved). |
