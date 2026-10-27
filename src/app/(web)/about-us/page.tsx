import BrandMark from "@@/components/common/BrandMark";
import FounderSection from "@@/components/about/FounderSection";
import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import { Routes } from "@@/constants/routes";
import {
  ABOUT_CONTENT,
  ABOUT_OG_IMAGE,
  ABOUT_OG_IMAGE_ALT,
  ABOUT_PAGE_URL,
  ABOUT_SEO,
} from "@@/data/about";
import { buildPageMetadata } from "@@/lib/seo";

export const metadata = buildPageMetadata({
  ...ABOUT_SEO,
  url: ABOUT_PAGE_URL,
  ogImage: ABOUT_OG_IMAGE,
  ogImageAlt: ABOUT_OG_IMAGE_ALT,
});

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: ABOUT_SEO.title,
    description: ABOUT_SEO.description,
    url: ABOUT_PAGE_URL,
  };

  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <JsonLd id="about-jsonld" data={schema} />
      <PageHero
        icon="icon-folded-newspaper"
        title={ABOUT_CONTENT.pageTitle}
        trail={[{ label: "About", href: Routes.ABOUT }]}
      />

      <section className="block">
        <div className="container">
          <div className="title-wrap text-center">
            <h2 className="h--lg">
              <i className="icon icon-promotion-1" aria-hidden="true" />{ABOUT_CONTENT.sectionTitle}
            </h2>
            <p>{ABOUT_CONTENT.sectionIntro}</p>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <h2 className="text-center">{ABOUT_CONTENT.missionTitle}</h2>
          <div className="row">
            <div className="col-md-5 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <span className="eva-brand-host eva-brand-host--inline">
                <img
                  src={ABOUT_CONTENT.missionImage}
                  className="img-responsive"
                  alt={ABOUT_CONTENT.missionImageAlt}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
                <BrandMark />
              </span>
            </div>
            <div className="divider visible-xs visible-sm" />
            <div className="col-md-7">
              {ABOUT_CONTENT.missionParagraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
          <div className="divider" />
          <h3>{ABOUT_CONTENT.facilitiesTitle}</h3>
          {ABOUT_CONTENT.facilitiesParagraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </section>

      <FounderSection />
    </main>
  );
}
