import ServiceCardGrid from "@@/components/services/ServiceCardGrid";
import { SERVICE_SLUGS, type ServiceSlug } from "@@/constants/routes";

/** Every other service (site order), excluding the page's own service. */
export default function RelatedServices({ current }: { current: ServiceSlug }) {
  const slugs = SERVICE_SLUGS.filter((slug) => slug !== current);
  return (
    <section className="block block--darkbg eva-related-services" aria-labelledby="related-services-title">
      <div className="container">
        <h2 id="related-services-title" className="text-center">
          <i className="icon icon-audio" aria-hidden="true" />
          Related Services
        </h2>
        <ServiceCardGrid slugs={slugs} />
      </div>
    </section>
  );
}
