import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumbs from "@@/components/common/Breadcrumbs";
import ContactForm from "@@/components/contact/ContactForm";
import { CONTACT, DEFAULT_OG_IMAGE_ALT, SITE_NAME } from "@@/constants/constants";
import {
  CONTACT_INTRO,
  CONTACT_OG_IMAGE,
  CONTACT_PAGE_URL,
  CONTACT_SEO,
  MAP_EMBEDS,
} from "@@/data/contact";

export const metadata: Metadata = {
  title: { absolute: CONTACT_SEO.title },
  description: CONTACT_SEO.description,
  alternates: { canonical: CONTACT_PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: CONTACT_SEO.title,
    description: CONTACT_SEO.description,
    url: CONTACT_PAGE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: CONTACT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: CONTACT_SEO.title,
    description: CONTACT_SEO.description,
    images: [CONTACT_OG_IMAGE],
  },
};

export default function ContactPage() {
  const whatsappHref = `https://wa.me/${CONTACT.whatsapp.replace("+", "")}`;
  const addressText = CONTACT.addressLines.join(" ");

  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: CONTACT_SEO.title,
    description: CONTACT_SEO.description,
    url: CONTACT_PAGE_URL,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://evaentertainment.in/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact",
          item: CONTACT_PAGE_URL,
        },
      ],
    },
  };

  return (
    <main className="page-main">
      <Script
        id="contact-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="block block--title block--darkbg bottom-null">
        <div className="container">
          <div className="text-center">
            <h1>
              <i className="icon icon-travel" aria-hidden="true" />
              Contact Us
            </h1>
            <p className="eva-contact-intro">{CONTACT_INTRO}</p>
            <Breadcrumbs current="Contact" />
          </div>
        </div>
      </div>

      <section className="block eva-contact-section" aria-label="Contact details and enquiry form">
        <div className="container">
          <div className="eva-contact-grid">
            <div className="eva-contact-details">
              <div className="eva-contact-group">
                <span className="eva-contact-accent-line" aria-hidden="true" />
                <h2 className="eva-contact-group-title">
                  Studio <span>booking</span>
                </h2>
                <p className="eva-contact-group-desc">
                  Let’s discuss your project. We’re here to help.
                </p>

                <div className="eva-contact-card eva-contact-card--highlight">
                  <div className="eva-contact-card-main">
                    <span className="eva-contact-icon eva-contact-icon--phone" aria-hidden="true">
                      <i className="icon icon-telephone" />
                    </span>
                    <div className="eva-contact-card-body">
                      <p className="eva-contact-card-name">{CONTACT.person}</p>
                      <p className="eva-contact-card-role">Studio booking</p>
                      <a
                        className="eva-contact-card-value eva-contact-card-phone"
                        href={`tel:${CONTACT.whatsapp}`}
                      >
                        {CONTACT.whatsappDisplay}
                      </a>
                    </div>
                  </div>
                  <div className="eva-contact-card-actions">
                    <a
                      className="eva-contact-whatsapp"
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="eva-contact-whatsapp-icon"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          fill="currentColor"
                          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 6.045L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                        />
                      </svg>
                      <span>Chat on WhatsApp</span>
                      <span aria-hidden="true">›</span>
                    </a>
                    <p className="eva-contact-hours">
                      Quick response • Mon – Sat, 9 AM – 7 PM
                    </p>
                  </div>
                </div>

                <a
                  className="eva-contact-card eva-contact-card--link"
                  href={`mailto:${CONTACT.bookingEmail}`}
                >
                  <span className="eva-contact-icon eva-contact-icon--mail" aria-hidden="true">
                    <i className="icon icon-mail" />
                  </span>
                  <div className="eva-contact-card-body">
                    <p className="eva-contact-card-label">Booking email</p>
                    <p className="eva-contact-card-hint">
                      For studio bookings &amp; project enquiries
                    </p>
                    <p className="eva-contact-card-value">{CONTACT.bookingEmail}</p>
                  </div>
                  <span className="eva-contact-chevron" aria-hidden="true">
                    ›
                  </span>
                </a>

                <a
                  className="eva-contact-card eva-contact-card--link"
                  href={`mailto:${CONTACT.infoEmail}`}
                >
                  <span className="eva-contact-icon eva-contact-icon--mail" aria-hidden="true">
                    <i className="icon icon-mail" />
                  </span>
                  <div className="eva-contact-card-body">
                    <p className="eva-contact-card-label">Info email</p>
                    <p className="eva-contact-card-hint">
                      For general enquiries
                    </p>
                    <p className="eva-contact-card-value">{CONTACT.infoEmail}</p>
                  </div>
                  <span className="eva-contact-chevron" aria-hidden="true">
                    ›
                  </span>
                </a>

                <div className="eva-contact-card">
                  <span className="eva-contact-icon eva-contact-icon--pin" aria-hidden="true">
                    <i className="icon icon-placeholder-for-map" />
                  </span>
                  <div className="eva-contact-card-body">
                    <p className="eva-contact-card-label">Location</p>
                    <p className="eva-contact-card-hint">Visit our studio</p>
                    <p className="eva-contact-card-value">{addressText}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="eva-contact-form-panel">
              <span className="eva-contact-accent-line" aria-hidden="true" />
              <h2 className="eva-contact-group-title">
                Enquiry <span>Form</span>
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="block eva-contact-maps" aria-label="Studio locations">
        <div className="container">
          <div className="eva-contact-maps-grid">
            {MAP_EMBEDS.map((map) => (
              <div className="eva-contact-map" key={map.src}>
                <h2 className="eva-contact-map-heading">{map.heading}</h2>
                <p className="eva-contact-map-address">{map.address}</p>
                <div className="eva-contact-map-frame">
                  <iframe
                    src={map.src}
                    title={map.title}
                    width="100%"
                    height="360"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
