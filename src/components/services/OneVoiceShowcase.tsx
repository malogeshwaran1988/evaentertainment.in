"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { claimAudio, otherHasAudio, registerAudio, releaseAudio } from "@@/lib/audio-focus";
import BrandMark from "@@/components/common/BrandMark";
import FullscreenStage, { FsControls } from "@@/components/common/FullscreenStage";
import { SoundIcon } from "@@/components/services/ServiceVideo";
import s from "./OneVoiceShowcase.module.scss";

const BASE = "/media/onevoice";
const FOCUS = "onevoice-showcase";

/** One original line, performed by the same artist in each language. English first. */
const LANGS = [
  { code: "en", name: "English", line: "Whatever happens tonight, I won't leave you behind." },
  { code: "hi", name: "Hindi", line: "आज रात जो भी हो, मैं तुम्हें पीछे नहीं छोड़ूँगा।" },
  { code: "bn", name: "Bengali", line: "আজ রাতে যা-ই হোক, আমি তোমাকে ফেলে যাব না।" },
  { code: "mr", name: "Marathi", line: "आज रात्री काहीही झालं, तरी मी तुला मागे सोडणार नाही." },
  { code: "te", name: "Telugu", line: "ఈ రాత్రి ఏం జరిగినా, నిన్ను వదిలి వెళ్ళను." },
  { code: "ta", name: "Tamil", line: "இன்றிரவு என்ன நடந்தாலும், உன்னை விட்டுப் போக மாட்டேன்." },
] as const;

/**
 * Hollywood source scene (always English, muted picture-in-picture) beside the same voice artist
 * performing the line in each language. Clips load only when in view, one language at a time.
 * Sound on by default (falls back to "Tap for sound" when the browser blocks it) and follows audio focus.
 * The tour moves to the next language when a clip ends. Reduced motion: posters until a chip is picked.
 */
export default function OneVoiceShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const artist = useRef<HTMLVideoElement>(null);
  const source = useRef<HTMLVideoElement>(null);
  const [idx, setIdx] = useState(0);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [armed, setArmed] = useState(false);
  const reduced = useRef(false);
  const wantSound = useRef(true);
  const resume = useRef(false);
  const lang = LANGS[idx];

  useEffect(
    () =>
      registerAudio(FOCUS, () => {
        if (artist.current) artist.current.muted = true;
        wantSound.current = false;
        setSound(false);
      }),
    [],
  );

  const start = useCallback(() => {
    const v = artist.current;
    const src = source.current;
    if (!v) return;
    const audible = wantSound.current && !otherHasAudio(FOCUS) && sessionStorage.getItem("eva-onevoice-mute") !== "1";
    v.muted = !audible;
    if (audible) claimAudio(FOCUS);
    v.play()
      .then(() => {
        setSound(!v.muted);
        if (!v.muted) setBlocked(false);
      })
      .catch(() => {
        // Unmuted autoplay blocked: play muted and offer sound.
        v.muted = true;
        releaseAudio(FOCUS);
        setSound(false);
        setBlocked(true);
        v.play().catch(() => {});
      });
    if (src) src.play().catch(() => {});
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (inView) {
      if (!armed && !reduced.current) setArmed(true);
      else if (armed && resume.current) start();
      resume.current = false;
    } else if (artist.current && !artist.current.paused) {
      resume.current = true;
      artist.current.pause();
      source.current?.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // Load and play the chosen language (the source scene restarts in step, always in English).
  useEffect(() => {
    if (!armed) return;
    const v = artist.current;
    if (!v) return;
    v.load();
    const src = source.current;
    if (src) {
      if (src.readyState === 0) src.load();
      else src.currentTime = 0;
    }
    setProgress(0);
    start();
  }, [armed, idx, start]);

  const pick = (i: number) => {
    if (!armed) setArmed(true);
    if (i === idx && armed) start();
    else setIdx(i);
  };

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const n = LANGS.length;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (idx - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    pick(next);
    e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=radio]")[next]?.focus();
  };

  const togglePlay = () => {
    const v = artist.current;
    if (!v) return;
    if (!armed) return setArmed(true);
    if (v.paused) start();
    else {
      v.pause();
      source.current?.pause();
    }
  };

  const toggleSound = () => {
    const v = artist.current;
    if (!v) return;
    const next = !sound;
    wantSound.current = next;
    sessionStorage.setItem("eva-onevoice-mute", next ? "0" : "1");
    setBlocked(false);
    setSound(next);
    if (!next) {
      v.muted = true;
      releaseAudio(FOCUS);
      return;
    }
    if (!armed) return setArmed(true);
    claimAudio(FOCUS);
    v.muted = false;
    if (v.paused) start();
  };

  return (
    <FullscreenStage label="One voice, many languages" fill className={s.fs}>
    <div ref={root} className={s.wrap}>
      <video
        ref={artist}
        className={s.artist}
        poster={`${BASE}/poster.avif`}
        playsInline
        muted
        preload="none"
        disablePictureInPicture
        data-audio-focus={FOCUS}
        aria-label={`Voice artist performing the dubbed line in ${lang.name}`}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration) setProgress(v.currentTime / v.duration);
        }}
        onEnded={() => {
          if (!reduced.current) setIdx((i) => (i + 1) % LANGS.length);
        }}
      >
        {armed && (
          <>
            <source src={`${BASE}/${lang.code}.webm`} type="video/webm" />
            <source src={`${BASE}/${lang.code}.mp4`} type="video/mp4" />
          </>
        )}
      </video>

      <figure className={s.pip}>
        <video
          ref={source}
          className={s.pipVideo}
          poster={`${BASE}/source-poster.avif`}
          playsInline
          muted
          loop
          preload="none"
          disablePictureInPicture
          aria-label="Original English source scene playing on the reference monitor"
        >
          {armed && (
            <>
              <source src={`${BASE}/source.webm`} type="video/webm" />
              <source src={`${BASE}/source.mp4`} type="video/mp4" />
            </>
          )}
        </video>
        <figcaption className={s.tag}>Source: English</figcaption>
      </figure>

      <span className={s.badge}>Same voice, 10 languages</span>

      <p className={s.sub} lang={lang.code} aria-live="polite">
        <span className={s.subLang}>{lang.name}</span>
        {lang.line}
      </p>

      <FsControls>
      <div className={s.bar}>
        <div className={s.chips} role="radiogroup" aria-label="Dub language" onKeyDown={onKey}>
          {LANGS.map((l, i) => (
            <button
              key={l.code}
              type="button"
              role="radio"
              aria-checked={i === idx}
              tabIndex={i === idx ? 0 : -1}
              className={s.chip}
              data-audio-btn=""
              onClick={() => pick(i)}
            >
              {l.name}
              {i === idx ? <span className={s.ring} style={{ transform: `scaleX(${progress})` }} aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
        <div className={s.controls}>
          <button type="button" className={s.ctrl} onClick={togglePlay} aria-label={playing ? "Pause showcase" : "Play showcase"}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              {playing ? <path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor" /> : <path d="M7 5l12 7-12 7z" fill="currentColor" />}
            </svg>
          </button>
          <button
            type="button"
            className={`${s.ctrl}${blocked ? ` ${s.pulse}` : ""}`}
            data-audio-btn=""
            aria-pressed={sound}
            onClick={toggleSound}
          >
            <SoundIcon on={sound} />
            <span className={s.ctrlText}>{blocked ? "Tap for sound" : "Sound"}</span>
          </button>
        </div>
      </div>
      </FsControls>
      <BrandMark />
    </div>
    </FullscreenStage>
  );
}
