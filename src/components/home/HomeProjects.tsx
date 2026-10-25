"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import Link from "@@/components/common/NavLink";
import { SvgIcon } from "@@/components/common/Icons";
import { PosterPlaceholder, YearBadge } from "@@/components/projects/ProjectPoster";
import { Routes } from "@@/constants/routes";
import {
  projectLanguageLine,
  type PublicProject,
} from "@@/data/projects";
import { HOME_PROJECTS_LIMIT } from "@@/data/home";
import { projectPosterAlt } from "@@/lib/project-seo";

/** Home strip: ongoing projects first, then the newest by year (order comes from getPublicProjects). */
export default function HomeProjects({ projects }: { projects: PublicProject[] }) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [announce, setAnnounce] = useState("");

  if (projects.length === 0) return null;

  const shown = projects.slice(0, HOME_PROJECTS_LIMIT);

  // Loops: past the last card wraps to the first, before the first wraps to the last.
  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
    const atEnd = el.scrollLeft >= max - 2;
    const atStart = el.scrollLeft <= 2;
    if (dir === 1 && atEnd) {
      el.scrollTo({ left: 0, behavior });
      setAnnounce("Back to the first project");
      return;
    }
    if (dir === -1 && atStart) {
      el.scrollTo({ left: max, behavior });
      setAnnounce("Jumped to the last project");
      return;
    }
    setAnnounce("");
    const step = Math.min(el.clientWidth * 0.8, 360);
    el.scrollBy({ left: dir * step, behavior });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    scrollBy(e.key === "ArrowRight" ? 1 : -1);
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
        fetchPriority="low"
        decoding="async"
      />
      <div className="container">
        <div className="title-wrap text-center">
          <h2 className="h--lg" id="eva-home-projects-title">
            <SvgIcon name="film" />
            Ongoing &amp; Recent Projects
          </h2>
          <p className="p--lg">What we are dubbing now and titles we have finished recently</p>
        </div>
        {/* Arrow keys scroll (and wrap) while focus is anywhere in the carousel. */}
        <div className="eva-home-projects-carousel" onKeyDown={onKeyDown}>
          <button
            type="button"
            className="eva-home-projects-scroll eva-home-projects-scroll--prev"
            aria-label="Previous projects (wraps to the end)"
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
                      loading="lazy"
                      fetchPriority="low"
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
            aria-label="Next projects (wraps to the start)"
            onClick={() => scrollBy(1)}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
        <div className="eva-home-projects-cta">
          <Link className="btn" href={Routes.PROJECTS}>
            See all projects
          </Link>
        </div>
      </div>
    </section>
  );
}
