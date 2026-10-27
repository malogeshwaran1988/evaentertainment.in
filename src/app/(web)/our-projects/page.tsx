import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import { Routes } from "@@/constants/routes";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";
import { connection } from "next/server";
import { SvgIcon } from "@@/components/common/Icons";
import ProjectsGallery from "@@/components/projects/ProjectsGallery";
import LanguageHubLinks from "@@/components/projects/LanguageHubLinks";
import Link from "@@/components/common/NavLink";
import { serviceHref } from "@@/constants/routes";
import { languagePairs, pairsWithProjects } from "@@/lib/project-links";
import { getProjects } from "@@/lib/projects-store";
import { projectIsPublished } from "@@/data/projects";
import ProjectImpactStrip, { IMPACT_STRIP_ENABLED } from "@@/components/projects/ProjectImpactStrip";
import { getPublicProjects } from "@@/lib/projects-public";
import {
  projectAbsolutePosterUrl,
  projectHref,
} from "@@/lib/project-seo";
import { aggregateProjectImpact } from "@@/lib/project-stats";
import {
  PROJECT_YEAR_ONGOING,
  PROJECTS_OG_IMAGE,
  PROJECTS_OG_IMAGE_ALT,
  PROJECTS_PAGE_URL,
  PROJECTS_SEO,
} from "@@/data/projects";

export const metadata = buildPageMetadata({
  ...PROJECTS_SEO,
  url: PROJECTS_PAGE_URL,
  ogImage: PROJECTS_OG_IMAGE,
  ogImageAlt: PROJECTS_OG_IMAGE_ALT,
});

/** Languages by published project count (desc), ties alphabetical. */
function rankLanguages(projects: { from: string }[]) {
  const counts = new Map<string, number>();
  for (const p of projects) if (p.from) counts.set(p.from, (counts.get(p.from) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([language, count]) => ({ language, count }));
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Read at request time: projects.json lives on the server and changes from the admin panel.
  await connection();
  // Same cached reader as before (unstable_cache), so no extra Blob reads per request.
  const { projects: allProjects } = await getPublicProjects();
  const impact = aggregateProjectImpact(allProjects);
  const pairs = pairsWithProjects(
    languagePairs((await getProjects()).filter(projectIsPublished)),
  );

  // Only the selected language tab is rendered and serialised; other tabs load on click.
  const ranked = rankLanguages(allProjects);
  const top = ranked[0]?.language;
  const raw = (await searchParams).language;
  const requested = (Array.isArray(raw) ? raw[0] : raw)?.trim();
  const selected = ranked.find((r) => r.language === requested)?.language ?? top ?? "";
  const projects = allProjects.filter((p) => p.from === selected);
  const tabs = ranked.map((r) => ({
    ...r,
    href: r.language === top ? Routes.PROJECTS : `${Routes.PROJECTS}?language=${encodeURIComponent(r.language)}`,
  }));
  const otherLinks = allProjects
    .filter((p) => p.from !== selected)
    .map((p) => ({ id: p.id, href: projectHref(p.slug), title: p.title }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PROJECTS_SEO.title,
    description: PROJECTS_SEO.description,
    url: PROJECTS_PAGE_URL,
    ...(projects.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: projects.map((project, index) => {
              const poster = projectAbsolutePosterUrl(project.poster);
              return {
                "@type": "ListItem",
                position: index + 1,
                url: absoluteUrl(projectHref(project.slug)),
                item: {
                  "@type": "Movie",
                  name: project.title,
                  url: absoluteUrl(projectHref(project.slug)),
                  ...(poster ? { image: poster } : {}),
                  ...(project.year && project.year !== PROJECT_YEAR_ONGOING
                    ? { dateCreated: project.year }
                    : {}),
                },
              };
            }),
          },
        }
      : {}),
  };

  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <JsonLd id="projects-jsonld" data={schema} />
      <PageHero
        svg={<SvgIcon name="film" />}
        title="Our Projects"
        trail={[{ label: "Our Projects", href: Routes.PROJECTS }]}
        className="eva-projects-hero"
      />

      {IMPACT_STRIP_ENABLED ? (
        <ProjectImpactStrip
          stats={impact}
          className="block block--darkbg eva-impact--projects"
          showCta={false}
        />
      ) : null}

      <section
        className="block block--darkbg eva-projects"
        aria-label="Project portfolio"
      >
        <div className="container">
          <div className="eva-projects-intro">
            <p className="p--lg">
              These are the films and series our team has dubbed at our studio in Andheri West, Mumbai.
              Most are South Indian films dubbed into Hindi with lip-sync dialogue adaptation, Hindi
              voice casting and a final mix ready for OTT, TV or theatrical release.
            </p>
            <p>
              Each project page lists the language pair and release year. To see how we handle a
              language, open its hub below or read about our{" "}
              <Link className="link-on-dark" href={serviceHref("dubbing-studio")}>lip-sync dubbing studio</Link> and{" "}
              <Link className="link-on-dark" href={serviceHref("regional-film-dubbing")}>regional film dubbing</Link>.
            </p>
            <LanguageHubLinks pairs={pairs} heading="Projects by language pair" id="projects-hubs" />
          </div>
          <ProjectsGallery projects={projects} tabs={tabs} selected={selected} otherLinks={otherLinks} />
        </div>
      </section>
    </main>
  );
}
