/** Cookie consent, kept in localStorage. Bump the key version if the cookie notice changes materially. */
export type Consent = "accepted" | "rejected";

const STORAGE_KEY = "eva-consent-v1";
export const CONSENT_EVENT = "eva:consent";
export const CONSENT_RESET_EVENT = "eva:consent-reset";

export function getConsent(): Consent | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

export function setConsent(value: Consent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage blocked (private mode): the choice still applies to this page view.
  }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: value }));
}

/** Forget the choice and show the banner again. */
export function resetConsent() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
  window.dispatchEvent(new Event(CONSENT_RESET_EVENT));
}
