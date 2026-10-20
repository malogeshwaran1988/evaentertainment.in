"use client";

import Link from "@@/components/common/NavLink";
import { usePathname } from "next/navigation";
import { Routes } from "@@/constants/routes";
import styles from "./ContactCta.module.scss";

/** Paths (and prefixes) where the sitewide Contact CTA is hidden. 404 is hidden via CSS (`.eva-404`). */
const HIDDEN_PREFIXES = [Routes.CONTACT, Routes.THANK_YOU, "/preview"];

/**
 * Sitewide Contact Us CTA ("Need a Quality Sound?") — the original Glory booking card design
 * (restored from BookingCta, removed in 5fd2ad2), repurposed to point at the Contact page.
 */
export default function ContactCta() {
  const pathname = usePathname() ?? "";
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;

  return (
    <section className={`block ${styles.cta}`} aria-labelledby="eva-contact-cta-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <h2 id="eva-contact-cta-title">
            Need a <span>Quality</span> Sound?
          </h2>
          <p className="p--lg">
            Dubbing, voice-over, translation or mixing — tell us about your project and our
            studio team will get back to you.
          </p>
        </div>
        <div className={styles.action}>
          <Link href={Routes.CONTACT} className="btn btn--lg">
            <span>
              <i className="icon-mail" aria-hidden="true" />
              Contact Us
            </span>
          </Link>
          <p className="p--sm">We usually reply within one working day.</p>
        </div>
      </div>
    </section>
  );
}
