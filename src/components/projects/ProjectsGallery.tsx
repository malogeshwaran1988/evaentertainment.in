"use client";

import Image from "next/image";
import NextLink from "next/link";
import { useCallback, useRef, useState } from "react";
import { BATCH_SIZE, LoadMore, useBatchReveal } from "@@/components/common/BatchReveal";
import Link from "@@/components/common/NavLink";
import { NoScriptLinks } from "@@/components/projects/PosterBatchGrid";
import { PosterPlaceholder, YearBadge } from "@@/components/projects/ProjectPoster";
import { Routes } from "@@/constants/routes";
import { projectLanguageLine, type PublicProject } from "@@/data/projects";
import { gridImageLoading } from "@@/lib/image-loading";
import { projectPosterAlt } from "@@/lib/project-seo";
import { FILTER_ALL, facetOptions, matchesFacets } from "@@/lib/project-filters";

export type LanguageTab = { language: string; count: number; href: string };

type ProjectsGalleryProps = {
  /** Only the selected language's projects; other tabs are server-rendered on demand. */
  projects: PublicProject[];
  /** Ordered by published project count (desc), ties alphabetical. */
  tabs: LanguageTab[];
  selected: string;
  /** Other languages' projects, as plain links for no-JS visitors and crawlers. */
  otherLinks?: { id: string; href: string; title: string }[];
};

export default function ProjectsGallery({ projects, tabs, selected, otherLinks = [] }: ProjectsGalleryProps) {
  // Category narrows within the current language tab only; reset when the tab changes.
  const [catState, setCatState] = useState({ tab: selected, category: FILTER_ALL as string });
  const options = facetOptions(projects, { language: FILTER_ALL, category: FILTER_ALL });
  const category =
    catState.tab === selected && options.categories.includes(catState.category)
      ? catState.category
      : FILTER_ALL;
  const facets = { language: FILTER_ALL, category };

  const filter = `${selected}|${category}`;
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
      {tabs.length > 0 ? (
        <nav className="eva-projects-filters" aria-label="Projects by original language">
          {tabs.map((t) => (
            <NextLink
              key={t.language}
              href={t.href}
              prefetch={false}
              scroll={false}
              replace
              className="eva-projects-filter"
              aria-current={t.language === selected ? "page" : undefined}
            >
              {t.language}
              <span className="sr-only">, {t.count} {t.count === 1 ? "project" : "projects"}</span>
            </NextLink>
          ))}
        </nav>
      ) : null}
      {options.categories.length > 1 ? (
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
              aria-pressed={category === f}
              onClick={() => setCatState({ tab: selected, category: f })}
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
        {category === FILTER_ALL ? (
          <NoScriptLinks
            items={[
              ...visible
                .slice(BATCH_SIZE)
                .map((p) => ({ id: p.id, href: Routes.project(p.slug), title: p.title })),
              ...otherLinks,
            ]}
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
