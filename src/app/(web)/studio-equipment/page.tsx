import type React from "react";
import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import { Routes } from "@@/constants/routes";
import { buildPageMetadata } from "@@/lib/seo";
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

      <section className="eva-equipment-section" aria-labelledby="equipment-heading">
        <div className="eva-equipment-inner">
          <div className="eva-equipment-intro">
            <p className="eva-equipment-eyebrow">{EQUIPMENT_EXPERIENCE.eyebrow}</p>
            <h2 id="equipment-heading">{EQUIPMENT_CONTENT.heading}</h2>
            <div className="eva-equipment-intro-copy">
              {EQUIPMENT_CONTENT.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>

          <ul className="eva-equipment-highlights" aria-label="Studio highlights">
            {EQUIPMENT_EXPERIENCE.highlights.map((h) => (
              <li key={h.label}>
                <span className="eva-equipment-highlight-value">{h.value}</span>
                <span className="eva-equipment-highlight-label">{h.label}</span>
              </li>
            ))}
          </ul>

          <div className="eva-equipment-experience">
            <h3>{EQUIPMENT_EXPERIENCE.heading}</h3>
            <p>{EQUIPMENT_EXPERIENCE.intro}</p>
          </div>

          <ol className="eva-equipment-features" aria-label="Studio equipment">
            {EQUIPMENT_ITEMS.map((item, index) => (
              <Reveal as="li" key={item.id} className="eva-equipment-feature">
                <figure className="eva-equipment-figure">
                  <div
                    className={`eva-equipment-photo eva-live eva-live--${item.overlay}${index % 2 ? " eva-live--alt" : ""}`}
                    style={
                      {
                        "--focus-x": `${item.focus.x}%`,
                        "--focus-y": `${item.focus.y}%`,
                      } as React.CSSProperties
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised AVIF, served as-is */}
                    <img
                      src={item.image}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      sizes="(min-width: 992px) 56vw, 100vw"
                    />
                    <div className="eva-live-layer" aria-hidden="true">
                      <span className="eva-live-glow" />
                      <span className="eva-live-sheen" />
                      {item.overlay === "meter" && (
                        <span className="eva-live-meter">
                          {Array.from({ length: 14 }, (_, i) => (
                            <i key={i} style={{ animationDelay: `${-((i * 37) % 11) / 10}s` }} />
                          ))}
                        </span>
                      )}
                      {item.overlay === "rec" && (
                        <span className="eva-live-rec">
                          <b />
                          REC
                        </span>
                      )}
                      {item.overlay !== "meter" && (
                        <span className="eva-live-rings">
                          <i />
                          <i />
                          <i />
                        </span>
                      )}
                    </div>
                  </div>
                  <figcaption>
                    {item.caption}. Photo:{" "}
                    <a href={item.credit.source} target="_blank" rel="noopener noreferrer">
                      {item.credit.author}, {item.credit.license}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </figcaption>
                </figure>
                <div className="eva-equipment-text">
                  <p className="eva-equipment-role">
                    <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    {item.role}
                  </p>
                  <h3>{item.name}</h3>
                  <p className="eva-equipment-desc">{item.description}</p>
                  <p className="eva-equipment-workflow">
                    <strong>At EVA: </strong>
                    {item.workflow}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
          <p className="eva-equipment-note">
            Photos are representative of the equipment we use and are not pictures of our own studio.
          </p>
        </div>
      </section>
    </main>
  );
}
