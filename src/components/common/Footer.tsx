import Image from "next/image";
import Link from "next/link";
import { CONTACT, LOGO_ALT, SITE_NAME } from "@@/constants/constants";
import { NAV_ITEMS, Routes } from "@@/constants/routes";
import { SERVICE_BLOCKS } from "@@/data/services";

const FOOTER_LINKS = [
  ...NAV_ITEMS,
  { label: "CONTACT", href: Routes.CONTACT },
] as const;

function serviceHref(block: (typeof SERVICE_BLOCKS)[number]) {
  return block.id ? `${Routes.SERVICES}#${block.id}` : Routes.SERVICES;
}

export default function Footer() {
  const year = new Date().getFullYear();
  const whatsappHref = `https://wa.me/${CONTACT.whatsapp.replace("+", "")}`;
  const landlineTel = CONTACT.landline.replace(/[^\d+]/g, "");

  return (
    <>
      <footer className="footer" aria-label="Site footer">
        <div className="eva-footer-grid">
          <div className="eva-footer-brand">
            <Link href={Routes.HOME} className="eva-footer-logo">
              <Image
                src="/images/common/eva-logo.avif"
                alt={LOGO_ALT}
                width={160}
                height={45}
                sizes="160px"
              />
            </Link>
            <div className="eva-footer-social" aria-label="Social media">
              <a
                href="#"
                className="icon icon-facebook-logo"
                aria-label="Facebook (coming soon)"
              />
              <a
                href="#"
                className="icon icon-twitter-logo"
                aria-label="Twitter (coming soon)"
              />
              <a
                href="#"
                className="icon icon-linkedin-logo"
                aria-label="LinkedIn (coming soon)"
              />
            </div>
          </div>

          <div>
            <p className="eva-footer-title">Links</p>
            <ul className="eva-footer-links">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eva-footer-title">Services</p>
            <ul className="eva-footer-links">
              {SERVICE_BLOCKS.map((block) => (
                <li key={block.title}>
                  <Link href={serviceHref(block)}>{block.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="eva-footer-contact">
            <p className="eva-footer-title">Contact us</p>
            <p className="eva-footer-contact-block">
              <strong>{SITE_NAME}</strong>
              <br />
              {CONTACT.addressLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <p className="eva-footer-contact-block">
              <strong>{CONTACT.person}</strong>
              <br />
              <span className="eva-footer-label">WhatsApp:</span>{" "}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONTACT.whatsappDisplay}
              </a>
              <br />
              <span className="eva-footer-label">Office:</span>{" "}
              <a href={`tel:${landlineTel}`}>{CONTACT.landline}</a>
            </p>
            <p className="eva-footer-contact-block">
              <span className="eva-footer-label">Booking:</span>{" "}
              <a href={`mailto:${CONTACT.bookingEmail}`}>
                {CONTACT.bookingEmail}
              </a>
              <br />
              <span className="eva-footer-label">Info:</span>{" "}
              <a href={`mailto:${CONTACT.infoEmail}`}>{CONTACT.infoEmail}</a>
            </p>
          </div>
        </div>
      </footer>

      <div className="eva-footer-bar">
        <div className="eva-footer-bar-inner">
          <p className="eva-footer-copyright">
            &copy; {year} {SITE_NAME} Recording Studio. All Rights Reserved.
          </p>
          <nav className="eva-footer-legal" aria-label="Legal">
            <Link href={Routes.PRIVACY}>Privacy Policy</Link>
            <Link href={Routes.TERMS}>Terms of Service</Link>
          </nav>
        </div>
      </div>
    </>
  );
}
