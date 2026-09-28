"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  POSTER_URL_PREFIX,
  PROJECT_YEAR_ONGOING,
  projectLanguageLine,
  projectPosterAlt,
  projectYearLabel,
  type Project,
  type ProjectLanguage,
} from "@@/data/projects";
import { imageLoading } from "@@/lib/image-loading";

type Filter = "All" | ProjectLanguage;

type ProjectsGalleryProps = {
  projects: Project[];
  languages: readonly ProjectLanguage[];
};

function joinList(items: readonly string[]) {
  return items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function YearBadge({ year }: { year?: string }) {
  if (!year) return null;
  return (
    <span
      className={
        year === PROJECT_YEAR_ONGOING
          ? "eva-project-badge eva-project-badge--ongoing"
          : "eva-project-badge"
      }
    >
      {projectYearLabel(year)}
    </span>
  );
}

function PosterPlaceholder({ title }: { title: string }) {
  return (
    <div className="eva-project-poster-placeholder" aria-hidden="true">
      <i className="fas fa-film" />
      <span>{title}</span>
    </div>
  );
}

export default function ProjectsGallery({
  projects,
  languages,
}: ProjectsGalleryProps) {
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const usedLanguages = languages.filter((l) =>
    projects.some((p) => p.from === l || p.to.includes(l)),
  );
  const filters: Filter[] = ["All", ...usedLanguages];

  const visible =
    filter === "All"
      ? projects
      : projects.filter(
          (p) => p.from === filter || p.to.includes(filter),
        );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (active && dialog && !dialog.open) dialog.showModal();
  }, [active]);

  const openProject = (project: Project, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setActive(project);
  };

  const closeDialog = () => dialogRef.current?.close();

  const handleClose = () => {
    setActive(null);
    openerRef.current?.focus();
  };

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
        <p className="eva-projects-empty">
          No {filter} projects to show yet.
        </p>
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
                    // Uploads are already capped at 150 KB and may not exist when the optimizer starts.
                    unoptimized={project.poster.startsWith(POSTER_URL_PREFIX)}
                  />
                ) : (
                  <PosterPlaceholder title={project.title} />
                )}
              </div>
              <h2 className="eva-project-title">
                {/* ::after stretches this button over the whole card, poster included. */}
                <button
                  type="button"
                  className="eva-project-open"
                  aria-haspopup="dialog"
                  onClick={(e) => openProject(project, e.currentTarget)}
                >
                  {project.title}
                  <span className="sr-only">, view details</span>
                </button>
              </h2>
              <p className="eva-project-meta">{projectLanguageLine(project)}</p>
              <p className="eva-project-meta">{project.category}</p>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        className="eva-project-dialog"
        aria-labelledby="eva-project-dialog-title"
        onClose={handleClose}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeDialog();
        }}
      >
        {active ? (
          <div className="eva-project-dialog-body">
            <button
              type="button"
              className="eva-project-dialog-close"
              aria-label="Close"
              onClick={closeDialog}
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className="eva-project-dialog-poster">
              <YearBadge year={active.year} />
              {active.poster ? (
                // Posters are served unoptimized by the route handler.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={active.poster} alt={projectPosterAlt(active)} />
              ) : (
                <PosterPlaceholder title={active.title} />
              )}
            </div>
            <div className="eva-project-dialog-details">
              <h2 id="eva-project-dialog-title" className="eva-project-dialog-title">
                {active.title}
              </h2>
              <dl className="eva-project-dialog-list">
                {active.year ? (
                  <div>
                    <dt>Year</dt>
                    <dd>
                      {active.year === PROJECT_YEAR_ONGOING
                        ? "Ongoing (in production)"
                        : active.year}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt>Source language</dt>
                  <dd>{active.from}</dd>
                </div>
                <div>
                  <dt>Dubbed into</dt>
                  <dd>{joinList(active.to)}</dd>
                </div>
                <div>
                  <dt>Category</dt>
                  <dd>{active.category}</dd>
                </div>
              </dl>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
