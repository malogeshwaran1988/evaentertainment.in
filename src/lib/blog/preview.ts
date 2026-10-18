import type { BlogArticleData } from "@@/components/blog/BlogArticleView";

/**
 * Unsaved-form previews travel from the editor tab to the preview tab through localStorage
 * (same origin, nothing is written to the server or Blob). Keys expire after a day.
 */
export type BlogPreviewPayload = BlogArticleData & { savedAt: number };

export const BLOG_PREVIEW_PATH = "/preview/blog";
const PREFIX = "eva-blog-preview:";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function writeBlogPreview(key: string, data: BlogArticleData) {
  const now = Date.now();
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (!k?.startsWith(PREFIX) || k === PREFIX + key) continue;
      const old = JSON.parse(localStorage.getItem(k) || "{}") as Partial<BlogPreviewPayload>;
      if (!old.savedAt || now - old.savedAt > MAX_AGE_MS) localStorage.removeItem(k);
    }
    localStorage.setItem(PREFIX + key, JSON.stringify({ ...data, savedAt: now }));
    return true;
  } catch {
    return false; // quota exceeded / storage disabled
  }
}

export function readBlogPreview(key: string): BlogPreviewPayload | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as BlogPreviewPayload) : null;
  } catch {
    return null;
  }
}
