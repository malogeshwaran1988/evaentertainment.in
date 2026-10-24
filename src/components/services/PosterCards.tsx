"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "@@/components/common/NavLink";
import { PosterPlaceholder } from "@@/components/projects/ProjectPoster";

const ProjectTrailer = dynamic(() => import("@@/components/projects/ProjectTrailer"), { ssr: false });

export type PosterCard = {
  id: string;
  title: string;
  href: string;
  poster?: string;
  posterAlt: string;
  languages: string;
  category: string;
  year?: string;
  description?: string;
  trailerId?: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

/** Poster cards that open an accessible quick-view dialog (no URL change). */
export default function PosterCards({ cards }: { cards: PosterCard[] }) {
  const [open, setOpen] = useState<PosterCard | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const dialog = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    const gap = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (gap > 0) root.style.paddingRight = `${gap}px`;
    dialog.current?.querySelector<HTMLElement>(".eva-poster-modal-close")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !dialog.current) return;
      const els = [...dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialog.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialog.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const btn = opener.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
      root.style.paddingRight = "";
      btn?.focus();
    };
  }, [open, close]);

  return (
    <>
      <ul className="eva-svc-poster-list">
        {cards.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className="eva-svc-poster"
              aria-haspopup="dialog"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpen(c);
              }}
            >
              <span className="eva-svc-poster-img">
                {c.poster ? (
                  <Image src={c.poster} alt={c.posterAlt} fill sizes="(min-width: 992px) 180px, 45vw" loading="lazy" />
                ) : (
                  <PosterPlaceholder title={c.title} />
                )}
              </span>
              <span className="eva-svc-poster-title">{c.title}</span>
              <span className="eva-svc-poster-meta">{c.languages}</span>
            </button>
          </li>
        ))}
      </ul>
      {open ? (
        <div className="eva-poster-modal" onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <div
            ref={dialog}
            className="eva-poster-modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="eva-poster-modal-title"
          >
            <button type="button" className="eva-poster-modal-close" onClick={close} aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
            <div className="eva-poster-modal-poster">
              {open.poster ? (
                <Image src={open.poster} alt={open.posterAlt} fill sizes="(min-width: 768px) 260px, 60vw" />
              ) : (
                <PosterPlaceholder title={open.title} />
              )}
            </div>
            <div className="eva-poster-modal-body">
              <h3 id="eva-poster-modal-title">{open.title}</h3>
              <dl className="eva-poster-modal-facts">
                <div><dt>Languages</dt><dd>{open.languages}</dd></div>
                <div><dt>Category</dt><dd>{open.category}</dd></div>
                {open.year ? <div><dt>Year</dt><dd>{open.year}</dd></div> : null}
              </dl>
              {open.description ? <p className="eva-poster-modal-desc">{open.description}</p> : null}
              {open.trailerId ? <ProjectTrailer id={open.trailerId} title={`${open.title} – trailer`} /> : null}
              <Link href={open.href} className="btn">
                <span>View full project</span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
