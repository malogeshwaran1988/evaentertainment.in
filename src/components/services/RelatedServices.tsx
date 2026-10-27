import ServiceCardGrid from "@@/components/services/ServiceCardGrid";
import type { ServiceSlug } from "@@/constants/routes";
import { getService } from "@@/data/services";

/**
 * The page's own related services only (services.ts `related`), as name-only cards.
 * The full 12-card grid with summaries lives on the home page alone, so its copy is not repeated sitewide.
 */
export default function RelatedServices({ current }: { current: ServiceSlug }) {
  const slugs = getService(current)?.related ?? [];
  if (!slugs.length) return null;
  return (
    <section
      className="block block--darkbg eva-related-services eva-related-services--compact"
      aria-labelledby="related-services-title"
    >
      <div className="container">
        <h2 id="related-services-title" className="text-center">
          <i className="icon icon-audio" aria-hidden="true" />Related Services
        </h2>
        <ServiceCardGrid slugs={slugs} summary={false} />
      </div>
    </section>
  );
}
