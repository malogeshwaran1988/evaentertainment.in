"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "@@/components/common/NavLink";
import { PosterPlaceholder, YearBadge } from "@@/components/projects/ProjectPoster";
import { Routes } from "@@/constants/routes";
import {
  POSTER_URL_PREFIX,
  projectLanguageLine,
  type PublicProject,
  type ProjectLanguage,
} from "@@/data/projects";
import { imageLoading } from "@@/lib/image-loading";
import { projectPosterAlt } from "@@/lib/project-seo";

type Filter = "All" | ProjectLanguage;

type ProjectsGalleryProps = {
  projects: PublicProject[];
  languages: readonly ProjectLanguage[];
};

export default function ProjectsGallery({
  projects,
  languages,
}: ProjectsGalleryProps) {
  const [filter, setFilter] = useState<Filter>("All");

  const usedLanguages = languages.filter((l) =>
    projects.some((p) => p.from === l || p.to.includes(l)),
  );
  const filters: Filter[] = ["All", ...usedLanguages];

  const visible =
    filter === "All"
      ? projects
      : projects.filter((p) => p.from === filter || p.to.includes(filter));

  if (projects.length === 0) {
    return <p className="eva-projects-empty">Projects coming soon.</p>;
  }

  return (
    <>
      <div
        className="eva-projects-filters"
        role="group"
        aria-label="Filter projects by language"
      >
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className="eva-projects-filter"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
      </p>

      {visible.length === 0 ? (
        <p className="eva-projects-empty">No {filter} projects to show yet.</p>
      ) : (
        <ul className="eva-projects-grid">
          {visible.map((project, i) => (
            <li className="eva-project-card" key={project.id}>
              <div className="eva-project-poster">
                <YearBadge year={project.year} />
                {project.poster ? (
                  <Image
                    src={project.poster}
                    alt={projectPosterAlt(project)}
                    fill
                    {...imageLoading(i)}
                    sizes="(min-width: 1200px) 16vw, (min-width: 992px) 23vw, (min-width: 768px) 30vw, 46vw"
                    unoptimized={project.poster.startsWith(POSTER_URL_PREFIX)}
                  />
                ) : (
                  <PosterPlaceholder title={project.title} />
                )}
              </div>
              <h2 className="eva-project-title">
                <Link
                  className="eva-project-open"
                  href={Routes.project(project.slug)}
                >
                  {project.title}
                  <span className="sr-only">, view project page</span>
                </Link>
              </h2>
              <p className="eva-project-meta">{projectLanguageLine(project)}</p>
              <p className="eva-project-meta">{project.category}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
