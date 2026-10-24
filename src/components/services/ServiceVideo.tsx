"use client";

import { useEffect, useRef, useState } from "react";
import type { ServiceSfx, ServiceVideo as Video } from "@@/data/service-media";
import s from "./ServiceVideo.module.scss";

/** Pick the first audio source the browser can play (Opus webm, then AAC m4a). */
export function pickAudio(webm: string, m4a: string): string {
  const probe = document.createElement("audio");
  return probe.canPlayType('audio/webm; codecs="opus"') ? webm : m4a;
}

export function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      {on ? (
        <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

/**
 * Muted looping clip: loads near the viewport, pauses off screen, poster only under reduced motion.
 * With `sfx`, a 44px sound toggle (muted by default) plays an effect kept in sync with the video time.
 * The audio file is fetched only after the visitor turns sound on.
 * With `video.audio`, the same toggle unmutes the clip's own soundtrack instead.
 */
function LoopVideo({ video, poster, label, sfx }: { video: Video; poster: string; label: string; sfx?: ServiceSfx }) {
  const ref = useRef<HTMLVideoElement>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const visible = useRef(false);
  const [load, setLoad] = useState(false);
  const [sound, setSound] = useState(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm) {
      reducedRef.current = true;
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setLoad(true);
          el.play().catch(() => {});
        } else {
          el.pause();
          audio.current?.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (load) ref.current?.play().catch(() => {});
  }, [load]);

  // Keep the effect locked to the picture: follow video play/pause and correct drift (also on each loop).
  useEffect(() => {
    const el = ref.current;
    if (!el || !sfx) return;
    const sync = () => {
      const a = audio.current;
      if (!a || !sound) return;
      if (Math.abs(a.currentTime - el.currentTime) > 0.12) a.currentTime = el.currentTime;
      if (el.paused) a.pause();
      else if (a.paused) a.play().catch(() => {});
    };
    const pause = () => audio.current?.pause();
    el.addEventListener("timeupdate", sync);
    el.addEventListener("play", sync);
    el.addEventListener("seeked", sync);
    el.addEventListener("pause", pause);
    return () => {
      el.removeEventListener("timeupdate", sync);
      el.removeEventListener("play", sync);
      el.removeEventListener("seeked", sync);
      el.removeEventListener("pause", pause);
    };
  }, [sfx, sound]);

  useEffect(() => () => audio.current?.pause(), []);

  const own = video.audio;
  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (own) {
      const next = !sound;
      setSound(next);
      el.muted = !next;
      if (next) {
        if (!load) setLoad(true);
        if (reducedRef.current || visible.current) el.play().catch(() => {});
      }
      return;
    }
    if (!sfx) return;
    const next = !sound;
    setSound(next);
    if (!next) {
      audio.current?.pause();
      return;
    }
    if (!audio.current) {
      audio.current = new Audio(pickAudio(sfx.webm, sfx.m4a));
      audio.current.loop = true;
    }
    const a = audio.current;
    if (reducedRef.current) {
      // Reduced motion: no autoplaying picture, so the effect plays once on its own.
      a.loop = false;
      a.currentTime = 0;
      a.play().catch(() => {});
      return;
    }
    if (!load) setLoad(true);
    a.currentTime = el.currentTime;
    if (visible.current) {
      el.play().catch(() => {});
      a.play().catch(() => {});
    }
  };

  return (
    <>
      <video
        ref={ref}
        className="eva-svc-video"
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        disablePictureInPicture
      >
        {load && (
          <>
            <source src={video.webm} type="video/webm" />
            <source src={video.mp4} type="video/mp4" />
          </>
        )}
      </video>
      {(sfx || own) && (
        <button
          type="button"
          className="eva-media-sound"
          aria-pressed={sound}
          onClick={toggle}
        >
          <SoundIcon on={sound} />
          <span>Sound</span>
          <span className="sr-only">: {own ? `turn sound on/off, ${own}` : sfx?.label}</span>
        </button>
      )}
    </>
  );
}

type Sound = "on" | "off" | "blocked";

/**
 * Clip with its own soundtrack that starts with sound when it comes into view (`video.autoSound`).
 * Browsers often block unmuted autoplay until a tap; then the clip plays muted and the sound button
 * pulses "Tap for sound" (the first tap anywhere on the page also turns it on).
 * Turning sound off is remembered for the session. Reduced motion: poster plus a play button.
 */
function AutoSoundVideo({ video, poster, label }: { video: Video; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [sound, setSound] = useState<Sound>("off");
  const [reduced, setReduced] = useState(false);
  const [started, setStarted] = useState(false);
  const wantSound = useRef(true);
  const inView = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      if (sessionStorage.getItem("eva-video-sound") === "off") wantSound.current = false;
    } catch { /* storage blocked */ }
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm) {
      queueMicrotask(() => setReduced(true));
      return;
    }
    const start = () => {
      if (!wantSound.current) {
        el.muted = true;
        void el.play().catch(() => undefined);
        setSound("off");
        return;
      }
      el.muted = false;
      el.play().then(
        () => setSound("on"),
        () => {
          el.muted = true;
          setSound("blocked");
          void el.play().catch(() => undefined);
        },
      );
    };
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) setLoad(true); }, { threshold: 0.01 });
    const seen = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
        if (e.isIntersecting) start();
        else el.pause();
      },
      { threshold: 0.5 },
    );
    near.observe(el);
    seen.observe(el);
    return () => { near.disconnect(); seen.disconnect(); };
  }, []);

  // While blocked, the visitor's first tap or key press anywhere unlocks sound.
  useEffect(() => {
    if (sound !== "blocked") return;
    const unlock = (ev: Event) => {
      const el = ref.current;
      if (!el || (ev.target as Element | null)?.closest?.("[data-eva-sound]")) return;
      el.muted = false;
      el.play().then(() => setSound("on"), () => { el.muted = true; });
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [sound]);

  const remember = (on: boolean) => {
    wantSound.current = on;
    try { sessionStorage.setItem("eva-video-sound", on ? "on" : "off"); } catch { /* storage blocked */ }
  };

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (sound === "on") {
      el.muted = true;
      setSound("off");
      remember(false);
      return;
    }
    remember(true);
    el.muted = false;
    if (!load) setLoad(true);
    setSound("on");
    if (inView.current || reduced) void el.play().catch(() => undefined);
  };

  const playReduced = () => {
    const el = ref.current;
    if (!el) return;
    setLoad(true);
    setStarted(true);
    el.muted = !wantSound.current;
    setSound(wantSound.current ? "on" : "off");
    requestAnimationFrame(() => void el.play().catch(() => undefined));
  };

  const text = sound === "on" ? "Sound on" : sound === "blocked" ? "Tap for sound" : "Sound off";

  return (
    <>
      <video
        ref={ref}
        className="eva-svc-video"
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        disablePictureInPicture
        controls={reduced && started}
      >
        {load && (
          <>
            <source src={video.webm} type="video/webm" />
            <source src={video.mp4} type="video/mp4" />
          </>
        )}
      </video>
      {reduced && !started ? (
        <button type="button" className={s.play} onClick={playReduced}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
          Play video<span className="sr-only"> with {video.audio ?? "sound"}</span>
        </button>
      ) : (
        <button
          type="button"
          data-eva-sound=""
          className={`eva-media-sound ${sound === "blocked" ? s.pulse : ""}`}
          aria-pressed={sound === "on"}
          onClick={toggle}
        >
          <SoundIcon on={sound === "on"} />
          <span>{text}</span>
          <span className="sr-only">: {video.audio ?? "clip sound"}</span>
        </button>
      )}
    </>
  );
}

/**
 * Muted looping clip (optionally with a synced effect or its own soundtrack behind a toggle),
 * or, with `video.autoSound`, a clip that starts with sound when in view.
 */
export default function ServiceVideo(props: { video: Video; poster: string; label: string; sfx?: ServiceSfx }) {
  return props.video.autoSound ? <AutoSoundVideo {...props} /> : <LoopVideo {...props} />;
}
