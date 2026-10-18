"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const BATCH_SIZE = 10;

/**
 * Shows `batch` items, then `batch` more each time the sentinel nears the viewport or the
 * "Load more" button is used. Data is already on the client: no extra requests.
 */
export function useBatchReveal(total: number, batch = BATCH_SIZE, resetKey?: unknown) {
  const [count, setCount] = useState(batch);
  const [announce, setAnnounce] = useState("");
  const [prevKey, setPrevKey] = useState(resetKey);
  if (prevKey !== resetKey) {
    setPrevKey(resetKey);
    setCount(batch);
    setAnnounce("");
  }
  const shown = Math.min(count, total);
  const more = useCallback(() => {
    const next = Math.min(shown + batch, total);
    if (next <= shown) return;
    setCount(next);
    setAnnounce(`Showing ${next} of ${total} projects.`);
  }, [batch, shown, total]);
  return { shown, hasMore: shown < total, more, announce };
}

type LoadMoreProps = {
  hasMore: boolean;
  onMore: () => void;
  shown: number;
  total: number;
  announce: string;
  /** Element to move focus to after a button press (first newly revealed card link). */
  focusAfter?: () => HTMLElement | null | undefined;
};

/** Sentinel (auto-load near the end) + visible, keyboard-operable fallback button + live region. */
export function LoadMore({ hasMore, onMore, shown, total, announce, focusAfter }: LoadMoreProps) {
  const sentinel = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onMore();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, onMore, shown]);

  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    focusAfter?.()?.focus();
  }, [shown, focusAfter]);

  return (
    <div className="eva-load-more">
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
      {hasMore ? (
        <>
          <div ref={sentinel} aria-hidden="true" className="eva-load-more-sentinel" />
          <button
            type="button"
            className="btn btn--border eva-load-more-btn"
            onClick={() => {
              pendingFocus.current = true;
              onMore();
            }}
          >
            <span>
              Load more projects <span className="eva-load-more-count">({shown} of {total})</span>
            </span>
          </button>
        </>
      ) : total > BATCH_SIZE ? (
        <p className="eva-load-more-done">All {total} projects shown.</p>
      ) : null}
    </div>
  );
}
