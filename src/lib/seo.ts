import type { Metadata } from "next";
import { APP_BASE_URL, SITE_NAME } from "@@/constants/constants";

type PageSeo = {
  title: string;
  description: string;
  url: string;
  ogImage: string;
  ogImageAlt: string;
  /** Keep out of search results when needed. Admin uses its own layout robots. */
  noindex?: boolean;
};

/**
 * Standard for every success / failure / error / confirmation / status / admin page:
 * `noindex, follow` and never listed in the sitemap. Use this (or buildStatusPageMetadata)
 * so new status pages get it by default.
 */
export const STATUS_PAGE_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: true,
  googleBot: { index: false, follow: true },
};

/** Status/utility routes that must never be indexed or appear in sitemap.xml. */
export const NOINDEX_ROUTES = ["/thank-you", "/login", "/admin", "/preview"] as const;

/**
 * Live but unpublished pages: reachable and linked, but `noindex, follow` and left out of
 * sitemap.xml. To publish one later, delete its line here.
 */
export const UNPUBLISHED_ROUTES: readonly string[] = [
  "/hollywood-dubbing-indian-languages",
  "/indian-languages",
  "/regional-film-dubbing",
  "/pan-india-film-dubbing",
];

export const isUnpublishedRoute = (path: string) => UNPUBLISHED_ROUTES.includes(path.replace(/\/+$/, "") || "/");

export function isNoindexRoute(path: string) {
  return isUnpublishedRoute(path) || NOINDEX_ROUTES.some((r) => path === r || path.startsWith(`${r}/`));
}

const pathOf = (url: string) => {
  try {
    return new URL(url, APP_BASE_URL).pathname;
  } catch {
    return url;
  }
};

/** Metadata for a status page (thank-you, sent, failed, error, not-found, confirmation …). */
export function buildStatusPageMetadata(title: string, description?: string): Metadata {
  return {
    title: { absolute: title },
    ...(description ? { description } : {}),
    robots: STATUS_PAGE_ROBOTS,
  };
}

const INDEXABLE: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export function buildPageMetadata({
  title,
  description,
  url,
  ogImage,
  ogImageAlt,
  noindex,
}: PageSeo): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: noindex || isUnpublishedRoute(pathOf(url)) ? STATUS_PAGE_ROBOTS : INDEXABLE,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogImageAlt }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: ogImage, alt: ogImageAlt }],
    },
  };
}

/** Absolute URL for a site path such as `/about-us`. */
export const absoluteUrl = (path: string) =>
  path === "/" ? `${APP_BASE_URL}/` : `${APP_BASE_URL}${path}`;
