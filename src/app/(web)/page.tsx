import type { CSSProperties } from "react";
import { connection } from "next/server";
import Link from "@@/components/common/NavLink";
import InViewFx from "@@/components/common/InViewFx";
import JsonLd from "@@/components/common/JsonLd";
import HeroSlider from "@@/components/home/HeroSlider";
import HomeProjects from "@@/components/home/HomeProjects";
import ProjectImpactStrip, { IMPACT_STRIP_ENABLED } from "@@/components/projects/ProjectImpactStrip";
import ServiceCardGrid from "@@/components/services/ServiceCardGrid";
import { APP_BASE_URL, CONTACT, POSTAL_ADDRESS, SITE_NAME, SOCIAL_LINKS } from "@@/constants/constants";
import {
  HOME_INTRO,
  HOME_PAGE_URL,
  HOME_PROJECTS_LIMIT,
  SERVICE_CARDS,
  WHAT_WE_DO,
} from "@@/data/home";
import { getPublicProjects } from "@@/lib/projects-public";
import { getProjects } from "@@/lib/projects-store";
import { PROJECT_YEAR_ONGOING, projectIsPublished, type Project } from "@@/data/projects";

/** Home slider order: ongoing first, then year newest to oldest, ties by most recently updated. */
function compareHome(a: Project, b: Project) {
  const rank = (p: Project) =>
    p.year === PROJECT_YEAR_ONGOING ? Infinity : p.year && !Number.isNaN(Number(p.year)) ? Number(p.year) : -Infinity;
  const ra = rank(a);
  const rb = rank(b);
  if (ra !== rb) return rb > ra ? 1 : -1;
  return (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "");
}
import { aggregateProjectImpact } from "@@/lib/project-stats";

const EQ_BARS = Array.from({ length: 16 }, (_, i) => i);

export default async function HomePage() {
  // Read at request time: projects change from the admin panel without a redeploy.
  await connection();
  const { projects: allProjects } = await getPublicProjects();
  // Same cached reader (no extra Blob reads); only these 10 are serialised to the client.
  const homeIds = (await getProjects())
    .filter(projectIsPublished)
    .sort(compareHome)
    .slice(0, HOME_PROJECTS_LIMIT)
    .map((p) => p.id);
  const byId = new Map(allProjects.map((p) => [p.id, p]));
  const projects = homeIds.flatMap((id) => byId.get(id) ?? []);
  const impact = aggregateProjectImpact(allProjects);
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url: HOME_PAGE_URL,
    image: `${APP_BASE_URL}/images/common/eva-logo.avif`,
    telephone: CONTACT.whatsappDisplay,
    email: CONTACT.infoEmail,
    address: POSTAL_ADDRESS,
    sameAs: SOCIAL_LINKS.map((s) => s.href),
  };

  return (
    <main id="main-content" tabIndex={-1} className="page-main home-page">
      <JsonLd id="home-localbusiness-jsonld" data={orgSchema} />
      <HeroSlider />
      {IMPACT_STRIP_ENABLED ? (
        <ProjectImpactStrip stats={impact} className="block block--darkbg" />
      ) : null}
      <HomeProjects projects={projects} />

      <section
        id="what-we-do"
        className="block block--darkbg block--fullbg block--bgcover inset-125 block-bg-1 eva-what-we-do"
      >
        <div className="container">
          <h2 className="h--lg text-center">
            <i className="icon icon-mic" aria-hidden="true" />
            What We Do?
          </h2>
          <div className="text-center">
            <p className="p--lg eva-wwd-intro">
              {HOME_INTRO}
            </p>
          </div>
          <ServiceCardGrid slugs={WHAT_WE_DO} />
        </div>
      </section>

      <section className="block block--full no-pad-gutter">
        <div className="container title-wrap text-center">
          <h2 className="h--lg">
            <i className="icon icon-travel" aria-hidden="true" />
            Our Services
          </h2>
          <p className="p--lg">
            At EVA Entertainment specialize in the following services and can
            accommodate
            <br />
            your every video/audio requirement
          </p>
        </div>
        <div className="container container--bleed">
          <div className="row gutter-15 services-grid">
            {[0, 1, 2].map((col) => (
              <div className="col-sm-4" key={col}>
                {SERVICE_CARDS.slice(col * 2, col * 2 + 2).map((card) => (
                  <Link
                    key={card.title + card.image}
                    className="service-item"
                    href={card.href}
                  >
                    <InViewFx className="service-item-photo eva-fx-lazy">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.image}
                        alt={card.alt}
                        loading="lazy"
                        fetchPriority="low"
                        decoding="async"
                      />
                      <span className="eva-eq" aria-hidden="true">
                        {EQ_BARS.map((i) => (
                          <span key={i} style={{ "--i": i } as CSSProperties} />
                        ))}
                      </span>
                    </InViewFx>
                    <div className="service-item-caption">
                      <div className="clearfix">
                        <span className="service-item-price">{card.eyebrow}</span>
                        <span className="service-item-title h-gradient">
                          <span>{card.title}</span>
                        </span>
                      </div>
                      {card.description ? (
                        <div className="service-item-description">
                          <span>{card.description}</span>
                        </div>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
