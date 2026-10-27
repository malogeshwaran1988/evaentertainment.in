import { connection } from "next/server";
import JsonLd from "@@/components/common/JsonLd";
import HeroSlider from "@@/components/home/HeroSlider";
import HomeProjects from "@@/components/home/HomeProjects";
import ServicesGrid from "@@/components/home/ServicesGrid";
import ProjectImpactStrip, { IMPACT_STRIP_ENABLED } from "@@/components/projects/ProjectImpactStrip";
import ServiceCardGrid from "@@/components/services/ServiceCardGrid";
import ServiceFaq from "@@/components/services/ServiceFaq";
import { ServicePageCta } from "@@/components/services/ServiceLead";
import ServiceSections from "@@/components/services/ServiceSections";
import { plain } from "@@/components/services/RichText";
import { HOME_CTA, HOME_FAQS, HOME_SECTIONS } from "@@/data/home-story";
import { APP_BASE_URL, CONTACT, POSTAL_ADDRESS, SITE_NAME, SOCIAL_LINKS } from "@@/constants/constants";
import {
  HOME_INTRO,
  HOME_PAGE_URL,
  HOME_PROJECTS_LIMIT,
  HOME_SEO,
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
    areaServed: ["India", "United States", "United Kingdom", "United Arab Emirates"].map((name) => ({ "@type": "Country", name })),
    knowsLanguage: ["en", "hi", "bn", "mr", "te", "ta", "gu", "ur", "kn", "or", "ml"],
  };
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: HOME_SEO.title,
    description: HOME_SEO.description,
    url: HOME_PAGE_URL,
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
    })),
  };

  return (
    <main id="main-content" tabIndex={-1} className="page-main home-page">
      <JsonLd id="home-webpage-jsonld" data={webPageSchema} />
      <JsonLd id="home-localbusiness-jsonld" data={orgSchema} />
      <JsonLd id="home-faq-jsonld" data={faqSchema} />
      <HeroSlider />
      {IMPACT_STRIP_ENABLED ? (
        <ProjectImpactStrip stats={impact} className="block block--darkbg" />
      ) : null}
      <HomeProjects projects={projects} />
      <div className="eva-svc-page eva-home-story">
        <ServiceSections sections={HOME_SECTIONS} />
      </div>

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
          <ServicesGrid />
        </div>
      </section>
      <div className="eva-svc-page eva-home-story">
        <ServicePageCta page={HOME_CTA} />
        <ServiceFaq faqs={HOME_FAQS} />
      </div>
    </main>
  );
}
