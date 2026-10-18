import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

export const MAIL_FROM_NAME = "EVA Entertainment Website";

export function isValidEmail(email: string): boolean {
  if (email.length > 254 || /[\r\n<>,;"]/.test(email)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Removes CR/LF and control chars so user input can never add mail headers. */
const headerSafe = (v: string) =>
  v.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();

type MailInput = {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  /** Defaults to CONTACT_TO (internal notification). */
  to?: string;
  fromName?: string;
  headers?: Record<string, string>;
};

/** Builds the nodemailer message (exported so tests can render it with jsonTransport). */
export function buildMailOptions(options: MailInput): Mail.Options {
  const user = process.env.SMTP_USER;
  const to = options.to ?? (process.env.CONTACT_TO || "info@evaentertainment.in");
  const fromAddress = headerSafe(
    process.env.SMTP_FROM || user || "info@lasmind.com",
  ).replace(/^.*<([^>]+)>.*$/, "$1");
  const domain = fromAddress.split("@")[1] || "evaentertainment.in";
  const replyTo =
    options.replyTo && isValidEmail(headerSafe(options.replyTo))
      ? headerSafe(options.replyTo)
      : undefined;

  return {
    from: { name: options.fromName ?? MAIL_FROM_NAME, address: fromAddress },
    to,
    replyTo,
    subject: headerSafe(options.subject).slice(0, 200),
    messageId: `<${randomUUID()}@${domain}>`,
    date: new Date(),
    disableFileAccess: true,
    disableUrlAccess: true,
    text: options.text,
    html: options.html,
    headers: options.headers,
  };
}

/**
 * Dev/mock only: when MAIL_PREVIEW_DIR is set, render the full message with nodemailer's
 * jsonTransport (never sent) and save <time>-<to>.html/.json there for review.
 */
async function writeMailPreview(options: MailInput) {
  const dir = process.env.MAIL_PREVIEW_DIR;
  if (!dir || process.env.NODE_ENV === "production") return;
  try {
    const { mkdir, writeFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const info = await nodemailer.createTransport({ jsonTransport: true }).sendMail(buildMailOptions(options));
    const msg = JSON.parse(String(info.message)) as Record<string, unknown>;
    const to = String(options.to ?? process.env.CONTACT_TO ?? "internal").replace(/[^\w.@-]/g, "_");
    const base = path.join(dir, `${Date.now()}-${to}`);
    await mkdir(dir, { recursive: true });
    await writeFile(`${base}.html`, options.html ?? "");
    const { html: _html, text: _text, ...headers } = msg;
    void _html;
    void _text;
    await writeFile(`${base}.json`, JSON.stringify(headers, null, 2));
  } catch (err) {
    console.warn("[mail:preview] could not write preview", err);
  }
}

export async function sendMail(options: MailInput) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // MAIL_MOCK=1 ALWAYS wins, even when SMTP_* is configured: nothing leaves the machine.
  const mock = process.env.MAIL_MOCK === "1";
  if (mock || !host || !user || !pass) {
    // Mock, or local/dev without SMTP: accept and log. Production must set SMTP_*.
    if (mock || process.env.NODE_ENV !== "production") {
      console.info("[mail:mock]", options.to ?? "(internal)", options.subject);
      await writeMailPreview(options);
      return { ok: true as const, mocked: true as const };
    }
    throw new Error(
      "Mail is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and CONTACT_TO.",
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail(buildMailOptions(options));

  return { ok: true as const, mocked: false as const };
}
