import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import { Routes } from "@@/constants/routes";
import { buildPageMetadata } from "@@/lib/seo";
import LegalDoc from "@@/components/common/LegalDoc";
import {
  TERMS_CONTENT,
  TERMS_OG_IMAGE,
  TERMS_OG_IMAGE_ALT,
  TERMS_PAGE_URL,
  TERMS_SEO,
} from "@@/data/terms";

export const metadata = buildPageMetadata({
  ...TERMS_SEO,
  url: TERMS_PAGE_URL,
  ogImage: TERMS_OG_IMAGE,
  ogImageAlt: TERMS_OG_IMAGE_ALT,
});

export default function TermsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TERMS_SEO.title,
    description: TERMS_SEO.description,
    url: TERMS_PAGE_URL,
    dateModified: "2026-09-23",
  };

  return (
    <main className="page-main">
      <JsonLd id="terms-jsonld" data={schema} />
      <PageHero
        icon="icon-folded-newspaper"
        title={TERMS_CONTENT.pageTitle}
        trail={[{ label: "Terms of Service", href: Routes.TERMS }]}
      />

      <section className="block">
        <div className="container">
          <LegalDoc
            effectiveDate={TERMS_CONTENT.effectiveDate}
            lastUpdated={TERMS_CONTENT.lastUpdated}
            intro={TERMS_CONTENT.intro}
            sections={TERMS_CONTENT.sections}
            disclaimer={TERMS_CONTENT.disclaimer}
          />
        </div>
      </section>
    </main>
  );
}
