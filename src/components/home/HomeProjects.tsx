"use client";

import Image from "next/image";
import { useRef } from "react";
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
  const scrollerRef = useRef<HTMLUListElement>(null);

  if (projects.length === 0) return null;

  const shown = projects.slice(0, HOME_PROJECTS_LIMIT);

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.8, 360);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

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
        <div className="eva-home-projects-carousel">
          <button
            type="button"
            className="eva-home-projects-scroll eva-home-projects-scroll--prev"
            aria-label="Scroll projects left"
            onClick={() => scrollBy(-1)}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <ul className="eva-projects-grid eva-home-projects-grid" ref={scrollerRef}>
            {shown.map((project) => (
              <li className="eva-project-card" key={project.id}>
                <div className="eva-project-poster">
                  <YearBadge year={project.year} />
                  {project.poster ? (
                    <Image
                      src={project.poster}
                      alt={projectPosterAlt(project)}
                      fill
                      sizes="(min-width: 992px) 18vw, (min-width: 768px) 30vw, 42vw"
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
          <button
            type="button"
            className="eva-home-projects-scroll eva-home-projects-scroll--next"
            aria-label="Scroll projects right"
            onClick={() => scrollBy(1)}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
        <div className="eva-home-projects-cta">
          <Link className="btn" href={Routes.PROJECTS}>
            See all projects
          </Link>
        </div>
      </div>
    </section>
  );
}
