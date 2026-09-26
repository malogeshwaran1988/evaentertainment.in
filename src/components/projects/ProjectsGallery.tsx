"use client";

import Image from "next/image";
import { useState } from "react";
import {
  POSTER_URL_PREFIX,
  projectLanguageLine,
  projectPosterAlt,
  type Project,
  type ProjectLanguage,
} from "@@/data/projects";

type Filter = "All" | ProjectLanguage;

type ProjectsGalleryProps = {
  projects: Project[];
  languages: readonly ProjectLanguage[];
};

export default function ProjectsGallery({
  projects,
  languages,
}: ProjectsGalleryProps) {
  const [filter, setFilter] = useState<Filter>("All");
  const filters: Filter[] = ["All", ...languages];

  const visible =
    filter === "All"
      ? projects
      : projects.filter(
          (p) => p.from === filter || p.to.includes(filter),
        );

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
        <p className="eva-projects-empty">
          No {filter} projects to show yet.
        </p>
      ) : (
        <ul className="eva-projects-grid">
          {visible.map((project) => (
            <li className="eva-project-card" key={project.id}>
              <div className="eva-project-poster">
                {project.poster ? (
                  <Image
                    src={project.poster}
                    alt={projectPosterAlt(project)}
                    fill
                    sizes="(min-width: 1200px) 16vw, (min-width: 992px) 23vw, (min-width: 768px) 30vw, 46vw"
                    // Uploads are already capped at 150 KB and may not exist when the optimizer starts.
                    unoptimized={project.poster.startsWith(POSTER_URL_PREFIX)}
                  />
                ) : (
                  <div className="eva-project-poster-placeholder" aria-hidden="true">
                    <i className="fas fa-film" />
                    <span>{project.title}</span>
                  </div>
                )}
              </div>
              <h2 className="eva-project-title">{project.title}</h2>
              <p className="eva-project-meta">{projectLanguageLine(project)}</p>
              <p className="eva-project-meta">{project.category}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
