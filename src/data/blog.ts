/** Blog posts: shared types and constants (safe for client and server). */

export const BLOG_STATUSES = ["draft", "published"] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];

export const BLOG_CATEGORIES = [
  "Dubbing",
  "Voice Over",
  "Sound & Mixing",
  "Subtitling & Translation",
  "Studio News",
  "Guides",
] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_TITLE_MAX = 120;
export const BLOG_EXCERPT_MAX = 300;
export const BLOG_AUTHOR_MAX = 80;
export const BLOG_META_TITLE_MAX = 70;
export const BLOG_META_DESCRIPTION_MAX = 160;
export const BLOG_COVER_ALT_MAX = 150;
export const BLOG_TAGS_MAX = 8;
export const BLOG_TAG_MAX = 30;
/** Sanitised HTML; generous, but keeps blog.json small enough to read on every request. */
export const BLOG_CONTENT_MAX = 200_000;
export const BLOG_DEFAULT_AUTHOR = "EVA Entertainment";

/** Uploaded cover and in-article images are served from here (see src/app/images/blog). */
export const BLOG_IMAGE_URL_PREFIX = "/images/blog/";
export const BLOG_IMAGE_MAX_BYTES = 150 * 1024;

export type BlogPost = {
  id: string;
  /** Current public slug: /blog/<slug>. */
  slug: string;
  /** Slugs this post was published under before; each 301-redirects to `slug`. */
  previousSlugs?: string[];
  title: string;
  excerpt: string;
  /** Sanitised on the server before it is stored. */
  content: string;
  cover?: string;
  coverAlt?: string;
  author: string;
  /** YYYY-MM-DD; the post is public from this day (IST) once published. */
  publishDate: string;
  category: BlogCategory;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  status: BlogStatus;
  /** Set the first time the post is published; from then on its slug is locked. */
  firstPublishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostInput = Omit<
  BlogPost,
  "id" | "slug" | "previousSlugs" | "firstPublishedAt" | "createdAt" | "updatedAt"
>;

/** Today's date in India (YYYY-MM-DD), the zone publish dates are written in. */
export function todayInIndia(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Published and its publish date has arrived. Drafts and scheduled posts are never public. */
export function blogPostIsPublic(post: Pick<BlogPost, "status" | "publishDate">, now = new Date()) {
  return post.status === "published" && post.publishDate <= todayInIndia(now);
}

export type BlogPublicState = "draft" | "scheduled" | "published";

export function blogPublicState(post: Pick<BlogPost, "status" | "publishDate">, now = new Date()): BlogPublicState {
  if (post.status !== "published") return "draft";
  return blogPostIsPublic(post, now) ? "published" : "scheduled";
}

/** Newest publish date first, then newest edit. */
export function compareBlogPosts(a: BlogPost, b: BlogPost) {
  return b.publishDate.localeCompare(a.publishDate) || b.updatedAt.localeCompare(a.updatedAt);
}

export const BLOG_SEO = {
  title: "Blog | Dubbing, Voice-Over and Sound Insights | EVA Entertainment",
  description:
    "Guides and studio stories on film dubbing, voice-over, Foley and 5.1 mixing from EVA Entertainment, a dubbing and recording studio in Andheri West, Mumbai.",
};
