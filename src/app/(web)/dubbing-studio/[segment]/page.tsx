import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SEGMENT_SLUGS, getSegment, segmentHref } from "@@/data/dubbing-segments";
import {
  LANGUAGE_SLUGS,
  getLanguage,
  languageHref,
} from "@@/data/dubbing-languages";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";
import SegmentPageView from "./segment-view";
import LanguagePageView from "./language-view";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  const segmentParams = SEGMENT_SLUGS.map((segment) => ({ segment }));
  const languageParams = LANGUAGE_SLUGS.filter((slug) => !SEGMENT_SLUGS.includes(slug as never)).map(
    (segment) => ({ segment }),
  );
  return [...segmentParams, ...languageParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segment: string }>;
}): Promise<Metadata> {
  const { segment: slug } = await params;
  const segment = getSegment(slug);
  if (segment) {
    return buildPageMetadata({
      title: segment.page.seoTitle,
      description: segment.page.description,
      url: absoluteUrl(segmentHref(segment.slug)),
      ogImage: segment.ogImage,
      ogImageAlt: segment.ogImageAlt,
    });
  }
  const lang = getLanguage(slug);
  if (lang) {
    return buildPageMetadata({
      title: lang.page.seoTitle,
      description: lang.page.description,
      url: absoluteUrl(languageHref(lang.slug)),
      ogImage: lang.ogImage,
      ogImageAlt: lang.ogImageAlt,
    });
  }
  return {};
}

export default async function DubbingStudioChildPage({
  params,
}: {
  params: Promise<{ segment: string }>;
}) {
  const { segment: slug } = await params;
  if (getSegment(slug)) return <SegmentPageView slug={slug} />;
  if (getLanguage(slug)) return <LanguagePageView slug={slug} />;
  notFound();
}
