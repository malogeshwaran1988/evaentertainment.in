import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import { Routes } from "@@/constants/routes";
import { buildPageMetadata } from "@@/lib/seo";
import {
  EQUIPMENT_CONTENT,
  EQUIPMENT_OG_IMAGE,
  EQUIPMENT_OG_IMAGE_ALT,
  EQUIPMENT_PAGE_URL,
  EQUIPMENT_SEO,
} from "@@/data/equipment";

export const metadata = buildPageMetadata({
  ...EQUIPMENT_SEO,
  url: EQUIPMENT_PAGE_URL,
  ogImage: EQUIPMENT_OG_IMAGE,
  ogImageAlt: EQUIPMENT_OG_IMAGE_ALT,
});

export default function EquipmentPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: EQUIPMENT_SEO.title,
    description: EQUIPMENT_SEO.description,
    url: EQUIPMENT_PAGE_URL,
  };

  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <link
        rel="preload"
        as="image"
        href="/images/equipment/equipment-06.avif"
        fetchPriority="high"
      />
      <JsonLd id="equipment-jsonld" data={schema} />
      <PageHero
        icon="icon-mic-2"
        title={EQUIPMENT_CONTENT.pageTitle}
        trail={[{ label: "Equipment", href: Routes.EQUIPMENT }]}
        className="bottom-null"
      />

      <section className="block equiment-bg eva-equipment-section">
        <div className="container">
          <h2 className="heading-as-h4" style={{ marginBottom: 30 }}>
            {EQUIPMENT_CONTENT.heading}
          </h2>
          <div className="row">
            <div className="divider visible-xs visible-sm" />
            <div className="col-md-7">
              {EQUIPMENT_CONTENT.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
