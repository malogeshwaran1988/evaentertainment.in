import Link from "@@/components/common/NavLink";
import ServiceCardGrid from "@@/components/services/ServiceCardGrid";
import { Routes, type ServiceSlug } from "@@/constants/routes";

export default function RelatedServices({ slugs }: { slugs: ServiceSlug[] }) {
  return (
    <section className="block block--darkbg eva-related-services" aria-labelledby="related-services-title">
      <div className="container">
        <h2 id="related-services-title" className="text-center">
          <i className="icon icon-audio" aria-hidden="true" />
          Related Services
        </h2>
        <ServiceCardGrid slugs={slugs} />
        <p className="text-center eva-related-all">
          <Link href={Routes.SERVICES} className="all-view">
            <span className="icon icon-sound" aria-hidden="true" />
            View all services
          </Link>
        </p>
      </div>
    </section>
  );
}
