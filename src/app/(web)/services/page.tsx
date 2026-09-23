import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumbs from "@@/components/common/Breadcrumbs";
import {
  FOLLEY_EXTRA_PARAGRAPH,
  SERVICE_BLOCKS,
  SERVICES_OG_IMAGE,
  SERVICES_PAGE_URL,
  SERVICES_SEO,
} from "@@/data/services";
import { SITE_NAME } from "@@/constants/constants";

export const metadata: Metadata = {
  title: { absolute: SERVICES_SEO.title },
  description: SERVICES_SEO.description,
  alternates: { canonical: SERVICES_PAGE_URL },
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
    title: SERVICES_SEO.title,
    description: SERVICES_SEO.description,
    url: SERVICES_PAGE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: SERVICES_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SERVICES_SEO.title,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SERVICES_SEO.title,
    description: SERVICES_SEO.description,
    images: [SERVICES_OG_IMAGE],
  },
};

export default function ServicesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "EVA Entertainment Localization Services",
    description: SERVICES_SEO.description,
    url: SERVICES_PAGE_URL,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: "https://evaentertainment.in/",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Studio Services",
      itemListElement: SERVICE_BLOCKS.map((block) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: block.title,
        },
      })),
    },
  };

  return (
    <main className="page-main">
      <link
        rel="preload"
        as="image"
        href={SERVICE_BLOCKS[0].image}
        fetchPriority="high"
      />
      <Script
        id="services-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="block block--title block--darkbg">
        <div className="container">
          <div className="text-center">
            <h1>
              <i className="icon icon-audio" aria-hidden="true" />
              Services
            </h1>
            <Breadcrumbs current="Services" />
          </div>
        </div>
      </div>

      {SERVICE_BLOCKS.map((block) => {
        const imageOnLeft = Boolean(block.dark);
        return (
          <section
            key={block.title}
            id={block.id}
            className={`block bottom-null${block.dark ? " block--darkbg" : ""}`}
          >
            <div className="container">
              <div
                className={`row row--half${block.dark ? " bg-grey-dark" : ""}`}
              >
                <div
                  className={imageOnLeft ? "half-bg-left" : "half-bg-right"}
                  style={{ backgroundImage: `url(${block.image})` }}
                />
                <div
                  className={`col-sm-6${imageOnLeft ? " pull-right" : ""}`}
                >
                  <h2 className="text-uppercase heading-as-h5">
                    <span className="theme-color">{block.title}</span>
                  </h2>
                  <div className="marker-list">
                    {block.paragraphs.map((p) => (
                      <p key={p.slice(0, 48)}>{p}</p>
                    ))}
                    {block.extraHeading ? (
                      <>
                        <h3 className="heading-as-h4">{block.extraHeading}</h3>
                        <p>{FOLLEY_EXTRA_PARAGRAPH}</p>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}
