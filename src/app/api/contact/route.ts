import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, sendMail } from "@@/utils/mail";
import { BLOCKED_EMAIL_MESSAGE, blockedEmailDomain } from "@@/lib/blocked-email-domains";
import { sendClientAck } from "@@/utils/mail-ack";
import { contactEmail } from "@@/utils/email-templates";
import { cleanLine, cleanText, LIMITS } from "@@/lib/security/form-guard";
import { guardFormRequest } from "@@/lib/security/form-request";

export async function POST(req: NextRequest) {
  const guard = await guardFormRequest(req, "contact");
  if (!guard.ok) return guard.response;
  const body = guard.body;

  const name = cleanLine(body.name, LIMITS.name);
  const lastname = cleanLine(body.lastname, LIMITS.name);
  const email = cleanLine(body.email, LIMITS.email);
  const phone = cleanLine(body.phone, LIMITS.phone);
  const service = cleanLine(body.service, LIMITS.service);
  const message = cleanText(body.message, LIMITS.message);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required." },
      { status: 400 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }
  const blockedDomain = blockedEmailDomain(email);
  if (blockedDomain) {
    // Visible in Vercel runtime logs; nothing is stored or sent.
    console.warn("[form:blocked-email]", { form: "contact", email, domain: blockedDomain, ts: new Date().toISOString() });
    return NextResponse.json({ error: BLOCKED_EMAIL_MESSAGE, field: "email" }, { status: 400 });
  }
  if (phone && !/^[+\d][\d\s()\-.]{4,24}$/.test(phone)) {
    return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
  }

  try {
    await sendMail({
      ...contactEmail({ name, lastname, email, phone, service, message }),
      replyTo: email,
    });
    // Internal email succeeded; the ack never fails the request.
    await sendClientAck(email, { kind: "contact", firstName: name });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact]", err);
    return NextResponse.json(
      { error: "Unable to send message right now." },
      { status: 500 },
    );
  }
}
