import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import { Routes } from "@@/constants/routes";
import { buildPageMetadata } from "@@/lib/seo";
import LivePhoto from "@@/components/equipment/LivePhoto";
import Reveal from "@@/components/equipment/Reveal";
import {
  EQUIPMENT_CONTENT,
  EQUIPMENT_EXPERIENCE,
  EQUIPMENT_ITEMS,
  EQUIPMENT_OG_IMAGE,
  EQUIPMENT_OG_IMAGE_ALT,
  EQUIPMENT_PAGE_URL,
  EQUIPMENT_SEO,
} from "@@/data/equipment";

/** Re-render daily so the auto-computed years-of-experience figure stays current. */
export const revalidate = 86400;

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
      <JsonLd id="equipment-jsonld" data={schema} />
      <PageHero
        icon="icon-mic-2"
        title={EQUIPMENT_CONTENT.pageTitle}
        trail={[{ label: "Equipment", href: Routes.EQUIPMENT }]}
        className="bottom-null"
      />

      <section className="block eva-equipment-intro-block" aria-labelledby="equipment-heading">
        <div className="container">
          <div className="title-wrap text-center eva-equipment-intro">
            <h2 id="equipment-heading">
              <i className="icon icon-mic-2" aria-hidden="true" />
              Equipment at <span>EVA Entertainment</span>
            </h2>
            {EQUIPMENT_CONTENT.paragraphs.map((p, i) => (
              <p key={p.slice(0, 40)} className={i === 0 ? "p--lg" : undefined}>
                {p}
              </p>
            ))}
          </div>

          <ul className="eva-equipment-highlights" aria-label="Studio highlights">
            {EQUIPMENT_EXPERIENCE.highlights.map((h) => (
              <li key={h.label}>
                <i className={`icon ${h.icon}`} aria-hidden="true" />
                <span className="heading-as-h4">{h.value}</span>{" "}
                <span className="eva-equipment-highlight-label">{h.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block block--darkbg eva-equipment-features-block" aria-labelledby="equipment-experience-heading">
        <div className="container">
          <div className="title-wrap text-center eva-equipment-intro">
            <h2 id="equipment-experience-heading">
              <i className="icon icon-music-equalizer" aria-hidden="true" />
              {EQUIPMENT_EXPERIENCE.heading}
            </h2>
            <p>{EQUIPMENT_EXPERIENCE.intro}</p>
          </div>

          <ol className="eva-equipment-features" aria-label="Studio equipment">
            {EQUIPMENT_ITEMS.map((item, index) => (
              <Reveal as="li" key={item.id} className="eva-equipment-feature">
                <figure className="eva-equipment-figure">
                  <LivePhoto item={item} eager={index === 0} alt={index % 2 === 1} />
                </figure>
                <div className="eva-equipment-text">
                  <p className="p--sm text-uppercase theme-color eva-equipment-role">{item.role}</p>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p className="eva-equipment-workflow">
                    <strong className="theme-color">At EVA: </strong>
                    {item.workflow}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
