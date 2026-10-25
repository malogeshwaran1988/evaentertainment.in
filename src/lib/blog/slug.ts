import anyAscii from "any-ascii";

/**
 * Blog URL slugs. One function makes every slug (auto from the title or typed by hand) and the
 * same validator runs in the browser and in the server action, so the two can never disagree.
 */
export const BLOG_SLUG_MAX = 80;
export const BLOG_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Words that would read as listing/feature URLs rather than posts. */
const RESERVED = new Set(["new", "edit", "page", "tag", "tags", "category", "feed", "rss", "admin", "search"]);

/**
 * Lowercase, transliterated (Café → cafe, हिंदी → hindi), "&" → "and", runs of anything else → one
 * hyphen, no leading/trailing hyphen, capped at BLOG_SLUG_MAX on a word boundary.
 */
export function slugifyBlog(text: string, max = BLOG_SLUG_MAX): string {
  const ascii = anyAscii(text.normalize("NFKC").replace(/&/g, " and "))
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (ascii.length <= max) return ascii;
  const cut = ascii.slice(0, max + 1);
  const lastHyphen = cut.lastIndexOf("-");
  return (lastHyphen > max / 2 ? cut.slice(0, lastHyphen) : ascii.slice(0, max)).replace(/-+$/, "");
}

/** Returns an error message or null when the slug is valid. */
export function validateBlogSlug(slug: string): string | null {
  if (!slug) return "Enter a URL slug.";
  if (slug.length > BLOG_SLUG_MAX) return `Keep the slug to ${BLOG_SLUG_MAX} characters or fewer.`;
  if (!BLOG_SLUG_PATTERN.test(slug)) {
    return "Use lowercase letters, numbers and single hyphens only (no spaces, no hyphen at the start or end).";
  }
  if (RESERVED.has(slug)) return `“${slug}” is reserved. Choose a more descriptive slug.`;
  return null;
}

/** Appends -2, -3 … until the slug is free. */
export function uniqueBlogSlug(desired: string, taken: ReadonlySet<string>): string {
  const root = desired || "post";
  if (!taken.has(root) && !RESERVED.has(root)) return root;
  for (let n = 2; n < 1000; n++) {
    const suffix = `-${n}`;
    const candidate = `${root.slice(0, BLOG_SLUG_MAX - suffix.length).replace(/-+$/, "")}${suffix}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${root.slice(0, BLOG_SLUG_MAX - 9)}-${Date.now().toString(36)}`;
}

export const blogHref = (slug: string) => `/blog/${slug}`;
