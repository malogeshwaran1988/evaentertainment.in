import Link from "@@/components/common/NavLink";
import ServiceCardGrid from "@@/components/services/ServiceCardGrid";
import { WHAT_WE_DO_HREF, type ServiceSlug } from "@@/constants/routes";

export default function RelatedServices({ slugs }: { slugs: ServiceSlug[] }) {
  return (
    <section className="block block--darkbg eva-related-services" aria-labelledby="related-services-title">
      <div className="container">
        <h2 id="related-services-title" className="text-center">
          <i className="icon icon-audio" aria-hidden="true" />
          Related Services
        </h2>
        <ServiceCardGrid slugs={slugs} />
        <div className="eva-related-all">
          <Link href={WHAT_WE_DO_HREF} className="eva-related-all-btn">
            <span>View all services</span>
            <svg className="eva-related-all-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
