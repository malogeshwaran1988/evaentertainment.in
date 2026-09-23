import nodemailer from "nodemailer";

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function sendMail(options: {
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO || "info@evaentertainment.in";
  const from = process.env.SMTP_FROM || user || "noreply@evaentertainment.in";

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

  await transporter.sendMail({
    from,
    to,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
  });

  return { ok: true as const, mocked: false as const };
}
