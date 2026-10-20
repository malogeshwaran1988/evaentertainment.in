import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import { Routes } from "@@/constants/routes";
import { buildPageMetadata } from "@@/lib/seo";
import {
  EQUIPMENT_CONTENT,
  EQUIPMENT_ITEMS,
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
    <main id="main-content" tabIndex={-1} className="page-main eva-equipment-page">
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

      <section
        className="block equiment-bg eva-equipment-section"
        aria-labelledby="equipment-heading"
      >
        <div className="eva-equipment-inner">
          <div className="eva-equipment-intro">
            <h2 id="equipment-heading" className="heading-as-h4">
              {EQUIPMENT_CONTENT.heading}
            </h2>
            {EQUIPMENT_CONTENT.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>

          <ul className="eva-equipment-grid" aria-label="Studio equipment">
            {EQUIPMENT_ITEMS.map((item) => (
              <li key={item.id} className="eva-equipment-card">
                <div
                  className={`eva-equipment-media eva-equipment-media--${item.fit}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised AVIF, served as-is */}
                  <img
                    src={item.image}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="eva-equipment-body">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
