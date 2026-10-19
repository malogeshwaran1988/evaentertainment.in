// Checks the CSV parser, row validation and export → import round trip.
// Run: node scripts/test-project-csv.mjs  (uses jiti, already in node_modules)
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, { alias: { "@@": path.join(root, "src") } });
const { parseCsv } = await jiti.import(path.join(root, "src/lib/admin/csv.ts"));
const csvMod = await jiti.import(path.join(root, "src/lib/admin/project-csv.ts"));
const { validateProjectCsv, projectsToCsv, projectCsvTemplate, PROJECT_CSV_HEADER } = csvMod;

// Parser
assert.deepEqual(parseCsv('\uFEFFa,b,c\r\n1,"x, y","he said ""hi"""\n2,"multi\nline",\n'), [
  ["a", "b", "c"], ["1", "x, y", 'he said "hi"'], ["2", "multi\nline", ""],
]);
assert.deepEqual(parseCsv("a,b\r\r\n\n1,2"), [["a", "b"], ["1", "2"]]);
assert.throws(() => parseCsv('a\n"open'));

const y = String(new Date().getFullYear());
const head = "title,from,to,category,year,audioHours,published,posterUrl\n";
let r = validateProjectCsv(head + `Good,telugu,Hindi;tamil,movie dubbing,${y},2.5,,\n` +
  `Bad,Telugu,Telugu,Nope,1980,-1,maybe,ftp://x\n` +
  `good,Tamil,Hindi,Dubbing,ongoing,,true,\n` +
  `Existing Film,Tamil,Hindi,Dubbing,ongoing,,,\n`, [{ title: "Existing  film" }]);
assert.ok(r.ok);
assert.deepEqual(r.rows[0].errors, []);
assert.deepEqual(r.rows[0].data.to, ["Tamil", "Hindi"]);
assert.equal(r.rows[0].data.published, false);
assert.equal(r.rows[0].data.audioHours, 2.5);
const bad = r.rows[1].errors.join(" | ");
for (const f of ["published", "posterUrl", "category", "year", "audioHours"]) assert.ok(bad.includes(f), `${f} in ${bad}`);
assert.match(r.rows[2].errors.join(), /same name as row 2/);
assert.match(r.rows[3].errors.join(), /existing project/);
assert.match(validateProjectCsv(head + "S,Tamil,Tamil,Dubbing,ongoing,,,", []).rows[0].errors.join(), /^to: Target languages/);
assert.equal(validateProjectCsv("title,from\nx,Tamil", []).ok, false); // missing required columns
const many = head + Array.from({ length: 201 }, (_, i) => `T${i},Tamil,Hindi,Dubbing,ongoing,,,`).join("\n");
assert.equal(validateProjectCsv(many, []).ok, false);

// Template: header matches, example row validates
r = validateProjectCsv(projectCsvTemplate(), []);
assert.ok(r.ok && r.rows[0].errors.length === 0, JSON.stringify(r));

// Round trip: every field of a full project survives export → validate unchanged
const full = {
  id: "1", slug: "s", title: "Thank You, \"Dear\"", from: "Telugu", to: ["Tamil", "Hindi"], category: "Movie Dubbing",
  poster: "/images/our-projects/a.avif?v=2", posterAlt: "Alt", description: "Line one,\nline two", audioHours: 12.5,
  year: "2025", published: true, synopsis: "Syn", director: "Dir", cast: ["A One", "B Two"], originalRelease: "2025-03",
  productionHouse: "PH", trailerUrl: "https://youtu.be/dQw4w9WgXcQ", whereToWatch: "ETV Win",
  evaWork: { lipSync: true, songs: true, mix: "5.1 and stereo", voiceArtists: 12, dubbingDirector: "DD", notes: "N" },
  voiceCast: [{ role: "Hero", artist: "Artist A" }], faqs: [{ q: "Q1?", a: "A1." }, { q: "Q2?", a: "A2." }],
  createdAt: "", updatedAt: "",
};
const minimal = { id: "2", slug: "m", title: "Min", from: "Tamil", to: ["Hindi"], category: "Dubbing", year: "ongoing", published: false, createdAt: "", updatedAt: "" };
r = validateProjectCsv(projectsToCsv([full, minimal]), []);
assert.ok(r.ok);
for (const row of r.rows) assert.deepEqual(row.errors, []);
const strip = (o) => JSON.parse(JSON.stringify(o));
const expected = { ...full };
for (const k of ["id", "slug", "poster", "createdAt", "updatedAt"]) delete expected[k];
assert.deepEqual(strip(r.rows[0].data), expected);
assert.equal(r.rows[0].posterUrl, "https://evaentertainment.in/images/our-projects/a.avif?v=2");
assert.deepEqual(strip(r.rows[1].data), { title: "Min", from: "Tamil", to: ["Hindi"], category: "Dubbing", year: "ongoing", published: false });

// Real data round trip: local storage/projects.json if present, else the seed projects.
const store = path.join(root, process.env.EVA_DATA_DIR || "storage", "projects.json");
let real = existsSync(store) ? JSON.parse(readFileSync(store, "utf8")) : [];
let source = "local storage";
if (!real.length) {
  const { PROJECTS_SEED } = await jiti.import(path.join(root, "src/data/projects-seed.ts"));
  real = PROJECTS_SEED.map((p, i) => ({ ...p, id: String(i), slug: String(i), published: true, createdAt: "", updatedAt: "" }));
  source = "seed";
}
const withYear = real.filter((p) => p.year);
const rr = validateProjectCsv(projectsToCsv(real), []);
assert.ok(rr.ok, JSON.stringify(rr));
const failing = rr.rows.filter((x) => x.errors.length && !(x.errors.length === 1 && x.errors[0].startsWith("year:")));
assert.deepEqual(failing.map((x) => `${x.title}: ${x.errors}`), []);
console.log(`round trip of ${real.length} ${source} projects: ok (${real.length - withYear.length} without a year flagged "year", same as the form)`);
assert.equal(PROJECT_CSV_HEADER[0], "title");
console.log("project CSV tests passed");
