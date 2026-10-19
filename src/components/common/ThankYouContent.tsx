"use client";

import { useSyncExternalStore } from "react";
import Link from "@@/components/common/NavLink";
import { CONTACT } from "@@/constants/constants";
import { Routes, WHAT_WE_DO_HREF } from "@@/constants/routes";
import { hasThankYouTicket, type ThankYouType } from "@@/lib/thank-you";

const COPY: Record<ThankYouType, { heading: string; body: string }> = {
  contact: {
    heading: "Thank you for contacting us",
    body: "We have received your enquiry and a member of our team will get back to you within one business day. A confirmation has been sent to your email.",
  },
};

const noop = () => () => {};

/**
 * Shows the per-form thank-you only when this tab actually submitted that form (sessionStorage
 * ticket). Direct visits, bookmarks and shared links get a neutral view instead of a false
 * "we received your message". Server render = neutral, so crawlers never see a confirmation.
 */
export default function ThankYouContent({ type }: { type: ThankYouType | null }) {
  const valid = useSyncExternalStore(
    noop,
    () => (type ? hasThankYouTicket(type) : false),
    () => false,
  );

  if (!type || !valid) {
    return (
      <div className="eva-thank-you">
        <h2 className="h--md">Looking to get in touch?</h2>
        <p className="p--lg">
          Send us a message and we will get back to you within one business day.
        </p>
        <div className="eva-service-actions eva-thank-you-actions">
          <Link href={Routes.CONTACT} className="btn">
            <span>Contact us</span>
          </Link>
        </div>
      </div>
    );
  }

  const c = COPY[type];
  return (
    <div className="eva-thank-you" role="status">
      <span className="eva-thank-you-tick" aria-hidden="true">
        ✓
      </span>
      <h2 className="h--md">{c.heading}</h2>
      <p className="p--lg">{c.body}</p>
      <p>
        Urgent? Write to <a href={`mailto:${CONTACT.infoEmail}`}>{CONTACT.infoEmail}</a> or WhatsApp{" "}
        <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`}>{CONTACT.whatsappDisplay}</a>.
      </p>
      <div className="eva-service-actions eva-thank-you-actions">
        <Link href={Routes.HOME} className="btn btn--border">
          <span>Back to Home</span>
        </Link>
        <Link href={WHAT_WE_DO_HREF} className="btn">
          <span>Explore our services</span>
        </Link>
      </div>
    </div>
  );
}
