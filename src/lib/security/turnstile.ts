import "server-only";

/**
 * Server-side Cloudflare Turnstile check. If TURNSTILE_SECRET_KEY is unset the check is
 * skipped (logged once) so the forms keep working until keys are added.
 */
let warned = false;

export async function verifyTurnstile(token: unknown, ip?: string, host?: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Widget shown (site key set) but no secret: fail closed instead of silently skipping.
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      console.error("[turnstile] site key set but TURNSTILE_SECRET_KEY missing; rejecting.");
      return false;
    }
    if (!warned) {
      console.warn("[turnstile] TURNSTILE_SECRET_KEY not set; skipping CAPTCHA verification.");
      warned = true;
    }
    return true;
  }
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean; hostname?: string };
    if (data.success !== true) return false;
    // Token must have been issued for this site (blocks tokens farmed on another domain).
    const expected = (host || "").split(":")[0];
    if (expected && data.hostname && expected !== "localhost" && data.hostname !== expected) return false;
    return true;
  } catch (err) {
    console.error("[turnstile] verify failed", err);
    return false;
  }
}
