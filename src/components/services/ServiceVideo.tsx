"use client";

import { useEffect, useRef, useState } from "react";
import type { ServiceSfx, ServiceVideo as Video } from "@@/data/service-media";

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
 */
export default function ServiceVideo({ video, poster, label, sfx }: { video: Video; poster: string; label: string; sfx?: ServiceSfx }) {
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

  const toggle = () => {
    const el = ref.current;
    if (!sfx || !el) return;
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
      {sfx && (
        <button
          type="button"
          className="eva-media-sound"
          aria-pressed={sound}
          onClick={toggle}
        >
          <SoundIcon on={sound} />
          <span>Sound</span>
          <span className="sr-only">: {sfx.label}</span>
        </button>
      )}
    </>
  );
}
