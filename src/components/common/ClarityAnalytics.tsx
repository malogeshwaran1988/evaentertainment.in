"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";
import { CLARITY_PROJECT_ID } from "@@/constants/constants";
import { CONSENT_EVENT, getConsent, type Consent } from "@@/lib/consent";

/**
 * Microsoft Clarity session analytics — production builds only, so local dev sessions aren't recorded.
 * Runs only after the visitor accepts cookies, and starts once the page has loaded and the main
 * thread is idle, so it doesn't delay the hero paint.
 */
export default function ClarityAnalytics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    let started = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const init = () => {
      if (started) return;
      started = true;
      Clarity.init(CLARITY_PROJECT_ID);
    };
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(init, { timeout: 4000 });
      } else {
        timeoutId = window.setTimeout(init, 1500);
      }
    };
    const startWhenLoaded = () => {
      if (document.readyState === "complete") schedule();
      else window.addEventListener("load", schedule, { once: true });
    };

    if (getConsent() === "accepted") startWhenLoaded();

    const onConsent = (e: Event) => {
      const value = (e as CustomEvent<Consent>).detail;
      if (started) Clarity.consent(value === "accepted");
      else if (value === "accepted") startWhenLoaded();
    };
    window.addEventListener(CONSENT_EVENT, onConsent);

    return () => {
      window.removeEventListener(CONSENT_EVENT, onConsent);
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
