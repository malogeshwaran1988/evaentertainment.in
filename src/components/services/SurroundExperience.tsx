"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import s from "./SurroundExperience.module.scss";

/**
 * Scroll-driven 5.1 cinema over a real studio photo. A real jet clip plays on the
 * room's screen (scrubbed by scroll), then the sound "leaves" the screen: it flies
 * over the mix position and behind you, and each speaker lights up as it moves.
 * Optional sound uses Web Audio with an HRTF panner that follows the same path.
 *
 * To use EVA's own studio photo, change only STUDIO below:
 *  - photo/width/height: the new image (keep it AVIF and under 250 KB)
 *  - screen: the four corners of the screen in the photo, in % of width/height
 *  - speakers: each monitor's centre in %; set edge: true for any you can't see
 *    (it is then shown as a labelled glow at the left or right edge)
 *  - sweet: the mix chair (where the beams meet), focus: the dolly-in point
 */
export const STUDIO = {
  photo: "/images/services/mixing-room-51.avif",
  width: 1000,
  height: 666,
  alt: "A mixing room with a screen on the front wall, studio monitors around it and a console with session screens.",
  credit: {
    text: "Studio photo: “The Blue Room control room at Dubway Studios” by Dubwaystudios",
    href: "https://commons.wikimedia.org/wiki/File:Dubwaytheblueroom.jpg",
    license: "CC BY-SA 4.0",
    licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  // Corners in % (x, y): top-left, top-right, bottom-right, bottom-left.
  screen: [[54.7, 32], [66.6, 32], [66.6, 43.3], [54.7, 43.3]] as [number, number][],
  speakers: {
    L: { x: 42, y: 29.6 },
    C: { x: 59.7, y: 28 },
    R: { x: 79.7, y: 24.5 },
    Ls: { x: 3, y: 55, edge: true },
    Rs: { x: 97, y: 55, edge: true },
    LFE: { x: 56, y: 75 },
  } as Record<string, { x: number; y: number; edge?: boolean }>,
  sweet: { x: 47, y: 60 },
  focus: { x: 60.6, y: 37.6 },
  // Mobile: how wide the photo is (in vw) and which % of it sits in the middle.
  mobile: { width: 190, centre: 60 },
};

const MEDIA = {
  webm: "/media/surround/jet-flyby.webm",
  mp4: "/media/surround/jet-flyby.mp4",
  poster: "/media/surround/poster.jpg",
  sfxWebm: "/media/surround/jet-sfx.webm",
  sfxMp3: "/media/surround/jet-sfx.mp3",
  videoEnd: 0.55, // scroll progress at which the clip reaches its last frame
};

const CH = ["L", "C", "R", "Ls", "Rs", "LFE"] as const;

// [progress, L, C, R, Ls, Rs, LFE]
const LEVELS: number[][] = [
  [0, 0.08, 0.35, 0.08, 0, 0, 0],
  [0.2, 0.15, 0.6, 0.15, 0, 0, 0.05],
  [0.45, 0.95, 1, 0.95, 0.15, 0.15, 0.35],
  [0.62, 0.9, 0.8, 0.9, 0.85, 0.85, 1],
  [0.78, 0.2, 0.15, 0.2, 1, 1, 0.45],
  [0.92, 0.05, 0.05, 0.05, 0.35, 0.35, 0.05],
  [1, 0.05, 0.05, 0.05, 0.3, 0.3, 0.05],
];
// Sound source over the photo, in % of the photo: [progress, x, y, size, opacity]
const PATH: number[][] = [
  [0, 60.6, 37.6, 0.15, 0],
  [0.4, 60.6, 37.6, 0.5, 0.6],
  [0.55, 58, 40, 1.3, 1],
  [0.66, 50, 22, 2.6, 1],
  [0.76, 47, 2, 3.4, 0.8],
  [0.86, 47, -25, 3.8, 0],
  [1, 47, -25, 3.8, 0],
];
// Listener-space position for the HRTF panner (metres): [progress, x, y, z]; -z is in front.
const PATH3: number[][] = [
  [0, 0, 0.5, -30],
  [0.45, 0, 0.6, -6],
  [0.62, 0, 2.2, -0.5],
  [0.72, 0, 2, 2],
  [0.86, 0, 1, 9],
  [1, 0, 0.5, 20],
];
// Camera dolly toward the screen and back: [progress, zoom]
const ZOOM: number[][] = [[0, 1], [0.45, 1.45], [0.66, 1.08], [1, 1]];

function lerpTable(t: number[][], p: number) {
  let i = 0;
  while (i < t.length - 2 && p > t[i + 1][0]) i++;
  const a = t[i], b = t[i + 1];
  const k = Math.min(1, Math.max(0, (p - a[0]) / (b[0] - a[0] || 1)));
  const e = k * k * (3 - 2 * k);
  return a.slice(1).map((v, j) => v + (b[j + 1] - v) * e);
}

// Projective transform mapping the video's rectangle onto the screen quad (matrix3d).
type M = number[];
const adj = (m: M): M => [
  m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
  m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
  m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3],
];
const mul = (a: M, b: M): M => {
  const c = Array(9).fill(0);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) c[3 * i + j] += a[3 * i + k] * b[3 * k + j];
  return c;
};
const basis = (p: number[][]): M => {
  const m = [p[0][0], p[1][0], p[2][0], p[0][1], p[1][1], p[2][1], 1, 1, 1];
  const a = adj(m);
  const v = [0, 1, 2].map((r) => a[3 * r] * p[3][0] + a[3 * r + 1] * p[3][1] + a[3 * r + 2]);
  return mul(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
};
function quadMatrix(w: number, h: number, dst: number[][]) {
  const t = mul(basis(dst), adj(basis([[0, 0], [w, 0], [w, h], [0, h]])));
  const n = t.map((v) => v / t[8]);
  return `matrix3d(${[n[0], n[3], 0, n[6], n[1], n[4], 0, n[7], 0, 0, 1, 0, n[2], n[5], 0, 1].map((v) => +v.toFixed(8)).join(",")})`;
}

const STAGES = [
  { t: "Far away", d: "A distant jet sits in the centre channel, with only a hint in left and right." },
  { t: "Front channels carry the approach", d: "As it closes in, L, C and R swell and widen the sound across the screen." },
  { t: "LFE adds the rumble", d: "Overhead, every channel opens up and the subwoofer shakes the room." },
  { t: "Surrounds put it behind you", d: "Ls and Rs take over as the jet passes, so you hear it leave the room." },
  { t: "The mixing room", d: "Pro Tools mixing, Genelec and Yamaha monitoring, and a recording booth next door for pickups during the mix." },
];
const STAGE_AT = [0, 0.2, 0.5, 0.7, 0.88];
const TRAIL = 8;
const VW = 1000, VH = (1000 * STUDIO.height) / STUDIO.width;
const px = (x: number) => (x / 100) * VW;
const py = (y: number) => (y / 100) * VH;
const KEY = "eva-surround-sound";

type AudioApi = { set: (on: boolean) => void };

export default function SurroundExperience({ headingId }: { headingId: string }) {
  const root = useRef<HTMLElement | null>(null);
  const scene = useRef<HTMLDivElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const src = useRef<SVGGElement | null>(null);
  const trail = useRef<(SVGCircleElement | null)[]>([]);
  const after = useRef<HTMLDivElement | null>(null);
  const audio = useRef<AudioApi | null>(null);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const el = root.current;
    const sc = scene.current;
    const v = video.current;
    if (!el || !sc || !v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, on = false, near = false, inView = false, loaded = false, p = 0, want = false;

    // ---------- Web Audio (created only after the visitor unmutes) ----------
    let ctx: AudioContext | null = null;
    let nodes: { gain: GainNode; pan: PannerNode; shelf: BiquadFilterNode; srcNode?: AudioBufferSourceNode } | null = null;
    let buf: AudioBuffer | null = null;
    let suspendT = 0;

    const audioFrame = () => {
      if (!ctx || !nodes || reduced) return;
      const t = ctx.currentTime;
      const [x, y, z] = lerpTable(PATH3, p);
      nodes.pan.positionX.setTargetAtTime(x, t, 0.06);
      nodes.pan.positionY.setTargetAtTime(y, t, 0.06);
      nodes.pan.positionZ.setTargetAtTime(z, t, 0.06);
      const lv = lerpTable(LEVELS, p);
      const g = want && inView ? 0.25 + 0.75 * Math.max(...lv) : 0;
      nodes.gain.gain.setTargetAtTime(g, t, want && inView ? 0.08 : 0.25);
      nodes.shelf.gain.setTargetAtTime(lv[5] * 14, t, 0.08);
      if (nodes.srcNode) nodes.srcNode.playbackRate.setTargetAtTime(p < 0.62 ? 1.05 : 0.9, t, 0.3);
    };

    const startSource = (loop: boolean) => {
      if (!ctx || !nodes || !buf) return;
      try { nodes.srcNode?.stop(); } catch { /* already stopped */ }
      const n = ctx.createBufferSource();
      n.buffer = buf;
      n.loop = loop;
      n.connect(nodes.shelf);
      n.start();
      nodes.srcNode = n;
    };

    // Reduced motion: no scroll link, so play one pass with the path automated over time.
    const playOnce = () => {
      if (!ctx || !nodes || !buf) return;
      startSource(false);
      const t = ctx.currentTime, d = buf.duration;
      const ap = (prm: AudioParam, vals: number[]) => {
        prm.cancelScheduledValues(t);
        PATH3.forEach((row, i) => prm.linearRampToValueAtTime(vals[i], t + row[0] * d));
      };
      ap(nodes.pan.positionX, PATH3.map((r) => r[1]));
      ap(nodes.pan.positionY, PATH3.map((r) => r[2]));
      ap(nodes.pan.positionZ, PATH3.map((r) => r[3]));
      nodes.gain.gain.cancelScheduledValues(t);
      nodes.gain.gain.setValueAtTime(0.9, t);
      nodes.shelf.gain.setValueAtTime(0, t);
      nodes.shelf.gain.linearRampToValueAtTime(14, t + 0.62 * d);
      nodes.shelf.gain.linearRampToValueAtTime(0, t + 0.85 * d);
    };

    const ensureAudio = async () => {
      if (!ctx) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        const shelf = ctx.createBiquadFilter();
        shelf.type = "lowshelf";
        shelf.frequency.value = 140;
        const pan = new PannerNode(ctx, { panningModel: "HRTF", distanceModel: "inverse", refDistance: 1.5, rolloffFactor: 1.1 });
        const gain = ctx.createGain();
        gain.gain.value = 0;
        shelf.connect(pan).connect(gain).connect(ctx.destination);
        nodes = { gain, pan, shelf };
        const a = document.createElement("audio");
        const url = a.canPlayType('audio/webm; codecs="opus"') ? MEDIA.sfxWebm : MEDIA.sfxMp3;
        try {
          buf = await ctx.decodeAudioData(await (await fetch(url)).arrayBuffer());
        } catch {
          buf = null;
        }
        if (!reduced) startSource(true);
      }
      if (ctx.state !== "running") await ctx.resume().catch(() => undefined);
      if (reduced) playOnce(); else audioFrame();
    };

    const fadeOut = () => {
      if (!ctx || !nodes) return;
      nodes.gain.gain.cancelScheduledValues(ctx.currentTime);
      nodes.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
      window.clearTimeout(suspendT);
      suspendT = window.setTimeout(() => { if (ctx && !(want && inView)) ctx.suspend().catch(() => undefined); }, 900);
    };

    audio.current = {
      set: (v2: boolean) => {
        want = v2;
        if (v2) { window.clearTimeout(suspendT); void ensureAudio(); } else fadeOut();
      },
    };

    // ---------- Visuals ----------
    const layout = () => {
      const w = sc.clientWidth, h = sc.clientHeight;
      const q = STUDIO.screen.map(([x, y]) => [(x / 100) * w, (y / 100) * h]);
      v.style.transform = quadMatrix(v.offsetWidth || 640, v.offsetHeight || 360, q);
    };

    const loadVideo = () => {
      if (loaded || reduced) return;
      loaded = true;
      v.preload = "auto";
      v.load();
    };

    const paint = (pp: number) => {
      p = pp;
      const lv = lerpTable(LEVELS, p);
      lv.forEach((val, i) => el.style.setProperty(`--${CH[i]}`, val.toFixed(3)));
      el.style.setProperty("--p", p.toFixed(3));
      el.style.setProperty("--z", lerpTable(ZOOM, p)[0].toFixed(4));
      const [x, y, size, op] = lerpTable(PATH, p);
      src.current?.setAttribute("transform", `translate(${px(x).toFixed(1)} ${py(y).toFixed(1)}) scale(${size.toFixed(3)})`);
      if (src.current) src.current.style.opacity = op.toFixed(3);
      trail.current.forEach((c, i) => {
        if (!c) return;
        const [tx, ty, , to] = lerpTable(PATH, Math.max(0, p - (i + 1) * 0.015));
        c.setAttribute("cx", px(tx).toFixed(1));
        c.setAttribute("cy", py(ty).toFixed(1));
        c.style.opacity = (p > 0.5 ? to * (1 - i / TRAIL) * 0.9 : 0).toFixed(3);
      });
      let st = 0;
      STAGE_AT.forEach((a, i) => { if (p >= a) st = i; });
      el.dataset.stage = String(st);
      if (loaded && v.duration) {
        const tt = Math.min(1, p / MEDIA.videoEnd) * (v.duration - 0.05);
        if (Math.abs(v.currentTime - tt) > 0.02) v.currentTime = tt;
      }
      audioFrame();
    };

    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      paint(Math.min(1, Math.max(0, -r.top / (span || 1))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const onResize = () => { layout(); onScroll(); };
    const start = () => {
      if (on) return;
      on = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      tick();
    };
    const stop = () => {
      on = false;
      window.removeEventListener("scroll", onScroll);
    };

    layout();
    window.addEventListener("resize", onResize);
    v.addEventListener("loadedmetadata", onScroll);

    // Restore an earlier unmute from this tab; browsers need a gesture to start audio.
    const kick = () => { if (want) void ensureAudio(); };
    if (sessionStorage.getItem(KEY) === "on") {
      want = true;
      queueMicrotask(() => setSound(true));
      window.addEventListener("pointerdown", kick, { once: true });
      window.addEventListener("keydown", kick, { once: true });
    }

    const vis = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView && want) void ensureAudio(); else if (!inView) fadeOut();
    });
    vis.observe(el);

    let io: IntersectionObserver | null = null;
    if (reduced) {
      paint(0.62);
      el.dataset.stage = "all";
    } else {
      paint(0);
      // Lazy: only load the clip and listen to scroll while the section is near.
      io = new IntersectionObserver(([e]) => {
        near = e.isIntersecting;
        el.dataset.live = near ? "true" : "false";
        if (near) { loadVideo(); start(); } else stop();
      }, { rootMargin: "100% 0px" });
      io.observe(el);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
      v.removeEventListener("loadedmetadata", onScroll);
      io?.disconnect();
      vis.disconnect();
      stop();
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(suspendT);
      ctx?.close().catch(() => undefined);
      audio.current = null;
    };
  }, []);

  const toggle = () => {
    const next = !sound;
    setSound(next);
    try { sessionStorage.setItem(KEY, next ? "on" : "off"); } catch { /* storage blocked */ }
    audio.current?.set(next);
  };

  const skip = () => {
    const t = after.current;
    if (!t) return;
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: "auto" });
  };

  const inRoom = CH.filter((c) => !STUDIO.speakers[c].edge);
  const edges = CH.filter((c) => STUDIO.speakers[c].edge);
  const sw = STUDIO.sweet;

  return (
    <section
      ref={root}
      className={`eva-svc-section ${s.wrap}`}
      aria-labelledby={headingId}
      data-stage="0"
      style={{
        ["--ar" as string]: `${STUDIO.width} / ${STUDIO.height}`,
        ["--arn" as string]: String(STUDIO.width / STUDIO.height),
        ["--fx" as string]: `${STUDIO.focus.x}%`,
        ["--fy" as string]: `${STUDIO.focus.y}%`,
        ["--mw" as string]: `${STUDIO.mobile.width}vw`,
        ["--mc" as string]: String(STUDIO.mobile.centre / 100),
      }}
    >
      <div className={s.sticky}>
        <div ref={scene} className={s.scene}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={STUDIO.photo} alt={STUDIO.alt} width={STUDIO.width} height={STUDIO.height} className={s.photo} loading="lazy" decoding="async" />
          <div className={s.screen} aria-hidden="true">
            <video ref={video} className={s.video} muted playsInline preload="none" poster={MEDIA.poster} width={640} height={360} tabIndex={-1}>
              <source src={MEDIA.webm} type="video/webm" />
              <source src={MEDIA.mp4} type="video/mp4" />
            </video>
          </div>
          <svg viewBox={`0 0 ${VW} ${VH.toFixed(0)}`} className={s.svg} aria-hidden="true">
            <defs>
              <filter id="sx-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <radialGradient id="sx-dome" cx=".5" cy="1" r="1">
                <stop offset="0" stopColor="#70b615" stopOpacity=".05" /><stop offset=".8" stopColor="#70b615" stopOpacity=".3" /><stop offset="1" stopColor="#b6ff52" stopOpacity=".75" />
              </radialGradient>
            </defs>
            <rect x={px(STUDIO.screen[0][0]) - 3} y={py(STUDIO.screen[0][1]) - 3} width={px(STUDIO.screen[1][0] - STUDIO.screen[0][0]) + 6} height={py(STUDIO.screen[2][1] - STUDIO.screen[0][1]) + 6}
              className={s.frame} filter="url(#sx-glow)" />
            <ellipse cx={px(sw.x)} cy={py(sw.y) + 40} rx="300" ry="190" fill="url(#sx-dome)" className={s.dome} />
            {inRoom.map((c) => (
              <line key={c} x1={px(STUDIO.speakers[c].x)} y1={py(STUDIO.speakers[c].y)} x2={px(sw.x)} y2={py(sw.y)}
                className={s.beam} style={{ opacity: `var(--${c})` }} filter="url(#sx-glow)" />
            ))}
            {inRoom.map((c) => (
              <g key={c} transform={`translate(${px(STUDIO.speakers[c].x)} ${py(STUDIO.speakers[c].y)})`}>
                <g className={s.rings} style={{ opacity: `var(--${c})`, transform: `scale(calc(.5 + var(--${c}) * ${c === "LFE" ? 1.3 : 0.9}))` }}>
                  {[0, 1, 2, 3].map((r) => <circle key={r} r="44" className={s.ring} style={{ animationDelay: `${r * -0.45}s` }} />)}
                </g>
                <circle r="7" className={s.cone} style={{ opacity: `calc(.35 + var(--${c}))` }} />
                <g className={s.tag} transform="translate(0 -22)">
                  <rect x="-20" y="-14" width="40" height="22" rx="11" />
                  <text y="2">{c}</text>
                </g>
              </g>
            ))}
            <circle cx={px(sw.x)} cy={py(sw.y)} r="9" className={s.listener} />
            {Array.from({ length: TRAIL }, (_, i) => (
              <circle key={i} ref={(n) => { trail.current[i] = n; }} r={14 - i} className={s.trail} filter="url(#sx-glow)" />
            ))}
            <g ref={src}>
              <circle r="34" className={s.source} filter="url(#sx-glow)" />
              <circle r="12" className={s.core} />
            </g>
          </svg>
        </div>

        {edges.map((c) => (
          <div key={c} className={`${s.edge} ${STUDIO.speakers[c].x < 50 ? s.edgeL : s.edgeR}`} style={{ ["--v" as string]: `var(--${c})` }} aria-hidden="true">
            <span className={s.edgeGlow} />
            <span className={s.edgeTag}>{c}<small>{c === "Ls" ? "left surround" : "right surround"}</small></span>
          </div>
        ))}

        <div className={s.head}>
          <h2 id={headingId} className="eva-svc-title">
            <i className="icon icon-mic-2" aria-hidden="true" /> The mixing <span>room</span>
          </h2>
          <p className={s.sub}>Scroll to fly a jet through a 5.1 room and watch every speaker respond.</p>
          <div className={s.controls}>
            <button type="button" className={s.sound} aria-pressed={sound} onClick={toggle} aria-label="Sound">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
                {sound ? (
                  <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M16 9l6 6M22 9l-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
              <span>{sound ? "Sound on" : "Sound off"}</span>
            </button>
            <button type="button" className={s.skip} onClick={skip}>Skip animation</button>
          </div>
          <p className={s.hint}>Best with headphones</p>
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

        <p className={s.credit}>
          <a href={STUDIO.credit.href} target="_blank" rel="noopener noreferrer">{STUDIO.credit.text}</a>,{" "}
          <a href={STUDIO.credit.licenseHref} target="_blank" rel="noopener noreferrer license">{STUDIO.credit.license}</a>.
          Footage and sound: Mixkit (free licence).
        </p>
      </div>
      <div ref={after} className={s.after} />
    </section>
  );
}
