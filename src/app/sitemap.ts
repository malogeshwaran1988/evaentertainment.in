import type { MetadataRoute } from "next";
import { Routes, SERVICE_SLUGS, serviceHref } from "@@/constants/routes";
import { projectIsPublished } from "@@/data/projects";
import STATIC_LASTMOD from "@@/data/static-lastmod.json";
import { blogHref } from "@@/lib/blog/slug";
import { getPublicBlogPosts } from "@@/lib/blog/store";
import { getProjects } from "@@/lib/projects-store";
import { projectIsIndexable } from "@@/lib/project-content";
import { LANGUAGE_HUB_MIN_PROJECTS, LANGUAGE_HUB_PREFIX, languagePairs } from "@@/lib/project-links";
import { projectHref } from "@@/lib/project-seo";
import { absoluteUrl, isNoindexRoute } from "@@/lib/seo";

/** Rebuilt hourly and on every admin save (revalidatePath("/sitemap.xml")). */
export const revalidate = 3600;

type Entry = [path: string, changeFrequency: "weekly" | "monthly" | "yearly", priority: number];

const LASTMOD = STATIC_LASTMOD as Record<string, string | null>;
const lastmodFor = (path: string) => {
  const raw = SERVICE_SLUGS.some((s) => serviceHref(s) === path) ? LASTMOD["service:*"] : LASTMOD[path];
  return raw ? new Date(raw) : undefined;
};

/**
 * Indexable static routes only. Status pages (thank-you, login/admin, errors) are never listed:
 * see NOINDEX_ROUTES in src/lib/seo.ts.
 */
const ENTRIES: Entry[] = [
  [Routes.HOME, "weekly", 1],
  ...SERVICE_SLUGS.map((slug): Entry => [serviceHref(slug), "monthly", 0.9]),
  [Routes.PROJECTS, "weekly", 0.8],
  [Routes.ABOUT, "monthly", 0.8],
  [Routes.EQUIPMENT, "monthly", 0.7],
  [Routes.CONTACT, "monthly", 0.8],
  [Routes.BOOK, "monthly", 0.8],
  [Routes.PRIVACY, "yearly", 0.3],
  [Routes.TERMS, "yearly", 0.3],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = ENTRIES.filter(([path]) => !isNoindexRoute(path)).map(
    ([path, changeFrequency, priority]) => ({
      url: absoluteUrl(path),
      lastModified: lastmodFor(path),
      changeFrequency,
      priority,
    }),
  );

  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  try {
    projects = (await getProjects()).filter(projectIsPublished);
  } catch (err) {
    // Never drop the whole sitemap because the project store is briefly unavailable.
    console.error("[sitemap] projects unavailable", err);
  }

  // Thin project pages are noindex until enriched, so they stay out of the sitemap too.
  const projectEntries: MetadataRoute.Sitemap = projects.filter((p) => projectIsIndexable(p)).map((project) => ({
    url: absoluteUrl(projectHref(project.slug)),
    lastModified: new Date(project.updatedAt || project.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const hubEntries: MetadataRoute.Sitemap = languagePairs(projects)
    .filter((pair) => pair.projects.length >= LANGUAGE_HUB_MIN_PROJECTS)
    .map((pair) => ({
      url: absoluteUrl(`${LANGUAGE_HUB_PREFIX}/${pair.slug}`),
      lastModified: new Date(
        Math.max(...pair.projects.map((p) => new Date(p.updatedAt || p.createdAt).getTime())),
      ),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // Only live posts (published and publish date reached); drafts and scheduled posts never appear.
  let posts: Awaited<ReturnType<typeof getPublicBlogPosts>> = [];
  try {
    posts = await getPublicBlogPosts();
  } catch (err) {
    console.error("[sitemap] blog unavailable", err);
  }
  const blogEntries: MetadataRoute.Sitemap = posts.length
    ? [
        {
          url: absoluteUrl(Routes.BLOG),
          lastModified: new Date(Math.max(...posts.map((p) => new Date(p.updatedAt).getTime()))),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        },
        ...posts.map((post) => ({
          url: absoluteUrl(blogHref(post.slug)),
          lastModified: new Date(post.updatedAt),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
      ]
    : [];

  return [...staticEntries, ...hubEntries, ...projectEntries, ...blogEntries];
}
