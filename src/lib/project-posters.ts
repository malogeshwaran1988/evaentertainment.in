import "server-only";
import { createHash } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { POSTER_MAX_BYTES, POSTER_URL_PREFIX, projectNameKey } from "@@/data/projects";
import { deleteBlob, readBlob, USE_BLOB, writeBlob } from "@@/lib/blob";

const posterBlobPath = (name: string) => `our-projects/${name}`;
const ONE_YEAR = 60 * 60 * 24 * 365;

export const POSTER_DIR = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
  "public",
  "images",
  "our-projects",
);
const posterDiskPath = (name: string) => path.join(/*turbopackIgnore: true*/ POSTER_DIR, name);

/** Uploaded file names are always generated here, so anything else is rejected. */
export const POSTER_FILE_PATTERN = /^[a-z0-9-]+\.(jpg|png|webp|avif)$/;

export const POSTER_CONTENT_TYPES = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
} as const;

type PosterExt = keyof typeof POSTER_CONTENT_TYPES;

/** Detects the real image type from its first bytes; the browser-reported type can't be trusted. */
function sniffImage(bytes: Buffer): PosterExt | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpg";
  }
  if (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "png";
  }
  if (
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }
  if (bytes.length >= 12 && bytes.toString("ascii", 4, 8) === "ftyp") {
    const brand = bytes.toString("ascii", 8, 12);
    if (brand === "avif" || brand === "avis") return "avif";
  }
  return null;
}

/**
 * "Biker" -> "biker". Names that aren't fully Latin get a short hash of the full name, so
 * "Biker" and "Biker தமிழ்" (or two all-Tamil names) never share a file.
 */
function posterBaseName(title: string) {
  const slug = title
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50)
    .replace(/-+$/, "");
  const key = projectNameKey(title);
  if (slug && /^[a-z0-9]*$/.test(key)) return slug;
  const hash = createHash("sha256").update(key).digest("hex").slice(0, 8);
  return slug ? `${slug}-${hash}` : `poster-${hash}`;
}

/** The query changes on every upload, so the long-lived cache never serves an old image. */
const posterUrl = (name: string) => `${POSTER_URL_PREFIX}${name}?v=${Date.now().toString(36)}`;

/** File name of an uploaded poster ("biker.avif"), or null for seeded /public images. */
function posterFileName(posterPath: string | undefined) {
  if (!posterPath?.startsWith(POSTER_URL_PREFIX)) return null;
  const name = posterPath.slice(POSTER_URL_PREFIX.length).split("?")[0];
  return POSTER_FILE_PATTERN.test(name) ? name : null;
}

/** True when both paths point at the same uploaded file, whatever their `?v=`. */
export function isSamePosterFile(a: string | undefined, b: string | undefined) {
  const name = posterFileName(a);
  return name !== null && name === posterFileName(b);
}

async function writePosterFile(name: string, bytes: Buffer, ext: PosterExt) {
  if (USE_BLOB) {
    await writeBlob(posterBlobPath(name), bytes, {
      contentType: POSTER_CONTENT_TYPES[ext],
      cacheControlMaxAge: ONE_YEAR,
      // Project names are unique, so an existing file is this project's old poster or an orphan.
      allowOverwrite: true,
    });
    return;
  }
  await mkdir(POSTER_DIR, { recursive: true });
  await writeFile(posterDiskPath(name), bytes);
}

export type PosterResult = { ok: true; path: string } | { ok: false; error: string };

/** Saves as "<project name>.<ext>", replacing any file already under that name. */
export async function savePoster(file: File, title: string): Promise<PosterResult> {
  if (file.size > POSTER_MAX_BYTES) {
    return {
      ok: false,
      error: `Poster is ${Math.ceil(file.size / 1024)} KB. The maximum is ${POSTER_MAX_BYTES / 1024} KB.`,
    };
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = sniffImage(bytes);
  if (!ext) {
    return { ok: false, error: "Poster must be a JPG, PNG, WebP or AVIF image." };
  }
  const name = `${posterBaseName(title)}.${ext}`;
  await writePosterFile(name, bytes, ext);
  return { ok: true, path: posterUrl(name) };
}

/**
 * Copies an uploaded poster to the file name for `title` and returns its new path, or the
 * same path when nothing needs to move. The old file is left for the caller to delete.
 */
export async function renamePoster(posterPath: string, title: string): Promise<string> {
  const name = posterFileName(posterPath);
  if (!name) return posterPath;
  const ext = name.slice(name.lastIndexOf(".") + 1) as PosterExt;
  const target = `${posterBaseName(title)}.${ext}`;
  if (target === name) return posterPath;
  const poster = await readPoster(name);
  if (!poster) return posterPath;
  const bytes = Buffer.from(await new Response(poster.body).arrayBuffer());
  await writePosterFile(target, bytes, ext);
  return posterUrl(target);
}

/** Removes an uploaded poster; paths outside /images/our-projects/ are left alone. */
export async function deletePoster(posterPath: string | undefined) {
  const name = posterFileName(posterPath);
  if (!name) return;
  if (USE_BLOB) {
    await deleteBlob(posterBlobPath(name));
    return;
  }
  try {
    await unlink(posterDiskPath(name));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
}

export type PosterFile = {
  body: ReadableStream<Uint8Array> | Uint8Array<ArrayBuffer>;
  size: number;
  contentType: string;
};

export async function readPoster(name: string): Promise<PosterFile | null> {
  if (!POSTER_FILE_PATTERN.test(name)) return null;
  const ext = name.slice(name.lastIndexOf(".") + 1) as PosterExt;
  if (USE_BLOB) {
    const blob = await readBlob(posterBlobPath(name));
    return blob && { body: blob.stream, size: blob.size, contentType: POSTER_CONTENT_TYPES[ext] };
  }
  try {
    const bytes = await readFile(posterDiskPath(name));
    return { body: new Uint8Array(bytes), size: bytes.length, contentType: POSTER_CONTENT_TYPES[ext] };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}
