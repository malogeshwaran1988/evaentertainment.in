"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Handle = {
  toggle(): void;
  isOpen(): boolean;
  readonly portal: HTMLElement;
};

/** Settings key the package uses; when present the visitor saved preferences we must apply on load. */
const SETTINGS_KEY = "lasmind-a11y-settings";

/**
 * Header button for the LasMind accessibility menu, just before Contact.
 * The package (about 145 KB) loads only on first hover, focus or tap, so the
 * page pays nothing for it at load time. Visitors who saved settings get it at idle.
 */
export default function AccessibilityWidget() {
  const handleRef = useRef<Handle | null>(null);
  const loading = useRef<Promise<Handle> | null>(null);
  const [open, setOpen] = useState(false);

  const load = useCallback(() => {
    if (!loading.current) {
      loading.current = import("@lasmind/website-accessibility").then(({ init }) => {
        const h = init({ side: "right", trigger: false }) as Handle;
        handleRef.current = h;
        // Keep aria-expanded in sync when the menu closes itself (Esc, close button, backdrop).
        const sync = () => setOpen(h.isOpen());
        const root = h.portal.shadowRoot ?? h.portal;
        new MutationObserver(sync).observe(root, { attributes: true, subtree: true, childList: true });
        return h;
      });
    }
    return loading.current;
  }, []);

  useEffect(() => {
    let saved = false;
    try {
      saved = !!localStorage.getItem(SETTINGS_KEY) || !!localStorage.getItem("lasmind-a11y-widget");
    } catch {}
    if (!saved) return;
    const run = () => void load();
    const hasIdle = "requestIdleCallback" in window;
    const id = hasIdle ? window.requestIdleCallback(run, { timeout: 3000 }) : window.setTimeout(run, 1500);
    return () => {
      if (hasIdle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, [load]);

  return (
    <button
      type="button"
      className="eva-a11y-trigger"
      aria-label="Accessibility options"
      aria-haspopup="dialog"
      aria-expanded={open}
      onPointerEnter={() => void load()}
      onFocus={() => void load()}
      onClick={() => {
        void load().then((h) => {
          h.toggle();
          setOpen(h.isOpen());
        });
      }}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
        <circle cx="12" cy="4" r="2" fill="currentColor" />
        <path
          d="M4 8.5c2.7.8 5.3 1.2 8 1.2s5.3-.4 8-1.2M12 9.7V14m0 0-3 7m3-7 3 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
