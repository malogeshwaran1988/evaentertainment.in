import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumbs from "@@/components/common/Breadcrumbs";
import LegalDoc from "@@/components/common/LegalDoc";
import { APP_BASE_URL, SITE_NAME } from "@@/constants/constants";
import {
  PRIVACY_CONTENT,
  PRIVACY_OG_IMAGE,
  PRIVACY_PAGE_URL,
  PRIVACY_SEO,
} from "@@/data/privacy";

export const metadata: Metadata = {
  title: { absolute: PRIVACY_SEO.title },
  description: PRIVACY_SEO.description,
  alternates: { canonical: PRIVACY_PAGE_URL },
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
    title: PRIVACY_SEO.title,
    description: PRIVACY_SEO.description,
    url: PRIVACY_PAGE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: PRIVACY_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: PRIVACY_SEO.title,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PRIVACY_SEO.title,
    description: PRIVACY_SEO.description,
    images: [PRIVACY_OG_IMAGE],
  },
};

export default function PrivacyPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: PRIVACY_SEO.title,
    description: PRIVACY_SEO.description,
    url: PRIVACY_PAGE_URL,
    dateModified: "2026-09-23",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${APP_BASE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Privacy Policy",
          item: PRIVACY_PAGE_URL,
        },
      ],
    },
  };

  return (
    <main className="page-main">
      <Script
        id="privacy-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="block block--title block--darkbg">
        <div className="container">
          <div className="text-center">
            <h1>{PRIVACY_CONTENT.pageTitle}</h1>
            <Breadcrumbs current="Privacy Policy" />
          </div>
        </div>
      </div>

      <section className="block">
        <div className="container">
          <LegalDoc
            effectiveDate={PRIVACY_CONTENT.effectiveDate}
            lastUpdated={PRIVACY_CONTENT.lastUpdated}
            intro={PRIVACY_CONTENT.intro}
            sections={PRIVACY_CONTENT.sections}
            disclaimer={PRIVACY_CONTENT.disclaimer}
          />
        </div>
      </section>
    </main>
  );
}
