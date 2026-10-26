import type { MetadataRoute } from "next";
import { Routes, SERVICE_SLUGS, serviceHref } from "@@/constants/routes";
import { projectIsPublished } from "@@/data/projects";
import STATIC_LASTMOD from "@@/data/static-lastmod.json";
import { BLOG_ENABLED } from "@@/lib/blog/enabled";
import { blogHref } from "@@/lib/blog/slug";
import { getPublicBlogPosts } from "@@/lib/blog/store";
import { getProjects } from "@@/lib/projects-store";
import { LANGUAGE_HUB_PREFIX, languagePairs } from "@@/lib/project-links";
import { projectAbsolutePosterUrl, projectHref } from "@@/lib/project-seo";
import { absoluteUrl, isIndexable } from "@@/lib/seo";

/** Rebuilt hourly and on every admin save (revalidatePath("/sitemap.xml")). */
export const revalidate = 3600;

/** changefreq is left out on purpose: Google ignores it. lastmod is the real content edit date. */
type Entry = [path: string, priority: number];

const MARKET_SLUGS = new Set<string>([
  "hollywood-dubbing-indian-languages",
  "pan-india-film-dubbing",
  "regional-film-dubbing",
  "indian-languages",
]);

const LASTMOD = STATIC_LASTMOD as Record<string, string | null | undefined>;
/** Real last-changed date from git from scripts/gen-static-lastmod.mjs at prebuild. */
const lastmodFor = (path: string) => {
  const slug = SERVICE_SLUGS.find((s) => serviceHref(s) === path);
  const raw = slug
    ? (MARKET_SLUGS.has(slug) ? LASTMOD["service:markets"] : LASTMOD["service:core"]) ?? LASTMOD["service:*"]
    : LASTMOD[path];
  return raw ? new Date(raw) : undefined;
};

/**
 * Indexable static routes only. Status pages (thank-you, login/admin, errors) are never listed:
 * see NOINDEX_ROUTES in src/lib/seo.ts.
 */
const ENTRIES: Entry[] = [
  [Routes.HOME, 1],
  ...SERVICE_SLUGS.map((slug): Entry => [serviceHref(slug), 0.9]),
  [Routes.PROJECTS, 0.8],
  [Routes.ABOUT, 0.6],
  [Routes.EQUIPMENT, 0.6],
  [Routes.CONTACT, 0.6],
  [Routes.CLIENTS, 0.5],
  [Routes.CAREERS, 0.4],
  [Routes.PRIVACY, 0.2],
  [Routes.TERMS, 0.2],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = ENTRIES.map(([path, priority]) => ({
    url: absoluteUrl(path),
    lastModified: lastmodFor(path),
    priority,
  }));

  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  try {
    projects = (await getProjects()).filter(projectIsPublished);
  } catch (err) {
    // Never drop the whole sitemap because the project store is briefly unavailable.
    console.error("[sitemap] projects unavailable", err);
  }

  // Every published project is indexable with a self canonical.
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => {
    const poster = projectAbsolutePosterUrl(project.poster);
    return {
      url: absoluteUrl(projectHref(project.slug)),
      lastModified: new Date(project.updatedAt || project.createdAt),
      priority: 0.6,
      ...(poster ? { images: [poster] } : {}),
    };
  });

  const hubEntries: MetadataRoute.Sitemap = languagePairs(projects)
    .map((pair) => ({
      url: absoluteUrl(`${LANGUAGE_HUB_PREFIX}/${pair.slug}`),
      lastModified: new Date(
        Math.max(...pair.projects.map((p) => new Date(p.updatedAt || p.createdAt).getTime())),
      ),
      priority: 0.7,
    }));

  // Only live posts (published and publish date reached); drafts and scheduled posts never appear.
  let posts: Awaited<ReturnType<typeof getPublicBlogPosts>> = [];
  try {
    if (BLOG_ENABLED) posts = await getPublicBlogPosts();
  } catch (err) {
    console.error("[sitemap] blog unavailable", err);
  }
  const blogEntries: MetadataRoute.Sitemap = posts.length
    ? [
        {
          url: absoluteUrl(Routes.BLOG),
          lastModified: new Date(Math.max(...posts.map((p) => new Date(p.updatedAt).getTime()))),
          priority: 0.7,
        },
        ...posts.map((post) => ({
          url: absoluteUrl(blogHref(post.slug)),
          lastModified: new Date(post.updatedAt),
          priority: 0.6,
        })),
      ]
    : [];

  // Last guard: never list a private or utility URL (see isIndexable in src/lib/seo.ts).
  return [...staticEntries, ...hubEntries, ...projectEntries, ...blogEntries].filter((e) =>
    isIndexable(new URL(e.url).pathname),
  );
}
