import { Routes } from "@@/constants/routes";

/** Which form sent the visitor to /thank-you. */
export type ThankYouType = "contact" | "booking";
export const THANK_YOU_TYPES: readonly ThankYouType[] = ["contact", "booking"];

const KEY = "eva:thank-you";
/** A submit "ticket" is valid this long; after that /thank-you shows the neutral view. */
export const THANK_YOU_TTL_MS = 30 * 60 * 1000;

export const thankYouHref = (type: ThankYouType) => `${Routes.THANK_YOU}?type=${type}`;

export function parseThankYouType(v: unknown): ThankYouType | null {
  const s = Array.isArray(v) ? v[0] : v;
  return THANK_YOU_TYPES.includes(s as ThankYouType) ? (s as ThankYouType) : null;
}

/** Call right after a successful submit, before navigating. */
export function markThankYou(type: ThankYouType) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ type, at: Date.now() }));
  } catch {
    /* storage blocked: the page falls back to the neutral view */
  }
}

/** True when this tab really submitted `type` recently (guards direct visits / shared links). */
export function hasThankYouTicket(type: ThankYouType): boolean {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return false;
    const t = JSON.parse(raw) as { type?: string; at?: number };
    return t.type === type && typeof t.at === "number" && Date.now() - t.at < THANK_YOU_TTL_MS;
  } catch {
    return false;
  }
}
