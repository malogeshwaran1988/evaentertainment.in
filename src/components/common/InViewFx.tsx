"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Wrapper that sets `data-inview` while on screen, so CSS only animates visible effects. */
export default function InViewFx({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      el.toggleAttribute("data-inview", entry.isIntersecting);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
