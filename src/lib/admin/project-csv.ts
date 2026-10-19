/**
 * CSV bulk import/export for admin projects. Each CSV row is mapped onto the exact FormData the
 * add-project form submits and validated with parseProjectForm, so the rules are identical.
 *
 * Flattening convention for list / nested fields:
 *   to         → languages separated by ";"      e.g. "Hindi;Telugu"
 *   cast       → names separated by ";"          e.g. "Nani; Sai Pallavi"
 *   voiceCast  → "Role — Artist" items by ";"    e.g. "Hero — Sanket Mhatre; Villain — Rajesh Jolly"
 *   faqs       → "Q: …" / "A: …" lines in one quoted cell (line breaks allowed), blank line between FAQs
 *   evaWork    → evaLipSync, evaSongs (true/false), evaMix, evaVoiceArtists, evaDubbingDirector, evaNotes
 *   poster     → posterUrl (http/https image URL, fetched and converted to AVIF like "Fetch from URL")
 */
import {
  PROJECT_AUDIO_HOURS_MAX,
  PROJECT_CATEGORIES,
  PROJECT_DESCRIPTION_MAX,
  PROJECT_LANGUAGES,
  PROJECT_SYNOPSIS_MAX,
  PROJECT_YEAR_MIN,
  PROJECT_YEAR_ONGOING,
  projectNameKey,
  type Project,
  type ProjectInput,
} from "@@/data/projects";
import { APP_BASE_URL } from "@@/constants/constants";
import { formatFaqs } from "@@/lib/project-content";
import { CsvError, parseCsv, toCsv } from "@@/lib/admin/csv";
import { parseProjectForm } from "@@/lib/admin/project-validation";

export const CSV_MAX_BYTES = 1024 * 1024;
export const CSV_MAX_ROWS = 200;

type Column = { key: string; required?: boolean; help: string };

export const PROJECT_CSV_COLUMNS: readonly Column[] = [
  { key: "title", required: true, help: "Project name, max 120 characters. Must be unique (also against existing projects)." },
  { key: "from", required: true, help: `Source language. One of: ${PROJECT_LANGUAGES.join(", ")}.` },
  { key: "to", required: true, help: `Target languages separated by ";" (e.g. Hindi;Telugu). Same list; can't include the source language.` },
  { key: "category", required: true, help: `One of: ${PROJECT_CATEGORIES.join(", ")}.` },
  { key: "year", required: true, help: `"ongoing" or a year from ${PROJECT_YEAR_MIN} to the current year.` },
  { key: "audioHours", help: `Optional finished audio hours: above 0, at most ${PROJECT_AUDIO_HOURS_MAX}, one decimal place.` },
  { key: "published", help: "true or false. Blank = false (imported as unpublished)." },
  { key: "description", help: `Optional public blurb, max ${PROJECT_DESCRIPTION_MAX} characters.` },
  { key: "posterUrl", help: "Optional http(s) image URL. Fetched and converted to AVIF. If it fails, the row is imported unpublished without a poster." },
  { key: "posterAlt", help: "Optional poster ALT name, max 150 characters (only kept when a poster is saved)." },
  { key: "synopsis", help: `Optional, max ${PROJECT_SYNOPSIS_MAX} characters.` },
  { key: "director", help: "Optional, max 120 characters." },
  { key: "cast", help: 'Lead cast separated by ";" (max 20 names, 80 characters each).' },
  { key: "originalRelease", help: "Optional YYYY, YYYY-MM or YYYY-MM-DD." },
  { key: "productionHouse", help: "Optional, max 120 characters." },
  { key: "trailerUrl", help: "Optional YouTube link (youtube.com/watch?v=… or youtu.be/…)." },
  { key: "whereToWatch", help: "Optional platform / channel, max 200 characters." },
  { key: "evaLipSync", help: "EVA work: true or false." },
  { key: "evaSongs", help: "EVA work: true or false." },
  { key: "evaMix", help: 'EVA work: mix, e.g. "5.1 and stereo" (max 80).' },
  { key: "evaVoiceArtists", help: "EVA work: whole number 1–999." },
  { key: "evaDubbingDirector", help: "EVA work: dubbing director (max 120)." },
  { key: "evaNotes", help: "EVA work: notes (max 1500)." },
  { key: "voiceCast", help: 'Items "Role — Artist" separated by ";" (max 40).' },
  { key: "faqs", help: 'Lines "Q: …" then "A: …" in one quoted cell; blank line between FAQs (max 10).' },
];

export const PROJECT_CSV_HEADER = PROJECT_CSV_COLUMNS.map((c) => c.key);

const ALIASES: Record<string, string> = {
  sourcelanguage: "from",
  targetlanguages: "to",
  name: "title",
};
const KEY_BY_LOWER = new Map(PROJECT_CSV_HEADER.map((k) => [k.toLowerCase(), k]));

const BOOL_TRUE = new Set(["true", "yes", "y", "1"]);
const BOOL_FALSE = new Set(["false", "no", "n", "0", ""]);

const splitList = (v: string) =>
  v
    .split(/[;\r\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

function canonical<T extends string>(list: readonly T[], value: string): T | string {
  return list.find((x) => x.toLowerCase() === value.trim().toLowerCase()) ?? value.trim();
}

export type CsvRowResult = {
  /** 1-based line of the row in the file (header is line 1; multi-line cells may shift this). */
  row: number;
  title: string;
  from: string;
  to: string;
  category: string;
  year: string;
  published: boolean;
  posterUrl?: string;
  errors: string[];
  data?: ProjectInput;
};

export type CsvParseResult =
  | { ok: true; rows: CsvRowResult[]; warnings: string[] }
  | { ok: false; error: string };

const FIELD_LABEL: Record<string, string> = { from: "from", to: "to", evaWork: "eva*", poster: "posterUrl" };

/** Maps one CSV record onto the form's FormData. Returns FormData plus CSV-only errors. */
function recordToFormData(rec: Record<string, string>) {
  const fd = new FormData();
  const errors: string[] = [];
  const set = (k: string, v: string) => {
    if (v !== "") fd.set(k, v);
  };
  const bool = (k: string, target: string) => {
    const v = (rec[k] ?? "").trim().toLowerCase();
    if (BOOL_TRUE.has(v)) fd.set(target, "on");
    else if (!BOOL_FALSE.has(v)) errors.push(`${k}: use true or false.`);
  };
  set("title", rec.title ?? "");
  set("from", canonical(PROJECT_LANGUAGES, rec.from ?? ""));
  for (const l of splitList(rec.to ?? "")) fd.append("to", canonical(PROJECT_LANGUAGES, l));
  set("category", canonical(PROJECT_CATEGORIES, rec.category ?? ""));
  const year = (rec.year ?? "").trim();
  set("year", year.toLowerCase() === PROJECT_YEAR_ONGOING ? PROJECT_YEAR_ONGOING : year);
  fd.set("audioHours", rec.audioHours ?? "");
  bool("published", "published");
  fd.set("description", rec.description ?? "");
  fd.set("posterAlt", rec.posterAlt ?? "");
  for (const k of ["synopsis", "director", "originalRelease", "productionHouse", "trailerUrl", "whereToWatch", "evaMix", "evaVoiceArtists", "evaDubbingDirector", "evaNotes", "faqs"]) {
    set(k, rec[k] ?? "");
  }
  set("cast", splitList(rec.cast ?? "").join("\n"));
  set("voiceCast", splitList(rec.voiceCast ?? "").join("\n"));
  bool("evaLipSync", "evaLipSync");
  bool("evaSongs", "evaSongs");
  const posterUrl = (rec.posterUrl ?? "").trim();
  if (posterUrl) {
    try {
      const u = new URL(posterUrl);
      if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
    } catch {
      errors.push("posterUrl: use an http or https image URL.");
    }
  }
  return { fd, errors, posterUrl: posterUrl || undefined };
}

/**
 * Parses and validates the whole file against `existing` projects. Pure: no I/O.
 */
export function validateProjectCsv(text: string, existing: readonly Pick<Project, "title">[]): CsvParseResult {
  let records: string[][];
  try {
    records = parseCsv(text);
  } catch (err) {
    return { ok: false, error: err instanceof CsvError ? err.message : "Couldn't read the CSV file." };
  }
  // Rows whose first cell starts with "#" are comments.
  records = records.filter((r) => !(r[0] ?? "").trimStart().startsWith("#"));
  if (records.length < 2) return { ok: false, error: "The file has no project rows under the header." };
  const header = records[0].map((h) => {
    const low = h.trim().toLowerCase();
    return KEY_BY_LOWER.get(low) ?? ALIASES[low] ?? null;
  });
  const warnings: string[] = [];
  const unknown = records[0].filter((_, i) => header[i] === null).map((h) => h.trim()).filter(Boolean);
  if (unknown.length) warnings.push(`Ignored unknown columns: ${unknown.join(", ")}.`);
  const missing = PROJECT_CSV_COLUMNS.filter((c) => c.required && !header.includes(c.key)).map((c) => c.key);
  if (missing.length) return { ok: false, error: `Missing required columns: ${missing.join(", ")}. Download the template for the exact header.` };
  const body = records.slice(1);
  if (body.length > CSV_MAX_ROWS) return { ok: false, error: `The file has ${body.length} rows. The maximum is ${CSV_MAX_ROWS} per import.` };

  const taken = new Map(existing.map((p) => [projectNameKey(p.title), `an existing project “${p.title}”`]));
  const rows: CsvRowResult[] = body.map((cells, i) => {
    const rec: Record<string, string> = {};
    header.forEach((k, j) => {
      if (k) rec[k] = cells[j] ?? "";
    });
    const { fd, errors, posterUrl } = recordToFormData(rec);
    if (cells.length > header.length && cells.slice(header.length).some((c) => c.trim())) {
      errors.push("Row has more cells than the header. Wrap values that contain commas in double quotes.");
    }
    const parsed = parseProjectForm(fd);
    if (parsed.fieldErrors) {
      for (const [k, msg] of Object.entries(parsed.fieldErrors)) errors.push(`${FIELD_LABEL[k] ?? k}: ${msg}`);
    }
    const title = (rec.title ?? "").trim();
    if (title) {
      const key = projectNameKey(title);
      const clash = taken.get(key);
      if (clash) errors.push(`title: same name as ${clash}.`);
      else taken.set(key, `row ${i + 2}`);
    }
    return {
      row: i + 2,
      title,
      from: String(fd.get("from") ?? ""),
      to: fd.getAll("to").map(String).join(", "),
      category: String(fd.get("category") ?? ""),
      year: String(fd.get("year") ?? ""),
      published: fd.get("published") === "on",
      posterUrl,
      errors,
      data: errors.length ? undefined : parsed.data,
    };
  });
  return { ok: true, rows, warnings };
}

const bool = (v: boolean | undefined) => (v ? "true" : "false");

/** One project as a CSV row in PROJECT_CSV_HEADER order (export / round-trip). */
export function projectToCsvRow(p: Project): string[] {
  const values: Record<string, string> = {
    title: p.title,
    from: p.from,
    to: p.to.join(";"),
    category: p.category,
    year: p.year ?? "",
    audioHours: p.audioHours !== undefined ? String(p.audioHours) : "",
    published: bool(p.published !== false),
    description: p.description ?? "",
    posterUrl: p.poster ? new URL(p.poster, APP_BASE_URL).toString() : "",
    posterAlt: p.posterAlt ?? "",
    synopsis: p.synopsis ?? "",
    director: p.director ?? "",
    cast: (p.cast ?? []).join("; "),
    originalRelease: p.originalRelease ?? "",
    productionHouse: p.productionHouse ?? "",
    trailerUrl: p.trailerUrl ?? "",
    whereToWatch: p.whereToWatch ?? "",
    evaLipSync: bool(p.evaWork?.lipSync),
    evaSongs: bool(p.evaWork?.songs),
    evaMix: p.evaWork?.mix ?? "",
    evaVoiceArtists: p.evaWork?.voiceArtists ? String(p.evaWork.voiceArtists) : "",
    evaDubbingDirector: p.evaWork?.dubbingDirector ?? "",
    evaNotes: p.evaWork?.notes ?? "",
    voiceCast: (p.voiceCast ?? []).map((v) => `${v.role} — ${v.artist}`).join("; "),
    faqs: formatFaqs(p.faqs),
  };
  return PROJECT_CSV_HEADER.map((k) => values[k] ?? "");
}

export function projectsToCsv(projects: readonly Project[]) {
  return toCsv([PROJECT_CSV_HEADER, ...projects.map(projectToCsvRow)]);
}

/** Template: header plus one example row (delete it before importing). */
export function projectCsvTemplate() {
  const example: Record<string, string> = {
    title: "Example Film (delete this row)",
    from: "Telugu",
    to: "Hindi",
    category: "Movie Dubbing",
    year: String(new Date().getFullYear()),
    audioHours: "2.5",
    published: "false",
    description: "Short public description.",
    posterUrl: "https://example.org/poster.jpg",
    posterAlt: "",
    cast: "Actor One; Actor Two",
    originalRelease: `${new Date().getFullYear()}-01-15`,
    evaLipSync: "true",
    evaSongs: "false",
    voiceCast: "Hero — Artist Name; Heroine — Artist Name",
    faqs: "Q: Is it lip-synced?\nA: Yes.",
  };
  return toCsv([PROJECT_CSV_HEADER, PROJECT_CSV_HEADER.map((k) => example[k] ?? "")]);
}

/** Column reference as CSV (column, required, allowed values). */
export function projectCsvGuide() {
  return toCsv([["column", "required", "allowed values / format"], ...PROJECT_CSV_COLUMNS.map((c) => [c.key, c.required ? "yes" : "no", c.help])]);
}
