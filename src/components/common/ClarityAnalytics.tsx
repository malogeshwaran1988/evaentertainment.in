"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";
import { CLARITY_PROJECT_ID } from "@@/constants/constants";

/**
 * Microsoft Clarity session analytics — production builds only, so local dev sessions aren't recorded.
 * Starts once the page has loaded and the main thread is idle, so it doesn't delay the hero paint.
 */
export default function ClarityAnalytics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const start = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(() => Clarity.init(CLARITY_PROJECT_ID), {
          timeout: 4000,
        });
      } else {
        timeoutId = window.setTimeout(() => Clarity.init(CLARITY_PROJECT_ID), 1500);
      }
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
