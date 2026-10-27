"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { claimAudio, otherHasAudio, registerAudio, releaseAudio, SOUND_BTN_SELECTOR } from "@@/lib/audio-focus";
import FullscreenStage, { FsControls } from "@@/components/common/FullscreenStage";
import s from "./SurroundExperience.module.scss";

/**
 * EVA's 5.1 mixing room. The studio film (a jet takes off on the screen and flies
 * toward the audience) plays as a normal video once the section is in view. Channel
 * meters, captions and the jet sound (Web Audio with an HRTF panner) follow the
 * video's currentTime, so lights and sound move with the plane.
 *
 * To change the visuals, edit only STUDIO below. Set credit to null for our own media.
 */
export const STUDIO: {
  webm: string; mp4: string; poster: string; width: number; height: number; alt: string;
  credit: { text: string; href: string } | null;
} = {
  webm: "/media/surround/studio-51.webm",
  mp4: "/media/surround/studio-51.mp4",
  poster: "/images/services/mixing-room-51-eva.avif",
  width: 1920,
  height: 1080,
  alt: "EVA 5.1 mixing room in Mumbai with a big screen, LCR monitors rear surround speakers, a subwoofer and a mixing console",
  credit: null,
};

const MEDIA = { sfxWebm: "/media/surround/jet-sfx.webm", sfxMp3: "/media/surround/jet-sfx.mp3" };

const CH = ["L", "C", "R", "LFE", "Ls", "Rs"] as const;
// Timeline as a fraction of the clip: [t, L, C, R, LFE, Ls, Rs]
const LEVELS: number[][] = [
  [0, 0.1, 0.35, 0.1, 0.05, 0, 0],
  [0.3, 0.3, 0.7, 0.3, 0.2, 0.05, 0.05],
  [0.45, 0.85, 1, 0.85, 0.6, 0.15, 0.15],
  [0.7, 0.95, 0.9, 0.95, 1, 0.5, 0.5],
  [0.88, 0.5, 0.4, 0.5, 0.9, 1, 1],
  [1, 0.2, 0.15, 0.2, 0.5, 1, 1],
];
const LFE_I = 3;
// Where each speaker cone sits in the clip, in % of the 16:9 frame, keyed by seconds.
// Tracked from the video frames (the camera slowly pushes in). [t, Lx, Ly, Cx, Cy, Rx, Ry, LFEx, LFEy, Lsx, Lsy, Rsx, Rsy]
const SPK_POS: number[][] = [
  [0, 28.1, 43.9, 52.2, 47.8, 76.8, 43.7, 45.1, 63.0, 5.2, 53.3, 94.8, 53.7],
  [1, 28.0, 43.9, 52.2, 47.8, 76.9, 43.7, 45.1, 63.1, 4.9, 53.5, 95.1, 53.9],
  [2, 27.9, 43.9, 52.2, 48.0, 77.1, 43.9, 45.1, 63.3, 4.6, 53.5, 95.5, 54.1],
  [3, 27.8, 44.1, 52.3, 48.1, 77.2, 43.9, 45.1, 63.5, 4.3, 53.9, 95.9, 54.3],
  [4, 27.7, 44.3, 52.3, 48.3, 77.3, 44.3, 45.1, 63.9, 3.9, 54.3, 96.2, 54.6],
  [5, 27.7, 44.6, 52.3, 48.7, 77.4, 44.6, 45.0, 64.3, 3.4, 54.5, 96.6, 55.1],
  [6, 27.6, 45.2, 52.3, 49.3, 77.5, 45.0, 45.0, 64.8, 3.1, 55.1, 96.9, 55.6],
  [7, 27.5, 45.7, 52.3, 49.8, 77.7, 45.6, 45.0, 65.6, 2.7, 55.9, 97.3, 56.3],
  [8, 27.4, 46.5, 52.3, 50.7, 77.8, 46.4, 44.8, 66.4, 2.4, 56.8, 97.5, 57.3],
  [9, 27.3, 47.8, 52.3, 51.9, 77.9, 47.7, 44.8, 67.7, 2.1, 58.1, 97.7, 58.5],
  [10, 27.2, 49.4, 52.2, 53.6, 78.0, 49.4, 44.8, 69.5, 1.9, 59.8, 97.9, 60.2],
  [11, 27.0, 51.4, 52.2, 55.6, 78.0, 51.4, 44.7, 71.8, 1.7, 61.6, 98.1, 62.0],
  [12, 26.9, 52.9, 52.2, 57.1, 78.1, 52.9, 44.7, 73.2, 1.5, 62.9, 98.3, 63.2],
];
// Cone size as % of frame width (LFE woofer is larger, side surrounds are closer to camera).
const SPK_SIZE = [3.6, 3.2, 3.6, 4.6, 4.4, 4.4];

function lerpRows(t: number[][], x: number) {
  let i = 0;
  while (i < t.length - 2 && x > t[i + 1][0]) i++;
  const a = t[i], b = t[i + 1];
  const k = Math.min(1, Math.max(0, (x - a[0]) / (b[0] - a[0] || 1)));
  return a.slice(1).map((v, j) => v + (b[j + 1] - v) * k);
}

// Listener-space jet position (metres): [t, x, y, z]; -z is in front.
const PATH3: number[][] = [
  [0, 0, 0.3, -24],
  [0.45, 0, 0.5, -12],
  [0.7, 0, 1.4, -5],
  [0.88, 0, 2.2, -0.8],
  [1, 0, 2.4, 3],
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
  { t: "On the runway", d: "The jet sits in the centre channel, with only a hint in left and right." },
  { t: "Front channels carry the take-off", d: "L, C and R swell and widen the sound across the screen." },
  { t: "LFE adds the rumble", d: "The subwoofer shakes the room as the wheels leave the ground." },
  { t: "Surrounds put it over you", d: "Ls and Rs take over as the jet flies toward the audience." },
];
const STAGE_AT = [0, 0.3, 0.55, 0.82];
const KEY = "eva-surround-sound";

type Sound = "on" | "off" | "blocked";
const FOCUS = "surround-51";
type Api = { toggleSound: () => void; togglePlay: () => void };

export default function SurroundExperience({ headingId }: { headingId: string }) {
  const root = useRef<HTMLElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const spks = useRef<(HTMLSpanElement | null)[]>([]);
  const api = useRef<Api | null>(null);
  const [sound, setSound] = useState<Sound>("off");
  const [playing, setPlaying] = useState(false);
  const [reducedUi, setReducedUi] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const el = root.current;
    const v = video.current;
    if (!el || !v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) queueMicrotask(() => setReducedUi(true));
    let saved: string | null = null;
    try { saved = sessionStorage.getItem(KEY); } catch { /* storage blocked */ }
    // Sound is wanted by default unless the visitor turned it off in this tab.
    let want = saved !== "off";
    let inView = false, loaded = false, raf = 0, userPaused = false, started = !reduced;

    // ---------- Web Audio ----------
    let ctx: AudioContext | null = null;
    let nodes: { gain: GainNode; pan: PannerNode; shelf: BiquadFilterNode; src?: AudioBufferSourceNode } | null = null;
    let buf: AudioBuffer | null = null;
    let loading: Promise<void> | null = null;

    const report = () => {
      if (!want) setSound("off");
      else setSound(ctx && ctx.state === "running" ? "on" : "blocked");
    };

    const startSource = () => {
      if (!ctx || !nodes || !buf) return;
      try { nodes.src?.stop(); } catch { /* already stopped */ }
      nodes.src = undefined;
      if (v.paused || !want) return;
      const n = ctx.createBufferSource();
      n.buffer = buf;
      n.connect(nodes.shelf);
      n.start(0, Math.min(buf.duration - 0.01, v.currentTime));
      nodes.src = n;
    };

    const setup = () => {
      if (loading) return loading;
      loading = (async () => {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        const shelf = ctx.createBiquadFilter();
        shelf.type = "lowshelf";
        shelf.frequency.value = 140;
        const pan = new PannerNode(ctx, { panningModel: "HRTF", distanceModel: "inverse", refDistance: 2, rolloffFactor: 0.8 });
        const gain = ctx.createGain();
        gain.gain.value = 0;
        shelf.connect(pan).connect(gain).connect(ctx.destination);
        nodes = { gain, pan, shelf };
        ctx.onstatechange = report;
        const url = document.createElement("audio").canPlayType('audio/webm; codecs="opus"') ? MEDIA.sfxWebm : MEDIA.sfxMp3;
        try { buf = await ctx.decodeAudioData(await (await fetch(url)).arrayBuffer()); } catch { buf = null; }
      })();
      return loading;
    };

    // Try to run audio. Without an earlier tap or click the browser keeps it suspended.
    // `auto`: started by scrolling or a stray tap; never takes sound from another clip.
    const tryAudio = async (auto = true) => {
      if (auto && otherHasAudio(FOCUS)) { want = false; report(); return; }
      if (!want || !inView) return;
      await setup();
      if (ctx && ctx.state !== "running") await ctx.resume().catch(() => undefined);
      if (!want) return;
      report();
      if (ctx?.state === "running") { claimAudio(FOCUS); startSource(); }
    };

    const silence = () => {
      releaseAudio(FOCUS);
      if (!ctx || !nodes) return;
      nodes.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
      const n = nodes.src;
      nodes.src = undefined;
      window.setTimeout(() => { try { n?.stop(); } catch { /* done */ } }, 500);
    };

    // ---------- Timeline: meters, captions and panner follow currentTime ----------
    const last: string[] = [];
    const lastSp: string[] = [];
    const paint = () => {
      const d = v.duration || 12;
      const p = Math.min(1, Math.max(0, v.currentTime / d));
      const lv = lerpTable(LEVELS, p);
      lv.forEach((val, i) => {
        const t = `scaleY(${val.toFixed(3)})`;
        const b = bars.current[i];
        if (b && last[i] !== t) { last[i] = t; b.style.transform = t; }
      });
      // Speaker rings: follow each cone as the camera moves; ring strength = channel level.
      const pos = lerpRows(SPK_POS, v.currentTime || 0);
      let top = 0;
      lv.forEach((val, i) => { if (val > lv[top]) top = i; });
      lv.forEach((val, i) => {
        const sp = spks.current[i];
        if (!sp) return;
        const lvl = val < 0.12 ? 0 : Math.min(1, (val - 0.12) / 0.78);
        const key = `${pos[i * 2].toFixed(2)}|${pos[i * 2 + 1].toFixed(2)}|${lvl.toFixed(2)}|${i === top}`;
        if (lastSp[i] === key) return;
        lastSp[i] = key;
        sp.style.left = `${pos[i * 2]}%`;
        sp.style.top = `${pos[i * 2 + 1]}%`;
        sp.style.setProperty("--lvl", lvl.toFixed(2));
        if (i === top && lvl > 0) sp.dataset.top = ""; else delete sp.dataset.top;
      });
      let st = 0;
      STAGE_AT.forEach((a, i) => { if (p >= a) st = i; });
      if (el.dataset.stage !== String(st)) { el.dataset.stage = String(st); setStage(st); }
      if (ctx && nodes) {
        const t = ctx.currentTime;
        const [x, y, z] = lerpTable(PATH3, p);
        nodes.pan.positionX.setTargetAtTime(x, t, 0.05);
        nodes.pan.positionY.setTargetAtTime(y, t, 0.05);
        nodes.pan.positionZ.setTargetAtTime(z, t, 0.05);
        nodes.shelf.gain.setTargetAtTime(lv[LFE_I] * 10, t, 0.08);
        nodes.gain.gain.setTargetAtTime(want && inView && !v.paused ? 1 : 0, t, 0.08);
      }
    };
    const loop = () => { paint(); raf = v.paused ? 0 : requestAnimationFrame(loop); };

    const onPlay = () => { setPlaying(true); el.dataset.playing = ""; if (!raf) raf = requestAnimationFrame(loop); if (ctx?.state === "running") startSource(); };
    const onPause = () => { setPlaying(false); delete el.dataset.playing; silence(); paint(); };
    const onSeeked = () => { paint(); if (!v.paused && ctx?.state === "running") startSource(); };
    // Loop by hand so the jet sound restarts exactly with the picture.
    const onEnded = () => { v.currentTime = 0; void v.play().catch(() => undefined); };
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("seeked", onSeeked);
    v.addEventListener("ended", onEnded);

    const load = () => {
      if (loaded) return;
      loaded = true;
      v.preload = "auto";
      v.load();
    };
    const play = () => {
      if (!started || userPaused || !inView) return;
      load();
      void v.play().catch(() => undefined);
      void tryAudio();
    };

    // Any tap or key press anywhere unlocks audio, so sound comes on by itself if wanted.
    const unlock = (e: Event) => {
      if ((e.target as Element | null)?.closest?.(SOUND_BTN_SELECTOR)) return; if (want && inView) void tryAudio(); else if (ctx && ctx.state !== "running") void ctx.resume().catch(() => undefined); };
    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);

    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting && !reduced) load(); }, { rootMargin: "100% 0px" });
    near.observe(el);
    const vis = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) play(); else { v.pause(); silence(); }
    }, { threshold: 0.45 });
    vis.observe(el);

    paint();
    queueMicrotask(report);

    // One sound at a time: another clip took sound, so mute the jet and stay muted.
    const unregister = registerAudio(FOCUS, () => { want = false; silence(); report(); });

    api.current = {
      toggleSound: () => {
        if (want && ctx?.state === "running") {
          want = false;
          try { sessionStorage.setItem(KEY, "off"); } catch { /* storage blocked */ }
          silence();
          report();
          return;
        }
        want = true;
        try { sessionStorage.setItem(KEY, "on"); } catch { /* storage blocked */ }
        void tryAudio(false);
      },
      togglePlay: () => {
        if (v.paused) {
          userPaused = false;
          started = true;
          setReducedUi(false);
          play();
        } else {
          userPaused = true;
          v.pause();
        }
      },
    };

    return () => {
      unregister();
      near.disconnect();
      vis.disconnect();
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("ended", onEnded);
      if (raf) cancelAnimationFrame(raf);
      ctx?.close().catch(() => undefined);
      api.current = null;
    };
  }, []);

  const soundLabel = sound === "on" ? "Sound on" : sound === "blocked" ? "Tap for sound" : "Sound off";

  return (
    <section
      ref={root}
      className={`eva-svc-section ${s.wrap}`}
      aria-labelledby={headingId}
      data-stage="0"
      data-still={reducedUi ? "true" : undefined}
      style={{ ["--ar" as string]: `${STUDIO.width} / ${STUDIO.height}` }}
    >
      <FullscreenStage label="5.1 mixing room" className={s.fs}>
      <div className={s.scene}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={STUDIO.poster} alt={STUDIO.alt} width={STUDIO.width} height={STUDIO.height} className={s.still} loading="lazy" decoding="async" />
        <video ref={video} className={s.video} muted playsInline preload="none" width={STUDIO.width} height={STUDIO.height} tabIndex={-1} aria-hidden="true">
          <source src={STUDIO.webm} type="video/webm" />
          <source src={STUDIO.mp4} type="video/mp4" />
        </video>
        <div className={s.spkLayer} aria-hidden="true">
          {CH.map((c, i) => (
            <span
              key={c}
              className={s.spk}
              data-ch={c}
              style={{ ["--sz" as string]: SPK_SIZE[i] }}
              ref={(n) => { spks.current[i] = n; }}
            >
              <i /><i /><i />
              <b>{c}</b>
            </span>
          ))}
        </div>
        {reducedUi ? (
          <button type="button" className={s.bigPlay} onClick={() => api.current?.togglePlay()}>
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
            <span>Play the 5.1 clip</span>
          </button>
        ) : null}
      </div>
      <FsControls only>
        <div className={s.fsControls}>
          <button
            type="button"
            className={`${s.sound} ${sound === "blocked" ? s.pulse : ""}`}
            aria-pressed={sound === "on"}
            data-audio-btn=""
            onClick={() => api.current?.toggleSound()}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
              {sound === "on" ? (
                <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M16 9l6 6M22 9l-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
            <span>{soundLabel}</span>
          </button>
          <button type="button" className={s.skip} aria-pressed={playing} onClick={() => api.current?.togglePlay()}>
            {playing ? "Pause video" : "Play video"}
          </button>
        </div>
        <ol className={s.fsStages}>
          {STAGES.map((st, i) => (
            <li key={st.t} aria-current={i === stage ? "step" : undefined}>
              <b>{st.t}</b>
              <span>{st.d}</span>
            </li>
          ))}
        </ol>
        <p className={s.hint}>Best with headphones. The rings on each speaker show which channel is playing.</p>
      </FsControls>
      </FullscreenStage>

      <div className={s.head}>
        <h2 id={headingId} className="eva-svc-title">
          <i className="icon icon-mic-2" aria-hidden="true" />The mixing <span>room</span>
        </h2>
        <p className={s.sub}>A jet takes off on screen and flies toward you. Watch every channel of the 5.1 room respond.</p>
        <div className={s.controls}>
          <button
            type="button"
            className={`${s.sound} ${sound === "blocked" ? s.pulse : ""}`}
            aria-pressed={sound === "on"}
            data-sound-btn=""
            data-audio-btn=""
            onClick={() => api.current?.toggleSound()}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
              {sound === "on" ? (
                <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M16 9l6 6M22 9l-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
            <span>{soundLabel}</span>
          </button>
          {!reducedUi ? (
            <button type="button" className={s.skip} onClick={() => api.current?.togglePlay()}>
              {playing ? "Pause video" : "Play video"}
            </button>
          ) : null}
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
          </li>
        ))}
      </ol>

      <p className={s.foot}>
        Pro Tools mixing, Genelec and Yamaha monitoring and a recording booth next door for pickups during the mix.{" "}
        <Link href="/studio-equipment" className={`link-on-dark ${s.link}`}>See the full studio equipment list</Link>
      </p>

      {STUDIO.credit ? (
        <p className={s.credit}><a className="link-on-dark" href={STUDIO.credit.href} target="_blank" rel="noopener noreferrer">{STUDIO.credit.text}</a></p>
      ) : null}
    </section>
  );
}
