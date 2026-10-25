"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import s from "./FullscreenStage.module.scss";

/**
 * Shared full-screen "experience mode" for every video on the site.
 *
 * <FullscreenStage label="..." fill> wraps a media frame. It adds a 44px full-screen button (top-right) and, when
 * opened, shows the frame full screen (Fullscreen API on this wrapper, never the bare <video>; a fixed overlay on
 * iPhone Safari and other browsers without element full screen). The video is letterboxed (object-fit: contain)
 * on a dark backdrop and every demo control moves into a side panel (right, landscape) or bottom sheet (portrait).
 *
 * Controls opt in with <FsControls>: rendered in place normally, portalled into the panel in full screen. Use
 * <FsControls only> for extras that exist only in the panel. Nothing remounts the <video>, so playback, sound and
 * audio focus (src/lib/audio-focus.ts) carry over when entering or leaving.
 * Close: the X button or Esc. Focus is trapped while open and returns to the trigger on exit.
 */
type Mode = "api" | "overlay" | null;
const PanelCtx = createContext<HTMLElement | null>(null);

export function useFullscreenPanel() {
  return useContext(PanelCtx);
}

export function FsControls({ children, only = false }: { children: ReactNode; only?: boolean }) {
  const panel = useContext(PanelCtx);
  if (panel) return createPortal(children, panel);
  return only ? null : <>{children}</>;
}

type FsEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type FsDoc = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => Promise<void> | void };
const fsElement = () => document.fullscreenElement ?? (document as FsDoc).webkitFullscreenElement ?? null;

const FOCUSABLE = 'a[href], button:not([disabled]), select:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
// Fixed-overlay fallback: ancestors must not create a containing block or stacking context above the overlay.
const LIFT: [string, string][] = [
  ["transform", "none"], ["animation", "none"], ["will-change", "auto"], ["filter", "none"], ["contain", "none"],
  ["isolation", "auto"], ["clip-path", "none"], ["mask", "none"], ["opacity", "1"], ["z-index", "auto"], ["content-visibility", "visible"],
];

export default function FullscreenStage({
  label,
  fill = false,
  className = "",
  children,
}: {
  /** What is on screen, e.g. "Voice-over showcase". Used for the button and dialog names. */
  label: string;
  /** Absolutely fill the positioned parent (media frames). Off: stays in normal flow. */
  fill?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [panel, setPanel] = useState<HTMLElement | null>(null);
  const [ratio, setRatio] = useState("16 / 9");
  const titleId = useId();

  const saved = useRef<[HTMLElement, string | null][]>([]);
  const unchain = useCallback(() => {
    saved.current.forEach(([n, css]) => (css === null ? n.removeAttribute("style") : n.setAttribute("style", css)));
    saved.current = [];
  }, []);
  const chain = (el: HTMLElement) => {
    const lift = (n: HTMLElement, props: [string, string][]) => {
      saved.current.push([n, n.getAttribute("style")]);
      props.forEach(([k, v]) => n.style.setProperty(k, v, "important"));
    };
    for (let n = el.parentElement; n && n !== document.body && n !== document.documentElement; n = n.parentElement) lift(n, LIFT);
    lift(document.documentElement, [["overflow", "hidden"]]);
    lift(document.body, [["overflow", "hidden"]]);
  };

  const close = useCallback(() => {
    if (fsElement()) {
      const d = document as FsDoc;
      void (d.exitFullscreen ? d.exitFullscreen() : d.webkitExitFullscreen?.())?.catch?.(() => undefined);
    }
    unchain();
    setMode(null);
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  }, [unchain]);

  const open = async () => {
    const el = root.current as FsEl | null;
    const fr = frame.current;
    if (!el || !fr) return;
    const v = fr.querySelector("video");
    const r = fr.getBoundingClientRect();
    setRatio(v && v.videoWidth ? `${v.videoWidth} / ${v.videoHeight}` : `${Math.round(r.width)} / ${Math.round(r.height) || 1}`);
    try {
      if (el.requestFullscreen) await el.requestFullscreen({ navigationUI: "hide" });
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      else throw new Error("no element full screen");
      setMode("api");
    } catch {
      // iPhone Safari: fixed overlay. Lift ancestors out of transforms/stacking so position: fixed covers the page.
      chain(el);
      setMode("overlay");
    }
  };

  // Browser Esc / system exit from the Fullscreen API.
  useEffect(() => {
    if (mode !== "api") return;
    const onChange = () => { if (!fsElement()) close(); };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, [mode, close]);

  // Esc closes; Tab stays inside the full-screen view; focus moves to the close button on open.
  useEffect(() => {
    if (!mode) return;
    const el = root.current;
    if (!el) return;
    requestAnimationFrame(() => el.querySelector<HTMLElement>("[data-fs-close]")?.focus({ preventScroll: true }));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      const a = document.activeElement as HTMLElement | null;
      if (!a || !el.contains(a)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && a === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [mode, close]);

  useEffect(() => () => unchain(), [unchain]);

  const on = mode !== null;
  return (
    <div
      ref={root}
      className={`${s.root} ${fill ? s.fill : ""} ${className}`}
      data-fs={mode ?? undefined}
      style={{ ["--fs-ar" as string]: ratio }}
      {...(on ? { role: "dialog", "aria-modal": true, "aria-labelledby": titleId } : {})}
    >
      <div className={s.stage}>
        <div ref={frame} className={s.frame}>
          <PanelCtx.Provider value={on ? panel : null}>{children}</PanelCtx.Provider>
        </div>
      </div>
      {on ? null : (
        <button ref={trigger} type="button" className={s.trigger} onClick={open} aria-label={`Full screen: ${label}`} title="Full screen">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {on ? (
        <aside className={s.panel} aria-label={`${label} controls`}>
          <div className={s.head}>
            <p id={titleId} className={s.title}>{label}</p>
            <button type="button" className={s.close} onClick={close} data-fs-close="" aria-label="Exit full screen">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div ref={setPanel} className={s.body} />
          <p className={s.hint}>Press Esc to exit full screen</p>
        </aside>
      ) : null}
    </div>
  );
}
