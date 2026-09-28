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
type Direction = "prev" | "next";

const SWIPE_MIN_PX = 50;

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<Direction | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

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

  const active = activeIndex === null ? null : (visible[activeIndex] ?? null);
  const prev = activeIndex !== null && activeIndex > 0 ? visible[activeIndex - 1] : null;
  const next = activeIndex !== null ? (visible[activeIndex + 1] ?? null) : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeIndex !== null && dialog && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLButtonElement>(".eva-project-dialog-close")?.focus();
    }
  }, [activeIndex]);

  const prevPoster = prev?.poster;
  const nextPoster = next?.poster;
  useEffect(() => {
    for (const src of [prevPoster, nextPoster]) {
      if (src) new window.Image().src = src;
    }
  }, [prevPoster, nextPoster]);

  const openProject = (index: number) => {
    setDirection(null);
    setActiveIndex(index);
  };

  const showAt = (index: number, dir: Direction) => {
    if (index < 0 || index >= visible.length) return;
    setDirection(dir);
    setActiveIndex(index);
  };

  const showPrev = () => activeIndex !== null && showAt(activeIndex - 1, "prev");
  const showNext = () => activeIndex !== null && showAt(activeIndex + 1, "next");

  const closeDialog = () => dialogRef.current?.close();

  const handleClose = () => {
    const shownId = active?.id;
    setActiveIndex(null);
    if (shownId) {
      gridRef.current
        ?.querySelector<HTMLButtonElement>(`[data-project-id="${CSS.escape(shownId)}"]`)
        ?.focus();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) <= Math.abs(dy)) return;
    if (dx < 0) showNext();
    else showPrev();
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
        <ul className="eva-projects-grid" ref={gridRef}>
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
                  data-project-id={project.id}
                  onClick={() => openProject(i)}
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
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") showPrev();
          else if (e.key === "ArrowRight") showNext();
        }}
      >
        {active && activeIndex !== null ? (
          <>
            {visible.length > 1 ? (
              // aria-disabled (not disabled) keeps focus on the button at either end.
              <button
                type="button"
                className="eva-project-dialog-nav eva-project-dialog-nav--prev"
                aria-label={prev ? `Previous project: ${prev.title}` : "Previous project"}
                aria-disabled={!prev}
                onClick={showPrev}
              >
                <span aria-hidden="true">‹</span>
              </button>
            ) : null}
            <div
              className="eva-project-dialog-panel"
              onTouchStart={(e) => {
                const touch = e.touches[0];
                touchStart.current = { x: touch.clientX, y: touch.clientY };
              }}
              onTouchEnd={handleTouchEnd}
            >
              <button
                type="button"
                className="eva-project-dialog-close"
                aria-label="Close"
                onClick={closeDialog}
              >
                <span aria-hidden="true">×</span>
              </button>
              <div
                className="eva-project-dialog-body"
                key={active.id}
                data-dir={direction ?? undefined}
              >
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
              {visible.length > 1 ? (
                <p className="eva-project-dialog-count" aria-live="polite">
                  {activeIndex + 1} / {visible.length}
                  <span className="eva-project-dialog-hint"> · Swipe for more</span>
                </p>
              ) : null}
            </div>
            {visible.length > 1 ? (
              <button
                type="button"
                className="eva-project-dialog-nav eva-project-dialog-nav--next"
                aria-label={next ? `Next project: ${next.title}` : "Next project"}
                aria-disabled={!next}
                onClick={showNext}
              >
                <span aria-hidden="true">›</span>
              </button>
            ) : null}
          </>
        ) : null}
      </dialog>
    </>
  );
}
