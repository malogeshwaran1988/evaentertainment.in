import Script from "next/script";
import Link from "next/link";
import HeroSlider from "@@/components/home/HeroSlider";
import { CONTACT, SITE_NAME, SOCIAL_LINKS } from "@@/constants/constants";
import {
  HOME_INTRO,
  HOME_PAGE_URL,
  SERVICE_CARDS,
  WHAT_WE_DO,
} from "@@/data/home";

export default function HomePage() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url: HOME_PAGE_URL,
    image: "https://evaentertainment.in/images/common/eva-logo.avif",
    telephone: CONTACT.whatsappDisplay,
    email: CONTACT.infoEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: "No.228, 2nd Floor, Mohid Heights, Near RTO Office, Opp Four Bungalows",
      addressLocality: "Andheri West, Mumbai",
      postalCode: "400053",
      addressCountry: "IN",
    },
    sameAs: SOCIAL_LINKS.map((s) => s.href),
  };

  return (
    <main className="page-main home-page">
      <Script
        id="home-localbusiness-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <HeroSlider />

      <section className="block block--darkbg block--fullbg block--bgcover inset-125 block-bg-1">
        <div className="container">
          <h2 className="h--lg text-center">
            <i className="icon icon-mic" aria-hidden="true" />
            What We Do?
          </h2>
          <div className="text-center">
            <p className="p--lg" style={{ marginBottom: 50 }}>
              {HOME_INTRO}
            </p>
          </div>
          <div className="row text-center what-we-do-row">
            {WHAT_WE_DO.map((item) => (
              <div className="col-xs-6 col-sm-4 col-lg-3" key={item.title}>
                <div className="service-icon">
                  <i className={item.icon} aria-hidden="true" />
                </div>
                <h3 className="heading-as-h4">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block block--full no-pad-gutter">
        <div className="container title-wrap text-center">
          <h2 className="h--lg">
            <i className="icon icon-travel" aria-hidden="true" />
            Our Services
          </h2>
          <p className="p--lg">
            At EVA Entertainment specialize in the following services and can
            accommodate
            <br />
            your every video/audio requirement
          </p>
        </div>
        <div className="container container--bleed">
          <div className="row gutter-15 services-grid">
            {[0, 1, 2].map((col) => (
              <div className="col-sm-4" key={col}>
                {SERVICE_CARDS.slice(col * 2, col * 2 + 2).map((card) => (
                  <Link
                    key={card.title + card.image}
                    className="service-item"
                    href={card.href}
                  >
                    <div className="service-item-photo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.image}
                        alt={card.alt}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="service-item-caption">
                      <div className="clearfix">
                        <span className="service-item-price">{card.eyebrow}</span>
                        <span className="service-item-title h-gradient">
                          <span>{card.title}</span>
                        </span>
                      </div>
                      {card.description ? (
                        <div className="service-item-description">
                          <span>{card.description}</span>
                        </div>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
