import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, sendMail } from "@@/utils/mail";
import { BLOCKED_EMAIL_MESSAGE, blockedEmailDomain } from "@@/lib/blocked-email-domains";
import { sendClientAck } from "@@/utils/mail-ack";
import { bookingEmail } from "@@/utils/email-templates";
import { cleanLine, cleanText, LIMITS } from "@@/lib/security/form-guard";
import { guardFormRequest } from "@@/lib/security/form-request";
import { COUNTRIES } from "@@/data/countries";

export async function POST(req: NextRequest) {
  const guard = await guardFormRequest(req, "booking");
  if (!guard.ok) return guard.response;
  const body = guard.body;

  const name = cleanLine(body.name, LIMITS.name);
  const lastname = cleanLine(body.lastname, LIMITS.name);
  const email = cleanLine(body.email, LIMITS.email);
  const phone = cleanLine(body.phone, LIMITS.phone);
  const address = cleanLine(body.address, LIMITS.address);
  const rawCity = cleanLine(body.city, LIMITS.city);
  // The form posts an ISO alpha-3 code; show the country name in the email.
  const city = COUNTRIES.find((c) => c.code === rawCity)?.name ?? rawCity;
  const service = cleanLine(body.service, LIMITS.service);
  const hours = cleanLine(body.hours, LIMITS.hours);
  const date = cleanLine(body.date, LIMITS.date);
  const rawTime = cleanLine(body.time, LIMITS.time);
  const time = /^([01]\d|2[0-3]):[0-5]\d$/.test(rawTime) ? rawTime : "";
  const language = cleanLine(body.language, LIMITS.language);
  const notes = cleanText(body.notes, LIMITS.notes);

  if (!name || !email || !service) {
    return NextResponse.json(
      { error: "Name, email, and service are required." },
      { status: 400 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }
  const blockedDomain = blockedEmailDomain(email);
  if (blockedDomain) {
    // Visible in Vercel runtime logs; nothing is stored or sent.
    console.warn("[form:blocked-email]", { form: "booking", email, domain: blockedDomain, ts: new Date().toISOString() });
    return NextResponse.json({ error: BLOCKED_EMAIL_MESSAGE, field: "email" }, { status: 400 });
  }
  if (phone && !/^[+\d][\d\s()\-.]{4,24}$/.test(phone)) {
    return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
  }

  try {
    await sendMail({
      ...bookingEmail({ name, lastname, email, phone, address, city, service, hours, date, time, language, notes }),
      replyTo: email,
    });
    // Internal email succeeded; the ack never fails the request.
    await sendClientAck(email, { kind: "booking", firstName: name, date: [date, time].filter(Boolean).join(" at ") });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/booking]", err);
    return NextResponse.json(
      { error: "Unable to send booking right now." },
      { status: 500 },
    );
  }
}
