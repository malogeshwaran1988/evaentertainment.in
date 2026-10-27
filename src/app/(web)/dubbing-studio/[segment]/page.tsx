import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import RelatedServices from "@@/components/services/RelatedServices";
import ServiceFaq from "@@/components/services/ServiceFaq";
import ServiceLead, { ServicePageCta } from "@@/components/services/ServiceLead";
import ServiceSections from "@@/components/services/ServiceSections";
import ServicePosterStrip from "@@/components/services/ServicePosterStrip";
import LanguageHubLinks from "@@/components/projects/LanguageHubLinks";
import Link from "@@/components/common/NavLink";
import { plain } from "@@/components/services/RichText";
import { APP_BASE_URL, CONTACT, POSTAL_ADDRESS, SITE_NAME } from "@@/constants/constants";
import { Routes, serviceHref } from "@@/constants/routes";
import { projectIsPublished, projectLanguageLine } from "@@/data/projects";
import {
  DUBBING_STUDIO_HREF,
  SEGMENT_SLUGS,
  getSegment,
  projectsForSegment,
  segmentHref,
} from "@@/data/dubbing-segments";
import type { ServicePageContent, ServicePageSection } from "@@/data/service-page-types";
import type { Service } from "@@/data/services";
import { LANGUAGE_HUB_PREFIX, languagePairs, pairsWithProjects } from "@@/lib/project-links";
import { getProjects } from "@@/lib/projects-store";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return SEGMENT_SLUGS.map((segment) => ({ segment }));
}

async function publishedProjects() {
  try {
    return (await getProjects()).filter(projectIsPublished);
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segment: string }>;
}): Promise<Metadata> {
  const { segment: slug } = await params;
  const segment = getSegment(slug);
  if (!segment) return {};
  const url = absoluteUrl(segmentHref(segment.slug));
  return buildPageMetadata({
    title: segment.page.seoTitle,
    description: segment.page.description,
    url,
    ogImage: segment.ogImage,
    ogImageAlt: segment.ogImageAlt,
  });
}

function titlesSection(
  segmentName: string,
  projects: Awaited<ReturnType<typeof publishedProjects>>,
): ServicePageSection | null {
  if (!projects.length) return null;
  return {
    heading: `Titles we have dubbed in this segment`,
    icon: "icon-play-circle",
    blocks: [
      {
        t: "p",
        text: `Published ${segmentName} credits from our studio. Each link opens the project page.`,
      },
      {
        t: "ul",
        items: projects.map((p) => {
          const langs = projectLanguageLine(p);
          return `**[${p.title}](${Routes.project(p.slug)})** (${langs})`;
        }),
      },
    ],
  };
}

function relatedSegmentsSection(
  currentSlug: string,
  related: string[],
  projects: Awaited<ReturnType<typeof publishedProjects>>,
): ServicePageSection | null {
  const links = related
    .map((slug) => getSegment(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .filter((s) => projectsForSegment(s, projects).length > 0)
    .map((s) => `**[${s.name}](${segmentHref(s.slug)})** - ${s.keyword}`);
  if (!links.length) return null;
  return {
    heading: "Related segments",
    icon: "icon-audio",
    blocks: [
      {
        t: "p",
        text: `More content types we dub under [Lip-Sync Dubbing](${DUBBING_STUDIO_HREF}).`,
      },
      { t: "ul", items: links },
    ],
  };
}

export default async function DubbingSegmentPage({
  params,
}: {
  params: Promise<{ segment: string }>;
}) {
  const { segment: slug } = await params;
  const segment = getSegment(slug);
  if (!segment) notFound();

  const all = await publishedProjects();
  const matched = projectsForSegment(segment, all);
  // Zero-project hide: do not ship a thin segment page.
  if (!matched.length) notFound();

  const titles = titlesSection(segment.name, matched);
  const related = relatedSegmentsSection(segment.slug, segment.relatedSegments, all);
  const page: ServicePageContent = {
    ...segment.page,
    posterStrip: matched.map((p) => p.slug),
    sections: [
      ...segment.page.sections.slice(0, 1),
      ...(titles ? [titles] : []),
      ...segment.page.sections.slice(1),
      ...(segment.marketHref
        ? [
            {
              heading: "Related market hub",
              icon: "icon-like",
              blocks: [
                {
                  t: "p" as const,
                  text: `For the buyer journey see [${segment.marketLabel ?? "market hub"}](${segment.marketHref}). This page owns the ${segment.keyword} craft keyword.`,
                },
              ],
            },
          ]
        : []),
      ...(related ? [related] : []),
    ],
  };

  // Language pages are not live yet: link only existing pair hubs (never 404s).
  const pairs = pairsWithProjects(languagePairs(matched));
  const url = absoluteUrl(segmentHref(segment.slug));
  const serviceLike = {
    slug: "dubbing-studio",
    name: segment.name,
    image: segment.image,
    alt: segment.alt,
    fx: segment.fx,
  } as Pick<Service, "slug" | "name" | "image" | "alt" | "fx"> & { slug: "dubbing-studio" };

  const faqs = page.faqs.map((f) => ({ q: f.q, a: f.a }));
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.seoTitle,
        description: page.description,
        isPartOf: { "@id": `${APP_BASE_URL}/#website` },
        about: { "@id": `${url}#service` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: segment.keyword,
        serviceType: page.serviceType,
        description: page.description,
        url,
        image: `${APP_BASE_URL}${segment.ogImage}`,
        areaServed: [
          { "@type": "Country", name: "India" },
          { "@type": "City", name: "Mumbai" },
        ],
        provider: {
          "@type": "LocalBusiness",
          "@id": `${APP_BASE_URL}/#organization`,
          name: SITE_NAME,
          url: `${APP_BASE_URL}/`,
          telephone: CONTACT.whatsappDisplay,
          address: POSTAL_ADDRESS,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl(Routes.HOME),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Lip-Sync Dubbing",
            item: absoluteUrl(serviceHref("dubbing-studio")),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: segment.name,
            item: url,
          },
        ],
      },
      ...(faqs.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <main id="main-content" tabIndex={-1} className="page-main eva-svc-page">
      <JsonLd id="segment-jsonld" data={graph} />
      <PageHero
        icon={segment.icon}
        title={page.h1}
        subtitle={segment.subtitle}
        trail={[
          { label: "Lip-Sync Dubbing", href: serviceHref("dubbing-studio") },
          { label: segment.name, href: segmentHref(segment.slug) },
        ]}
        schema={false}
      />
      <ServiceLead service={serviceLike as Service} page={page} />
      <ServiceSections sections={page.sections} />
      <ServicePosterStrip slugs={page.posterStrip} heading={`Films we have dubbed (${segment.name})`} />
      <LanguageHubLinks
        pairs={pairs}
        heading="Languages we dub for"
        section
      />
      {pairs.length === 0 ? (
        <section className="block eva-svc-section" aria-labelledby="segment-lang-fallback">
          <div className="container">
            <h2 id="segment-lang-fallback" className="eva-svc-title">
              <i className="icon icon-translate2" aria-hidden="true" />Languages we dub for
            </h2>
            <p>
              We dub into Hindi Tamil Telugu and other Indian languages. Browse live work by pair on
              our <Link href={LANGUAGE_HUB_PREFIX}>language pair index</Link>.
            </p>
          </div>
        </section>
      ) : null}
      <ServicePageCta page={page} />
      <ServiceFaq faqs={faqs} />
      <RelatedServices current="dubbing-studio" />
    </main>
  );
}
