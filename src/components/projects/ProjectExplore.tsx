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

function AdjacentLink({
  neighbor,
  direction,
}: {
  neighbor: ProjectNavNeighbor | null;
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";
  const label = isPrev ? "Previous" : "Next";

  if (!neighbor) {
    return (
      <span
        className={`eva-project-explore-adj eva-project-explore-adj--${direction} eva-project-explore-adj--disabled`}
        aria-disabled="true"
      >
        {isPrev ? <span aria-hidden="true">‹</span> : null}
        <span className="eva-project-explore-adj-label">{label}</span>
        {!isPrev ? <span aria-hidden="true">›</span> : null}
      </span>
    );
  }

  return (
    <Link
      className={`eva-project-explore-adj eva-project-explore-adj--${direction}`}
      href={Routes.project(neighbor.slug)}
      aria-label={`${label} project: ${neighbor.title}`}
    >
      {isPrev ? <span aria-hidden="true">‹</span> : null}
      <span className="eva-project-explore-adj-label">
        {label}
        <span className="eva-project-explore-adj-title">{neighbor.title}</span>
      </span>
      {!isPrev ? <span aria-hidden="true">›</span> : null}
    </Link>
  );
}

export default function ProjectExplore({ projects, prev, next }: ProjectExploreProps) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const hasThumbs = projects.length > 0;

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.75, 320);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section
      className="eva-project-explore"
      {...(hasThumbs
        ? { "aria-labelledby": "eva-project-explore-title" }
        : { "aria-label": "Adjacent projects" })}
    >
      {hasThumbs ? (
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
                          sizes="140px"
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

      <div className="eva-project-explore-nav" aria-label="Adjacent projects">
        <AdjacentLink neighbor={prev} direction="prev" />
        <AdjacentLink neighbor={next} direction="next" />
      </div>
    </section>
  );
}
