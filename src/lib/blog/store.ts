import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  blogPostIsPublic,
  compareBlogPosts,
  type BlogPost,
  type BlogPostInput,
} from "@@/data/blog";
import { unstable_cache } from "next/cache";
import { BlobPreconditionFailedError, readBlobText, readBlobVersioned, USE_BLOB, writeBlob } from "@@/lib/blob";
import { BLOG_TAG, DATA_REVALIDATE_SECONDS } from "@@/lib/cache-tags";
import { BLOG_BLOB_FILE, BLOG_DISK_FILE } from "@@/lib/blog/paths";

/**
 * Blog posts, stored like projects: one JSON file in the private Blob store (`eva/blog.json`)
 * or, in local dev, `${EVA_DATA_DIR:-./storage}/blog.json`. Writes are serialised in-process and
 * guarded by the Blob ETag across instances, and slug uniqueness is checked inside that write so
 * two saves can't both claim one URL.
 */
const MAX_WRITE_ATTEMPTS = 3;

let writeQueue: Promise<unknown> = Promise.resolve();

type Snapshot = { posts: BlogPost[]; etag?: string };

/** A slug is taken by another post's current or former URL. */
export class BlogSlugTakenError extends Error {
  constructor(
    readonly slug: string,
    readonly byTitle: string,
    readonly former: boolean,
  ) {
    super(`Slug ${slug} is taken`);
  }
}

const serialize = (posts: BlogPost[]) => `${JSON.stringify(posts, null, 2)}\n`;

function parsePosts(raw: string): BlogPost[] {
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? (parsed as BlogPost[]) : [];
}

async function writeAll(posts: BlogPost[], etag?: string): Promise<string | undefined> {
  if (USE_BLOB) {
    const saved = await writeBlob(BLOG_BLOB_FILE, serialize(posts), {
      contentType: "application/json",
      ...(etag ? { ifMatch: etag } : { allowOverwrite: false }),
    });
    return saved.etag;
  }
  await mkdir(path.dirname(BLOG_DISK_FILE), { recursive: true });
  const tmp = `${BLOG_DISK_FILE}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, serialize(posts), "utf8");
  await rename(tmp, BLOG_DISK_FILE);
}

async function readSnapshot(): Promise<Snapshot> {
  if (USE_BLOB) {
    const blob = await readBlobVersioned(BLOG_BLOB_FILE);
    return blob ? { posts: parsePosts(blob.text), etag: blob.etag } : { posts: [] };
  }
  try {
    return { posts: parsePosts(await readFile(BLOG_DISK_FILE, "utf8")) };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return { posts: [] };
    throw err;
  }
}

/** Read path: cached (BLOG_TAG, 1 day), one Blob get on a miss, no head(). Writes use readSnapshot. */
const readPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    if (USE_BLOB) {
      const text = await readBlobText(BLOG_BLOB_FILE);
      return text === null ? [] : parsePosts(text);
    }
    return (await readSnapshot()).posts;
  },
  ["eva-blog-v1"],
  { tags: [BLOG_TAG], revalidate: DATA_REVALIDATE_SECONDS },
);

function mutate<T>(fn: (posts: BlogPost[]) => { next: BlogPost[]; result: T }) {
  const run = writeQueue.then(async () => {
    for (let attempt = 1; ; attempt++) {
      const { posts, etag } = await readSnapshot();
      const { next, result } = fn(posts);
      try {
        // No blob yet: create it (allowOverwrite false), so a racing first save fails and retries.
        await writeAll(next, etag);
        return result;
      } catch (err) {
        const conflict = err instanceof BlobPreconditionFailedError;
        if (!conflict || attempt >= MAX_WRITE_ATTEMPTS) throw err;
      }
    }
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

/** Every slug in use (current and former), except the given post's own. */
export function takenBlogSlugs(posts: readonly BlogPost[], exceptId?: string): Set<string> {
  const taken = new Set<string>();
  for (const p of posts) {
    if (p.id === exceptId) continue;
    taken.add(p.slug);
    for (const s of p.previousSlugs ?? []) taken.add(s);
  }
  return taken;
}

function assertSlugFree(posts: readonly BlogPost[], slug: string, exceptId?: string) {
  for (const p of posts) {
    if (p.id === exceptId) continue;
    if (p.slug === slug) throw new BlogSlugTakenError(slug, p.title, false);
    if (p.previousSlugs?.includes(slug)) throw new BlogSlugTakenError(slug, p.title, true);
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await readPosts();
  return [...posts].sort(compareBlogPosts);
}

/** Uncached read for admin save actions (slug checks, image cleanup) so they never act on stale data. */
export async function getBlogPostsFresh(): Promise<BlogPost[]> {
  const { posts } = await readSnapshot();
  return [...posts].sort(compareBlogPosts);
}

export async function getPublicBlogPosts(now = new Date()): Promise<BlogPost[]> {
  return (await getBlogPosts()).filter((p) => blogPostIsPublic(p, now));
}

export async function getBlogPost(id: string) {
  return (await readPosts()).find((p) => p.id === id) ?? null;
}

export type PublicBlogLookup =
  | { post: BlogPost; redirectTo?: undefined }
  | { post?: undefined; redirectTo: string }
  | null;

/** A public post by its current slug, or the current slug when `slug` is one it used to have. */
export async function findPublicBlogPost(slug: string, now = new Date()): Promise<PublicBlogLookup> {
  const posts = (await readPosts()).filter((p) => blogPostIsPublic(p, now));
  const post = posts.find((p) => p.slug === slug);
  if (post) return { post };
  const moved = posts.find((p) => p.previousSlugs?.includes(slug));
  return moved ? { redirectTo: moved.slug } : null;
}

type SaveInput = BlogPostInput & { slug: string };

function withFirstPublish(post: BlogPost): BlogPost {
  if (post.status === "published" && !post.firstPublishedAt) {
    return { ...post, firstPublishedAt: new Date().toISOString() };
  }
  return post;
}

function lean(post: BlogPost): BlogPost {
  const out = { ...post };
  for (const key of ["cover", "coverAlt", "metaTitle", "metaDescription"] as const) {
    if (!out[key]) delete out[key];
  }
  if (!out.previousSlugs?.length) delete out.previousSlugs;
  return out;
}

export function createBlogPost(input: SaveInput) {
  return mutate((posts) => {
    assertSlugFree(posts, input.slug);
    const now = new Date().toISOString();
    const post = lean(withFirstPublish({ ...input, id: randomUUID(), createdAt: now, updatedAt: now }));
    return { next: [...posts, post], result: post };
  });
}

export type BlogUpdateResult = { post: BlogPost; previous: BlogPost } | null;

/**
 * Saves the post. When the slug changes on a post that has been published, the old slug is kept
 * in `previousSlugs` so /blog/<old> keeps working as a 301. Going back to a former slug removes it
 * from that list, so a post never redirects to itself.
 */
export function updateBlogPost(id: string, input: SaveInput) {
  return mutate<BlogUpdateResult>((posts) => {
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return { next: posts, result: null };
    const previous = posts[index];
    assertSlugFree(posts, input.slug, id);
    let previousSlugs = previous.previousSlugs ?? [];
    if (input.slug !== previous.slug && previous.firstPublishedAt) {
      previousSlugs = [...previousSlugs, previous.slug];
    }
    previousSlugs = [...new Set(previousSlugs)].filter((s) => s !== input.slug);
    const post = lean(
      withFirstPublish({
        ...previous,
        ...input,
        previousSlugs,
        updatedAt: new Date().toISOString(),
      }),
    );
    const next = [...posts];
    next[index] = post;
    return { next, result: { post, previous } };
  });
}

export function deleteBlogPost(id: string) {
  return mutate((posts) => {
    const removed = posts.find((p) => p.id === id) ?? null;
    return { next: posts.filter((p) => p.id !== id), result: removed };
  });
}
