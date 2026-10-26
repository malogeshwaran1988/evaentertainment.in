/**
 * End-to-end check that admin saves keep /sitemap.xml and project URLs in sync.
 * Local only: it refuses any host but localhost and needs a local build that uses the file store
 * (BLOB_READ_WRITE_TOKEN empty) so production data is never touched.
 *
 *   AUTH_SECRET=<local test secret> ADMIN_ALLOWED_EMAILS=<test>@lasmind.com AUTH_GOOGLE_ID=x \
 *   AUTH_GOOGLE_SECRET=x BLOB_READ_WRITE_TOKEN= MAIL_MOCK=1 npx next start -p 3123
 *   TEST_ADMIN_EMAIL=<test>@lasmind.com AUTH_SECRET=<same> node scripts/test-sitemap-sync.mjs
 *
 * Needs playwright-core (npm i --no-save playwright-core) and a local Chrome.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { encode } from "next-auth/jwt";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL || "http://localhost:3123";
const SITE = "https://evaentertainment.in";
const STORE = path.resolve(process.env.EVA_DATA_DIR || "storage", "projects.json");
const CHROME =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const EMAIL = process.env.TEST_ADMIN_EMAIL;

if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(BASE)) throw new Error(`Local hosts only, got ${BASE}`);
if (process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Unset BLOB_READ_WRITE_TOKEN: this test must use the local file store");
if (!process.env.AUTH_SECRET || !EMAIL) throw new Error("Set AUTH_SECRET and TEST_ADMIN_EMAIL (the server's local values)");

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};

const sitemapUrls = async () => {
  const xml = await (await fetch(`${BASE}/sitemap.xml`, { cache: "no-store" })).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
};
const status = async (p) => {
  const res = await fetch(`${BASE}${p}`, { redirect: "manual" });
  return { code: res.status, location: res.headers.get("location") ?? "" };
};
const robotsOf = async (p) => {
  const html = await (await fetch(`${BASE}${p}`)).text();
  return html.match(/<meta name="robots" content="([^"]+)"/)?.[1] ?? "";
};
const findInStore = async (title) =>
  JSON.parse(await readFile(STORE, "utf8")).find((p) => p.title === title) ?? null;

const token = await encode({
  token: { email: EMAIL, sub: "sitemap-sync-test" },
  secret: process.env.AUTH_SECRET,
  salt: "authjs.session-token",
});
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const context = await browser.newContext();
await context.addCookies([{ name: "authjs.session-token", value: token, url: BASE }]);
const page = await context.newPage();
page.on("dialog", (d) => d.accept());

const stamp = Date.now().toString(36);
const title = `Sitemap Sync Test ${stamp}`;
const renamed = `Sitemap Sync Renamed ${stamp}`;

try {
  // 1. Create (published, Hindi target)
  await page.goto(`${BASE}/admin/projects/new`);
  await page.fill("#title", title);
  await page.click("#from");
  await page.getByRole("option", { name: "Telugu", exact: true }).click();
  await page.click("#to-Hindi");
  if (await page.locator("#year").count()) {
    await page.click("#year");
    await page.getByRole("option", { name: "2024", exact: true }).click();
  }
  await page.click('button[type="submit"]');
  await page.waitForFunction(() => /added/i.test(document.body.innerText), null, { timeout: 20000 });
  const created = await findInStore(title);
  check("create: saved to the local store", !!created);
  const slug = created.slug;
  const href = `/projects/${slug}`;
  check("create: listed in sitemap.xml", (await sitemapUrls()).includes(`${SITE}${href}`), href);
  check("create: page returns 200", (await status(href)).code === 200);
  check("create: page is index, follow", /^index, follow/.test(await robotsOf(href)));

  // 2. Rename (slug change)
  await page.goto(`${BASE}/admin/projects/${created.id}/edit`);
  await page.fill("#title", renamed);
  await page.click('button[type="submit"]');
  await page.waitForFunction(() => /updated/i.test(document.body.innerText), null, { timeout: 20000 });
  const updated = await findInStore(renamed);
  const newHref = `/projects/${updated.slug}`;
  check("rename: slug changed", updated.slug !== slug, `${slug} -> ${updated.slug}`);
  check("rename: old slug kept in previousSlugs", (updated.previousSlugs ?? []).includes(slug));
  const urls = await sitemapUrls();
  check("rename: new URL in sitemap.xml", urls.includes(`${SITE}${newHref}`));
  check("rename: old URL gone from sitemap.xml", !urls.includes(`${SITE}${href}`));
  const old = await status(href);
  check("rename: old URL answers 308 to the new one", old.code === 308 && old.location.endsWith(newHref), `${old.code} ${old.location}`);

  // 3. Delete
  await page.goto(`${BASE}/admin/projects`);
  const row = page.locator("tr", { hasText: renamed });
  await row.getByRole("button").last().click();
  const del = page.getByRole("menuitem", { name: /delete/i });
  if (await del.count()) await del.first().click();
  const confirm = page.getByRole("alertdialog").getByRole("button", { name: /delete/i });
  if (await confirm.count()) await confirm.click();
  await page.waitForFunction(() => /deleted/i.test(document.body.innerText), null, { timeout: 20000 });
  check("delete: removed from the store", !(await findInStore(renamed)));
  const after = await sitemapUrls();
  check("delete: gone from sitemap.xml", !after.includes(`${SITE}${newHref}`));
  check("delete: page returns 404", (await status(newHref)).code === 404);
  check("delete: old slug returns 404", (await status(href)).code === 404);
} catch (err) {
  check("run without errors", false, err.message);
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
