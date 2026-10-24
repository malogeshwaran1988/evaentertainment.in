"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import s from "./SurroundExperience.module.scss";

/** Scroll-driven 5.1 cinema: a jet flies off the screen, over the audience and behind,
 *  and each speaker's level follows it. No libraries; one rAF-throttled scroll listener
 *  writes CSS variables and transforms only. Reduced motion gets a static frame. */

const CH = ["L", "C", "R", "Ls", "Rs", "LFE"] as const;
// Speaker positions in the 1000x600 room drawing.
const POS: Record<(typeof CH)[number], [number, number]> = {
  L: [200, 205], C: [500, 190], R: [800, 205], Ls: [70, 500], Rs: [930, 500], LFE: [660, 300],
};
const SWEET: [number, number] = [500, 470];

// [progress, L, C, R, Ls, Rs, LFE]
const LEVELS: number[][] = [
  [0, 0.08, 0.35, 0.08, 0, 0, 0],
  [0.2, 0.15, 0.6, 0.15, 0, 0, 0.05],
  [0.42, 0.95, 1, 0.95, 0.15, 0.15, 0.35],
  [0.6, 0.9, 0.8, 0.9, 0.85, 0.85, 1],
  [0.78, 0.2, 0.15, 0.2, 1, 1, 0.45],
  [0.92, 0.05, 0.05, 0.05, 0.35, 0.35, 0.05],
  [1, 0.05, 0.05, 0.05, 0.3, 0.3, 0.05],
];
// [progress, x, y, scale, opacity]
const PATH: number[][] = [
  [0, 500, 120, 0.06, 0.9],
  [0.2, 500, 125, 0.18, 1],
  [0.42, 500, 150, 0.7, 1],
  [0.6, 500, 330, 1.7, 1],
  [0.78, 500, 560, 2.4, 0.9],
  [0.88, 500, 700, 2.8, 0],
  [1, 500, 700, 2.8, 0],
];

function lerpTable(t: number[][], p: number) {
  let i = 0;
  while (i < t.length - 2 && p > t[i + 1][0]) i++;
  const a = t[i], b = t[i + 1];
  const k = Math.min(1, Math.max(0, (p - a[0]) / (b[0] - a[0] || 1)));
  const e = k * k * (3 - 2 * k);
  return a.slice(1).map((v, j) => v + (b[j + 1] - v) * e);
}

const STAGES = [
  { t: "Far away", d: "A distant jet sits in the centre channel, with only a hint in left and right." },
  { t: "Front channels carry the approach", d: "As it closes in, L, C and R swell and widen the sound across the screen." },
  { t: "LFE adds the rumble", d: "Overhead, every channel opens up and the subwoofer shakes the room." },
  { t: "Surrounds put it behind you", d: "Ls and Rs take over as the jet passes, so you hear it leave the room." },
  { t: "The mixing room", d: "Pro Tools mixing, Genelec and Yamaha monitoring, and a recording booth next door for pickups during the mix." },
];
const STAGE_AT = [0, 0.2, 0.5, 0.7, 0.88];
const TRAIL = 9;

export default function SurroundExperience({ headingId }: { headingId: string }) {
  const root = useRef<HTMLElement | null>(null);
  const plane = useRef<SVGGElement | null>(null);
  const trail = useRef<(SVGCircleElement | null)[]>([]);
  const after = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let on = false;

    const paint = (p: number) => {
      const lv = lerpTable(LEVELS, p);
      lv.forEach((v, i) => el.style.setProperty(`--${CH[i]}`, v.toFixed(3)));
      const [x, y, sc, op] = lerpTable(PATH, p);
      plane.current?.setAttribute("transform", `translate(${x} ${y}) scale(${sc})`);
      if (plane.current) plane.current.style.opacity = String(op);
      trail.current.forEach((c, i) => {
        if (!c) return;
        const q = Math.max(0, p - (i + 1) * 0.018);
        const [tx, ty, , to] = lerpTable(PATH, q);
        c.setAttribute("cx", tx.toFixed(1));
        c.setAttribute("cy", ty.toFixed(1));
        c.style.opacity = String(p > 0.02 ? to * (1 - i / TRAIL) * 0.85 : 0);
      });
      let st = 0;
      STAGE_AT.forEach((a, i) => { if (p >= a) st = i; });
      el.dataset.stage = String(st);
    };

    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      paint(Math.min(1, Math.max(0, -r.top / (span || 1))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const start = () => {
      if (on) return;
      on = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      tick();
    };
    const stop = () => {
      on = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };

    if (reduced.matches) { paint(0.6); el.dataset.stage = "all"; return; }
    paint(0);
    // Lazy: only listen to scroll while the section is near the viewport.
    const io = new IntersectionObserver(([e]) => {
      el.dataset.live = e.isIntersecting ? "true" : "false";
      if (e.isIntersecting) start(); else stop();
    }, { rootMargin: "100% 0px" });
    io.observe(el);
    return () => { io.disconnect(); stop(); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const skip = () => {
    const t = after.current;
    if (!t) return;
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: "auto" });
  };

  return (
    <section ref={root} className={`eva-svc-section ${s.wrap}`} aria-labelledby={headingId} data-stage="0">
      <div className={s.sticky}>
        <div className={s.head}>
          <h2 id={headingId} className="eva-svc-title">
            <i className="icon icon-mic-2" aria-hidden="true" /> The mixing <span>room</span>
          </h2>
          <p className={s.sub}>Scroll to fly a jet through a 5.1 room and watch every speaker respond.</p>
          <button type="button" className={s.skip} onClick={skip}>Skip animation</button>
        </div>

        <div className={s.stage} aria-hidden="true">
          <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" className={s.svg}>
            <defs>
              <filter id="sx-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="sx-screen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2a3d52" />
                <stop offset="1" stopColor="#0d1218" />
              </linearGradient>
              <radialGradient id="sx-dome">
                <stop offset="0" stopColor="#70b615" stopOpacity=".55" />
                <stop offset="1" stopColor="#70b615" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* room in perspective */}
            <polygon points="300,60 700,60 1000,600 0,600" className={s.floor} />
            <line x1="300" y1="60" x2="0" y2="600" className={s.edge} />
            <line x1="700" y1="60" x2="1000" y2="600" className={s.edge} />
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={300 - i * 60} y1={240 + i * 80} x2={700 + i * 60} y2={240 + i * 80} className={s.row} />
            ))}
            {/* cinema screen */}
            <rect x="290" y="50" width="420" height="190" rx="4" fill="url(#sx-screen)" className={s.screen} />
            <path d="M290 200 Q 400 170 500 190 T 710 180 V240 H290Z" fill="#0a0e12" opacity=".7" />
            {/* LFE dome */}
            <ellipse cx={SWEET[0]} cy={SWEET[1]} rx="330" ry="150" fill="url(#sx-dome)" className={s.dome} />
            {/* beams speaker -> sweet spot */}
            {CH.map((c) => (
              <line key={c} x1={POS[c][0]} y1={POS[c][1]} x2={SWEET[0]} y2={SWEET[1]}
                className={s.beam} style={{ opacity: `var(--${c})` }} filter="url(#sx-glow)" />
            ))}
            {/* rings + speakers */}
            {CH.map((c) => (
              <g key={c} transform={`translate(${POS[c][0]} ${POS[c][1]})`}>
                <g className={s.rings} style={{ opacity: `var(--${c})`, transform: `scale(calc(.6 + var(--${c}) * .9))` }}>
                  {[0, 1, 2, 3].map((r) => (
                    <circle key={r} r="60" className={s.ring} style={{ animationDelay: `${r * -0.45}s` }} />
                  ))}
                </g>
                <rect x={c === "LFE" ? -26 : -16} y={c === "LFE" ? -18 : -26} width={c === "LFE" ? 52 : 32}
                  height={c === "LFE" ? 36 : 52} rx="5" className={s.box} />
                <circle r={c === "LFE" ? 12 : 9} className={s.cone} style={{ opacity: `calc(.3 + var(--${c}))` }} />
                <text y={c === "LFE" ? 40 : 46} className={s.label}>{c}</text>
              </g>
            ))}
            {/* listener */}
            <g transform={`translate(${SWEET[0]} ${SWEET[1]})`}>
              <circle r="16" className={s.listener} />
              <text y="40" className={s.labelSm}>You</text>
            </g>
            {/* sound source trail + jet */}
            {Array.from({ length: TRAIL }, (_, i) => (
              <circle key={i} ref={(n) => { trail.current[i] = n; }} r={14 - i} className={s.trail} filter="url(#sx-glow)" />
            ))}
            <g ref={plane} className={s.plane}>
              <circle r="34" className={s.source} filter="url(#sx-glow)" />
              <path d="M0-30 L5-8 L40 6 L40 12 L5 6 L4 22 L13 30 L13 34 L0 30 L-13 34 L-13 30 L-4 22 L-5 6 L-40 12 L-40 6 L-5-8Z" className={s.jet} />
            </g>
          </svg>
        </div>

        <div className={s.meters} aria-hidden="true">
          {CH.map((c) => (
            <div key={c} className={s.meter}>
              <span className={s.track}><span className={s.bar} style={{ transform: `scaleY(var(--${c}))` }} /></span>
              <b>{c}</b>
            </div>
          ))}
        </div>

        <ol className={s.caps}>
          {STAGES.map((st, i) => (
            <li key={st.t} className={s.cap} data-i={i}>
              <h3>{st.t}</h3>
              <p>{st.d}</p>
              {i === STAGES.length - 1 ? (
                <p><Link href="/studio-equipment" className={s.link}>See the full studio equipment list</Link></p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      <div ref={after} className={s.after} />
    </section>
  );
}
