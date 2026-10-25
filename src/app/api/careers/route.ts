import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, sendMail } from "@@/utils/mail";
import { BLOCKED_EMAIL_MESSAGE, blockedEmailDomain } from "@@/lib/blocked-email-domains";
import { careersAckEmail, renderInquiryEmail } from "@@/utils/email-templates";
import { ACK_FROM_NAME } from "@@/utils/mail-ack";
import { cleanLine, LIMITS } from "@@/lib/security/form-guard";
import { guardFormRequest } from "@@/lib/security/form-request";
import {
  CAREERS_MAX_BODY_BYTES,
  DIAL_CODES,
  FILES_TOTAL_MAX_BYTES,
  RESUME_MAX_BYTES,
  VOICE_MAX_FILES,
  countryByCode,
  roleById,
} from "@@/data/careers";

type Kind = "resume" | "voice";
type Decoded = { filename: string; content: Buffer; contentType: string };

const RESUME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};
const VOICE_TYPES: Record<string, string> = { mp3: "audio/mpeg", wav: "audio/wav", m4a: "audio/mp4" };

/** Checks the real file signature, not just the name the browser sent. */
function signatureOk(ext: string, b: Buffer): boolean {
  const ascii = (s: number, e: number) => b.subarray(s, e).toString("latin1");
  switch (ext) {
    case "pdf": return ascii(0, 5) === "%PDF-";
    case "docx": return b[0] === 0x50 && b[1] === 0x4b;
    case "doc": return b.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
    case "mp3": return ascii(0, 3) === "ID3" || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0);
    case "wav": return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WAVE";
    case "m4a": return ascii(4, 8) === "ftyp";
    default: return false;
  }
}

function decodeFile(v: unknown, kind: Kind): Decoded | null {
  if (!v || typeof v !== "object") return null;
  const f = v as Record<string, unknown>;
  const name = cleanLine(f.name, 120).replace(/[\\/:*?"<>|]+/g, "_");
  const ext = (name.split(".").pop() || "").toLowerCase();
  const types = kind === "resume" ? RESUME_TYPES : VOICE_TYPES;
  if (!types[ext] || typeof f.data !== "string" || !/^[A-Za-z0-9+/=]+$/.test(f.data)) return null;
  const content = Buffer.from(f.data, "base64");
  if (!content.length || !signatureOk(ext, content)) return null;
  return { filename: name, content, contentType: types[ext] };
}

const bad = (error: string, field?: string) => NextResponse.json({ error, field }, { status: 400 });

export async function POST(req: NextRequest) {
  const guard = await guardFormRequest(req, "careers", CAREERS_MAX_BODY_BYTES);
  if (!guard.ok) return guard.response;
  const body = guard.body;

  const name = cleanLine(body.name, LIMITS.name);
  const email = cleanLine(body.email, LIMITS.email);
  const dial = cleanLine(body.dialCode, 6);
  const phone = cleanLine(body.phone, LIMITS.phone);
  const country = countryByCode(cleanLine(body.country, 2));

  const role = roleById(cleanLine(body.role, 40));
  if (!role) return bad("Select the role you are applying for.", "role");
  if (!name) return bad("Full name is required.", "name");
  if (!email || !isValidEmail(email)) return bad("Enter a valid email address.", "email");
  const blockedDomain = blockedEmailDomain(email);
  if (blockedDomain) {
    console.warn("[form:blocked-email]", { form: "careers", email, domain: blockedDomain, ts: new Date().toISOString() });
    return bad(BLOCKED_EMAIL_MESSAGE, "email");
  }
  if (!DIAL_CODES.includes(dial)) return bad("Select a country code.", "dialCode");
  const digits = phone.replace(/\D/g, "");
  if (!/^[\d\s()\-.]{4,24}$/.test(phone) || digits.length < 6 || digits.length > 14) {
    return bad("Enter a valid mobile number.", "phone");
  }
  if (!country) return bad("Select your country.", "country");

  const resume = decodeFile(body.resume, "resume");
  if (!resume) return bad("Upload your resume as a PDF, DOC or DOCX file.", "resume");
  if (resume.content.length > RESUME_MAX_BYTES) return bad("Your resume must be 1 MB or smaller.", "resume");

  const rawVoices = Array.isArray(body.voices) ? body.voices : [];
  if (rawVoices.length < 1 || rawVoices.length > VOICE_MAX_FILES) {
    return bad(`Upload 1 to ${VOICE_MAX_FILES} voice samples.`, "voices");
  }
  const voices = rawVoices.map((v) => decodeFile(v, "voice"));
  if (voices.some((v) => !v)) return bad("Voice samples must be MP3, WAV or M4A files.", "voices");
  const files = [resume, ...(voices as Decoded[])];
  const total = files.reduce((n, f) => n + f.content.length, 0);
  if (total > FILES_TOTAL_MAX_BYTES) return bad("All files together must be 3 MB or smaller.", "voices");

  const mobile = `${dial} ${phone}`;
  const { html, text } = renderInquiryEmail({
    heading: `New job application: ${role.title}`,
    intro: `${name} applied through the careers page on the website. The resume and voice samples are attached.`,
    fields: [
      { label: "Role applying for", value: role.title },
      { label: "Full name", value: name },
      { label: "Email", value: email, kind: "email" },
      { label: "Mobile", value: mobile, kind: "tel" },
      { label: "Country", value: country.name },
      { label: "Resume", value: resume.filename },
      { label: "Voice samples", value: (voices as Decoded[]).map((v) => v.filename).join(", ") },
    ],
    replyName: name,
    replyEmail: email,
  });

  try {
    await sendMail({
      to: process.env.CAREERS_TO || undefined, // falls back to CONTACT_TO in mail.ts
      subject: `New application: ${role.title} - ${name}`,
      html,
      text,
      replyTo: email,
      attachments: files.map((f) => ({ filename: f.filename, content: f.content, contentType: f.contentType })),
    });
  } catch (err) {
    console.error("[api/careers]", err);
    return NextResponse.json({ error: "Unable to send your application right now." }, { status: 500 });
  }

  // Applicant confirmation: never fails the request.
  try {
    await sendMail({
      ...careersAckEmail({
        name,
        role: role.title,
        resume: resume.filename,
        voices: (voices as Decoded[]).map((v) => v.filename),
      }),
      to: email,
      fromName: ACK_FROM_NAME,
      replyTo: process.env.CAREERS_TO || process.env.CONTACT_TO || "info@evaentertainment.in",
      headers: { "Auto-Submitted": "auto-replied", "X-Auto-Response-Suppress": "All" },
    });
  } catch (err) {
    console.error("[api/careers] applicant confirmation failed (application still received)", err);
  }
  return NextResponse.json({ ok: true });
}
