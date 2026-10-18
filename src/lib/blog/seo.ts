import { APP_BASE_URL, SITE_NAME } from "@@/constants/constants";
import {
  BLOG_META_DESCRIPTION_MAX,
  BLOG_META_TITLE_MAX,
  type BlogPost,
} from "@@/data/blog";
import { slugifyAscii } from "@@/lib/project-seo";

const BRAND = SITE_NAME;
const BRAND_SLUG = "eva-entertainment";
/** Same cap as poster file names, so names stay readable. */
export const BLOG_IMAGE_STEM_MAX = 50;

const mentionsBrand = (text: string) => /eva\s*entertainment/i.test(text);

/** Branded file name without extension: `<stem>-eva-entertainment` (brand not repeated). */
export function blogImageBaseName(stem: string): string {
  const base = slugifyAscii(stem, BLOG_IMAGE_STEM_MAX) || "blog-image";
  return base.includes(BRAND_SLUG) ? base : `${base}-${BRAND_SLUG}`;
}

/** Cover ALT: the typed ALT (or the title), with "– EVA Entertainment" added unless it's already there. */
export function blogCoverAlt(post: Pick<BlogPost, "title" | "coverAlt">): string {
  const base = post.coverAlt?.trim() || post.title.trim();
  return mentionsBrand(base) ? base : `${base} – ${BRAND}`;
}

export function blogSeoTitle(post: Pick<BlogPost, "title" | "metaTitle">): string {
  const custom = post.metaTitle?.trim();
  if (custom) return mentionsBrand(custom) ? custom : `${custom} | ${BRAND}`;
  const withBrand = `${post.title.trim()} | ${BRAND} Blog`;
  return withBrand.length <= BLOG_META_TITLE_MAX ? withBrand : `${post.title.trim()} | ${BRAND}`;
}

export function blogSeoDescription(post: Pick<BlogPost, "excerpt" | "metaDescription">): string {
  const text = (post.metaDescription?.trim() || post.excerpt.trim()).replace(/\s+/g, " ");
  return text.length <= BLOG_META_DESCRIPTION_MAX
    ? text
    : `${text.slice(0, BLOG_META_DESCRIPTION_MAX - 1).trimEnd()}…`;
}

export function blogAbsoluteUrl(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  return `${APP_BASE_URL}${src.startsWith("/") ? src : `/${src}`}`;
}

/** Word count of the article body (tags stripped), for JSON-LD and reading time. */
export function blogWordCount(html: string): number {
  const text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .trim();
  return text ? text.split(/\s+/).length : 0;
}

export const blogReadingMinutes = (html: string) => Math.max(1, Math.round(blogWordCount(html) / 200));

/** "18 October 2026" for a YYYY-MM-DD publish date. */
export function formatBlogDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}
