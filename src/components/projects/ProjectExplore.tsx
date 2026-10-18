"use client";

import Image from "next/image";
import { useRef } from "react";
import Link from "@@/components/common/NavLink";
import { PosterPlaceholder } from "@@/components/projects/ProjectPoster";
import { Routes } from "@@/constants/routes";
import { POSTER_URL_PREFIX, type PublicProject } from "@@/data/projects";
import { projectPosterAlt } from "@@/lib/project-seo";

export type ProjectNavNeighbor = Pick<PublicProject, "slug" | "title">;

type ProjectExploreProps = {
  projects: PublicProject[];
  prev: ProjectNavNeighbor | null;
  next: ProjectNavNeighbor | null;
};

export default function ProjectExplore({ projects, prev, next }: ProjectExploreProps) {
  const scrollerRef = useRef<HTMLUListElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.75, 320);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="eva-project-explore" aria-labelledby="eva-project-explore-title">
      <div className="eva-project-explore-nav" aria-label="Adjacent projects">
        {prev ? (
          <Link
            className="eva-project-explore-adj eva-project-explore-adj--prev"
            href={Routes.project(prev.slug)}
          >
            <span aria-hidden="true">‹</span>
            <span className="eva-project-explore-adj-label">
              Previous
              <span className="eva-project-explore-adj-title">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span className="eva-project-explore-adj eva-project-explore-adj--disabled" aria-disabled="true">
            <span aria-hidden="true">‹</span>
            <span className="eva-project-explore-adj-label">Previous</span>
          </span>
        )}
        {next ? (
          <Link
            className="eva-project-explore-adj eva-project-explore-adj--next"
            href={Routes.project(next.slug)}
          >
            <span className="eva-project-explore-adj-label">
              Next
              <span className="eva-project-explore-adj-title">{next.title}</span>
            </span>
            <span aria-hidden="true">›</span>
          </Link>
        ) : (
          <span className="eva-project-explore-adj eva-project-explore-adj--disabled" aria-disabled="true">
            <span className="eva-project-explore-adj-label">Next</span>
            <span aria-hidden="true">›</span>
          </span>
        )}
      </div>

      {projects.length > 0 ? (
        <>
          <div className="eva-project-explore-head">
            <h2 id="eva-project-explore-title" className="eva-project-explore-title">
              Explore more projects
            </h2>
            <Link className="eva-project-explore-all" href={Routes.PROJECTS}>
              View all projects
            </Link>
          </div>
          <div className="eva-project-explore-carousel">
            <button
              type="button"
              className="eva-project-explore-scroll eva-project-explore-scroll--prev"
              aria-label="Scroll projects left"
              onClick={() => scrollBy(-1)}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <ul className="eva-project-explore-thumbs" ref={scrollerRef}>
              {projects.map((project) => (
                <li key={project.id}>
                  <Link
                    className="eva-project-explore-thumb"
                    href={Routes.project(project.slug)}
                  >
                    <span className="eva-project-explore-thumb-media">
                      {project.poster ? (
                        <Image
                          src={project.poster}
                          alt={projectPosterAlt(project)}
                          fill
                          sizes="120px"
                          loading="lazy"
                          unoptimized={project.poster.startsWith(POSTER_URL_PREFIX)}
                        />
                      ) : (
                        <PosterPlaceholder title={project.title} />
                      )}
                    </span>
                    <span className="eva-project-explore-thumb-title">{project.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="eva-project-explore-scroll eva-project-explore-scroll--next"
              aria-label="Scroll projects right"
              onClick={() => scrollBy(1)}
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}
