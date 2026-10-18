import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import Link from "@@/components/common/NavLink";
import { SvgIcon } from "@@/components/common/Icons";
import { PosterPlaceholder } from "@@/components/projects/ProjectPoster";
import ProjectExplore from "@@/components/projects/ProjectExplore";
import { APP_BASE_URL, SITE_NAME } from "@@/constants/constants";
import { Routes } from "@@/constants/routes";
import {
  POSTER_URL_PREFIX,
  PROJECT_YEAR_ONGOING,
  PROJECTS_OG_IMAGE,
  PROJECTS_PAGE_URL,
  type Project,
} from "@@/data/projects";
import { getProjectBySlug, getProjects } from "@@/lib/projects-store";
import {
  EVA_ORG_ID,
  evaOrganizationLd,
  projectAbsolutePosterUrl,
  projectHref,
  projectLanguageChip,
  projectPosterAlt,
  projectSeoDescription,
  projectSeoTitle,
  projectYearChip,
} from "@@/lib/project-seo";
import { formatAudioHours } from "@@/lib/project-stats";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";

/** Allow admin-created slugs after deploy; generateStaticParams still prebuilds known ones. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  await connection();
  const project = await getProjectBySlug((await params).slug);
  if (!project) return {};
  const ogImage = project.poster || PROJECTS_OG_IMAGE;
  return buildPageMetadata({
    title: projectSeoTitle(project),
    description: projectSeoDescription(project),
    url: absoluteUrl(projectHref(project.slug)),
    ogImage,
    ogImageAlt: projectPosterAlt(project),
  });
}

function neighbors(projects: Project[], slug: string) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) return { prev: null, next: null, others: projects };
  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
    others: projects.filter((p) => p.slug !== slug),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const slug = (await params).slug;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug) ?? (await getProjectBySlug(slug));
  if (!project) notFound();

  const { prev, next, others } = neighbors(projects, project.slug);
  const url = absoluteUrl(projectHref(project.slug));
  const posterUrl = projectAbsolutePosterUrl(project.poster);
  const seoAlt = projectPosterAlt(project);
  const workType = project.category === "Movie Dubbing" ? "Movie" : "CreativeWork";
  const yearChip = projectYearChip(project);
  const posterIsUpload = Boolean(project.poster?.startsWith(POSTER_URL_PREFIX));

  const workSchema = {
    "@context": "https://schema.org",
    "@type": workType,
    name: project.title,
    url,
    ...(posterUrl ? { image: posterUrl } : {}),
    ...(project.description ? { description: project.description } : {}),
    ...(project.year && project.year !== PROJECT_YEAR_ONGOING
      ? { dateCreated: project.year }
      : {}),
    inLanguage: project.to,
    productionCompany: { "@id": EVA_ORG_ID },
    contributor: { "@id": EVA_ORG_ID },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${APP_BASE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Our Projects",
        item: PROJECTS_PAGE_URL,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: url,
      },
    ],
  };

  const orgSchema = {
    "@context": "https://schema.org",
    ...evaOrganizationLd(),
  };

  return (
    <main className="page-main">
      <JsonLd id="project-org-jsonld" data={orgSchema} />
      <JsonLd id="project-work-jsonld" data={workSchema} />
      <JsonLd id="project-breadcrumb-jsonld" data={breadcrumbSchema} />
      <PageHero
        svg={<SvgIcon name="film" />}
        title={project.title}
        trail={[
          { label: "Our Projects", href: Routes.PROJECTS },
          { label: project.title, href: Routes.project(project.slug) },
        ]}
        className="eva-projects-hero eva-project-detail-hero"
        schema={false}
        backgroundSrc={project.poster}
        backgroundUnoptimized={posterIsUpload}
      />

      <section className="block block--darkbg eva-project-detail" aria-label={project.title}>
        <div className="container eva-project-detail-inner">
          <div className="row gutter-30 align-items-start">
            <div className="col-md-5">
              <div className="eva-project-detail-poster">
                {project.poster ? (
                  <Image
                    src={project.poster}
                    alt={seoAlt}
                    width={600}
                    height={900}
                    className="eva-project-detail-img"
                    unoptimized={posterIsUpload}
                    loading="eager"
                    fetchPriority="high"
                  />
                ) : (
                  <PosterPlaceholder title={project.title} />
                )}
              </div>
            </div>
            <div className="col-md-7">
              <p className="h--lg eva-project-detail-heading">{project.title}</p>
              <ul className="eva-project-detail-chips" aria-label="Project details">
                <li className="eva-project-detail-chip">{projectLanguageChip(project)}</li>
                <li className="eva-project-detail-chip">{project.category}</li>
                {yearChip ? <li className="eva-project-detail-chip">{yearChip}</li> : null}
                {project.audioHours ? (
                  <li className="eva-project-detail-chip">
                    {formatAudioHours(project.audioHours)} hours dubbed
                  </li>
                ) : null}
              </ul>
              <p className="eva-project-detail-brand">Dubbed by {SITE_NAME}</p>
              {project.description ? (
                <p className="eva-project-detail-desc">{project.description}</p>
              ) : null}
              <div className="eva-project-detail-cta">
                <Link className="btn" href={Routes.CONTACT}>
                  Contact us
                </Link>
                <Link className="btn btn--border" href={Routes.BOOK}>
                  Book a session
                </Link>
              </div>
            </div>
          </div>

          <ProjectExplore
            projects={others.map((p) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              from: p.from,
              to: p.to,
              category: p.category,
              ...(p.poster ? { poster: p.poster } : {}),
              ...(p.posterAlt ? { posterAlt: p.posterAlt } : {}),
              ...(p.year ? { year: p.year } : {}),
            }))}
            prev={prev ? { slug: prev.slug, title: prev.title } : null}
            next={next ? { slug: next.slug, title: next.title } : null}
          />
        </div>
      </section>
    </main>
  );
}
