import type { MetadataRoute } from "next";
import { Routes, SERVICE_SLUGS, serviceHref } from "@@/constants/routes";
import {
  SEGMENT_SLUGS,
  getSegment,
  projectsForSegment,
  segmentHref,
  segmentIsLive,
} from "@@/data/dubbing-segments";
import { LANGUAGE_SLUGS, getLanguage, projectsForLanguage, languageHref } from "@@/data/dubbing-languages";
import { projectIsPublished } from "@@/data/projects";
import STATIC_LASTMOD from "@@/data/static-lastmod.json";
import { BLOG_ENABLED, BLOG_HUB_MIN_POSTS } from "@@/lib/blog/enabled";
import { blogHref } from "@@/lib/blog/slug";
import { getPublicBlogPosts } from "@@/lib/blog/store";
import { getProjects } from "@@/lib/projects-store";
import { LANGUAGE_HUB_PREFIX, languagePairs } from "@@/lib/project-links";
import { projectAbsolutePosterUrl, projectHref } from "@@/lib/project-seo";
import { absoluteUrl, isIndexable } from "@@/lib/seo";

/** Rebuilt hourly and on every admin save (revalidateContent in src/lib/revalidate-content.ts). */
export const revalidate = 3600;

/** changefreq is left out on purpose: Google ignores it. lastmod is the real content edit date. */
type Entry = [path: string, priority: number];

const MARKET_SLUGS = new Set<string>([
  "hollywood-dubbing-indian-languages",
  "pan-india-film-dubbing",
  "regional-film-dubbing",
]);

const LASTMOD = STATIC_LASTMOD as Record<string, string | null | undefined>;
/** Real last-changed date from git from scripts/gen-static-lastmod.mjs at prebuild. */
const lastmodFor = (path: string) => {
  const slug = SERVICE_SLUGS.find((s) => serviceHref(s) === path);
  const raw = slug
    ? ((MARKET_SLUGS.has(slug)
        ? LASTMOD["service:markets"]
        : LASTMOD["service:core"]) ?? LASTMOD["service:*"])
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
  [Routes.BLOG, 0.7],
  [Routes.PRIVACY, 0.2],
  [Routes.TERMS, 0.2],
];

type Section = () => Promise<MetadataRoute.Sitemap>;
type PublishedProjects = Awaited<ReturnType<typeof getProjects>>;

/** Published projects are read once per sitemap build; a store hiccup never drops the static URLs. */
async function publishedProjects(): Promise<PublishedProjects> {
  try {
    return (await getProjects()).filter(projectIsPublished);
  } catch (err) {
    console.error("[sitemap] projects unavailable", err);
    return [];
  }
}

const staticSection: Section = async () =>
  ENTRIES.map(([path, priority]) => ({
    url: absoluteUrl(path),
    lastModified: lastmodFor(path),
    priority,
  }));

/** Every published project is indexable with a self canonical. lastmod is its admin updatedAt. */
const projectSection = (projects: PublishedProjects): MetadataRoute.Sitemap =>
  projects.map((project) => {
    const poster = projectAbsolutePosterUrl(project.poster);
    return {
      url: absoluteUrl(projectHref(project.slug)),
      lastModified: new Date(project.updatedAt || project.createdAt),
      priority: 0.6,
      ...(poster ? { images: [poster] } : {}),
    };
  });

const hubSection = (projects: PublishedProjects): MetadataRoute.Sitemap => [
  ...(projects.length
    ? [{ url: absoluteUrl(LANGUAGE_HUB_PREFIX), priority: 0.6 }]
    : []),
  ...languagePairs(projects).map((pair) => ({
    url: absoluteUrl(`${LANGUAGE_HUB_PREFIX}/${pair.slug}`),
    ...(pair.projects.length
      ? {
          lastModified: new Date(
            Math.max(
              ...pair.projects.map((p) =>
                new Date(p.updatedAt || p.createdAt).getTime(),
              ),
            ),
          ),
        }
      : {}),
    priority: 0.7,
  })),
];

/** Only live posts (published and publish date reached). /blog itself joins at BLOG_HUB_MIN_POSTS. */
const blogSection: Section = async () => {
  if (!BLOG_ENABLED) return [];
  let posts: Awaited<ReturnType<typeof getPublicBlogPosts>> = [];
  try {
    posts = await getPublicBlogPosts();
  } catch (err) {
    console.error("[sitemap] blog unavailable", err);
  }
  const hub: MetadataRoute.Sitemap =
    posts.length >= BLOG_HUB_MIN_POSTS
      ? [
          {
            url: absoluteUrl(Routes.BLOG),
            lastModified: new Date(
              Math.max(...posts.map((p) => new Date(p.updatedAt).getTime())),
            ),
            priority: 0.7,
          },
        ]
      : [];
  return [
    ...hub,
    ...posts.map((post) => ({
      url: absoluteUrl(blogHref(post.slug)),
      lastModified: new Date(post.updatedAt),
      priority: 0.6,
    })),
  ];
};

/**
 * Sections are independent so a sitemap index can be added later without rewriting them:
 * near 5,000 URLs, export generateSitemaps() returning one id per section and call the matching
 * section here by id. Until then one sitemap.xml is simpler for Search Console.
 */
const segmentSection = (projects: PublishedProjects): MetadataRoute.Sitemap =>
  SEGMENT_SLUGS.flatMap((slug) => {
    const segment = getSegment(slug);
    if (!segment) return [];
    if (!segmentIsLive(segment, projects)) return [];
    const matched = projectsForSegment(segment, projects);
    return [
      {
        url: absoluteUrl(segmentHref(slug)),
        lastModified: matched.length
          ? new Date(
              Math.max(
                ...matched.map((p) => new Date(p.updatedAt || p.createdAt).getTime()),
              ),
            )
          : lastmodFor(segmentHref(slug)),
        priority: 0.85,
      },
    ];
  });


const languageSection = (projects: PublishedProjects): MetadataRoute.Sitemap =>
  LANGUAGE_SLUGS.flatMap((slug) => {
    const lang = getLanguage(slug);
    if (!lang) return [];
    const matched = projectsForLanguage(lang, projects);
    if (!matched.length) return [];
    return [
      {
        url: absoluteUrl(languageHref(slug)),
        lastModified: new Date(
          Math.max(
            ...matched.map((p) => new Date(p.updatedAt || p.createdAt).getTime()),
          ),
        ),
        priority: 0.85,
      },
    ];
  });

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await publishedProjects();
  const all = [
    ...(await staticSection()),
    ...segmentSection(projects),
    ...languageSection(projects),
    ...hubSection(projects),
    ...projectSection(projects),
    ...(await blogSection()),
  ];
  // Dedupe by URL (e.g. /blog may appear in ENTRIES and blogSection).
  const seen = new Set<string>();
  const deduped = all.filter((e) => {
    if (seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });
  // Last guard: never list a private or utility URL (see isIndexable in src/lib/seo.ts).
  return deduped.filter((e) => isIndexable(new URL(e.url).pathname));
}
