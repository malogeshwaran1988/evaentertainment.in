import "server-only";
import { createHash } from "node:crypto";
import { access, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { BLOG_IMAGE_MAX_BYTES, BLOG_IMAGE_URL_PREFIX, type BlogPost } from "@@/data/blog";
import { blobExists, deleteBlob, readBlob, USE_BLOB, writeBlob } from "@@/lib/blob";
import { blogImageBaseName } from "@@/lib/blog/seo";

/**
 * Cover and in-article images. Same rules as project posters: 150 KB cap, type sniffed from the
 * bytes, branded file names (`…-eva-entertainment-<hash8>.avif`, identical uploads share one file), a `?v=` version in the
 * stored URL, private Blob store on Vercel (`eva/blog/…`) and public/images/blog/ locally.
 */
const blobKey = (name: string) => `blog/${name}`;
const ONE_YEAR = 60 * 60 * 24 * 365;

export const BLOG_IMAGE_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "images", "blog");
const diskPath = (name: string) => path.join(/*turbopackIgnore: true*/ BLOG_IMAGE_DIR, name);

export const BLOG_IMAGE_FILE_PATTERN = /^[a-z0-9-]+\.(jpg|png|webp|avif)$/;

const CONTENT_TYPES = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
} as const;
type Ext = keyof typeof CONTENT_TYPES;

function sniffImage(bytes: Buffer): Ext | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "png";
  }
  if (bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") {
    return "webp";
  }
  if (bytes.length >= 12 && bytes.toString("ascii", 4, 8) === "ftyp") {
    const brand = bytes.toString("ascii", 8, 12);
    if (brand === "avif" || brand === "avis") return "avif";
  }
  return null;
}

/** "name.avif" from "/images/blog/name.avif?v=x" or null for anything else. */
export function blogImageFileName(url: string | undefined): string | null {
  if (!url?.startsWith(BLOG_IMAGE_URL_PREFIX)) return null;
  const name = url.slice(BLOG_IMAGE_URL_PREFIX.length).split("?")[0];
  return BLOG_IMAGE_FILE_PATTERN.test(name) ? name : null;
}

/** Every uploaded image a post uses: its cover plus <img> tags in the article. */
export function blogImagesOf(post: Pick<BlogPost, "cover" | "content">): Set<string> {
  const names = new Set<string>();
  const cover = blogImageFileName(post.cover);
  if (cover) names.add(cover);
  const re = new RegExp(`src="(${BLOG_IMAGE_URL_PREFIX.replace(/\//g, "\\/")}[^"]+)"`, "g");
  for (const m of post.content.matchAll(re)) {
    const name = blogImageFileName(m[1].replace(/&amp;/g, "&"));
    if (name) names.add(name);
  }
  return names;
}

async function exists(name: string) {
  try {
    await access(diskPath(name));
    return true;
  } catch {
    return false;
  }
}

export type BlogImageResult = { ok: true; url: string } | { ok: false; error: string };

/**
 * Saves an upload as `<stem>-eva-entertainment-<hash8>.<ext>`; the same bytes reuse the stored file
 * (cleanup only deletes files no post references, so sharing is safe).
 */
export async function saveBlogImage(file: File, stem: string): Promise<BlogImageResult> {
  if (file.size > BLOG_IMAGE_MAX_BYTES) {
    return {
      ok: false,
      error: `Image is ${Math.ceil(file.size / 1024)} KB. The maximum is ${BLOG_IMAGE_MAX_BYTES / 1024} KB.`,
    };
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = sniffImage(bytes);
  if (!ext) return { ok: false, error: "Use a JPG, PNG, WebP or AVIF image." };
  // Content-addressed name: the same bytes always get the same name, so a re-upload is stored
  // once and no head() loop is needed to find a free "-2/-3" name (that loop cost up to 200
  // Simple Operations per upload).
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 8);
  const name = `${blogImageBaseName(stem)}-${hash}.${ext}`;
  if (USE_BLOB) {
    try {
      await writeBlob(blobKey(name), bytes, {
        contentType: CONTENT_TYPES[ext],
        cacheControlMaxAge: ONE_YEAR,
        allowOverwrite: false,
      });
    } catch (err) {
      // Already stored (same name ⇒ same bytes): reuse it. Anything else is a real failure.
      if (!(await blobExists(blobKey(name)))) throw err;
    }
  } else {
    await mkdir(BLOG_IMAGE_DIR, { recursive: true });
    if (!(await exists(name))) await writeFile(diskPath(name), bytes);
  }
  return { ok: true, url: `${BLOG_IMAGE_URL_PREFIX}${name}?v=${Date.now().toString(36)}` };
}

export async function deleteBlogImage(name: string) {
  if (!BLOG_IMAGE_FILE_PATTERN.test(name)) return;
  try {
    if (USE_BLOB) await deleteBlob(blobKey(name));
    else await unlink(diskPath(name));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") console.error("Failed to delete blog image", name, err);
  }
}

export type BlogImageFile = {
  body: ReadableStream<Uint8Array> | Uint8Array<ArrayBuffer>;
  size: number;
  contentType: string;
};

export async function readBlogImage(name: string): Promise<BlogImageFile | null> {
  if (!BLOG_IMAGE_FILE_PATTERN.test(name)) return null;
  const ext = name.slice(name.lastIndexOf(".") + 1) as Ext;
  if (USE_BLOB) {
    const blob = await readBlob(blobKey(name));
    return blob && { body: blob.stream, size: blob.size, contentType: CONTENT_TYPES[ext] };
  }
  try {
    const bytes = await readFile(diskPath(name));
    return { body: new Uint8Array(bytes), size: bytes.length, contentType: CONTENT_TYPES[ext] };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}
