import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import Link from "@@/components/common/NavLink";
import { Routes, serviceHref } from "@@/constants/routes";
import { buildPageMetadata } from "@@/lib/seo";
import CareersForm from "@@/components/careers/CareersForm";
import "@@/styles/routes/contact.scss";
import "@@/styles/routes/careers.scss";
import {
  CAREERS_INTRO,
  CAREERS_OG_IMAGE,
  CAREERS_OG_IMAGE_ALT,
  CAREERS_PAGE_URL,
  CAREERS_ROLES,
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
        title="Careers"
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
                Work <span>with us</span>
              </h2>
              <p className="eva-contact-group-desc">
                We dub Kollywood, Bollywood and Hollywood films into English and 10 Indian languages. We are always
                looking for new talent.
              </p>
              <ul className="eva-careers-roles">
                {CAREERS_ROLES.map((r) => (
                  <li key={r.title} className="eva-contact-card">
                    <div className="eva-contact-card-body">
                      <h3 className="eva-careers-role-title">{r.title}</h3>
                      <p className="eva-contact-card-hint">{r.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
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
