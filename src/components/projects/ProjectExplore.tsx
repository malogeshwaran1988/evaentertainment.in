"use client";

import Image from "next/image";
import { useRef } from "react";
import Link from "@@/components/common/NavLink";
import { PosterPlaceholder } from "@@/components/projects/ProjectPoster";
import { Routes } from "@@/constants/routes";
import { type PublicProject } from "@@/data/projects";
import { projectPosterAlt } from "@@/lib/project-seo";

type ProjectExploreProps = {
  projects: PublicProject[];
};

export default function ProjectExplore({ projects }: ProjectExploreProps) {
  const scrollerRef = useRef<HTMLUListElement>(null);

  if (projects.length === 0) return null;

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.75, 360);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section
      className="eva-project-explore"
      aria-labelledby="eva-project-explore-title"
    >
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
                aria-label={project.title}
              >
                <span className="eva-project-explore-thumb-media">
                  {project.poster ? (
                    <Image
                      src={project.poster}
                      alt={projectPosterAlt(project)}
                      fill
                      sizes="140px"
                      loading="lazy"
                      fetchPriority="low"
                    />
                  ) : (
                    <PosterPlaceholder title={project.title} />
                  )}
                </span>
                <span className="sr-only">{project.title}</span>
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
    </section>
  );
}
