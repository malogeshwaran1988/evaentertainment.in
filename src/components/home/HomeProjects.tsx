import Image from "next/image";
import Link from "@@/components/common/NavLink";
import { SvgIcon } from "@@/components/common/Icons";
import { PosterPlaceholder, YearBadge } from "@@/components/projects/ProjectPoster";
import { Routes } from "@@/constants/routes";
import {
  POSTER_URL_PREFIX,
  projectLanguageLine,
  type PublicProject,
} from "@@/data/projects";
import { projectPosterAlt } from "@@/lib/project-seo";

export const HOME_PROJECTS_LIMIT = 6;

/** Home strip: ongoing projects first, then the newest by year (order comes from getPublicProjects). */
export default function HomeProjects({ projects }: { projects: PublicProject[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="block block--darkbg eva-home-projects" aria-labelledby="eva-home-projects-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="eva-home-projects-bg"
        src="/images/home/projects-bg.avif"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
      <div className="container">
        <div className="title-wrap text-center">
          <h2 className="h--lg" id="eva-home-projects-title">
            <SvgIcon name="film" />
            Ongoing &amp; Recent Projects
          </h2>
          <p className="p--lg">What we are dubbing now, and titles we have finished recently</p>
        </div>
        <ul className="eva-projects-grid eva-home-projects-grid">
          {projects.slice(0, HOME_PROJECTS_LIMIT).map((project) => (
            <li className="eva-project-card" key={project.id}>
              <div className="eva-project-poster">
                <YearBadge year={project.year} />
                {project.poster ? (
                  <Image
                    src={project.poster}
                    alt={projectPosterAlt(project)}
                    fill
                    sizes="(min-width: 992px) 16vw, (min-width: 768px) 30vw, 42vw"
                    unoptimized={project.poster.startsWith(POSTER_URL_PREFIX)}
                  />
                ) : (
                  <PosterPlaceholder title={project.title} />
                )}
              </div>
              <h3 className="eva-project-title">
                <Link className="eva-project-open" href={Routes.project(project.slug)}>
                  {project.title}
                </Link>
              </h3>
              <p className="eva-project-meta">{projectLanguageLine(project)}</p>
            </li>
          ))}
        </ul>
        <div className="eva-home-projects-cta">
          <Link className="btn" href={Routes.PROJECTS}>
            See all projects
          </Link>
        </div>
      </div>
    </section>
  );
}
