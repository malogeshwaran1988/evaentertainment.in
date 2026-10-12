/** Cookie consent, kept in localStorage. Bump the key version if the cookie notice changes materially. */
export type Consent = "accepted" | "rejected";

export const CONSENT_STORAGE_KEY = "eva-consent-v1";
export const CONSENT_EVENT = "eva:consent";
export const CONSENT_RESET_EVENT = "eva:consent-reset";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function getConsent(): Consent | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

/** GTM only treats a pushed `arguments` object (not a plain array) as a gtag() command. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/** Google Consent Mode v2 update; the defaults are set in the head by GtmHead. */
function updateGoogleConsent(value: Consent) {
  const state = value === "accepted" ? "granted" : "denied";
  gtag("consent", "update", {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
}

export function setConsent(value: Consent) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Storage blocked (private mode): the choice still applies to this page view.
  }
  updateGoogleConsent(value);
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: value }));
}

/** Forget the choice and show the banner again. */
export function resetConsent() {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {}
  window.dispatchEvent(new Event(CONSENT_RESET_EVENT));
}
