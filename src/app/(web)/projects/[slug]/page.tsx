import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import Link from "@@/components/common/NavLink";
import { SvgIcon } from "@@/components/common/Icons";
import { PosterPlaceholder } from "@@/components/projects/ProjectPoster";
import { APP_BASE_URL, SITE_NAME } from "@@/constants/constants";
import { Routes } from "@@/constants/routes";
import {
  POSTER_URL_PREFIX,
  PROJECT_YEAR_ONGOING,
  PROJECTS_OG_IMAGE,
  PROJECTS_PAGE_URL,
} from "@@/data/projects";
import { getProjectBySlug, getProjects } from "@@/lib/projects-store";
import {
  EVA_ORG_ID,
  evaOrganizationLd,
  projectAbsolutePosterUrl,
  projectDubbingLine,
  projectHref,
  projectPosterAlt,
  projectSeoDescription,
  projectSeoTitle,
} from "@@/lib/project-seo";
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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const project = await getProjectBySlug((await params).slug);
  if (!project) notFound();

  const url = absoluteUrl(projectHref(project.slug));
  const posterUrl = projectAbsolutePosterUrl(project.poster);
  const seoAlt = projectPosterAlt(project);
  const workType = project.category === "Movie Dubbing" ? "Movie" : "CreativeWork";

  const workSchema = {
    "@context": "https://schema.org",
    "@type": workType,
    name: project.title,
    url,
    ...(posterUrl ? { image: posterUrl } : {}),
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
        className="eva-projects-hero"
      />

      <section className="block block--darkbg eva-project-detail" aria-labelledby="project-detail-title">
        <div className="container">
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
                    unoptimized={project.poster.startsWith(POSTER_URL_PREFIX)}
                    priority
                    fetchPriority="high"
                  />
                ) : (
                  <PosterPlaceholder title={project.title} />
                )}
              </div>
            </div>
            <div className="col-md-7">
              <h1 id="project-detail-title" className="h--lg">
                {project.title}
              </h1>
              <p className="p--lg eva-project-detail-line">{projectDubbingLine(project)}</p>
              <p className="eva-project-detail-brand">
                Dubbed by {SITE_NAME}
              </p>
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
        </div>
      </section>
    </main>
  );
}
