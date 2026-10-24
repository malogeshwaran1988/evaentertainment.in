"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pickAudio } from "@@/components/services/ServiceVideo";

/**
 * Voice showcase: one studio frame per artist (male, female, child). "Listen" buttons crossfade to that
 * artist's looping muted clip and play their voice sample; when a sample ends it advances to the next
 * voice (male → female → child → male) until the visitor pauses. Audio loads only on the first click.
 *
 * PLACEHOLDER AUDIO: the *-voice.webm / *-voice.m4a samples were generated with macOS text-to-speech
 * (Rishi en_IN for male, Lekha hi_IN for female, Lekha pitched up for child). Replace them with real
 * EVA artist samples (same file names, about 6–8 s, Opus 40 kbps mono + AAC m4a fallback).
 */
const VOICES = [
  { id: "male", label: "Male", alt: "Indian male voice artist with headphones speaking at a studio microphone" },
  { id: "female", label: "Female", alt: "Indian female voice artist with headphones speaking at a studio microphone" },
  { id: "child", label: "Child", alt: "Indian child voice artist with headphones speaking at a studio microphone" },
] as const;

const base = (id: string) => `/media/voices/${id}`;
const R = 15;
const CIRC = 2 * Math.PI * R;

export default function VoiceShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const audios = useRef<(HTMLAudioElement | null)[]>([]);
  const visible = useRef(false);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>([false, false, false]);
  const reducedRef = useRef(false);

  const playVideo = useCallback(
    (i: number) => {
      vids.current.forEach((v, j) => {
        if (!v) return;
        if (j === i && visible.current && !reducedRef.current) v.play().catch(() => {});
        else v.pause();
      });
    },
    [],
  );

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reducedRef.current = true;
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setLoaded((l) => (l[0] ? l : [true, l[1], l[2]]));
        } else {
          vids.current.forEach((v) => v?.pause());
          audios.current.forEach((a) => a?.pause());
          setPlaying(false);
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!reducedRef.current) playVideo(active);
  }, [active, loaded, playVideo]);

  useEffect(() => () => audios.current.forEach((a) => a?.pause()), []);

  const getAudio = (i: number) => {
    let a = audios.current[i];
    if (!a) {
      const id = VOICES[i].id;
      a = new Audio(pickAudio(`${base(id)}-voice.webm`, `${base(id)}-voice.m4a`));
      a.preload = "auto";
      a.addEventListener("timeupdate", () => {
        if (a && a.duration) setProgress(a.currentTime / a.duration);
      });
      a.addEventListener("ended", () => {
        const next = (i + 1) % VOICES.length;
        start(next);
      });
      audios.current[i] = a;
    }
    return a;
  };

  function start(i: number) {
    audios.current.forEach((a, j) => {
      if (a && j !== i) {
        a.pause();
        a.currentTime = 0;
      }
    });
    setActive(i);
    setProgress(0);
    if (!reducedRef.current) setLoaded((l) => l.map((v, j) => v || j === i));
    const a = getAudio(i);
    a.currentTime = 0;
    a.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }

  const pause = () => {
    audios.current[active]?.pause();
    setPlaying(false);
  };

  const onListen = (i: number) => {
    if (i === active && playing) return pause();
    if (i === active && audios.current[i] && audios.current[i]!.currentTime > 0 && !audios.current[i]!.ended) {
      audios.current[i]!.play().then(() => setPlaying(true)).catch(() => {});
      return;
    }
    start(i);
  };

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const btns = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button[data-voice]"));
    const idx = btns.indexOf(document.activeElement as HTMLButtonElement);
    if (idx < 0) return;
    let n = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (idx + 1) % btns.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (idx - 1 + btns.length) % btns.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = btns.length - 1;
    if (n >= 0) {
      e.preventDefault();
      btns[n].focus();
    }
  };

  return (
    <div ref={root} className="eva-voices">
      {VOICES.map((v, i) => (
        <video
          key={v.id}
          ref={(el) => {
            vids.current[i] = el;
          }}
          className={`eva-svc-video eva-voices-clip${i === active ? " is-active" : ""}`}
          poster={`${base(v.id)}-poster.avif`}
          muted
          loop
          playsInline
          preload="none"
          aria-label={v.alt}
          aria-hidden={i !== active}
          disablePictureInPicture
        >
          {loaded[i] && (
            <>
              <source src={`${base(v.id)}.webm`} type="video/webm" />
              <source src={`${base(v.id)}.mp4`} type="video/mp4" />
            </>
          )}
        </video>
      ))}
      <div className="eva-voices-bar">
        <div className="eva-voices-pills" role="group" aria-label="Listen to a voice sample" onKeyDown={onKey}>
          {VOICES.map((v, i) => {
            const on = i === active && playing;
            return (
              <button
                key={v.id}
                type="button"
                data-voice={v.id}
                className={`eva-voices-pill${i === active ? " is-active" : ""}`}
                aria-pressed={on}
                aria-label={`Listen: ${v.label} voice`}
                onClick={() => onListen(i)}
              >
                <span className="eva-voices-ring" aria-hidden="true">
                  <svg width="36" height="36" viewBox="0 0 36 36" focusable="false">
                    <circle cx="18" cy="18" r={R} className="eva-voices-ring-bg" />
                    <circle
                      cx="18"
                      cy="18"
                      r={R}
                      className="eva-voices-ring-fg"
                      strokeDasharray={CIRC}
                      strokeDashoffset={i === active ? CIRC * (1 - progress) : CIRC}
                    />
                    {on ? (
                      <path d="M14 12h3v12h-3zM19 12h3v12h-3z" fill="currentColor" />
                    ) : (
                      <path d="M15 12l9 6-9 6z" fill="currentColor" />
                    )}
                  </svg>
                </span>
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>
        {playing && (
          <button type="button" className="eva-media-sound eva-voices-pause" onClick={pause} >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor" />
            </svg>
            <span>Pause</span>
            <span className="sr-only"> voice samples</span>
          </button>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {playing ? `Playing ${VOICES[active].label.toLowerCase()} voice sample` : ""}
      </p>
    </div>
  );
}
