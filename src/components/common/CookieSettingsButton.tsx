"use client";

import { resetConsent } from "@@/lib/consent";

export default function CookieSettingsButton() {
  return (
    <button type="button" className="eva-footer-cookie-btn" onClick={resetConsent}>
      Cookie settings
    </button>
  );
}
