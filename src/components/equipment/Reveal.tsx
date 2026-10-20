"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Fades its children up once when they scroll into view. Content is visible without JS
 *  and under prefers-reduced-motion (handled in CSS). */
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    // Keep data-inview in sync so CSS animations only run while on screen.
    const live = new IntersectionObserver(
      ([entry]) => {
        el.dataset.inview = entry.isIntersecting ? "true" : "false";
      },
      { threshold: 0 },
    );
    live.observe(el);
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return () => live.disconnect(); // already on screen
    el.dataset.reveal = "pending";
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.reveal = "shown";
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      live.disconnect();
    };
  }, []);

  return (
    <Tag ref={ref as never} className={`eva-reveal ${className}`.trim()}>
      {children}
    </Tag>
  );
}
