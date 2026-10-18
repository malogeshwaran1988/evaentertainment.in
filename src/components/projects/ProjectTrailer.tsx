"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lite YouTube embed: a thumbnail + play button; the iframe loads only after a click.
 * The button has a visible "Play trailer" label, and focus moves into the player once it loads
 * so keyboard users can control playback right away.
 */
export default function ProjectTrailer({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (play) frameRef.current?.focus();
  }, [play]);

  return (
    <div className="eva-project-trailer">
      {play ? (
        <iframe
          ref={frameRef}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&cc_load_policy=1`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button type="button" className="eva-project-trailer-btn" onClick={() => setPlay(true)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" fetchPriority="low" decoding="async" width={480} height={360} />
          <span className="eva-project-trailer-play" aria-hidden="true">▶</span>
          <span className="eva-project-trailer-label">
            Play trailer<span className="sr-only">: {title} (loads YouTube)</span>
          </span>
        </button>
      )}
    </div>
  );
}
