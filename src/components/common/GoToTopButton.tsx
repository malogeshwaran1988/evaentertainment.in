"use client";

import { useEffect, useState } from "react";

export default function GoToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`goto-top${visible ? " is-visible" : ""}`}
      aria-label="Back to top"
      // While faded out it must not be a hidden tab stop.
      tabIndex={visible ? undefined : -1}
      aria-hidden={visible ? undefined : true}
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        // Keyboard users land at the start of the page, not on a vanished button.
        document.querySelector<HTMLElement>(".eva-skip-link")?.focus({ preventScroll: true });
      }}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
