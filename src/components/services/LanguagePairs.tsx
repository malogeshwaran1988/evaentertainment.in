"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import s from "./LanguagePairs.module.scss";

/**
 * Language pairs: one tab per pair (source script -> target script), each with its own original studio image.
 * The active pair auto-advances every 4 s while the section is in view; it pauses on hover or keyboard focus,
 * via the pause button (WCAG 2.2.2) and never auto-advances under prefers-reduced-motion.
 * Script words are real HTML text over the image, never baked into the picture.
 */
const PAIRS = [
  { id: "te-hi", from: "Telugu", fromWord: "తెలుగు", fromLang: "te", to: "Hindi", toWord: "हिन्दी", toLang: "hi",
    desc: "Our biggest pair: Mass Jathara, Ghaati, Show Time and more.",
    alt: "Indian translator comparing a printed film script with a laptop draft in a dubbing studio" },
  { id: "ta-hi", from: "Tamil", fromWord: "தமிழ்", fromLang: "ta", to: "Hindi", toWord: "हिन्दी", toLang: "hi",
    desc: "Tamil features such as Sirai and Annapoorni.",
    alt: "Indian woman translator writing on a script page beside editing monitors with a brass lamp and filter coffee" },
  { id: "ml-hi", from: "Malayalam", fromWord: "മലയാളം", fromLang: "ml", to: "Hindi", toWord: "हिन्दी", toLang: "hi",
    desc: "Malayalam comedy and drama like Oddum Kuthira Chaddum Kuthira.",
    alt: "Indian dubbing artist with headphones speaking at a condenser microphone in a recording booth" },
  { id: "kn-hi", from: "Kannada", fromWord: "ಕನ್ನಡ", fromLang: "kn", to: "Hindi", toWord: "हिन्दी", toLang: "hi",
    desc: "Kannada titles such as Maharshi Valmiki.",
    alt: "Two Indian writers discussing a marked up dialogue script at a mixing console" },
  { id: "en-hi", from: "English", fromWord: "English", fromLang: "en", to: "Hindi", toWord: "हिन्दी", toLang: "hi",
    desc: "Documentaries, animation, corporate films and ads.",
    alt: "Indian female voice artist with headphones laughing during a take at a studio microphone" },
  { id: "te-ta", from: "Telugu", fromWord: "తెలుగు", fromLang: "te", to: "Tamil", toWord: "தமிழ்", toLang: "ta",
    desc: "South to South dubbing for Tamil audiences.",
    note: "Example: the film Jack was dubbed from Telugu into Tamil and Hindi.",
    alt: "Indian dubbing director at a mixing console pointing at an action scene on the studio screen" },
] as const;

const STEP_MS = 4000;

export default function LanguagePairs() {
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return () => mq.removeEventListener("change", on);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => {
      mq.removeEventListener("change", on);
      io.disconnect();
    };
  }, []);

  const running = inView && !paused && !hold && !reduced;
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % PAIRS.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [running, active]);

  const go = useCallback((i: number) => {
    const n = (i + PAIRS.length) % PAIRS.length;
    setActive(n);
    tabs.current[n]?.focus();
  }, []);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: PAIRS.length - 1 };
    if (e.key in map) {
      e.preventDefault();
      go(map[e.key]);
    }
  };

  const cur = PAIRS[active];
  return (
    <div
      ref={root}
      className={s.wrap}
      data-running={running}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold(false);
      }}
    >
      <div className={s.side}>
        <div role="tablist" aria-label="Language pairs" aria-orientation="vertical" className={s.list}>
          {PAIRS.map((p, i) => (
            <button
              key={p.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${uid}-tab-${p.id}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={`${uid}-panel`}
              tabIndex={i === active ? 0 : -1}
              className={s.tab}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <span className={s.scripts} aria-hidden="true">
                <span lang={p.fromLang}>{p.fromWord}</span>
                <span className={s.arrow}>→</span>
                <span lang={p.toLang}>{p.toWord}</span>
              </span>
              <span className={s.names}>
                {p.from} to {p.to}
              </span>
              {"note" in p ? <span className={s.note}>{p.note}</span> : null}
              <span className={s.bar} aria-hidden="true" />
            </button>
          ))}
        </div>
        {reduced ? null : (
          <button type="button" className={s.pause} aria-pressed={paused} onClick={() => setPaused((v) => !v)}>
            <i className={`icon ${paused ? "icon-play-circle" : "icon-pause-circle"}`} aria-hidden="true" />
            {paused ? "Play slideshow" : "Pause slideshow"}
          </button>
        )}
      </div>
      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${cur.id}`} className={s.panel}>
        {PAIRS.map((p, i) => (
          <div key={p.id} className={s.slide} data-on={i === active} aria-hidden={i !== active}>
            <Image
              src={`/images/services/lp-${p.id}.avif`}
              alt={i === active ? p.alt : ""}
              fill
              sizes="(min-width: 992px) 55vw, 100vw"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority="low"
            />
          </div>
        ))}
        <div className={s.chips} key={cur.id}>
          <span className={s.chip} lang={cur.fromLang}>
            <small>{cur.from}</small>
            {cur.fromWord}
          </span>
          <span className={s.chipArrow} aria-hidden="true">→</span>
          <span className={`${s.chip} ${s.chipTo}`} lang={cur.toLang}>
            <small>{cur.to}</small>
            {cur.toWord}
          </span>
        </div>
        <p className={s.caption}>{cur.desc}</p>
        <span className={s.progress} key={`p-${active}`} aria-hidden="true" />
      </div>
    </div>
  );
}
