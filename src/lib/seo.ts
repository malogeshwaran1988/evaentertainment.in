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
    robots: noindex ? { index: false, follow: true } : INDEXABLE,
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
