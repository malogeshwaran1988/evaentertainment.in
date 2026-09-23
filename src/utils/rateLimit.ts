type RateBucket = { count: number; resetAt: number };

const buckets = new Map<string, RateBucket>();

export function checkRateLimit(
  key: string,
  limit = Number(process.env.CONTACT_RATE_LIMIT_MAX || 5),
  windowMs = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || 60_000),
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (existing.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  existing.count += 1;
  return { ok: true };
}
