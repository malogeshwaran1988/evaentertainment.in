"use client";

import { useState } from "react";

/** Lite YouTube embed: a thumbnail + play button; the iframe loads only after a click. */
export default function ProjectTrailer({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="eva-project-trailer">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button type="button" className="eva-project-trailer-btn" onClick={() => setPlay(true)} aria-label={`Play: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" width={480} height={360} />
          <span className="eva-project-trailer-play" aria-hidden="true">▶</span>
        </button>
      )}
    </div>
  );
}
