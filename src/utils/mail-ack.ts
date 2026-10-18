import "server-only";
import { createHash } from "node:crypto";
import { ackEmail, type AckInput } from "@@/utils/email-templates";
import { isValidEmail, sendMail } from "@@/utils/mail";
import { checkRateLimit } from "@@/utils/rateLimit";

const DAY_MS = 24 * 60 * 60 * 1000;
export const ACK_FROM_NAME = "EVA Entertainment";

/**
 * Sends the client auto-acknowledgement. Call ONLY after guardFormRequest passed (Turnstile,
 * honeypot, rate limit) and the internal notification was sent. At most one ack per address per
 * 24h (Upstash when configured, in-memory fallback). Never throws: failures are logged only.
 */
export async function sendClientAck(email: string, input: AckInput): Promise<void> {
  try {
    const addr = email.trim().toLowerCase();
    if (!isValidEmail(addr)) return;
    const key = `ack:${createHash("sha256").update(addr).digest("hex")}`;
    const limited = await checkRateLimit(key, 1, DAY_MS);
    if (!limited.ok) {
      console.info("[mail:ack] skipped, already acknowledged in the last 24h");
      return;
    }
    await sendMail({
      ...ackEmail(input),
      to: addr,
      fromName: ACK_FROM_NAME,
      replyTo: process.env.CONTACT_TO || "info@evaentertainment.in",
      headers: { "Auto-Submitted": "auto-replied", "X-Auto-Response-Suppress": "All" },
    });
  } catch (err) {
    console.error("[mail:ack] failed (user still got success)", err);
  }
}
