import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumbs from "@@/components/common/Breadcrumbs";
import BookingForm from "@@/components/booking/BookingForm";
import {
  BOOKING_OG_IMAGE,
  BOOKING_PAGE_URL,
  BOOKING_SEO,
} from "@@/data/booking";
import { APP_BASE_URL, DEFAULT_OG_IMAGE_ALT, SITE_NAME } from "@@/constants/constants";

export const metadata: Metadata = {
  title: { absolute: BOOKING_SEO.title },
  description: BOOKING_SEO.description,
  alternates: { canonical: BOOKING_PAGE_URL },
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
    title: BOOKING_SEO.title,
    description: BOOKING_SEO.description,
    url: BOOKING_PAGE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: BOOKING_OG_IMAGE,
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
    title: BOOKING_SEO.title,
    description: BOOKING_SEO.description,
    images: [BOOKING_OG_IMAGE],
  },
};

export default function BookPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: BOOKING_SEO.title,
    description: BOOKING_SEO.description,
    url: BOOKING_PAGE_URL,
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
          name: "Book a Session",
          item: BOOKING_PAGE_URL,
        },
      ],
    },
  };

  return (
    <main className="page-main">
      <Script
        id="booking-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="block block--title block--darkbg bottom-null">
        <div className="container">
          <div className="text-center">
            <h1>
              <i className="icon icon-mic-3" aria-hidden="true" />
              Book Your Session
            </h1>
            <Breadcrumbs current="Book Your Session" />
          </div>
        </div>
      </div>

      <section className="block booking-page-section">
        <div className="container">
          <BookingForm />
        </div>
      </section>
    </main>
  );
}
