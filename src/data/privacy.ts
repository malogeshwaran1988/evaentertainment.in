import { APP_BASE_URL, CONTACT, DEFAULT_OG_IMAGE, SITE_NAME } from "@@/constants/constants";
import type { LegalSection } from "@@/data/legal";

export const PRIVACY_PAGE_URL = `${APP_BASE_URL}/privacy`;
export const PRIVACY_OG_IMAGE = DEFAULT_OG_IMAGE;

export const PRIVACY_SEO = {
  title: `Privacy Policy | ${SITE_NAME} Mumbai`,
  description:
    "Privacy Policy for EVA Entertainment Recording Studio — how we collect, use, store, and protect personal data under Indian DPDP law and international standards for our Mumbai studio and global clients.",
};

const address = CONTACT.addressLines.join(" ");

export const PRIVACY_CONTENT = {
  pageTitle: "Privacy Policy",
  effectiveDate: "23 September 2026",
  lastUpdated: "23 September 2026",
  intro:
    "EVA Entertainment (“EVA”, “we”, “us”, or “our”) operates a professional recording, dubbing, voice-over, Foley, subtitling, and multimedia localization studio in Mumbai, India, and works with clients in India and internationally. This Privacy Policy explains how we collect, use, disclose, retain, and protect personal data when you visit evaentertainment.in, contact us, book studio time, or engage us for production services.",
  sections: [
    {
      id: "who-we-are",
      title: "1. Who We Are",
      blocks: [
        {
          type: "p",
          text: `${SITE_NAME} is a recording and post-production studio based at ${address} Contact person: ${CONTACT.person}. Enquiries: ${CONTACT.infoEmail}. Bookings: ${CONTACT.bookingEmail}. WhatsApp: ${CONTACT.whatsappDisplay}. Office: ${CONTACT.landline}.`,
        },
        {
          type: "p",
          text: "For the purposes of the Digital Personal Data Protection Act, 2023 (“DPDP Act”) and related Indian rules, EVA Entertainment is the Data Fiduciary in respect of personal data processed in connection with this website and our studio services. Where we process personal data on behalf of a client under a production agreement, we may act as a Data Processor (or equivalent) for that engagement, as set out in the relevant contract.",
        },
      ],
    },
    {
      id: "scope",
      title: "2. Scope and Applicability",
      blocks: [
        {
          type: "p",
          text: "This Policy applies to personal data of website visitors, prospective and current clients, talent and freelancers who contact us through our channels, and other individuals who interact with us in India or from other countries in connection with our services. International clients should note that our primary place of establishment and processing is India; cross-border coordination for global projects is described in Section 8.",
        },
        {
          type: "p",
          text: "This Policy does not cover third-party websites, payment gateways, messaging platforms (for example WhatsApp), or social networks that you may use to reach us; those services are governed by their own privacy terms.",
        },
      ],
    },
    {
      id: "data-we-collect",
      title: "3. Personal Data We Collect",
      blocks: [
        {
          type: "h3",
          text: "3.1 Information you provide",
        },
        {
          type: "p",
          text: "When you use our contact form, booking form, email, phone, or WhatsApp, we may collect:",
        },
        {
          type: "ul",
          items: [
            "Identity and contact details: name, email address, phone number, and postal or city address where provided.",
            "Project and booking details: service type, preferred studio hours, preferred date, messages, and other information you include in an enquiry.",
            "Business details: company or production name, role, and project references you choose to share.",
            "Communications content: correspondence relating to quotes, sessions, deliverables, and support.",
          ],
        },
        {
          type: "h3",
          text: "3.2 Information collected automatically",
        },
        {
          type: "p",
          text: "When you visit our website, our hosting and server infrastructure may automatically collect limited technical data such as IP address, browser type, device information, referring URL, pages viewed, and timestamps. We use this information for security, diagnostics, and to keep the site reliable. We do not currently operate third-party advertising or analytics cookies on this site beyond what is required for basic website operation.",
        },
        {
          type: "h3",
          text: "3.3 Session and production materials",
        },
        {
          type: "p",
          text: "In the course of studio work we may receive or create audio, video, scripts, talent names, and related production files. Where those materials contain personal data, we process them only as needed to deliver the contracted services, subject to confidentiality and our Terms of Service.",
        },
      ],
    },
    {
      id: "purposes",
      title: "4. Purposes of Processing",
      blocks: [
        {
          type: "p",
          text: "We process personal data for the following purposes:",
        },
        {
          type: "ul",
          items: [
            "Responding to enquiries and providing quotes.",
            "Scheduling, confirming, and managing studio bookings and production sessions.",
            "Delivering recording, dubbing, voice-over, Foley, subtitling, localization, and related post-production services.",
            "Communicating about projects, invoices, approvals, and after-sales support.",
            "Maintaining the security and integrity of our website, facilities, and systems.",
            "Complying with applicable Indian laws, tax, accounting, and regulatory obligations.",
            "Improving our services and website experience based on aggregated or non-identifying insights where feasible.",
          ],
        },
      ],
    },
    {
      id: "legal-basis",
      title: "5. Legal Basis (India — DPDP Act)",
      blocks: [
        {
          type: "p",
          text: "Under the DPDP Act, we process personal data based on:",
        },
        {
          type: "ul",
          items: [
            "Consent: where you submit forms or otherwise agree to our contacting you for marketing or optional communications.",
            "Legitimate uses permitted by law: including processing necessary for employment-related purposes where applicable, medical emergencies, employment of certain functions as notified, and fulfilment of any obligation under law.",
            "Contractual necessity: processing needed to take steps at your request before entering into a contract, and to perform studio and production agreements with you or your organisation.",
          ],
        },
        {
          type: "p",
          text: "Where international privacy frameworks (such as GDPR-style principles for EU/UK clients, or similar standards elsewhere) are relevant to a client relationship, we apply comparable safeguards: purpose limitation, data minimisation, transparency, security, and respect for individual rights, to the extent compatible with Indian law and our contracts.",
        },
      ],
    },
    {
      id: "cookies",
      title: "6. Cookies and Similar Technologies",
      blocks: [
        {
          type: "p",
          text: "Our website may use essential cookies or similar storage needed for security, session continuity, and basic site function. We do not sell personal data and do not use advertising trackers as part of our standard site configuration. If we introduce optional analytics or marketing cookies in the future, we will update this Policy and, where required, seek appropriate consent.",
        },
      ],
    },
    {
      id: "sharing",
      title: "7. How We Share Personal Data",
      blocks: [
        {
          type: "p",
          text: "We do not sell personal data. We may share personal data only as needed with:",
        },
        {
          type: "ul",
          items: [
            "Service providers who support hosting, email delivery, IT, accounting, or similar operations under confidentiality obligations.",
            "Freelance talent, engineers, directors, or production partners engaged for your project, limited to what is necessary for delivery.",
            "Professional advisers (legal, accounting) where required.",
            "Government authorities, courts, or law enforcement when required by applicable law or to protect our rights, users, or the public.",
            "A successor entity in the event of a merger, acquisition, or restructuring, subject to appropriate safeguards.",
          ],
        },
      ],
    },
    {
      id: "international",
      title: "8. International Clients and Cross-Border Transfers",
      blocks: [
        {
          type: "p",
          text: "EVA Entertainment is based in India and regularly collaborates on international projects. Personal data may be accessed or stored in India and, where a project requires it, shared with authorised collaborators or cloud tools in other countries for production coordination.",
        },
        {
          type: "p",
          text: "When transferring personal data outside India, we take reasonable steps consistent with the DPDP Act and any applicable government notifications or restrictions, including contractual confidentiality, access controls, and limiting transfers to what is necessary for the engagement. International clients are responsible for ensuring they have lawful grounds to provide us with personal data of their personnel, talent, or end users.",
        },
      ],
    },
    {
      id: "retention",
      title: "9. Retention",
      blocks: [
        {
          type: "p",
          text: "We retain personal data only for as long as needed for the purposes described above, including the duration of a project relationship, statutory retention for tax and accounting records in India, and a reasonable period thereafter for dispute resolution or legitimate business records. Booking and enquiry records are typically retained for a limited operational period unless a longer retention is required by law or ongoing work. Production archives are retained as agreed in project contracts or studio policy.",
        },
      ],
    },
    {
      id: "security",
      title: "10. Security",
      blocks: [
        {
          type: "p",
          text: "We implement reasonable organisational and technical measures appropriate to a professional recording and post-production environment, including restricted facility and system access, need-to-know handling of client materials, and secure communication practices. No method of transmission or storage is completely secure; we encourage clients to use agreed secure transfer methods for sensitive masters and personal data.",
        },
      ],
    },
    {
      id: "rights",
      title: "11. Your Rights Under the DPDP Act",
      blocks: [
        {
          type: "p",
          text: "Subject to conditions and exceptions under the DPDP Act and applicable rules, you may have the right to:",
        },
        {
          type: "ul",
          items: [
            "Request a summary of personal data being processed about you and the processing activities.",
            "Seek correction, completion, updating, or erasure of your personal data.",
            "Withdraw consent where processing is based on consent (without affecting lawfulness of prior processing).",
            "Nominate another individual to exercise rights in the event of death or incapacity, where applicable.",
            "Have a readily available means of grievance redressal regarding our processing.",
          ],
        },
        {
          type: "p",
          text: "To exercise these rights, contact us using the details in Section 14. We may need to verify your identity before responding. If you are unsatisfied with our response, you may escalate as provided under the DPDP Act and related regulations once the relevant redressal mechanisms are operational.",
        },
      ],
    },
    {
      id: "children",
      title: "12. Children’s Data",
      blocks: [
        {
          type: "p",
          text: "Our website and studio booking services are directed at adults and business clients. We do not knowingly collect personal data from children online without verifiable consent of a parent or lawful guardian as required by applicable law. Where a production involves a minor (for example child voice talent), the client or guardian must ensure all required consents and clearances are in place before providing personal data or materials to us.",
        },
      ],
    },
    {
      id: "changes",
      title: "13. Changes to This Policy",
      blocks: [
        {
          type: "p",
          text: "We may update this Privacy Policy from time to time to reflect legal, technical, or business changes. The “Last updated” date at the top of this page will be revised when changes are posted. Continued use of our website or services after an update constitutes notice of the revised Policy, except where consent is required by law for a material change.",
        },
      ],
    },
    {
      id: "contact",
      title: "14. Contact and Grievance Redressal",
      blocks: [
        {
          type: "p",
          text: `For privacy requests, questions, or grievances, please contact:`,
        },
        {
          type: "ul",
          items: [
            `Grievance / privacy contact: ${CONTACT.person}`,
            `Email: ${CONTACT.infoEmail} (and ${CONTACT.bookingEmail} for booking-related matters)`,
            `WhatsApp: ${CONTACT.whatsappDisplay}`,
            `Office: ${CONTACT.landline}`,
            `Postal address: ${address}`,
          ],
        },
        {
          type: "p",
          text: "We aim to acknowledge and address privacy grievances within a reasonable period consistent with applicable Indian law.",
        },
      ],
    },
  ] as LegalSection[],
  disclaimer:
    "This Privacy Policy is provided for transparency regarding EVA Entertainment’s website and studio practices. It is not legal advice. For matters requiring formal counsel, please consult a qualified lawyer in the relevant jurisdiction.",
};
