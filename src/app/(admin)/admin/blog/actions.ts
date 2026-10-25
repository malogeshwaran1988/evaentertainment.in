"use server";

import { revalidatePath, updateTag } from "next/cache";
import { BLOG_TAG } from "@@/lib/cache-tags";
import { z } from "zod";
import { Routes } from "@@/constants/routes";
import {
  BLOG_AUTHOR_MAX,
  BLOG_CATEGORIES,
  BLOG_CONTENT_MAX,
  BLOG_COVER_ALT_MAX,
  BLOG_DEFAULT_AUTHOR,
  BLOG_EXCERPT_MAX,
  BLOG_META_DESCRIPTION_MAX,
  BLOG_META_TITLE_MAX,
  BLOG_STATUSES,
  BLOG_TAG_MAX,
  BLOG_TAGS_MAX,
  BLOG_TITLE_MAX,
  type BlogPost,
  type BlogPostInput,
} from "@@/data/blog";
import { requireAdmin } from "@@/lib/admin-auth";
import { AdminRoutes, blogEditPath } from "@@/lib/admin-session";
import { blogImageFileName, blogImagesOf, deleteBlogImage, saveBlogImage } from "@@/lib/blog/images";
import { sanitizeBlogHtml } from "@@/lib/blog/sanitize";
import { blogHref, slugifyBlog, uniqueBlogSlug, validateBlogSlug } from "@@/lib/blog/slug";
import * as store from "@@/lib/blog/store";

const BLOG_PREVIEW_HTML_MAX = 400_000;

type FieldKey = keyof BlogPostInput | "slug";

export type BlogFormState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Partial<Record<FieldKey, string>>;
  /** Set after a save so the form can show where the post now lives. */
  saved?: { id: string; slug: string; status: BlogPost["status"]; movedFrom?: string };
};

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const text = (max: number, label: string) =>
  z
    .string()
    .transform((v) => v.replace(CONTROL, "").trim())
    .pipe(z.string().max(max, `Keep the ${label} to ${max} characters or fewer.`));

const schema = z.object({
  title: text(BLOG_TITLE_MAX, "title").pipe(z.string().min(1, "Enter the post title.")),
  excerpt: text(BLOG_EXCERPT_MAX, "excerpt").pipe(
    z.string().min(1, "Write a short excerpt for the blog list and search results."),
  ),
  author: text(BLOG_AUTHOR_MAX, "author name"),
  publishDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a publish date.")
    .refine((d) => !Number.isNaN(Date.parse(`${d}T00:00:00Z`)), "Choose a valid date."),
  category: z.enum(BLOG_CATEGORIES, { error: "Choose a category." }),
  status: z.enum(BLOG_STATUSES, { error: "Choose Draft or Published." }),
  coverAlt: text(BLOG_COVER_ALT_MAX, "cover ALT"),
  metaTitle: text(BLOG_META_TITLE_MAX, "meta title"),
  metaDescription: text(BLOG_META_DESCRIPTION_MAX, "meta description"),
});

function parseTags(raw: string): { tags: string[]; error?: string } {
  const tags = [
    ...new Map(
      raw
        .split(/[,\n]/)
        .map((t) => t.replace(CONTROL, "").replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .map((t) => [t.toLowerCase(), t] as const),
    ).values(),
  ];
  if (tags.length > BLOG_TAGS_MAX) return { tags, error: `Use up to ${BLOG_TAGS_MAX} tags.` };
  const long = tags.find((t) => t.length > BLOG_TAG_MAX);
  if (long) return { tags, error: `Keep each tag to ${BLOG_TAG_MAX} characters (“${long.slice(0, 20)}…”).` };
  return { tags };
}

function parse(formData: FormData) {
  const fieldErrors: BlogFormState["fieldErrors"] = {};
  const result = schema.safeParse({
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    author: String(formData.get("author") ?? ""),
    publishDate: String(formData.get("publishDate") ?? ""),
    category: formData.get("category"),
    status: formData.get("status"),
    coverAlt: String(formData.get("coverAlt") ?? ""),
    metaTitle: String(formData.get("metaTitle") ?? ""),
    metaDescription: String(formData.get("metaDescription") ?? ""),
  });
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = issue.path[0] as FieldKey;
      fieldErrors[key] ??= issue.message;
    }
  }
  const { tags, error: tagsError } = parseTags(String(formData.get("tags") ?? ""));
  if (tagsError) fieldErrors.tags = tagsError;

  const rawContent = String(formData.get("content") ?? "");
  const content = rawContent.length > BLOG_CONTENT_MAX * 2 ? "" : sanitizeBlogHtml(rawContent);
  if (!content.replace(/<[^>]+>/g, "").trim() && !/<(img|iframe)\b/.test(content)) {
    fieldErrors.content = "Write the article before saving.";
  } else if (content.length > BLOG_CONTENT_MAX) {
    fieldErrors.content = "The article is too long. Split it into two posts.";
  }

  if (!result.success || Object.keys(fieldErrors).length) return { fieldErrors };
  const d = result.data;
  const data: BlogPostInput = {
    title: d.title,
    excerpt: d.excerpt,
    content,
    author: d.author || BLOG_DEFAULT_AUTHOR,
    publishDate: d.publishDate,
    category: d.category,
    tags,
    status: d.status,
    coverAlt: d.coverAlt || undefined,
    metaTitle: d.metaTitle || undefined,
    metaDescription: d.metaDescription || undefined,
  };
  return { data };
}

/** The slug field: auto (follows the title) or typed. Typed slugs are validated, never silently changed. */
function requestedSlug(formData: FormData, title: string, taken: ReadonlySet<string>) {
  const mode = formData.get("slugMode") === "manual" ? "manual" : "auto";
  if (mode === "auto") return { slug: uniqueBlogSlug(slugifyBlog(title) || "post", taken) };
  const slug = String(formData.get("slug") ?? "").trim();
  const error = validateBlogSlug(slug);
  if (error) return { error };
  if (taken.has(slug)) return { error: "Another post already uses this URL (now or in the past). Choose a different slug." };
  return { slug };
}

function coverFile(formData: FormData) {
  const value = formData.get("cover");
  return value instanceof File && value.size > 0 ? value : null;
}

function slugTakenState(err: store.BlogSlugTakenError): BlogFormState {
  const message = err.former
    ? `“${err.slug}” was the URL of “${err.byTitle}” and still redirects there. Choose a different slug.`
    : `“${err.byTitle}” already uses this URL. Choose a different slug.`;
  return { fieldErrors: { slug: message }, message };
}

function revalidateBlog(...slugs: (string | undefined)[]) {
  // Drop the cached Blob JSON first so this request and the next visitors read the saved data.
  updateTag(BLOG_TAG);
  revalidatePath(Routes.BLOG);
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath(AdminRoutes.BLOG);
  for (const slug of slugs) if (slug) revalidatePath(blogHref(slug));
}

/** Uploaded images no post uses any more. */
async function deleteUnusedImages(candidates: Iterable<string>) {
  const inUse = new Set<string>();
  for (const p of await store.getBlogPostsFresh()) for (const n of blogImagesOf(p)) inUse.add(n);
  for (const name of candidates) if (!inUse.has(name)) await deleteBlogImage(name);
}

const SAVE_FAILED = "Couldn't save the post. Please try again.";

export async function createBlogPostAction(_prev: BlogFormState, formData: FormData): Promise<BlogFormState> {
  await requireAdmin();
  const { data, fieldErrors } = parse(formData);
  const posts = await store.getBlogPostsFresh();
  const slugResult = requestedSlug(formData, String(formData.get("title") ?? ""), store.takenBlogSlugs(posts));
  if (!data || slugResult.error) {
    return {
      fieldErrors: { ...fieldErrors, ...(slugResult.error ? { slug: slugResult.error } : {}) },
      message: "Please fix the highlighted fields.",
    };
  }
  let uploaded: string | undefined;
  try {
    const file = coverFile(formData);
    if (file) {
      const saved = await saveBlogImage(file, data.coverAlt || data.title);
      if (!saved.ok) return { fieldErrors: { cover: saved.error }, message: saved.error };
      uploaded = saved.url;
    }
    const post = await store.createBlogPost({ ...data, slug: slugResult.slug!, cover: uploaded });
    revalidateBlog(post.slug);
    return {
      ok: true,
      message: `“${post.title}” saved as ${post.status === "published" ? "published" : "a draft"}.`,
      saved: { id: post.id, slug: post.slug, status: post.status },
    };
  } catch (err) {
    const name = blogImageFileName(uploaded);
    if (name) await deleteBlogImage(name);
    if (err instanceof store.BlogSlugTakenError) return slugTakenState(err);
    console.error("Failed to create blog post", err);
    return { message: SAVE_FAILED };
  }
}

export async function updateBlogPostAction(
  id: string,
  _prev: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  await requireAdmin();
  const { data, fieldErrors } = parse(formData);
  const posts = await store.getBlogPostsFresh();
  const existing = posts.find((p) => p.id === id);
  if (!existing) return { message: "This post no longer exists." };

  // Once a post has been public its URL is locked: the slug only changes when the editor
  // explicitly unlocked it ("Change URL") and the old URL then 301-redirects.
  let slugResult: { slug?: string; error?: string };
  if (existing.firstPublishedAt && formData.get("slugEdit") !== "on") {
    slugResult = { slug: existing.slug };
  } else {
    const taken = store.takenBlogSlugs(posts, id);
    slugResult =
      formData.get("slugMode") === "manual"
        ? requestedSlug(formData, "", taken)
        : { slug: existing.slug };
  }
  if (!data || slugResult.error) {
    return {
      fieldErrors: { ...fieldErrors, ...(slugResult.error ? { slug: slugResult.error } : {}) },
      message: "Please fix the highlighted fields.",
    };
  }

  let uploaded: string | undefined;
  try {
    let cover = existing.cover;
    const file = coverFile(formData);
    if (file) {
      const saved = await saveBlogImage(file, data.coverAlt || data.title);
      if (!saved.ok) return { fieldErrors: { cover: saved.error }, message: saved.error };
      cover = uploaded = saved.url;
    } else if (formData.get("removeCover") === "on") {
      cover = undefined;
    }
    const result = await store.updateBlogPost(id, { ...data, slug: slugResult.slug!, cover });
    if (!result) {
      const name = blogImageFileName(uploaded);
      if (name) await deleteBlogImage(name);
      return { message: "This post no longer exists." };
    }
    const { post, previous } = result;
    const before = blogImagesOf(previous);
    const after = blogImagesOf(post);
    await deleteUnusedImages([...before].filter((n) => !after.has(n)));
    revalidateBlog(post.slug, previous.slug);
    revalidatePath(blogEditPath(id));
    const movedFrom = previous.slug !== post.slug ? previous.slug : undefined;
    return {
      ok: true,
      message: movedFrom
        ? `Saved. The URL is now ${blogHref(post.slug)}${
            post.firstPublishedAt ? ` and ${blogHref(movedFrom)} redirects to it` : ""
          }.`
        : `“${post.title}” saved.`,
      saved: { id: post.id, slug: post.slug, status: post.status, movedFrom },
    };
  } catch (err) {
    const name = blogImageFileName(uploaded);
    if (name) await deleteBlogImage(name);
    if (err instanceof store.BlogSlugTakenError) return slugTakenState(err);
    console.error("Failed to update blog post", id, err);
    return { message: SAVE_FAILED };
  }
}

export async function deleteBlogPostAction(id: string): Promise<BlogFormState> {
  await requireAdmin();
  let removed: BlogPost | null;
  try {
    removed = await store.deleteBlogPost(id);
  } catch (err) {
    console.error("Failed to delete blog post", id, err);
    return { message: "Couldn't delete the post. Please try again." };
  }
  if (!removed) return { message: "This post was already deleted." };
  await deleteUnusedImages(blogImagesOf(removed));
  revalidateBlog(removed.slug, ...(removed.previousSlugs ?? []));
  return { ok: true, message: "Post deleted." };
}

export type BlogImageUploadResult = { ok: true; url: string } | { ok: false; error: string };

/** In-article images from the editor (already converted to AVIF in the browser). */
export async function uploadBlogImageAction(formData: FormData): Promise<BlogImageUploadResult> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose an image." };
  const stem = String(formData.get("stem") ?? "").replace(CONTROL, "").trim().slice(0, 120) || "blog image";
  try {
    return await saveBlogImage(file, stem);
  } catch (err) {
    console.error("Failed to upload blog image", err);
    return { ok: false, error: "Couldn't upload the image. Please try again." };
  }
}

/**
 * Preview only: runs the article HTML through the same sanitiser used on save, so the preview
 * tab shows exactly what would be published. Stores nothing.
 */
export async function previewBlogHtmlAction(html: string): Promise<string> {
  await requireAdmin();
  return sanitizeBlogHtml(String(html ?? "").slice(0, BLOG_PREVIEW_HTML_MAX));
}
