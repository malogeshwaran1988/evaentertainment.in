import Image from "next/image";
import Link from "@@/components/common/NavLink";
import ImageEffects from "@@/components/common/ImageEffects";
import InViewFx from "@@/components/common/InViewFx";
import { inline } from "@@/components/services/RichText";
import { Routes } from "@@/constants/routes";
import type { ServicePageContent } from "@@/data/service-page-types";
import type { Service } from "@@/data/services";
import { imageLoading } from "@@/lib/image-loading";

/** Lead copy beside the page's half-width photo. */
export default function ServiceLead({
  service,
  page,
}: {
  service: Service;
  page: ServicePageContent;
}) {
  return (
    <section
      className="block bottom-null eva-svc-lead"
      aria-labelledby="service-intro-title"
    >
      <div className="container">
        <div className="row row--half">
          <InViewFx className="half-bg-right eva-fx-host eva-fx-lazy">
            <Image
              src={service.image}
              alt={service.alt}
              fill
              {...imageLoading(0)}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="eva-half-bg-img"
            />
            <ImageEffects fx={service.fx} anchor="top-left" />
          </InViewFx>
          <div className="col-sm-6">
            <h2
              id="service-intro-title"
              className="text-uppercase heading-as-h5"
            >
              <span className="theme-color">{page.leadHeading}</span>
            </h2>
            <div className="eva-svc-lead-copy">
              {page.lead.map((p) => (
                <p key={p.slice(0, 48)}>{inline(p)}</p>
              ))}
            </div>
            <div className="eva-service-actions">
              <Link href={Routes.CONTACT} className="btn">
                <span>
                  <i className="icon icon-mail" aria-hidden="true" />
                  {page.cta.label}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicePageCta({ page }: { page: ServicePageContent }) {
  return (
    <section className="block eva-svc-cta" aria-labelledby="service-cta-title">
      <div className="container">
        <div className="eva-svc-cta-box">
          <h2 id="service-cta-title" className="eva-svc-title">
            <i className="icon icon-mail" aria-hidden="true" />{" "}
            {page.cta.heading}
          </h2>
          <p>{page.cta.text}</p>
          <ul className="eva-svc-cta-contact">
            {page.cta.contact.map((c) => (
              <li key={c.label}>
                <strong>{c.label}:</strong>{" "}
                {c.href ? (
                  <a
                    href={c.href}
                    {...(c.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {c.value}
                    {c.href.startsWith("http") ? (
                      <span className="sr-only"> (opens in a new tab)</span>
                    ) : null}
                  </a>
                ) : (
                  c.value
                )}
              </li>
            ))}
          </ul>
          <div className="eva-service-actions">
            <Link href={Routes.CONTACT} className="btn">
              <span>
                <i className="icon icon-mail" aria-hidden="true" />
                {page.cta.label}
              </span>
            </Link>
            {page.cta.secondary ? (
              <Link href={Routes.CONTACT} className="btn btn--border">
                <span>
                  <i className="icon icon-calendar" aria-hidden="true" />
                  {page.cta.secondary}
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
