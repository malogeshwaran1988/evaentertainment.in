import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import { Routes } from "@@/constants/routes";
import { buildPageMetadata } from "@@/lib/seo";
import BookingForm from "@@/components/booking/BookingForm";
import {
  BOOKING_OG_IMAGE,
  BOOKING_OG_IMAGE_ALT,
  BOOKING_PAGE_URL,
  BOOKING_SEO,
} from "@@/data/booking";

export const metadata = buildPageMetadata({
  ...BOOKING_SEO,
  url: BOOKING_PAGE_URL,
  ogImage: BOOKING_OG_IMAGE,
  ogImageAlt: BOOKING_OG_IMAGE_ALT,
});

export default function BookPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: BOOKING_SEO.title,
    description: BOOKING_SEO.description,
    url: BOOKING_PAGE_URL,
  };

  return (
    <main className="page-main">
      <JsonLd id="booking-jsonld" data={schema} />
      <PageHero
        icon="icon-mic-3"
        title="Book Your Session"
        trail={[{ label: "Book a Session", href: Routes.BOOK }]}
        className="bottom-null"
      />

      <section className="block booking-page-section">
        <div className="container">
          <BookingForm />
        </div>
      </section>
    </main>
  );
}
