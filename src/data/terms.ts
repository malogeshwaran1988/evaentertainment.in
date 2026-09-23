import { APP_BASE_URL, CONTACT, DEFAULT_OG_IMAGE, SITE_NAME } from "@@/constants/constants";
import type { LegalSection } from "@@/data/legal";

export const TERMS_PAGE_URL = `${APP_BASE_URL}/terms`;
export const TERMS_OG_IMAGE = DEFAULT_OG_IMAGE;

export const TERMS_SEO = {
  title: `Terms of Service | ${SITE_NAME} Mumbai`,
  description:
    "Terms of Service for EVA Entertainment Recording Studio — bookings, studio use, IP, confidentiality, and governing law for clients in India and international projects.",
};

const address = CONTACT.addressLines.join(" ");

export const TERMS_CONTENT = {
  pageTitle: "Terms of Service",
  effectiveDate: "23 September 2026",
  lastUpdated: "23 September 2026",
  intro:
    "These Terms of Service (“Terms”) govern your access to evaentertainment.in and your engagement of EVA Entertainment (“EVA”, “we”, “us”, or “our”) for recording studio facilities, lip-sync dubbing, voice-over, Foley, subtitling, multimedia localization, and related post-production services. By using our website, submitting a booking or enquiry, or confirming a project with us, you agree to these Terms.",
  sections: [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      blocks: [
        {
          type: "p",
          text: `If you accept these Terms on behalf of a company or production entity, you represent that you have authority to bind that entity. If you do not agree, do not use our website or services. Project-specific quotations, rate cards, statements of work, and non-disclosure agreements may supplement these Terms; in case of conflict on a commercial or delivery point, the signed project document generally prevails for that engagement.`,
        },
      ],
    },
    {
      id: "services",
      title: "2. Our Services",
      blocks: [
        {
          type: "p",
          text: "EVA Entertainment operates a professional recording and post-production studio in Mumbai, India, and provides services that may include, without limitation:",
        },
        {
          type: "ul",
          items: [
            "Studio and booth hire for recording sessions.",
            "Lip-sync dubbing and dialogue replacement.",
            "Voice-over recording and direction.",
            "Foley recording and sound design support.",
            "Subtitling and multimedia localization in international languages.",
            "Related engineering, coordination, and post-production workflows as agreed.",
          ],
        },
        {
          type: "p",
          text: "Service descriptions on our website are for general information. The scope, languages, deliverable formats, timelines, and fees for any engagement are defined in our written quotation or confirmation.",
        },
      ],
    },
    {
      id: "bookings",
      title: "3. Bookings, Cancellations, and Studio Use",
      blocks: [
        {
          type: "h3",
          text: "3.1 Booking requests",
        },
        {
          type: "p",
          text: "Website booking and contact forms are requests, not confirmed reservations, until we confirm availability and commercial terms in writing (email or agreed channel). We may decline or reschedule bookings based on capacity, technical suitability, or client history.",
        },
        {
          type: "h3",
          text: "3.2 Cancellations and no-shows",
        },
        {
          type: "p",
          text: "Unless a project agreement states otherwise: cancellations or major reductions with less than 48 hours’ notice before a confirmed session may incur a cancellation fee up to the booked session value; no-shows may be charged in full. International clients booking across time zones are responsible for confirming the session time in India Standard Time (IST).",
        },
        {
          type: "h3",
          text: "3.3 Overtime and facility rules",
        },
        {
          type: "p",
          text: "Sessions running beyond the booked window may be charged at overtime rates subject to studio availability. Clients and their guests must follow studio safety, equipment, and conduct rules. We may refuse entry or end a session if behaviour risks personnel, equipment, or other clients’ confidentiality.",
        },
      ],
    },
    {
      id: "client-materials",
      title: "4. Client Materials and Warranties",
      blocks: [
        {
          type: "p",
          text: "You are solely responsible for all scripts, video, audio, music, graphics, talent information, and other materials you supply (“Client Materials”). You represent and warrant that:",
        },
        {
          type: "ul",
          items: [
            "You own or have obtained all rights, licences, and clearances needed for us to use Client Materials to perform the services.",
            "Client Materials do not infringe copyright, trademark, privacy, publicity, or other rights of any third party.",
            "Where personal data of talent or others is included, you have a lawful basis to share it with us under applicable privacy laws (including Indian DPDP requirements and any foreign laws that apply to you).",
            "Content does not violate Indian law or applicable export, sanctions, or content regulations relevant to the project.",
          ],
        },
        {
          type: "p",
          text: "We may pause or decline work if we reasonably believe materials are unlawful, incomplete, or insufficiently cleared.",
        },
      ],
    },
    {
      id: "deliverables",
      title: "5. Deliverables, Revisions, and Approval",
      blocks: [
        {
          type: "p",
          text: "Deliverable formats, languages, and review rounds are as specified in the quotation. Additional revision rounds, versioning, or format changes beyond the agreed scope may be charged separately. Your written approval (including email) of a deliverable constitutes acceptance. If you do not provide timely feedback within the agreed review window, we may treat the last delivered version as accepted for scheduling and invoicing purposes.",
        },
      ],
    },
    {
      id: "ip",
      title: "6. Intellectual Property",
      blocks: [
        {
          type: "h3",
          text: "6.1 Client ownership of approved deliverables",
        },
        {
          type: "p",
          text: "Subject to full payment of all fees due and any third-party or talent restrictions disclosed in writing, and except as otherwise agreed: upon acceptance and payment, you own the rights in the final approved deliverables created specifically for your project (the “Client Deliverables”), excluding items in Section 6.2.",
        },
        {
          type: "h3",
          text: "6.2 EVA and third-party retained rights",
        },
        {
          type: "p",
          text: "EVA retains all rights in its pre-existing tools, workflows, templates, software configurations, house libraries, stock or library assets not expressly licensed to you, know-how, and methodologies. Third-party plugins, sample libraries, music, or stock assets remain subject to their own licences; any pass-through licence terms will be communicated where they apply. Unless separately licensed in writing, Client Deliverables do not include an unlimited right to our unpublished outtakes, alternate takes, or session archives beyond what is contractually delivered.",
        },
        {
          type: "h3",
          text: "6.3 Website and brand",
        },
        {
          type: "p",
          text: `The ${SITE_NAME} name, logo, website design, and marketing content are protected by applicable intellectual property laws. You may not copy or reuse them without prior written permission.`,
        },
      ],
    },
    {
      id: "talent",
      title: "7. Talent, Voice Artists, and Clearances",
      blocks: [
        {
          type: "p",
          text: "Where we engage voice artists, directors, writers, or other freelancers for your project, engagement terms (fees, buyouts, usage territory, media, and term) must be agreed in writing. Unless a buyout or usage licence is expressly included in the quotation, standard session fees may not cover unlimited worldwide or perpetual use. Clients who supply their own talent remain responsible for those talent agreements and payments.",
        },
      ],
    },
    {
      id: "confidentiality",
      title: "8. Confidentiality and Session Security",
      blocks: [
        {
          type: "p",
          text: "We treat Client Materials and unreleased projects as confidential and limit access to personnel and contractors with a need to know, consistent with professional studio practice used across the international sound industry. You agree not to disclose our non-public pricing, security arrangements, or other clients’ presence or materials observed at the facility. Mutual NDAs may be signed for high-sensitivity titles. You must not attempt unauthorised recording, photography, or network access inside the studio without our prior written consent.",
        },
      ],
    },
    {
      id: "fees",
      title: "9. Fees, Taxes, and Payment",
      blocks: [
        {
          type: "p",
          text: "Fees are as quoted in writing. Quotes are typically valid for the period stated (or 30 days if unspecified). Indian clients may be charged GST and other applicable taxes as required by law. International clients are responsible for bank transfer charges, withholding taxes, and any local taxes in their jurisdiction unless otherwise agreed. Payment schedules (including advances before sessions or delivery) will be stated in the quotation. Late payments may attract reasonable interest and suspension of further work or delivery until amounts are cleared.",
        },
      ],
    },
    {
      id: "acceptable-use",
      title: "10. Acceptable Use of Website and Facilities",
      blocks: [
        {
          type: "p",
          text: "You agree not to misuse our website or facilities, including by attempting to disrupt systems, scrape content at scale without permission, submit malware or abusive content, impersonate others, or use our services for unlawful, defamatory, or infringing productions. We may suspend access or refuse service for violations.",
        },
      ],
    },
    {
      id: "liability",
      title: "11. Limitation of Liability",
      blocks: [
        {
          type: "p",
          text: "To the maximum extent permitted by applicable Indian law: (a) our total aggregate liability arising out of or relating to any engagement is limited to the fees actually paid to us for the specific services giving rise to the claim in the three (3) months preceding the claim; (b) we are not liable for indirect, incidental, special, consequential, punitive, or lost-profit damages, including delays caused by force majeure, third-party talent unavailability, client-side approval delays, or failures of third-party platforms; and (c) nothing in these Terms excludes liability that cannot be limited under Indian law (including for fraud or wilful misconduct where such exclusion is prohibited).",
        },
      ],
    },
    {
      id: "indemnity",
      title: "12. Indemnity",
      blocks: [
        {
          type: "p",
          text: "You agree to indemnify and hold harmless EVA Entertainment and its personnel from claims, losses, and expenses (including reasonable legal fees) arising from Client Materials, your breach of these Terms or of third-party rights, or your misuse of Client Deliverables beyond licensed usage.",
        },
      ],
    },
    {
      id: "force-majeure",
      title: "13. Force Majeure",
      blocks: [
        {
          type: "p",
          text: "Neither party is liable for failure or delay caused by events beyond reasonable control, including natural disasters, epidemic, war, terrorism, labour disputes, government action, utility or internet failure, or facility damage. We will make reasonable efforts to reschedule affected sessions.",
        },
      ],
    },
    {
      id: "governing-law",
      title: "14. Governing Law and Dispute Resolution",
      blocks: [
        {
          type: "p",
          text: "These Terms and any dispute arising from the website or our services are governed by the laws of India. Subject to any mandatory consumer protections that may apply, courts in Mumbai, Maharashtra, India shall have exclusive jurisdiction. International clients acknowledge that contracting with an India-based studio means Indian law and Mumbai venue apply, unless a signed project agreement expressly states otherwise.",
        },
        {
          type: "p",
          text: "Before formal proceedings, parties should attempt good-faith negotiation. Nothing prevents either party from seeking interim injunctive relief for intellectual property or confidentiality breaches.",
        },
      ],
    },
    {
      id: "privacy",
      title: "15. Privacy",
      blocks: [
        {
          type: "p",
          text: "Personal data is handled as described in our Privacy Policy. By using our website or services, you acknowledge that Policy.",
        },
      ],
    },
    {
      id: "changes",
      title: "16. Changes to These Terms",
      blocks: [
        {
          type: "p",
          text: "We may update these Terms by posting a revised version on this page with an updated “Last updated” date. Continued use of the website or new bookings after changes take effect constitutes acceptance of the revised Terms. Existing signed project agreements remain governed by their own amendment clauses.",
        },
      ],
    },
    {
      id: "contact",
      title: "17. Contact",
      blocks: [
        {
          type: "p",
          text: `Questions about these Terms: ${CONTACT.infoEmail} | Bookings: ${CONTACT.bookingEmail} | WhatsApp: ${CONTACT.whatsappDisplay} | Office: ${CONTACT.landline} | Address: ${address}`,
        },
      ],
    },
  ] as LegalSection[],
  disclaimer:
    "These Terms of Service are a general website and studio engagement framework aligned with common international recording-industry practices and Indian law. They are not a substitute for project-specific contracts or legal advice. Consult qualified counsel for high-value or cross-border productions.",
};
