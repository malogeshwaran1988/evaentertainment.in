import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumbs from "@@/components/common/Breadcrumbs";
import {
  EQUIPMENT_CONTENT,
  EQUIPMENT_OG_IMAGE,
  EQUIPMENT_PAGE_URL,
  EQUIPMENT_SEO,
} from "@@/data/equipment";
import { DEFAULT_OG_IMAGE_ALT, SITE_NAME } from "@@/constants/constants";

export const metadata: Metadata = {
  title: { absolute: EQUIPMENT_SEO.title },
  description: EQUIPMENT_SEO.description,
  alternates: { canonical: EQUIPMENT_PAGE_URL },
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
    title: EQUIPMENT_SEO.title,
    description: EQUIPMENT_SEO.description,
    url: EQUIPMENT_PAGE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: EQUIPMENT_OG_IMAGE,
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
    title: EQUIPMENT_SEO.title,
    description: EQUIPMENT_SEO.description,
    images: [EQUIPMENT_OG_IMAGE],
  },
};

export default function EquipmentPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: EQUIPMENT_SEO.title,
    description: EQUIPMENT_SEO.description,
    url: EQUIPMENT_PAGE_URL,
  };

  return (
    <main className="page-main equiment-bg">
      <link
        rel="preload"
        as="image"
        href="/images/equipment/equipment-06.jpg"
        fetchPriority="high"
      />
      <Script
        id="equipment-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="block">
        <div className="container">
          <div className="text-center">
            <h1>
              <i className="icon icon-mic-2" aria-hidden="true" />
              {EQUIPMENT_CONTENT.pageTitle}
            </h1>
            <Breadcrumbs current="Our Equipment" />
          </div>
        </div>
      </div>

      <section className="block">
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
