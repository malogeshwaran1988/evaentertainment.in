import "server-only";
import { revalidatePath, updateTag } from "next/cache";
import { Routes } from "@@/constants/routes";
import { AdminRoutes } from "@@/lib/admin-session";
import { blogHref } from "@@/lib/blog/slug";
import { BLOG_TAG, PROJECTS_TAG } from "@@/lib/cache-tags";
import { CLIENTS_TAG } from "@@/lib/clients-store";
import { FOUNDER_TAG } from "@@/lib/founder-store";

/**
 * One place that says what each admin save refreshes. Every content type lists its data-cache tag,
 * the public pages that show it and how to build an item URL. A new admin content type only needs a
 * new entry here, so the public pages and /sitemap.xml stay in sync with the admin automatically.
 */
export type ContentType = "project" | "client" | "blog" | "founder";

type ContentSpec = {
  tag: string;
  /** Fixed public pages that list or show this content. */
  paths: string[];
  /** Dynamic route patterns (every page of the route is refreshed). */
  patterns: string[];
  admin?: string;
  itemHref?: (slug: string) => string;
};

const SPECS: Record<ContentType, ContentSpec> = {
  project: {
    tag: PROJECTS_TAG,
    paths: [Routes.PROJECTS, Routes.CLIENTS, "/dubbing"],
    // Service pages show poster strips and language hub links built from projects.
    patterns: ["/projects/[slug]", "/dubbing/[pair]", "/[service]"],
    admin: AdminRoutes.PROJECTS,
    itemHref: Routes.project,
  },
  client: {
    tag: CLIENTS_TAG,
    paths: [Routes.CLIENTS],
    patterns: ["/projects/[slug]"],
    admin: AdminRoutes.CLIENTS,
  },
  blog: {
    tag: BLOG_TAG,
    paths: [Routes.BLOG],
    patterns: ["/blog/[slug]"],
    admin: AdminRoutes.BLOG,
    itemHref: blogHref,
  },
  founder: { tag: FOUNDER_TAG, paths: [Routes.ABOUT], patterns: [] },
};

/**
 * Call after every admin create, update, delete, publish, unpublish or import.
 * `slugs` are the item's current and former slugs: old URLs then serve their 308 or 404 right away.
 */
export function revalidateContent(type: ContentType, slugs: (string | undefined)[] = []) {
  const spec = SPECS[type];
  // Drop the cached JSON first so this request and the next visitors read the saved data.
  updateTag(spec.tag);
  revalidatePath("/sitemap.xml");
  revalidatePath(Routes.HOME);
  for (const p of spec.paths) revalidatePath(p);
  for (const p of spec.patterns) revalidatePath(p, "page");
  if (spec.admin) revalidatePath(spec.admin);
  if (spec.itemHref) for (const s of slugs) if (s) revalidatePath(spec.itemHref(s));
}
