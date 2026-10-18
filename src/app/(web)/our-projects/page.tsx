import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import { Routes } from "@@/constants/routes";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";
import { connection } from "next/server";
import { SvgIcon } from "@@/components/common/Icons";
import ProjectsGallery from "@@/components/projects/ProjectsGallery";
import ProjectImpactStrip from "@@/components/projects/ProjectImpactStrip";
import { getPublicProjects } from "@@/lib/projects-public";
import {
  projectAbsolutePosterUrl,
  projectHref,
} from "@@/lib/project-seo";
import { aggregateProjectImpact } from "@@/lib/project-stats";
import {
  PROJECT_LANGUAGES,
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

export default async function ProjectsPage() {
  // Read at request time: projects.json lives on the server and changes from the admin panel.
  await connection();
  const { projects } = await getPublicProjects();
  const impact = aggregateProjectImpact(projects);
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PROJECTS_SEO.title,
    description: PROJECTS_SEO.description,
    url: PROJECTS_PAGE_URL,
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
  };

  return (
    <main className="page-main">
      <JsonLd id="projects-jsonld" data={schema} />
      <PageHero
        svg={<SvgIcon name="film" />}
        title="Our Projects"
        trail={[{ label: "Our Projects", href: Routes.PROJECTS }]}
        className="eva-projects-hero"
      />

      <ProjectImpactStrip stats={impact} className="block block--darkbg eva-impact--projects" />

      <section
        className="block block--darkbg eva-projects"
        aria-label="Project portfolio"
      >
        <div className="container">
          <ProjectsGallery projects={projects} languages={PROJECT_LANGUAGES} />
        </div>
      </section>
    </main>
  );
}
