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
};

/** Builds the nodemailer message (exported so tests can render it with jsonTransport). */
export function buildMailOptions(options: MailInput): Mail.Options {
  const user = process.env.SMTP_USER;
  const to = process.env.CONTACT_TO || "info@evaentertainment.in";
  const fromAddress = headerSafe(
    process.env.SMTP_FROM || user || "info@lasmind.com",
  ).replace(/^.*<([^>]+)>.*$/, "$1");
  const domain = fromAddress.split("@")[1] || "evaentertainment.in";
  const replyTo =
    options.replyTo && isValidEmail(headerSafe(options.replyTo))
      ? headerSafe(options.replyTo)
      : undefined;

  return {
    from: { name: MAIL_FROM_NAME, address: fromAddress },
    to,
    replyTo,
    subject: headerSafe(options.subject).slice(0, 200),
    messageId: `<${randomUUID()}@${domain}>`,
    date: new Date(),
    disableFileAccess: true,
    disableUrlAccess: true,
    text: options.text,
    html: options.html,
  };
}

export async function sendMail(options: MailInput) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // Local/dev without SMTP: accept and log. Production should set SMTP_*.
    if (
      process.env.NODE_ENV !== "production" ||
      process.env.MAIL_MOCK === "1"
    ) {
      console.info("[mail:dev-fallback]", options.subject, options.text);
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
