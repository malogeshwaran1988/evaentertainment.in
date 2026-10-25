"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import BrandMark from "@@/components/common/BrandMark";
import { CAREERS_ROLES } from "@@/data/careers";

const INTERVAL_MS = 7000;

/** Accessible role carousel: arrows, dots, arrow keys, pause; no autoplay under reduced motion. */
export default function RoleSlider() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hold, setHold] = useState(false);
  const live = useRef<HTMLDivElement>(null);
  const count = CAREERS_ROLES.length;
  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);

  useEffect(() => {
    setPlaying(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!playing || hold) return;
    const t = window.setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => window.clearTimeout(t);
  }, [playing, hold, index, go]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
  };

  return (
    <section
      className="eva-role-slider"
      aria-roledescription="carousel"
      aria-label="Roles at EVA Entertainment"
      onKeyDown={onKey}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHold(false); }}
    >
      <div className="eva-role-slider__viewport" ref={live} aria-live={playing && !hold ? "off" : "polite"}>
        {CAREERS_ROLES.map((r, i) => (
          <div
            key={r.id}
            className="eva-role-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${r.title}`}
            hidden={i !== index}
          >
            <div className="eva-role-slide__media eva-brand-host">
              <Image src={r.image} alt={r.alt} width={1280} height={720} sizes="(max-width: 991px) 100vw, 560px" priority={i === 0} />
              <BrandMark />
            </div>
            <div className="eva-role-slide__body">
              <h3 className="eva-role-slide__title">{r.title}</h3>
              <p className="eva-role-slide__kicker">What a day looks like</p>
              <ol className="eva-role-slide__steps">
                {r.day.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

      <div className="eva-role-slider__controls">
        <button type="button" className="eva-role-slider__btn" onClick={() => go(index - 1)} aria-label="Previous role">
          <span aria-hidden="true">‹</span>
        </button>
        <div className="eva-role-slider__dots">
          {CAREERS_ROLES.map((r, i) => (
            <button
              key={r.id}
              type="button"
              className="eva-role-slider__dot"
              aria-label={`Show ${r.title}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
        <button type="button" className="eva-role-slider__btn" onClick={() => go(index + 1)} aria-label="Next role">
          <span aria-hidden="true">›</span>
        </button>
        <button
          type="button"
          className="eva-role-slider__btn eva-role-slider__pause"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
        >
          <span aria-hidden="true">{playing ? "❚❚" : "►"}</span>
        </button>
      </div>
    </section>
  );
}
