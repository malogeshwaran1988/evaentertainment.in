import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import Link from "@@/components/common/NavLink";
import { Routes, serviceHref } from "@@/constants/routes";
import { buildPageMetadata } from "@@/lib/seo";
import CareersForm from "@@/components/careers/CareersForm";
import RoleSlider from "@@/components/careers/RoleSlider";
import "@@/styles/routes/contact.scss";
import "@@/styles/routes/careers.scss";
import {
  CAREERS_INTRO,
  CAREERS_OG_IMAGE,
  CAREERS_OG_IMAGE_ALT,
  CAREERS_PAGE_URL,
  CAREERS_SEO,
} from "@@/data/careers";

export const metadata = buildPageMetadata({
  ...CAREERS_SEO,
  url: CAREERS_PAGE_URL,
  ogImage: CAREERS_OG_IMAGE,
  ogImageAlt: CAREERS_OG_IMAGE_ALT,
});

export default function CareersPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: CAREERS_SEO.title,
    description: CAREERS_SEO.description,
    url: CAREERS_PAGE_URL,
  };

  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <JsonLd id="careers-jsonld" data={schema} />
      <PageHero
        icon="icon-like"
        title="Become a voice artist"
        subtitle={CAREERS_INTRO}
        trail={[{ label: "Careers", href: Routes.CAREERS }]}
        className="bottom-null"
      />

      <section className="block eva-contact-section eva-careers-section" aria-label="Open roles and job application form">
        <div className="container">
          <div className="eva-contact-grid">
            <div className="eva-contact-details">
              <span className="eva-contact-accent-line" aria-hidden="true" />
              <h2 className="eva-contact-group-title">
                Your voice <span>on the big screen</span>
              </h2>
              <p className="eva-contact-group-desc">
                Perform behind the screen. Every week a hero, a mother or a villain needs a voice in a new language.
                It could be yours. We dub Kollywood, Bollywood and Hollywood films into English and 10 Indian
                languages. Bring your craft and we will help you grow it in a studio that loves sound.
              </p>
              <RoleSlider />
              <p className="eva-contact-group-desc">
                Want to know the work first? See our{" "}
                <Link className="eva-copy-link" href={serviceHref("dubbing-studio")}>
                  dubbing studio
                </Link>{" "}
                or the{" "}
                <Link className="eva-copy-link" href={serviceHref("5-1-mixing-studio")}>
                  5.1 mixing studio
                </Link>
                .
              </p>
            </div>

            <div className="eva-contact-form-panel">
              <span className="eva-contact-accent-line" aria-hidden="true" />
              <h2 className="eva-contact-group-title">
                Apply <span>now</span>
              </h2>
              <CareersForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
