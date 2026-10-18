import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import { Routes } from "@@/constants/routes";
import { buildPageMetadata } from "@@/lib/seo";
import LegalDoc from "@@/components/common/LegalDoc";
import {
  PRIVACY_CONTENT,
  PRIVACY_OG_IMAGE,
  PRIVACY_OG_IMAGE_ALT,
  PRIVACY_PAGE_URL,
  PRIVACY_SEO,
} from "@@/data/privacy";

export const metadata = buildPageMetadata({
  ...PRIVACY_SEO,
  url: PRIVACY_PAGE_URL,
  ogImage: PRIVACY_OG_IMAGE,
  ogImageAlt: PRIVACY_OG_IMAGE_ALT,
});

export default function PrivacyPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: PRIVACY_SEO.title,
    description: PRIVACY_SEO.description,
    url: PRIVACY_PAGE_URL,
    dateModified: "2026-09-23",
  };

  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <JsonLd id="privacy-jsonld" data={schema} />
      <PageHero
        icon="icon-like"
        title={PRIVACY_CONTENT.pageTitle}
        trail={[{ label: "Privacy Policy", href: Routes.PRIVACY }]}
      />

      <section className="block">
        <div className="container">
          <LegalDoc
            effectiveDate={PRIVACY_CONTENT.effectiveDate}
            lastUpdated={PRIVACY_CONTENT.lastUpdated}
            intro={PRIVACY_CONTENT.intro}
            sections={PRIVACY_CONTENT.sections}
            disclaimer={PRIVACY_CONTENT.disclaimer}
          />
        </div>
      </section>
    </main>
  );
}
