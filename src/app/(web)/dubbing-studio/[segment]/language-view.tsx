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
  getLanguage,
  languageHref,
  pairsIntoLanguage,
  projectsForLanguage,
} from "@@/data/dubbing-languages";
import {
  DUBBING_STUDIO_HREF,
  liveSegmentLinks,
} from "@@/data/dubbing-segments";
import type { ServicePageContent, ServicePageSection } from "@@/data/service-page-types";
import type { Service } from "@@/data/services";
import { LANGUAGE_HUB_PREFIX, languagePairs, pairsWithProjects } from "@@/lib/project-links";
import { getProjects } from "@@/lib/projects-store";
import { absoluteUrl } from "@@/lib/seo";
import { notFound } from "next/navigation";

async function publishedProjects() {
  try {
    return (await getProjects()).filter(projectIsPublished);
  } catch {
    return [];
  }
}

function titlesSection(
  languageName: string,
  projects: Awaited<ReturnType<typeof publishedProjects>>,
): ServicePageSection | null {
  if (!projects.length) return null;
  return {
    heading: `Titles we have dubbed into ${languageName}`,
    icon: "icon-play-circle",
    blocks: [
      {
        t: "p",
        text: `Published credits converted into ${languageName}. Each link opens the project page. Titles come from admin data only.`,
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

function segmentsSection(
  projects: Awaited<ReturnType<typeof publishedProjects>>,
): ServicePageSection | null {
  const live = liveSegmentLinks(projects);
  if (!live.length) return null;
  return {
    heading: "Segments we dub",
    icon: "icon-audio",
    blocks: [
      {
        t: "p",
        text: "Content-type pages for the kinds of titles we dub. Language destination stays on this page.",
      },
      {
        t: "ul",
        items: live.map(
          (s) => `**[${s.label}](${s.href})** - ${s.keyword}`,
        ),
      },
    ],
  };
}

export default async function LanguagePageView({ slug }: { slug: string }) {
  const lang = getLanguage(slug);
  if (!lang) notFound();

  const all = await publishedProjects();
  const matched = projectsForLanguage(lang, all);
  if (!matched.length) notFound();

  const titles = titlesSection(lang.name, matched);
  const segments = segmentsSection(all);
  const allPairs = pairsWithProjects(languagePairs(all));
  const intoPairs = pairsIntoLanguage(lang, allPairs);

  const page: ServicePageContent = {
    ...lang.page,
    posterStrip: matched.map((p) => p.slug),
    sections: [
      ...lang.page.sections.slice(0, 1),
      ...(titles ? [titles] : []),
      ...(segments ? [segments] : []),
      ...lang.page.sections.slice(1),
      {
        heading: "Related language pairs",
        icon: "icon-translate2",
        blocks: [
          {
            t: "p",
            text: intoPairs.length
              ? `Exact source-to-${lang.name} queries stay on their pair pages. This page owns ${lang.keyword}.`
              : `Browse every live pair on our [language pair index](${LANGUAGE_HUB_PREFIX}). Pair pages own each source-to-target keyword. This page owns ${lang.keyword}.`,
          },
          ...(intoPairs.length
            ? [
                {
                  t: "ul" as const,
                  items: intoPairs.map(
                    (p) =>
                      `**[${p.from} to ${p.to} dubbing](${LANGUAGE_HUB_PREFIX}/${p.slug})** (${p.projects.length} ${p.projects.length === 1 ? "project" : "projects"})`,
                  ),
                },
              ]
            : []),
          {
            t: "p",
            text: `Parent hub: [Lip-Sync Dubbing](${DUBBING_STUDIO_HREF}).`,
          },
        ],
      },
    ],
  };

  const url = absoluteUrl(languageHref(lang.slug));
  const serviceLike = {
    slug: "dubbing-studio",
    name: lang.name,
    image: lang.image,
    alt: lang.alt,
    fx: lang.fx,
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
        name: lang.keyword,
        serviceType: page.serviceType,
        description: page.description,
        url,
        image: `${APP_BASE_URL}${lang.ogImage}`,
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
            name: lang.name,
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
      <JsonLd id="language-jsonld" data={graph} />
      <PageHero
        icon={lang.icon}
        title={page.h1}
        subtitle={lang.subtitle}
        trail={[
          { label: "Lip-Sync Dubbing", href: serviceHref("dubbing-studio") },
          { label: lang.name, href: languageHref(lang.slug) },
        ]}
        schema={false}
      />
      <ServiceLead service={serviceLike as Service} page={page} />
      <ServiceSections sections={page.sections} />
      <ServicePosterStrip
        slugs={page.posterStrip}
        heading={`Films we have dubbed into ${lang.name}`}
      />
      <LanguageHubLinks
        pairs={intoPairs}
        heading={`${lang.name} dubbing by source language`}
        section
      />
      {intoPairs.length === 0 ? (
        <section className="block eva-svc-section" aria-labelledby="lang-pair-fallback">
          <div className="container">
            <h2 id="lang-pair-fallback" className="eva-svc-title">
              <i className="icon icon-translate2" aria-hidden="true" />
              Language pairs
            </h2>
            <p>
              Browse every live pair on our <Link href={LANGUAGE_HUB_PREFIX}>language pair index</Link>.
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
