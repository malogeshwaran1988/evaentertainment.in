# Admin: CSV project import / export

On **/admin/projects**: **Export CSV** downloads every project in this format; **Import CSV** opens the importer (Download template, Column guide, Check file → preview → Import).

- Same rules as Add project (`src/lib/admin/project-validation.ts`), run on the server. Titles must be unique, also against existing projects and other rows.
- **All-or-nothing:** the Import button stays disabled until every row is valid, and the server re-checks inside the write queue; if anything is invalid nothing is written.
- New rows are unpublished unless `published` is `true`. A `posterUrl` is fetched (SSRF-safe server fetch) and converted to AVIF in the browser, one at a time; if that fails the row is imported **unpublished without a poster** and reported.
- Limits: 1 MB, 200 rows. One read + one write of projects.json per import (plus one write per poster).
- UTF-8 (BOM ok), RFC 4180 quoting; rows starting with `#` are ignored. Header names are case-insensitive (`sourceLanguage`/`targetLanguages` accepted as aliases).
- Round trip: an exported row re-imports to identical data (blocked only by the duplicate-title check, and by a missing `year` on older projects, which the form requires too). Test: `node scripts/test-project-csv.mjs`.

## Columns (flattening for nested fields)

| column | required | allowed values / format |
|---|---|---|
| `title` | yes | Project name, max 120 characters. Must be unique (also against existing projects). |
| `from` | yes | Source language. One of: English, Tamil, Hindi, Telugu, Malayalam, Kannada. |
| `to` | yes | Target languages separated by ";" (e.g. Hindi;Telugu). Same list; can't include the source language. |
| `category` | yes | One of: Movie Dubbing, Dubbing, Voice Over, Subtitling. |
| `year` | yes | "ongoing" or a year from 1990 to the current year. |
| `audioHours` | no | Optional finished audio hours: above 0, at most 10000, one decimal place. |
| `published` | no | true or false. Blank = false (imported as unpublished). |
| `description` | no | Optional public blurb, max 800 characters. |
| `posterUrl` | no | Optional http(s) image URL. Fetched and converted to AVIF. If it fails, the row is imported unpublished without a poster. |
| `posterAlt` | no | Optional poster ALT name, max 150 characters (only kept when a poster is saved). |
| `synopsis` | no | Optional, max 2000 characters. |
| `director` | no | Optional, max 120 characters. |
| `cast` | no | Lead cast separated by ";" (max 20 names, 80 characters each). |
| `originalRelease` | no | Optional YYYY, YYYY-MM or YYYY-MM-DD. |
| `productionHouse` | no | Optional, max 120 characters. |
| `trailerUrl` | no | Optional YouTube link (youtube.com/watch?v=… or youtu.be/…). |
| `whereToWatch` | no | Optional platform / channel, max 200 characters. |
| `evaLipSync` | no | EVA work: true or false. |
| `evaSongs` | no | EVA work: true or false. |
| `evaMix` | no | EVA work: mix, e.g. "5.1 and stereo" (max 80). |
| `evaVoiceArtists` | no | EVA work: whole number 1–999. |
| `evaDubbingDirector` | no | EVA work: dubbing director (max 120). |
| `evaNotes` | no | EVA work: notes (max 1500). |
| `voiceCast` | no | Items "Role — Artist" separated by ";" (max 40). |
| `faqs` | no | Lines "Q: …" then "A: …" in one quoted cell; blank line between FAQs (max 10). |
