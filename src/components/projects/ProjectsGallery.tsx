"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BATCH_SIZE, LoadMore, useBatchReveal } from "@@/components/common/BatchReveal";
import Link from "@@/components/common/NavLink";
import { NoScriptLinks } from "@@/components/projects/PosterBatchGrid";
import { PosterPlaceholder, YearBadge } from "@@/components/projects/ProjectPoster";
import { Routes } from "@@/constants/routes";
import {
  projectLanguageLine,
  type PublicProject,
  type ProjectLanguage,
} from "@@/data/projects";
import {
  FILTER_ALL,
  facetOptions,
  matchesFacets,
  sanitizeFacets,
  type ProjectFacets,
} from "@@/lib/project-filters";
import { gridImageLoading } from "@@/lib/image-loading";
import { projectPosterAlt } from "@@/lib/project-seo";

type ProjectsGalleryProps = {
  projects: PublicProject[];
  /** Kept for API compatibility; options are now derived from the data. */
  languages?: readonly ProjectLanguage[];
};

const NONE: ProjectFacets = { language: FILTER_ALL, category: FILTER_ALL };

export default function ProjectsGallery({ projects }: ProjectsGalleryProps) {
  const [rawFacets, setFacets] = useState<ProjectFacets>(NONE);

  // Read ?language=&category= once on mount; unknown or empty values fall back to All.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const initial = {
      language: q.get("language")?.trim() || FILTER_ALL,
      category: q.get("category")?.trim() || FILTER_ALL,
    };
    if (initial.language !== FILTER_ALL || initial.category !== FILTER_ALL) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL
      setFacets(initial);
    }
  }, []);

  const facets = useMemo(() => sanitizeFacets(projects, rawFacets), [projects, rawFacets]);
  const options = useMemo(() => facetOptions(projects, facets), [projects, facets]);

  const update = (next: Partial<ProjectFacets>) => {
    const merged = sanitizeFacets(projects, { ...facets, ...next });
    setFacets(merged);
    const url = new URL(window.location.href);
    for (const key of ["language", "category"] as const) {
      if (merged[key] === FILTER_ALL) url.searchParams.delete(key);
      else url.searchParams.set(key, merged[key]);
    }
    window.history.replaceState(window.history.state, "", url);
  };

  const filter = `${facets.language}|${facets.category}`;
  const visible = projects.filter((p) => matchesFacets(p, facets));

  const { shown, hasMore, more, announce } = useBatchReveal(visible.length, BATCH_SIZE, filter);
  const gridRef = useRef<HTMLUListElement>(null);
  const prevShown = useRef(shown);
  const focusNew = useCallback(() => {
    const links = gridRef.current?.querySelectorAll<HTMLElement>(".eva-project-open");
    const target = links?.[prevShown.current];
    prevShown.current = shown;
    return target;
  }, [shown]);

  if (projects.length === 0) {
    return <p className="eva-projects-empty">Projects coming soon.</p>;
  }

  return (
    <>
      {options.languages.length > 1 || facets.language !== FILTER_ALL ? (
        <div
          className="eva-projects-filters"
          role="group"
          aria-label="Filter projects by original language"
        >
          {[FILTER_ALL, ...options.languages].map((f) => (
            <button
              key={f}
              type="button"
              className="eva-projects-filter"
              aria-pressed={facets.language === f}
              onClick={() => update({ language: f })}
            >
              {f === FILTER_ALL ? "All" : f}
            </button>
          ))}
        </div>
      ) : null}
      {options.categories.length > 1 || facets.category !== FILTER_ALL ? (
        <div
          className="eva-projects-filters"
          role="group"
          aria-label="Filter projects by category"
        >
          {[FILTER_ALL, ...options.categories].map((f) => (
            <button
              key={f}
              type="button"
              className="eva-projects-filter"
              aria-pressed={facets.category === f}
              onClick={() => update({ category: f })}
            >
              {f === FILTER_ALL ? "All categories" : f}
            </button>
          ))}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
      </p>

      {visible.length === 0 ? (
        <p className="eva-projects-empty">No projects match these filters.</p>
      ) : (
        <>
        <ul className="eva-projects-grid" ref={gridRef}>
          {visible.slice(0, shown).map((project, i) => (
            <li className="eva-project-card" key={project.id}>
              <div className="eva-project-poster">
                <YearBadge year={project.year} />
                {project.poster ? (
                  <Image
                    src={project.poster}
                    alt={projectPosterAlt(project)}
                    fill
                    {...gridImageLoading(i)}
                    sizes="(min-width: 1200px) 16vw, (min-width: 992px) 23vw, (min-width: 768px) 30vw, 46vw"
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
        {filter === `${FILTER_ALL}|${FILTER_ALL}` ? (
          <NoScriptLinks
            items={visible
              .slice(BATCH_SIZE)
              .map((p) => ({ id: p.id, href: Routes.project(p.slug), title: p.title }))}
          />
        ) : null}
        <LoadMore
          hasMore={hasMore}
          onMore={() => {
            prevShown.current = shown;
            more();
          }}
          shown={shown}
          total={visible.length}
          announce={announce}
          focusAfter={focusNew}
        />
        </>
      )}
    </>
  );
}
