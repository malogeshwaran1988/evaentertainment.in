/**
 * Branded internal notification emails for the Contact and Book Studio Session forms.
 *
 * Bulletproof HTML: 600px table layout, inline CSS only, system fonts, MSO conditionals + VML
 * button for Outlook desktop, dark-mode-safe colours, logo hosted on our own domain (never
 * attached / base64), and a plain-text part. Every user value is HTML-escaped; the only links
 * built from user input are mailto: (validated email) and tel: (digits only).
 */
import { APP_BASE_URL, SITE_NAME } from "@@/constants/constants";

/** EVA logo colours (sampled from public/images/common/eva-logo.avif) + site CTA green. */
export const EMAIL_BRAND = {
  gold: "#BE8501", // logo "EVA" lettering
  grey: "#646363", // logo "Entertainment" / mic
  green: "#70B615", // site CTA green
  ink: "#13161D", // site dark background
  text: "#1F2328",
  muted: "#5B616B",
  line: "#E4E6EA",
  page: "#F3F4F6",
} as const;

export const EMAIL_LOGO = {
  src: `${APP_BASE_URL}/images/email/eva-logo.png`,
  width: 160,
  height: 80,
} as const;

export type EmailField = { label: string; value: string; kind?: "email" | "tel" };

export type InquiryEmail = {
  /** "New contact enquiry", "New studio booking request" … */
  heading: string;
  intro: string;
  fields: EmailField[];
  /** Free-text message, shown as its own block with line breaks kept. */
  message?: string;
  replyName: string;
  replyEmail: string;
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const telHref = (phone: string) => {
  const digits = phone.replace(/[^\d+]/g, "");
  return /^\+?\d{5,16}$/.test(digits) ? `tel:${digits}` : null;
};
/** Callers pass validated emails only; still refuse anything that could break the attribute. */
const mailtoHref = (email: string) =>
  /^[^\s@<>"'`]+@[^\s@<>"'`]+\.[^\s@<>"'`]+$/.test(email) ? `mailto:${encodeURI(email)}` : null;

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const B = EMAIL_BRAND;

function valueCell(f: EmailField): string {
  const v = escapeHtml(f.value);
  const href = f.kind === "email" ? mailtoHref(f.value) : f.kind === "tel" ? telHref(f.value) : null;
  return href
    ? `<a href="${escapeHtml(href)}" style="color:${B.text};text-decoration:underline;">${v}</a>`
    : v;
}

function row(f: EmailField): string {
  return `<tr>
<td valign="top" width="170" style="padding:10px 12px 10px 0;border-bottom:1px solid ${B.line};font-family:${FONT};font-size:13px;line-height:20px;color:${B.muted};font-weight:600;">${escapeHtml(f.label)}</td>
<td valign="top" style="padding:10px 0;border-bottom:1px solid ${B.line};font-family:${FONT};font-size:15px;line-height:22px;color:${B.text};word-break:break-word;">${valueCell(f)}</td>
</tr>`;
}

function button(label: string, href: string): string {
  const l = escapeHtml(label);
  const h = escapeHtml(href);
  return `<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${h}" style="height:44px;v-text-anchor:middle;width:260px;" arcsize="12%" stroke="f" fillcolor="${B.green}">
<w:anchorlock/><center style="color:#13161D;font-family:Segoe UI,Arial,sans-serif;font-size:15px;font-weight:bold;">${l}</center>
</v:roundrect>
<![endif]--><!--[if !mso]><!-- --><a href="${h}" style="display:inline-block;background-color:${B.green};color:#13161D;font-family:${FONT};font-size:15px;font-weight:700;line-height:44px;text-align:center;text-decoration:none;padding:0 26px;border-radius:6px;mso-hide:all;">${l}</a><!--<![endif]-->`;
}

export function renderInquiryEmail(e: InquiryEmail): { html: string; text: string } {
  const reply = mailtoHref(e.replyEmail);
  const firstName = e.replyName.split(/\s+/)[0] || "the client";
  const preheader = `${e.heading} from ${e.replyName}`;

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(e.heading)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${B.page};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${B.page};">${escapeHtml(preheader)}&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${B.page}" style="background-color:${B.page};">
<tr><td align="center" style="padding:24px 12px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
<tr><td bgcolor="${B.ink}" align="left" style="background-color:${B.ink};padding:20px 28px;border-radius:8px 8px 0 0;border-bottom:4px solid ${B.gold};">
<img src="${EMAIL_LOGO.src}" width="${EMAIL_LOGO.width}" height="${EMAIL_LOGO.height}" alt="${escapeHtml(SITE_NAME)}" style="display:block;border:0;outline:none;text-decoration:none;width:${EMAIL_LOGO.width}px;height:${EMAIL_LOGO.height}px;font-family:${FONT};font-size:24px;line-height:30px;font-weight:800;color:${B.gold};">
</td></tr>
<tr><td bgcolor="#FFFFFF" style="background-color:#FFFFFF;padding:28px 28px 8px;">
<h1 style="margin:0 0 8px;font-family:${FONT};font-size:22px;line-height:30px;font-weight:700;color:${B.text};">${escapeHtml(e.heading)}</h1>
<p style="margin:0 0 20px;font-family:${FONT};font-size:15px;line-height:22px;color:${B.muted};">${escapeHtml(e.intro)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${B.line};">
${e.fields.filter((f) => f.value).map(row).join("\n")}
</table>
</td></tr>
${
  e.message
    ? `<tr><td bgcolor="#FFFFFF" style="background-color:#FFFFFF;padding:12px 28px 8px;">
<p style="margin:0 0 8px;font-family:${FONT};font-size:13px;line-height:20px;font-weight:600;color:${B.muted};">Message</p>
<div style="font-family:${FONT};font-size:15px;line-height:23px;color:${B.text};background-color:#F7F8FA;border-left:4px solid ${B.green};padding:14px 16px;white-space:pre-wrap;word-break:break-word;">${escapeHtml(e.message)}</div>
</td></tr>`
    : ""
}
${
  reply
    ? `<tr><td bgcolor="#FFFFFF" align="left" style="background-color:#FFFFFF;padding:20px 28px 28px;">
${button(`Reply to ${firstName}`, reply)}
<p style="margin:12px 0 0;font-family:${FONT};font-size:13px;line-height:19px;color:${B.muted};">Or just press Reply: replies go to ${escapeHtml(e.replyEmail)}.</p>
</td></tr>`
    : ""
}
<tr><td bgcolor="${B.ink}" style="background-color:${B.ink};padding:18px 28px;border-radius:0 0 8px 8px;font-family:${FONT};font-size:12px;line-height:18px;color:#C9CDD3;">
Sent by the ${escapeHtml(SITE_NAME)} website form at <a href="${APP_BASE_URL}" style="color:#C9CDD3;text-decoration:underline;">evaentertainment.in</a>. Andheri West, Mumbai.
</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;

  const text = [
    `${e.heading}`,
    "=".repeat(e.heading.length),
    "",
    e.intro,
    "",
    ...e.fields.filter((f) => f.value).map((f) => `${f.label}: ${f.value}`),
    ...(e.message ? ["", "Message:", e.message] : []),
    "",
    `Reply to this email to answer ${e.replyName} (${e.replyEmail}).`,
    "",
    "--",
    `Sent by the ${SITE_NAME} website form at ${APP_BASE_URL}`,
  ].join("\n");

  return { html, text };
}

export type ContactInput = {
  name: string;
  lastname?: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
};

export function contactEmail(c: ContactInput) {
  const fullName = [c.name, c.lastname].filter(Boolean).join(" ");
  const { html, text } = renderInquiryEmail({
    heading: "New contact enquiry",
    intro: `${fullName} sent a message through the contact form on the website.`,
    fields: [
      { label: "Name", value: fullName },
      { label: "Email", value: c.email, kind: "email" },
      { label: "Phone", value: c.phone ?? "", kind: "tel" },
      { label: "Service of interest", value: c.service ?? "" },
    ],
    message: c.message,
    replyName: fullName,
    replyEmail: c.email,
  });
  return { subject: `New contact enquiry from ${fullName}`, html, text };
}

export type BookingInput = {
  name: string;
  lastname?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  service: string;
  hours?: string;
  date?: string;
};

export function bookingEmail(b: BookingInput) {
  const fullName = [b.name, b.lastname].filter(Boolean).join(" ");
  const { html, text } = renderInquiryEmail({
    heading: "New studio session request",
    intro: `${fullName} asked to book a studio session through the website.`,
    fields: [
      { label: "Name", value: fullName },
      { label: "Email", value: b.email, kind: "email" },
      { label: "Phone", value: b.phone ?? "", kind: "tel" },
      { label: "Service", value: b.service },
      { label: "Preferred date", value: b.date ?? "" },
      { label: "Hours", value: b.hours ?? "" },
      { label: "Address", value: b.address ?? "" },
      { label: "City / Country", value: b.city ?? "" },
    ],
    replyName: fullName,
    replyEmail: b.email,
  });
  const when = b.date ? ` for ${b.date}` : "";
  return { subject: `Studio session request from ${fullName}${when}`, html, text };
}
