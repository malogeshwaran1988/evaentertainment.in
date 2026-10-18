"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { BATCH_SIZE, LoadMore, useBatchReveal } from "@@/components/common/BatchReveal";
import Link from "@@/components/common/NavLink";
import { PosterPlaceholder } from "@@/components/projects/ProjectPoster";
import { gridImageLoading } from "@@/lib/image-loading";

export type PosterGridItem = { id: string; href: string; title: string; poster?: string; alt: string };

/** Poster grid revealed 10 at a time from data already in the page (no extra requests). */
export default function PosterBatchGrid({ items }: { items: PosterGridItem[] }) {
  const { shown, hasMore, more, announce } = useBatchReveal(items.length);
  const gridRef = useRef<HTMLUListElement>(null);
  const firstNew = useRef(0);
  const focusNew = useCallback(
    () => gridRef.current?.querySelectorAll<HTMLElement>(".eva-project-open")[firstNew.current],
    [],
  );

  return (
    <>
      <ul className="eva-projects-grid" ref={gridRef}>
        {items.slice(0, shown).map((p, i) => (
          <li className="eva-project-card" key={p.id}>
            <div className="eva-project-poster">
              {p.poster ? (
                <Image
                  src={p.poster}
                  alt={p.alt}
                  fill
                  {...gridImageLoading(i)}
                  sizes="(min-width: 1200px) 16vw, (min-width: 992px) 23vw, (min-width: 768px) 30vw, 46vw"
                />
              ) : (
                <PosterPlaceholder title={p.title} />
              )}
            </div>
            <h2 className="eva-project-title">
              <Link className="eva-project-open" href={p.href}>
                {p.title}
              </Link>
            </h2>
          </li>
        ))}
      </ul>
      <NoScriptLinks items={items.slice(BATCH_SIZE)} />
      <LoadMore
        hasMore={hasMore}
        onMore={() => {
          firstNew.current = shown;
          more();
        }}
        shown={shown}
        total={items.length}
        announce={announce}
        focusAfter={focusNew}
      />
    </>
  );
}

/** Without JavaScript the remaining projects are still reachable as plain links. */
export function NoScriptLinks({ items }: { items: { id: string; href: string; title: string }[] }) {
  if (items.length === 0) return null;
  return (
    <noscript>
      <ul className="eva-noscript-links">
        {items.map((p) => (
          <li key={p.id}>
            <a href={p.href}>{p.title}</a>
          </li>
        ))}
      </ul>
    </noscript>
  );
}
