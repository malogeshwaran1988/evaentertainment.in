/**
 * Branded internal notification email for the Contact form.
 *
 * Bulletproof HTML: 600px table layout, inline CSS only, system fonts, MSO conditionals + VML
 * button for Outlook desktop, dark-mode-safe colours, logo embedded as a CID inline
 * attachment (cid:eva-logo, added in mail.ts) so it shows offline and is not a remote image, and a plain-text part. Every user value is HTML-escaped; the only links
 * built from user input are mailto: (validated email) and tel: (digits only).
 */
import { APP_BASE_URL, SITE_NAME } from "@@/constants/constants";
import { EMAIL_LOGO_CID } from "./email-logo";

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
  src: `cid:${EMAIL_LOGO_CID}`,
  width: 160,
  height: 80,
} as const;

export type EmailField = { label: string; value: string; kind?: "email" | "tel" };

export type InquiryEmail = {
  /** "New contact enquiry" … */
  heading: string;
  intro: string;
  fields: EmailField[];
  /** Free-text message, shown as its own block with line breaks kept. */
  message?: string;
  /** Label above the message block (default "Message"). */
  messageLabel?: string;
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

function layout(o: { title: string; preheader: string; rows: string; footer?: string }): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(o.title)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${B.page};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${B.page};">${escapeHtml(o.preheader)}&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${B.page}" style="background-color:${B.page};">
<tr><td align="center" style="padding:24px 12px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
<tr><td bgcolor="#FFFFFF" align="left" style="background-color:#FFFFFF;padding:20px 28px;border-radius:8px 8px 0 0;border-bottom:4px solid ${B.gold};">
<img src="${EMAIL_LOGO.src}" width="${EMAIL_LOGO.width}" height="${EMAIL_LOGO.height}" alt="${escapeHtml(SITE_NAME)}" style="display:block;border:0;outline:none;text-decoration:none;width:${EMAIL_LOGO.width}px;max-width:100%;height:${EMAIL_LOGO.height}px;overflow:hidden;word-break:break-word;font-family:${FONT};font-size:18px;line-height:24px;font-weight:800;letter-spacing:0.3px;color:${B.gold};text-align:left;">
</td></tr>
${o.rows}<tr><td bgcolor="${B.ink}" style="background-color:${B.ink};padding:18px 28px;border-radius:0 0 8px 8px;font-family:${FONT};font-size:12px;line-height:18px;color:#C9CDD3;">
${o.footer ?? `Sent by the ${escapeHtml(SITE_NAME)} website form at`} <a href="${APP_BASE_URL}" style="color:#C9CDD3;text-decoration:underline;">evaentertainment.in</a>. Andheri West, Mumbai.
</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}

export function renderInquiryEmail(e: InquiryEmail): { html: string; text: string } {
  const reply = mailtoHref(e.replyEmail);
  const firstName = e.replyName.split(/\s+/)[0] || "the client";
  const preheader = `${e.heading} from ${e.replyName}`;

  const html = layout({
    title: e.heading,
    preheader,
    rows: `<tr><td bgcolor="#FFFFFF" style="background-color:#FFFFFF;padding:28px 28px 8px;">
<h1 style="margin:0 0 8px;font-family:${FONT};font-size:22px;line-height:30px;font-weight:700;color:${B.text};">${escapeHtml(e.heading)}</h1>
<p style="margin:0 0 20px;font-family:${FONT};font-size:15px;line-height:22px;color:${B.muted};">${escapeHtml(e.intro)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${B.line};">
${e.fields.filter((f) => f.value).map(row).join("\n")}
</table>
</td></tr>
${
  e.message
    ? `<tr><td bgcolor="#FFFFFF" style="background-color:#FFFFFF;padding:12px 28px 8px;">
<p style="margin:0 0 8px;font-family:${FONT};font-size:13px;line-height:20px;font-weight:600;color:${B.muted};">${escapeHtml(e.messageLabel ?? "Message")}</p>
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
`,
  });

  const text = [
    `${e.heading}`,
    "=".repeat(e.heading.length),
    "",
    e.intro,
    "",
    ...e.fields.filter((f) => f.value).map((f) => `${f.label}: ${f.value}`),
    ...(e.message ? ["", `${e.messageLabel ?? "Message"}:`, e.message] : []),
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

/* ------------------------------------------------------------------------------------------------
 * Client auto-acknowledgement. Echoes NO user free text except the (escaped, ≤40 char) first
 * name. The only links are fixed (mailto:info@… and the site).
 * --------------------------------------------------------------------------------------------- */

export const ACK_CONTACT_EMAIL = "info@evaentertainment.in";

export type AckInput = { kind: "contact"; firstName: string };

const ackSafe = (v: string | undefined, max: number) =>
  (v ?? "").replace(/[\u0000-\u001f\u007f<>]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max).trim();

const p = (html: string, extra = "") =>
  `<p style="margin:0 0 16px;font-family:${FONT};font-size:16px;line-height:25px;color:${B.text};${extra}">${html}</p>`;

export function ackEmail(a: AckInput) {
  const first = ackSafe(a.firstName.split(/\s+/)[0], 40) || "there";
  const subject = "Thank you for contacting EVA Entertainment";
  const heading = "Thank you for your enquiry";
  const mail = `mailto:${ACK_CONTACT_EMAIL}`;

  const rows = `<tr><td bgcolor="#FFFFFF" style="background-color:#FFFFFF;padding:30px 28px 10px;">
<h1 style="margin:0 0 18px;font-family:${FONT};font-size:22px;line-height:30px;font-weight:700;color:${B.text};">${escapeHtml(heading)}</h1>
${p(`Dear ${escapeHtml(first)},`)}
${p("Thank you for contacting EVA Entertainment. We have received your enquiry and a member of our team will get back to you within one business day.")}
${p(`If your project is urgent, please reply to this email or write to <a href="${mail}" style="color:${B.text};text-decoration:underline;">${ACK_CONTACT_EMAIL}</a>.`)}
</td></tr>
<tr><td bgcolor="#FFFFFF" align="left" style="background-color:#FFFFFF;padding:4px 28px 18px;">
${button("Write to us", mail)}
</td></tr>
<tr><td bgcolor="#FFFFFF" style="background-color:#FFFFFF;padding:8px 28px 28px;">
${p("Warm regards,", "margin-bottom:4px;")}
${p(`<strong>Team EVA Entertainment</strong><br><span style="color:${B.muted};font-size:14px;">Dubbing, Voice-over &amp; Sound Studio<br>Andheri West, Mumbai</span>`, "margin-bottom:0;")}
</td></tr>
`;

  const html = layout({
    title: subject,
    preheader: "We have received your enquiry and will get back to you within one business day.",
    rows,
    footer: `You are receiving this one-time confirmation because this address was used on a form at`,
  });

  const text = [
    `Dear ${first},`,
    "",
    "Thank you for contacting EVA Entertainment. We have received your enquiry and a member of our team will get back to you within one business day.",
    "",
    `If your project is urgent, please reply to this email or write to ${ACK_CONTACT_EMAIL}.`,
    "",
    "Warm regards,",
    "Team EVA Entertainment",
    "Dubbing, Voice-over & Sound Studio",
    "Andheri West, Mumbai",
    "",
    "--",
    `${APP_BASE_URL}`,
  ].join("\n");

  return { subject, html, text };
}

/* ------------------------------------------------------------------------------------------------
 * Careers: applicant confirmation (modelled on ackEmail). Echoes only escaped name, role title
 * (from a fixed list) and file names. No attachments, no links built from user input.
 * --------------------------------------------------------------------------------------------- */
export type CareersAckInput = { name: string; role: string; resume: string; voices: string[] };

export function careersAckEmail(a: CareersAckInput) {
  const first = ackSafe(a.name.split(/\s+/)[0], 40) || "there";
  const role = ackSafe(a.role, 60);
  const files = [ackSafe(a.resume, 120), ...a.voices.map((v) => ackSafe(v, 120))];
  const subject = `We received your application: ${role}`;
  const mail = `mailto:${ACK_CONTACT_EMAIL}`;
  const summary = [
    { label: "Role applying for", value: role },
    { label: "Resume", value: files[0] },
    { label: "Voice samples", value: files.slice(1).join(", ") },
  ];
  const steps = [
    "Our casting and sound team listens to every voice sample.",
    "If your profile fits a current project we call or email you for a short audition.",
    "We keep your profile on file for future films in your language.",
  ];

  const rows = `<tr><td bgcolor="#FFFFFF" style="background-color:#FFFFFF;padding:30px 28px 6px;">
<h1 style="margin:0 0 18px;font-family:${FONT};font-size:22px;line-height:30px;font-weight:700;color:${B.text};">Thank you for applying, ${escapeHtml(first)}</h1>
${p(`Your application for <strong>${escapeHtml(role)}</strong> has reached EVA Entertainment. We are glad you want to bring your talent to films seen across India and beyond.`)}
</td></tr>
<tr><td bgcolor="#FFFFFF" style="background-color:#FFFFFF;padding:0 28px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${B.line};border-radius:8px;border-collapse:separate;">
${summary
  .map(
    (s, i) => `<tr><td style="padding:12px 14px;${i ? `border-top:1px solid ${B.line};` : ""}font-family:${FONT};font-size:13px;line-height:18px;color:${B.muted};width:38%;vertical-align:top;">${escapeHtml(s.label)}</td><td style="padding:12px 14px;${i ? `border-top:1px solid ${B.line};` : ""}font-family:${FONT};font-size:15px;line-height:21px;color:${B.text};word-break:break-word;">${escapeHtml(s.value)}</td></tr>`,
  )
  .join("\n")}
</table>
</td></tr>
<tr><td bgcolor="#FFFFFF" style="background-color:#FFFFFF;padding:14px 28px 4px;">
<h2 style="margin:0 0 12px;font-family:${FONT};font-size:17px;line-height:24px;font-weight:700;color:${B.text};">What happens next</h2>
${steps
  .map(
    (s, i) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 10px;"><tr><td width="28" valign="top" style="font-family:${FONT};font-size:13px;line-height:22px;font-weight:700;color:#FFFFFF;"><span style="display:inline-block;width:22px;height:22px;border-radius:11px;background-color:#4A7A0C;text-align:center;">${i + 1}</span></td><td style="padding-left:8px;font-family:${FONT};font-size:15px;line-height:22px;color:${B.text};">${escapeHtml(s)}</td></tr></table>`,
  )
  .join("\n")}
</td></tr>
<tr><td bgcolor="#FFFFFF" style="background-color:#FFFFFF;padding:10px 28px 6px;">
${p(`Questions? Reply to this email or write to <a href="${mail}" style="color:${B.text};text-decoration:underline;">${ACK_CONTACT_EMAIL}</a>.`)}
</td></tr>
<tr><td bgcolor="#FFFFFF" align="left" style="background-color:#FFFFFF;padding:0 28px 18px;">
${button("Write to us", mail)}
</td></tr>
<tr><td bgcolor="#FFFFFF" style="background-color:#FFFFFF;padding:8px 28px 28px;">
${p("Warm regards,", "margin-bottom:4px;")}
${p(`<strong>Team EVA Entertainment</strong><br><span style="color:${B.muted};font-size:14px;">Dubbing, Voice-over &amp; Sound Studio<br>Andheri West, Mumbai</span>`, "margin-bottom:0;")}
</td></tr>
`;

  const html = layout({
    title: subject,
    preheader: `Your application for ${role} has reached our team.`,
    rows,
    footer: `You are receiving this one-time confirmation because this address was used on the careers form at`,
  });

  const text = [
    `Dear ${first},`,
    "",
    `Thank you for applying. Your application for ${role} has reached EVA Entertainment.`,
    "",
    ...summary.map((s) => `${s.label}: ${s.value}`),
    "",
    "What happens next",
    ...steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    `Questions? Reply to this email or write to ${ACK_CONTACT_EMAIL}.`,
    "",
    "Warm regards,",
    "Team EVA Entertainment",
    "Andheri West, Mumbai",
    "",
    "--",
    `${APP_BASE_URL}`,
  ].join("\n");

  return { subject, html, text };
}
