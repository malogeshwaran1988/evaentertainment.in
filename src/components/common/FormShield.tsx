"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Anti-spam fields for public forms: a hidden honeypot, the render timestamp and a
 * Cloudflare Turnstile widget (only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set).
 */
export function useFormShield() {
  const startedAt = useRef<number>(0);
  const tokenRef = useRef<string>("");
  const widgetId = useRef<string | undefined>(undefined);
  const boxRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(!SITE_KEY);

  useEffect(() => {
    startedAt.current = Date.now();
    if (!SITE_KEY || !boxRef.current) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !boxRef.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(boxRef.current, {
          sitekey: SITE_KEY,
          theme: "dark",
          callback: (t: string) => {
            tokenRef.current = t;
            setReady(true);
          },
          "expired-callback": () => {
            tokenRef.current = "";
            setReady(false);
          },
          "error-callback": () => setReady(false),
        });
      })
      .catch(() => setReady(false));
    return () => {
      cancelled = true;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
    };
  }, []);

  const values = useCallback(
    (form: HTMLFormElement) => ({
      website: String(new FormData(form).get("website") || ""),
      startedAt: startedAt.current,
      turnstileToken: tokenRef.current,
    }),
    [],
  );

  const reset = useCallback(() => {
    tokenRef.current = "";
    if (SITE_KEY) {
      setReady(false);
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    }
  }, []);

  const fields = (
    <>
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}
      >
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      {SITE_KEY ? <div ref={boxRef} className="eva-turnstile" style={{ margin: "12px 0" }} /> : null}
    </>
  );

  return { fields, values, reset, ready, enabled: Boolean(SITE_KEY) };
}
