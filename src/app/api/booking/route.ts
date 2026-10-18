import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, sendMail } from "@@/utils/mail";
import { cleanLine, LIMITS } from "@@/lib/security/form-guard";
import { guardFormRequest } from "@@/lib/security/form-request";

export async function POST(req: NextRequest) {
  const guard = await guardFormRequest(req, "booking");
  if (!guard.ok) return guard.response;
  const body = guard.body;

  const name = cleanLine(body.name, LIMITS.name);
  const lastname = cleanLine(body.lastname, LIMITS.name);
  const email = cleanLine(body.email, LIMITS.email);
  const phone = cleanLine(body.phone, LIMITS.phone);
  const address = cleanLine(body.address, LIMITS.address);
  const city = cleanLine(body.city, LIMITS.city);
  const service = cleanLine(body.service, LIMITS.service);
  const hours = cleanLine(body.hours, LIMITS.hours);
  const date = cleanLine(body.date, LIMITS.date);

  if (!name || !email || !service) {
    return NextResponse.json(
      { error: "Name, email, and service are required." },
      { status: 400 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }
  if (phone && !/^[+\d][\d\s()\-.]{4,24}$/.test(phone)) {
    return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
  }

  try {
    await sendMail({
      subject: "Booking Form from Eva Entertainment",
      replyTo: email,
      text: [
        "Here is what was sent:",
        "",
        `First name: ${name}`,
        `Last name: ${lastname}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Address: ${address}`,
        `City/Country: ${city}`,
        `Service: ${service}`,
        `Hours: ${hours}`,
        `Date: ${date}`,
      ].join("\n"),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/booking]", err);
    return NextResponse.json(
      { error: "Unable to send booking right now." },
      { status: 500 },
    );
  }
}
