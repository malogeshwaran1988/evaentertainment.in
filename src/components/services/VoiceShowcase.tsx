"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { claimAudio, registerAudio } from "@@/lib/audio-focus";

const FOCUS = "voice-showcase";

/**
 * Voice showcase: one studio clip per artist (male, female, child). Each clip carries its own voice track,
 * so lips and voice stay in sync. Idle, the active clip loops muted. "Listen" restarts that clip with sound;
 * when it ends the showcase advances to the next voice (male -> female -> child -> male) until paused.
 * Media loads only once the section is near the viewport.
 *
 * DEMO CLIPS: generated studio performances (EVA logo top-left plus a faint centre watermark).
 * Replace them with real EVA artist recordings (same file names, about 8 s, webm VP9/Opus + mp4 H.264/AAC).
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
  const visible = useRef(false);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>([false, false, false]);
  const reducedRef = useRef(false);
  const playingRef = useRef(false);
  playingRef.current = playing;

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
          vids.current.forEach((v) => {
            if (!v) return;
            v.pause();
            v.muted = true;
          });
          setPlaying(false);
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!reducedRef.current && !playingRef.current) playVideo(active);
  }, [active, loaded, playVideo]);

  useEffect(() => () => vids.current.forEach((v) => v?.pause()), []);

  // One sound at a time: another clip took sound, so every voice goes back to a muted loop.
  useEffect(
    () =>
      registerAudio(FOCUS, () => {
        vids.current.forEach((v) => {
          if (!v) return;
          v.muted = true;
          v.loop = true;
        });
        playingRef.current = false;
        setPlaying(false);
      }),
    [],
  );

  const onTime = (i: number) => {
    const v = vids.current[i];
    if (v && i === active && !v.muted && v.duration) setProgress(v.currentTime / v.duration);
  };

  const onEnded = (i: number) => {
    if (i !== active || !playingRef.current) return;
    start((i + 1) % VOICES.length);
  };

  function start(i: number) {
    vids.current.forEach((v, j) => {
      if (v && j !== i) {
        v.pause();
        v.muted = true;
        v.loop = true;
      }
    });
    setActive(i);
    setProgress(0);
    setLoaded((l) => l.map((x, j) => x || j === i));
    // Sources render after the state update; wait a frame so the element has them.
    requestAnimationFrame(() => {
      const v = vids.current[i];
      if (!v) return;
      if (v.networkState === v.NETWORK_EMPTY) v.load();
      v.loop = false;
      claimAudio(FOCUS);
      v.muted = false;
      v.currentTime = 0;
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {
          v.muted = true;
          setPlaying(false);
        });
    });
  }

  const pause = () => {
    const v = vids.current[active];
    if (v) v.pause();
    setPlaying(false);
  };

  const onListen = (i: number) => {
    if (i === active && playing) return pause();
    const v = vids.current[i];
    if (i === active && v && !v.muted && v.currentTime > 0 && !v.ended) {
      claimAudio(FOCUS);
      v.play().then(() => setPlaying(true)).catch(() => {});
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
          onTimeUpdate={() => onTime(i)}
          onEnded={() => onEnded(i)}
          preload="none"
          aria-label={v.alt}
          aria-hidden={i !== active}
          disablePictureInPicture
          data-audio-focus={FOCUS}
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
                data-audio-btn=""
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
          <button type="button" className="eva-media-sound eva-voices-pause" data-audio-btn="" onClick={pause}>
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
