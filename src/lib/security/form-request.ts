import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, clientIp } from "@@/utils/rateLimit";
import { checkBotSignals, MAX_BODY_BYTES } from "@@/lib/security/form-guard";
import { verifyTurnstile } from "@@/lib/security/turnstile";

type Guarded =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; response: NextResponse };

const json = (status: number, data: object, headers?: Record<string, string>) =>
  NextResponse.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });

/**
 * Shared spam/abuse gate for public form endpoints: same-origin check, body size cap,
 * durable rate limit, honeypot + timing, and Turnstile. Bots get a fake 200 so they learn nothing.
 */
export async function guardFormRequest(
  req: NextRequest,
  scope: string,
  maxBytes: number = MAX_BODY_BYTES,
): Promise<Guarded> {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return { ok: false, response: json(403, { error: "Forbidden." }) };
  }
  if (!(req.headers.get("content-type") || "").includes("application/json")) {
    return { ok: false, response: json(415, { error: "Unsupported content type." }) };
  }

  const ip = clientIp(req.headers);
  const limited = await checkRateLimit(`${scope}:${ip}`);
  if (!limited.ok) {
    return {
      ok: false,
      response: json(429, { error: "Too many requests. Please try again later." }, {
        "Retry-After": String(limited.retryAfterSec),
      }),
    };
  }

  const raw = await req.text();
  if (raw.length > maxBytes) {
    return { ok: false, response: json(413, { error: "Request too large." }) };
  }
  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return { ok: false, response: json(400, { error: "Invalid JSON body." }) };
  }

  const bot = checkBotSignals(body);
  if (bot.bot) {
    console.warn(`[${scope}] dropped bot submission: ${bot.reason}`);
    return { ok: false, response: json(200, { ok: true }) };
  }

  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return {
      ok: false,
      response: json(400, { error: "Verification failed. Please complete the check and try again." }),
    };
  }
  return { ok: true, body };
}
