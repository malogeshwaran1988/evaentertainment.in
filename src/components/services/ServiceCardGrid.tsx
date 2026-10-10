import Link from "@@/components/common/NavLink";
import { SvgIcon } from "@@/components/common/Icons";
import { serviceHref, type ServiceSlug } from "@@/constants/routes";
import { getService, type Service } from "@@/data/services";

/** Linked service cards (4-up desktop, 2-up tablet/phone). Must sit on a dark block. */
export default function ServiceCardGrid({
  slugs,
  heading: Heading = "h3",
}: {
  slugs: readonly ServiceSlug[];
  heading?: "h2" | "h3";
}) {
  const services = slugs.map(getService).filter((s): s is Service => Boolean(s));
  return (
    <ul className="eva-wwd-grid">
      {services.map((service) => (
        <li key={service.slug}>
          <Link className="eva-wwd-card" href={serviceHref(service.slug)}>
            <span className="eva-wwd-icon" aria-hidden="true">
              {service.svg ? <SvgIcon name={service.svg} /> : <i className={`icon ${service.icon}`} />}
            </span>
            <Heading className="eva-wwd-title">{service.name}</Heading>
            <p className="eva-wwd-text">{service.summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
