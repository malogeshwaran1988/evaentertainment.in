"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@@/components/common/NavLink";
import { Routes } from "@@/constants/routes";
import { CONSENT_RESET_EVENT, getConsent, setConsent, type Consent } from "@@/lib/consent";

/** Bottom cookie bar, shown until the visitor accepts or rejects analytics cookies. */
export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!getConsent()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_RESET_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, reopen);
  }, []);

  // WCAG 2.4.11: reserve the bar's height so it never covers a focused control or the footer.
  useEffect(() => {
    const root = document.documentElement;
    const bar = barRef.current;
    if (!open || !bar) {
      root.style.removeProperty("--eva-cookie-h");
      return;
    }
    const sync = () => root.style.setProperty("--eva-cookie-h", `${bar.offsetHeight}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(bar);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--eva-cookie-h");
    };
  }, [open]);

  if (!open) return null;

  const choose = (value: Consent) => {
    const hadFocus = barRef.current?.contains(document.activeElement);
    setConsent(value);
    setOpen(false);
    // Don't drop keyboard focus onto <body> when the bar disappears.
    if (hadFocus) document.getElementById("main-content")?.focus({ preventScroll: true });
  };

  return (
    <section ref={barRef} className="eva-cookie-bar" aria-label="Cookie consent">
      <div className="eva-cookie-bar-inner">
        <p className="eva-cookie-text">
          <strong>We use cookies.</strong> Essential storage keeps the site working. With your
          permission, Google analytics tags loaded through Google Tag Manager help us understand how
          visitors use the site so we can improve it. See our{" "}
          <Link href={Routes.PRIVACY}>Privacy Policy</Link>.
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
