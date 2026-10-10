import Image from "next/image";
import Link from "@@/components/common/NavLink";
import { SvgIcon } from "@@/components/common/Icons";
import { PosterPlaceholder, YearBadge } from "@@/components/projects/ProjectPoster";
import { Routes } from "@@/constants/routes";
import {
  POSTER_URL_PREFIX,
  PROJECT_YEAR_ONGOING,
  projectLanguageLine,
  projectPosterAlt,
  type Project,
} from "@@/data/projects";

const MAX_SHOWN = 6;

/** Home strip: ongoing projects, or the latest ones when nothing is in production. */
export default function HomeProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  const ongoing = projects.filter((p) => p.year === PROJECT_YEAR_ONGOING);
  const shown = (ongoing.length > 0 ? ongoing : projects).slice(0, MAX_SHOWN);
  const heading = ongoing.length > 0 ? "Ongoing Projects" : "Recent Projects";

  return (
    <section className="block block--darkbg eva-home-projects" aria-labelledby="eva-home-projects-title">
      <div className="container">
        <div className="title-wrap text-center">
          <h2 className="h--lg" id="eva-home-projects-title">
            <SvgIcon name="film" />
            {heading}
          </h2>
          <p className="p--lg">
            {ongoing.length > 0
              ? "Titles our team is dubbing right now"
              : "A few of the titles we have dubbed recently"}
          </p>
        </div>
        <ul className="eva-projects-grid eva-home-projects-grid">
          {shown.map((project) => (
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
                <Link className="eva-project-open" href={Routes.PROJECTS}>
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
