import type { Metadata } from "next";
import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import { SvgIcon } from "@@/components/common/Icons";
import LanguageHubLinks from "@@/components/projects/LanguageHubLinks";
import { inline, plain } from "@@/components/services/RichText";
import ServiceFaq from "@@/components/services/ServiceFaq";
import ServiceSections from "@@/components/services/ServiceSections";
import { DUBBING_HUB } from "@@/data/dubbing-pairs";
import { PROJECTS_OG_IMAGE, projectIsPublished } from "@@/data/projects";
import { DUBBING_LANGUAGES_PAGE as page } from "@@/data/service-pages-markets";
import { getProjects } from "@@/lib/projects-store";
import { LANGUAGE_HUB_PREFIX, languagePairs } from "@@/lib/project-links";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: page.seoTitle,
  description: page.description,
  url: absoluteUrl(LANGUAGE_HUB_PREFIX),
  ogImage: PROJECTS_OG_IMAGE,
  ogImageAlt: DUBBING_HUB.heading,
});

/** Language hub: the ten languages (moved here from /indian-languages) plus every pair with its real project count. */
export default async function DubbingHubPage() {
  const pairs = languagePairs((await getProjects()).filter(projectIsPublished));
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
    })),
  };
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: DUBBING_HUB.listHeading,
    itemListElement: pairs.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`${LANGUAGE_HUB_PREFIX}/${p.slug}`),
      name: `${p.from} to ${p.to} dubbing`,
    })),
  };
  return (
    <main id="main-content" tabIndex={-1} className="page-main eva-svc-page">
      <JsonLd id="faq-jsonld" data={faqSchema} />
      <JsonLd id="pairs-jsonld" data={listSchema} />
      <PageHero
        svg={<SvgIcon name="film" />}
        title={page.h1}
        subtitle={DUBBING_HUB.intro}
        trail={[{ label: DUBBING_HUB.heading, href: LANGUAGE_HUB_PREFIX }]}
      />
      <section className="block eva-svc-section" aria-labelledby="dubbing-lead">
        <div className="container">
          <h2 id="dubbing-lead" className="h--md">{page.leadHeading}</h2>
          {page.lead.map((p) => (
            <p key={p.slice(0, 48)}>{inline(p)}</p>
          ))}
        </div>
      </section>
      <section className="block block--darkbg">
        <div className="container">
          <LanguageHubLinks pairs={pairs} heading={DUBBING_HUB.listHeading} id="dubbing-pairs" />
        </div>
      </section>
      <ServiceSections sections={page.sections} />
      <ServiceFaq faqs={page.faqs} />
    </main>
  );
}
