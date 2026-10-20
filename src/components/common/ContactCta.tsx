"use client";

import Link from "@@/components/common/NavLink";
import { usePathname } from "next/navigation";
import { Routes } from "@@/constants/routes";
import styles from "./ContactCta.module.scss";
import CtaLanguageCycle from "./CtaLanguageCycle";

/** Paths (and prefixes) where the sitewide Contact CTA is hidden. 404 is hidden via CSS (`.eva-404`). */
const HIDDEN_PREFIXES = [Routes.CONTACT, Routes.THANK_YOU, "/preview"];

/**
 * Sitewide Contact Us CTA ("Make your film speak Hindi") — the original Glory booking card design
 * (restored from BookingCta, removed in 5fd2ad2), repurposed to point at the Contact page.
 */
export default function ContactCta({
  languages = ["Hindi"],
}: {
  languages?: string[];
}) {
  const pathname = usePathname() ?? "";
  if (
    HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  )
    return null;

  return (
    <section
      className={`block ${styles.cta}`}
      aria-labelledby="eva-contact-cta-title"
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.card}>
          <div className={styles.copy}>
            <h2 id="eva-contact-cta-title">
              <span className="sr-only">
                Make your film speak {languages.join(", ")}
              </span>
              <span className={styles.lead} aria-hidden="true">
                Make your film speak{" "}
              </span>
              <CtaLanguageCycle languages={languages} />
            </h2>
            <p className="p--lg">
              Experienced voice artists, frame-accurate sync and a final quality
              review on every reel, delivered on schedule and ready for release.
            </p>
          </div>
          <div className={styles.action}>
            <Link href={Routes.CONTACT} className="btn btn--lg">
              <span>
                <i className="icon icon-mail" aria-hidden="true" />
                Get My Dubbing Quote
              </span>
            </Link>
            <p className="p--sm">
              13+ years of studio experience
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
