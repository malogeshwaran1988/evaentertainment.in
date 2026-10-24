"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import s from "./SurroundExperience.module.scss";

/**
 * Scroll-driven 5.1 studio clip. EVA's studio film (jet on the screen, then the
 * camera pulls back to reveal all six speakers) is scrubbed by scroll as a
 * full-width backdrop, with light overlays: channel meters, step captions,
 * Sound on/off (Web Audio with an HRTF panner following the jet) and Skip.
 *
 * To change the visuals, edit only STUDIO below. Set credit to null for our own
 * media (no credit line is rendered).
 */
export const STUDIO: {
  webm: string; mp4: string; poster: string; width: number; height: number; alt: string;
  credit: { text: string; href: string } | null;
} = {
  webm: "/media/surround/studio-51.webm",
  mp4: "/media/surround/studio-51.mp4",
  poster: "/images/services/mixing-room-51-eva.avif",
  width: 1600,
  height: 900,
  alt: "EVA's 5.1 mixing room: a large screen on the front wall, left, centre and right monitors, rear surround speakers on stands, a subwoofer under the desk and a mixing console.",
  credit: null,
};

const MEDIA = {
  sfxWebm: "/media/surround/jet-sfx.webm",
  sfxMp3: "/media/surround/jet-sfx.mp3",
  videoEnd: 0.92, // scroll progress at which the clip reaches its last frame
};

const CH = ["L", "C", "R", "LFE", "Ls", "Rs"] as const;
// Same order as CH: [progress, L, C, R, LFE, Ls, Rs]
const LEVELS: number[][] = [
  [0, 0.08, 0.35, 0.08, 0, 0, 0],
  [0.2, 0.15, 0.6, 0.15, 0.05, 0, 0],
  [0.45, 0.95, 1, 0.95, 0.35, 0.15, 0.15],
  [0.62, 0.9, 0.8, 0.9, 1, 0.85, 0.85],
  [0.78, 0.2, 0.15, 0.2, 0.45, 1, 1],
  [0.92, 0.05, 0.05, 0.05, 0.05, 0.35, 0.35],
  [1, 0.05, 0.05, 0.05, 0.05, 0.3, 0.3],
];
const LFE_I = 3;
// Listener-space position for the HRTF panner (metres): [progress, x, y, z]; -z is in front.
const PATH3: number[][] = [
  [0, 0, 0.5, -30],
  [0.45, 0, 0.6, -6],
  [0.62, 0, 2.2, -0.5],
  [0.72, 0, 2, 2],
  [0.86, 0, 1, 9],
  [1, 0, 0.5, 20],
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
  { t: "Far away", d: "The jet sits in the centre channel, with only a hint in left and right." },
  { t: "Front channels carry the approach", d: "L, C and R swell and widen the sound across the screen." },
  { t: "LFE adds the rumble", d: "Every channel opens up and the subwoofer shakes the room." },
  { t: "Surrounds put it behind you", d: "Ls and Rs take over, so you hear the jet leave the room." },
  { t: "The mixing room", d: "Pro Tools mixing, Genelec and Yamaha monitoring, and a recording booth next door for pickups during the mix." },
];
const STAGE_AT = [0, 0.2, 0.5, 0.7, 0.88];
const KEY = "eva-surround-sound";

type AudioApi = { set: (on: boolean) => void };

export default function SurroundExperience({ headingId }: { headingId: string }) {
  const root = useRef<HTMLElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const after = useRef<HTMLDivElement | null>(null);
  const audio = useRef<AudioApi | null>(null);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const el = root.current;
    const v = video.current;
    if (!el || !v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, on = false, inView = false, loaded = false, p = 0, want = false;

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
      nodes.shelf.gain.setTargetAtTime(lv[LFE_I] * 14, t, 0.08);
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

    // ---------- Visuals: one rAF per scroll, refs only, no React state ----------
    const last: string[] = [];
    let lastSeek = -1;
    const paint = (pp: number) => {
      p = pp;
      const lv = lerpTable(LEVELS, p);
      lv.forEach((val, i) => {
        const t = `scaleY(${val.toFixed(3)})`;
        const b2 = bars.current[i];
        if (b2 && last[i] !== t) { last[i] = t; b2.style.transform = t; }
      });
      let st = 0;
      STAGE_AT.forEach((a2, i) => { if (p >= a2) st = i; });
      if (el.dataset.stage !== String(st)) el.dataset.stage = String(st);
      if (loaded && v.duration && !v.seeking) {
        const tt = Math.min(1, p / MEDIA.videoEnd) * (v.duration - 0.05);
        if (Math.abs(tt - lastSeek) >= 1 / 24) {
          lastSeek = tt;
          const fs = (v as HTMLVideoElement & { fastSeek?: (t: number) => void }).fastSeek;
          if (fs) fs.call(v, tt); else v.currentTime = tt;
        }
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
    const loadVideo = () => {
      if (loaded || reduced) return;
      loaded = true;
      v.preload = "auto";
      v.load();
    };

    window.addEventListener("resize", onScroll);
    v.addEventListener("loadedmetadata", onScroll);
    v.addEventListener("seeked", onScroll);

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
      // Static snapshot of the loudest moment: every channel at its real level.
      LEVELS[3].slice(1).forEach((val, i) => { const b2 = bars.current[i]; if (b2) b2.style.transform = `scaleY(${val})`; });
      p = 0.62;
      el.dataset.stage = "all";
    } else {
      paint(0);
      // Lazy: only load the clip and listen to scroll while the section is near.
      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { loadVideo(); start(); } else stop();
      }, { rootMargin: "100% 0px" });
      io.observe(el);
    }

    return () => {
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
      v.removeEventListener("loadedmetadata", onScroll);
      v.removeEventListener("seeked", onScroll);
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

  return (
    <section
      ref={root}
      className={`eva-svc-section ${s.wrap}`}
      aria-labelledby={headingId}
      data-stage="0"
      style={{ ["--ar" as string]: `${STUDIO.width} / ${STUDIO.height}` }}
    >
      <div className={s.sticky}>
        <div className={s.scene}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={STUDIO.poster} alt={STUDIO.alt} width={STUDIO.width} height={STUDIO.height} className={s.still} loading="lazy" decoding="async" />
          <video ref={video} className={s.video} muted playsInline preload="none" poster={STUDIO.poster} width={STUDIO.width} height={STUDIO.height} tabIndex={-1} aria-hidden="true">
            <source src={STUDIO.webm} type="video/webm" />
            <source src={STUDIO.mp4} type="video/mp4" />
          </video>
        </div>

        <div className={s.head}>
          <h2 id={headingId} className="eva-svc-title">
            <i className="icon icon-mic-2" aria-hidden="true" /> The mixing <span>room</span>
          </h2>
          <p className={s.sub}>
            <span className={s.subMotion}>Scroll to fly a jet through a 5.1 room and watch every channel respond.</span>
            <span className={s.subStill}>A jet flies through a 5.1 room, and every channel responds as it passes.</span>
          </p>
          <div className={s.controls}>
            <button type="button" className={s.sound} aria-pressed={sound} onClick={toggle} aria-label="Sound">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
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
          {CH.map((c, i) => (
            <div key={c} className={s.meter}>
              <span className={s.track}><span className={s.bar} ref={(n) => { bars.current[i] = n; }} /></span>
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

        {STUDIO.credit ? (
          <p className={s.credit}><a href={STUDIO.credit.href} target="_blank" rel="noopener noreferrer">{STUDIO.credit.text}</a></p>
        ) : null}
      </div>
      <div ref={after} className={s.after} />
    </section>
  );
}
