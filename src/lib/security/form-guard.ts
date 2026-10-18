import "server-only";

/** Name of the hidden honeypot input; real visitors never fill it. */
export const HONEYPOT_FIELD = "website";
/** Submissions faster than this after the form rendered are treated as bots. */
const MIN_FILL_MS = 3000;
/** Forms older than this are rejected (stale/replayed). */
const MAX_FILL_MS = 1000 * 60 * 60 * 6;

export type BotCheck = { bot: boolean; reason?: string };

export function checkBotSignals(body: Record<string, unknown>): BotCheck {
  const hp = body[HONEYPOT_FIELD];
  if (typeof hp === "string" && hp.trim() !== "") return { bot: true, reason: "honeypot" };
  const started = Number(body.startedAt);
  if (!Number.isFinite(started) || started <= 0) return { bot: true, reason: "no-timestamp" };
  const elapsed = Date.now() - started;
  if (elapsed < MIN_FILL_MS) return { bot: true, reason: "too-fast" };
  if (elapsed > MAX_FILL_MS) return { bot: true, reason: "stale" };
  return { bot: false };
}

/**
 * Single-line text field: strips CR/LF and other control chars (prevents mail header
 * injection), trims, and enforces a max length.
 */
export function cleanLine(v: unknown, max: number): string {
  return String(v ?? "")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .trim()
    .slice(0, max);
}

/** Multi-line text: keeps newlines, drops other control chars. */
export function cleanText(v: unknown, max: number): string {
  return String(v ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f]+/g, "")
    .trim()
    .slice(0, max);
}

export const LIMITS = {
  name: 80,
  email: 254,
  phone: 25,
  service: 100,
  message: 5000,
  address: 200,
  city: 100,
  hours: 10,
  date: 20,
  time: 10,
  language: 100,
  notes: 2000,
} as const;

export const MAX_BODY_BYTES = 16 * 1024;
