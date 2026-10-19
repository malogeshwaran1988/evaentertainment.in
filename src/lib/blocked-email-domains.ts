/**
 * Hand-maintained list of disposable / test email domains rejected by the public forms
 * (contact form). Shared by the client (instant feedback) and the server
 * (authoritative). A domain also blocks all its subdomains. Keep entries lowercase.
 */
export const BLOCKED_EMAIL_DOMAINS: readonly string[] = [
  // Reserved / test domains
  "example.com", "example.net", "example.org", "redexample.com", "test.com",
  // Disposable inbox services
  "mailinator.com", "tempmail.com", "temp-mail.org", "temp-mail.io", "tempmail.net",
  "tempmailo.com", "tempail.com", "guerrillamail.com", "guerrillamail.net",
  "guerrillamail.org", "guerrillamail.biz", "guerrillamail.de", "guerrillamailblock.com",
  "sharklasers.com", "grr.la", "pokemail.net", "spam4.me", "10minutemail.com",
  "10minutemail.net", "yopmail.com", "yopmail.net", "yopmail.fr", "trashmail.com",
  "trashmail.de", "throwawaymail.com", "getnada.com", "nada.email", "dispostable.com",
  "maildrop.cc", "mailnesia.com", "fakeinbox.com", "emailondeck.com", "mohmal.com",
  "mintemail.com", "mytemp.email", "moakt.com", "burnermail.io", "discard.email",
  "mailcatch.com", "spamgourmet.com", "33mail.com", "inboxkitten.com",
];

export const BLOCKED_EMAIL_MESSAGE =
  "Please use your real email address so our team can reply to you.";

const BLOCKED = new Set(BLOCKED_EMAIL_DOMAINS);

/** Returns the matched blocked domain (exact or parent of a subdomain), else null. */
export function blockedEmailDomain(email: string): string | null {
  const at = email.trim().lastIndexOf("@");
  if (at < 0) return null;
  const host = email.trim().slice(at + 1).toLowerCase().replace(/\.+$/, "");
  const parts = host.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    const candidate = parts.slice(i).join(".");
    if (BLOCKED.has(candidate)) return candidate;
  }
  return null;
}

export const isBlockedEmail = (email: string) => blockedEmailDomain(email) !== null;
