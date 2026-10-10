"use client";

import { useEffect, useState } from "react";
import Link from "@@/components/common/NavLink";
import { Routes } from "@@/constants/routes";
import { CONSENT_RESET_EVENT, getConsent, setConsent, type Consent } from "@@/lib/consent";

/** Bottom cookie bar, shown until the visitor accepts or rejects analytics cookies. */
export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!getConsent()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_RESET_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (value: Consent) => {
    setConsent(value);
    setOpen(false);
  };

  return (
    <section className="eva-cookie-bar" role="region" aria-label="Cookie consent">
      <div className="eva-cookie-bar-inner">
        <p className="eva-cookie-text">
          <strong>We use cookies.</strong> Essential storage keeps the site working. With your
          permission, Microsoft Clarity analytics cookies help us understand how visitors use the
          site so we can improve it. See our <Link href={Routes.PRIVACY}>Privacy Policy</Link>.
        </p>
        <div className="eva-cookie-actions">
          <button type="button" className="btn btn--border" onClick={() => choose("rejected")}>
            <span>Reject</span>
          </button>
          <button type="button" className="btn" onClick={() => choose("accepted")}>
            <span>Accept all</span>
          </button>
        </div>
      </div>
    </section>
  );
}
