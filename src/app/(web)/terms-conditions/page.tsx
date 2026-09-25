import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumbs from "@@/components/common/Breadcrumbs";
import LegalDoc from "@@/components/common/LegalDoc";
import { APP_BASE_URL, DEFAULT_OG_IMAGE_ALT, SITE_NAME } from "@@/constants/constants";
import {
  TERMS_CONTENT,
  TERMS_OG_IMAGE,
  TERMS_PAGE_URL,
  TERMS_SEO,
} from "@@/data/terms";

export const metadata: Metadata = {
  title: { absolute: TERMS_SEO.title },
  description: TERMS_SEO.description,
  alternates: { canonical: TERMS_PAGE_URL },
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
    title: TERMS_SEO.title,
    description: TERMS_SEO.description,
    url: TERMS_PAGE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: TERMS_OG_IMAGE,
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
    title: TERMS_SEO.title,
    description: TERMS_SEO.description,
    images: [TERMS_OG_IMAGE],
  },
};

export default function TermsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TERMS_SEO.title,
    description: TERMS_SEO.description,
    url: TERMS_PAGE_URL,
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
          name: "Terms of Service",
          item: TERMS_PAGE_URL,
        },
      ],
    },
  };

  return (
    <main className="page-main">
      <Script
        id="terms-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="block block--title block--darkbg">
        <div className="container">
          <div className="text-center">
            <h1>{TERMS_CONTENT.pageTitle}</h1>
            <Breadcrumbs current="Terms of Service" />
          </div>
        </div>
      </div>

      <section className="block">
        <div className="container">
          <LegalDoc
            effectiveDate={TERMS_CONTENT.effectiveDate}
            lastUpdated={TERMS_CONTENT.lastUpdated}
            intro={TERMS_CONTENT.intro}
            sections={TERMS_CONTENT.sections}
            disclaimer={TERMS_CONTENT.disclaimer}
          />
        </div>
      </section>
    </main>
  );
}
