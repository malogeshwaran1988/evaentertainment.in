import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import LegacyServiceHash from "@@/components/services/LegacyServiceHash";
import ServiceCardGrid from "@@/components/services/ServiceCardGrid";
import { APP_BASE_URL, SITE_NAME } from "@@/constants/constants";
import { Routes, SERVICE_SLUGS } from "@@/constants/routes";
import {
  SERVICES,
  SERVICES_INTRO,
  SERVICES_OG_IMAGE,
  SERVICES_OG_IMAGE_ALT,
  SERVICES_PAGE_URL,
  SERVICES_SEO,
  servicePageUrl,
} from "@@/data/services";
import { buildPageMetadata } from "@@/lib/seo";

export const metadata = buildPageMetadata({
  ...SERVICES_SEO,
  url: SERVICES_PAGE_URL,
  ogImage: SERVICES_OG_IMAGE,
  ogImageAlt: SERVICES_OG_IMAGE_ALT,
});

export default function ServicesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: SERVICES_SEO.title,
    description: SERVICES_SEO.description,
    url: SERVICES_PAGE_URL,
    mainEntity: {
      "@type": "OfferCatalog",
      name: "Studio Services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          url: servicePageUrl(s.slug),
          provider: { "@type": "Organization", name: SITE_NAME, url: `${APP_BASE_URL}/` },
        },
      })),
    },
  };

  return (
    <main className="page-main">
      <LegacyServiceHash />
      <JsonLd id="services-jsonld" data={schema} />
      <PageHero
        icon="icon-audio"
        title="Our Services"
        subtitle={SERVICES_INTRO}
        trail={[{ label: "Services", href: Routes.SERVICES }]}
        className="bottom-null"
      />
      <section
        className="block block--darkbg block--fullbg block--bgcover block-bg-1 eva-services-hub"
        aria-label="All services"
      >
        <div className="container">
          <ServiceCardGrid slugs={SERVICE_SLUGS} heading="h2" />
        </div>
      </section>
    </main>
  );
}
