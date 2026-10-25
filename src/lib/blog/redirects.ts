import { readFile } from "node:fs/promises";
import { get } from "@vercel/blob";
import { blogPostIsPublic, type BlogPost } from "@@/data/blog";
import { blobPath, USE_BLOB } from "@@/lib/blob-path";
import { BLOG_BLOB_FILE, BLOG_DISK_FILE } from "@@/lib/blog/paths";

/**
 * Old-slug → current-slug lookup for src/proxy.ts, which answers /blog/<old> with a real 301
 * (a redirect from a page would be a 308). Kept in memory for 5 minutes and read with the Blob CDN cache, so requests rarely cost an operation;
 * the post page itself also redirects, which covers the few seconds after a rename.
 */
const TTL_MS = 5 * 60_000;

type Lookup = { current: Set<string>; moved: Map<string, string> };

let cache: { at: number; lookup: Promise<Lookup> } | null = null;

async function readPosts(): Promise<BlogPost[]> {
  try {
    let raw: string;
    if (USE_BLOB) {
      const result = await get(blobPath(BLOG_BLOB_FILE), { access: "private" });
      if (!result || result.statusCode !== 200) return [];
      raw = await new Response(result.stream).text();
    } else {
      raw = await readFile(BLOG_DISK_FILE, "utf8");
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Missing file or a store hiccup: no redirects, the page handles the request as usual.
    return [];
  }
}

async function build(): Promise<Lookup> {
  const posts = (await readPosts()).filter((p) => blogPostIsPublic(p));
  const current = new Set(posts.map((p) => p.slug));
  const moved = new Map<string, string>();
  for (const p of posts) {
    for (const old of p.previousSlugs ?? []) if (!current.has(old)) moved.set(old, p.slug);
  }
  return { current, moved };
}

function lookup(): Promise<Lookup> {
  if (!cache || Date.now() - cache.at > TTL_MS) cache = { at: Date.now(), lookup: build() };
  return cache.lookup;
}

/**
 * Where /blog/<slug> should permanently redirect or null to serve it. Also folds case
 * (/blog/My-Post → /blog/my-post) so links typed with capitals still land on the one URL.
 */
export async function blogRedirectFor(slug: string): Promise<string | null> {
  const lower = slug.toLowerCase();
  const { current, moved } = await lookup();
  if (current.has(slug)) return null;
  if (current.has(lower)) return lower;
  return moved.get(slug) ?? moved.get(lower) ?? null;
}
