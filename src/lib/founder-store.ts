import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { unstable_cache } from "next/cache";
import {
  FOUNDER,
  FOUNDER_FEATURED_MAX,
  FOUNDER_HIGHLIGHTS_MAX,
  type FounderContent,
} from "@@/data/founder";
import { readBlob, readBlobText, USE_BLOB, writeBlob } from "@@/lib/blob";
import { DATA_REVALIDATE_SECONDS } from "@@/lib/cache-tags";

/** Admin saves call updateTag(FOUNDER_TAG); reads are one small Blob get per cache window. */
export const FOUNDER_TAG = "eva-founder";
export const FOUNDER_PHOTO_URL_PREFIX = "/images/founder/";
export const FOUNDER_PHOTO_FILE_PATTERN = /^founder-[a-z0-9]+\.avif$/;
export const FOUNDER_PHOTO_MAX_BYTES = 150 * 1024;

const BLOB_FILE = "founder.json";
const DATA_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.EVA_DATA_DIR || "storage");
const FILE = path.join(DATA_DIR, "founder.json");
const PHOTO_DIR = path.join(DATA_DIR, "founder");
const ONE_YEAR = 60 * 60 * 24 * 365;

export const FOUNDER_DEFAULTS: FounderContent = {
  name: FOUNDER.name,
  title: FOUNDER.title,
  photo: FOUNDER.photo,
  photoAlt: FOUNDER.photoAlt,
  linkedinUrl: FOUNDER.linkedinUrl,
  bio: [...FOUNDER.bio],
  highlights: FOUNDER.highlights.map((h) => ({ ...h })),
  featuredProjectIds: [...FOUNDER.featuredProjectIds],
};

const str = (v: unknown, fallback: string) => (typeof v === "string" ? v : fallback);

/** Missing or malformed fields fall back to the defaults in src/data/founder.ts. */
export function normalizeFounder(raw: unknown): FounderContent {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const d = FOUNDER_DEFAULTS;
  const strings = (v: unknown) =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : null;
  const highlights = Array.isArray(o.highlights)
    ? o.highlights
        .filter((h): h is { value: unknown; label: unknown } => !!h && typeof h === "object")
        .map((h) => ({ value: str(h.value, ""), label: str(h.label, "") }))
        .filter((h) => h.value || h.label)
        .slice(0, FOUNDER_HIGHLIGHTS_MAX)
    : d.highlights;
  return {
    name: str(o.name, d.name) || d.name,
    title: str(o.title, d.title),
    photo: str(o.photo, d.photo) || d.photo,
    photoAlt: str(o.photoAlt, d.photoAlt),
    linkedinUrl: str(o.linkedinUrl, d.linkedinUrl),
    bio: strings(o.bio) ?? d.bio,
    highlights,
    featuredProjectIds: (strings(o.featuredProjectIds) ?? []).slice(0, FOUNDER_FEATURED_MAX),
  };
}

async function readUncached(): Promise<FounderContent> {
  try {
    const text = USE_BLOB ? await readBlobText(BLOB_FILE) : await readFile(FILE, "utf8");
    return text === null ? FOUNDER_DEFAULTS : normalizeFounder(JSON.parse(text));
  } catch {
    // Missing file, missing blob or bad JSON: show the built-in defaults.
    return FOUNDER_DEFAULTS;
  }
}

const readCached = unstable_cache(readUncached, ["eva-founder-v1"], {
  tags: [FOUNDER_TAG],
  revalidate: DATA_REVALIDATE_SECONDS,
});

export function getFounder() {
  return readCached();
}

/** Uncached, for the admin form so it never edits a stale copy. */
export function getFounderFresh() {
  return readUncached();
}

export async function saveFounder(content: FounderContent) {
  const body = `${JSON.stringify(normalizeFounder(content), null, 2)}\n`;
  if (USE_BLOB) {
    await writeBlob(BLOB_FILE, body, {
      contentType: "application/json",
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    });
    return;
  }
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FILE, body);
}

/** Resizes to a 600px square AVIF, stepping quality down until it fits under 150 KB. */
export async function saveFounderPhoto(
  file: File,
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  if (file.size > 15 * 1024 * 1024) return { ok: false, error: "Use a photo under 15 MB." };
  let bytes: Buffer | null = null;
  try {
    const input = Buffer.from(await file.arrayBuffer());
    for (const quality of [60, 50, 40, 30]) {
      const out = await sharp(input)
        .rotate()
        .resize(600, 600, { fit: "cover", position: "attention" })
        .avif({ quality })
        .toBuffer();
      bytes = out;
      if (out.length <= FOUNDER_PHOTO_MAX_BYTES) break;
    }
  } catch {
    return { ok: false, error: "That file isn't a readable image. Try a JPG, PNG, WebP or AVIF." };
  }
  if (!bytes || bytes.length > FOUNDER_PHOTO_MAX_BYTES) {
    return { ok: false, error: "Couldn't get the photo under 150 KB. Try a simpler image." };
  }
  const name = `founder-${Date.now().toString(36)}.avif`;
  if (USE_BLOB) {
    await writeBlob(`founder/${name}`, bytes, {
      contentType: "image/avif",
      cacheControlMaxAge: ONE_YEAR,
      allowOverwrite: true,
    });
  } else {
    await mkdir(PHOTO_DIR, { recursive: true });
    await writeFile(path.join(PHOTO_DIR, name), bytes);
  }
  return { ok: true, path: `${FOUNDER_PHOTO_URL_PREFIX}${name}` };
}

export async function readFounderPhoto(name: string) {
  if (!FOUNDER_PHOTO_FILE_PATTERN.test(name)) return null;
  if (USE_BLOB) {
    const blob = await readBlob(`founder/${name}`);
    return blob ? { body: blob.stream as BodyInit, size: blob.size } : null;
  }
  try {
    const buf = await readFile(path.join(PHOTO_DIR, name));
    return { body: new Uint8Array(buf) as BodyInit, size: buf.length };
  } catch {
    return null;
  }
}
