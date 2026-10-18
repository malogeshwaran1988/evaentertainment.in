import { Redis } from "@upstash/redis";

/**
 * Fixed-window rate limiter shared across Vercel instances when Upstash Redis is configured
 * (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN, or the KV_REST_API_* names Vercel sets).
 * Falls back to a per-instance in-memory Map (local dev, or if Redis is unreachable).
 */
type RateBucket = { count: number; resetAt: number };
export type RateResult = { ok: true } | { ok: false; retryAfterSec: number };

const buckets = new Map<string, RateBucket>();

let redis: Redis | null | undefined;
function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

function memoryLimit(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();
  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (existing.count >= limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }
  existing.count += 1;
  return { ok: true };
}

export async function checkRateLimit(
  key: string,
  limit = Number(process.env.CONTACT_RATE_LIMIT_MAX || 5),
  windowMs = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || 60_000),
): Promise<RateResult> {
  const r = getRedis();
  if (r) {
    try {
      const k = `eva:rl:${key}`;
      const count = await r.incr(k);
      if (count === 1) await r.pexpire(k, windowMs);
      if (count > limit) {
        const ttl = await r.pttl(k);
        return { ok: false, retryAfterSec: Math.max(1, Math.ceil((ttl > 0 ? ttl : windowMs) / 1000)) };
      }
      return { ok: true };
    } catch (err) {
      console.error("[rateLimit] Redis unavailable, using memory", err);
    }
  }
  return memoryLimit(key, limit, windowMs);
}

/** Clears a key (e.g. after a successful login). */
export async function resetRateLimit(key: string) {
  buckets.delete(key);
  const r = getRedis();
  if (r) {
    try {
      await r.del(`eva:rl:${key}`);
    } catch {
      /* ignore */
    }
  }
}

/** Client IP as seen by Vercel (x-forwarded-for is set by the Vercel edge, not the client). */
export function clientIp(h: { get(name: string): string | null }): string {
  return (
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
