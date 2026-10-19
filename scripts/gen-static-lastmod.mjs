#!/usr/bin/env node
/**
 * Writes src/data/static-lastmod.json: the real last-changed date (latest git commit touching
 * the page or its content data) for each static route, used as sitemap <lastmod>.
 * Runs automatically before `next build` (npm "prebuild"). If git history isn't available
 * (e.g. a shallow CI clone), the committed JSON is kept as-is.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const OUT = "src/data/static-lastmod.json";
const ROUTES = {
  "/": ["src/app/(web)/page.tsx", "src/data/home.ts", "src/components/home"],
  "/our-projects": ["src/app/(web)/our-projects", "src/components/projects/ProjectsGallery.tsx"],
  "/about-us": ["src/app/(web)/about-us", "src/data/about.ts"],
  "/studio-equipment": ["src/app/(web)/studio-equipment", "src/data/equipment.ts"],
  "/contact-us": ["src/app/(web)/contact-us", "src/data/contact.ts"],
  "/privacy-policy": ["src/app/(web)/privacy-policy", "src/data/privacy.ts"],
  "/terms-conditions": ["src/app/(web)/terms-conditions", "src/data/terms.ts"],
  "service:*": ["src/app/(web)/[service]", "src/data/services.ts", "src/components/services"],
};

function lastCommit(paths) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...paths], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

let existing = {};
try {
  existing = JSON.parse(readFileSync(OUT, "utf8"));
} catch {
  /* first run */
}

const result = {};
let found = 0;
for (const [route, paths] of Object.entries(ROUTES)) {
  const date = lastCommit(paths);
  if (date) found++;
  result[route] = date ? date.slice(0, 10) : existing[route] ?? null;
}
if (!found) {
  console.log("[gen-static-lastmod] git history unavailable; keeping", OUT);
} else {
  const next = `${JSON.stringify(result, null, 2)}\n`;
  // Only write on a real change: touching this src/ file while `next dev` runs makes every open tab rebuild/reload.
  let current = "";
  try {
    current = readFileSync(OUT, "utf8");
  } catch {
    /* first run */
  }
  if (current === next) {
    console.log("[gen-static-lastmod] unchanged", OUT);
  } else {
    writeFileSync(OUT, next);
    console.log("[gen-static-lastmod] wrote", OUT);
  }
}
