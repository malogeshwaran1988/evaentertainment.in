"use client";

import { useEffect, useRef, useState } from "react";
import type { ServiceVideo as Video } from "@@/data/service-media";

/** Muted looping clip: loads near the viewport, pauses off screen, poster only under reduced motion. */
export default function ServiceVideo({ video, poster, label }: { video: Video; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (load) ref.current?.play().catch(() => {});
  }, [load]);

  return (
    <video
      ref={ref}
      className="eva-svc-video"
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      disablePictureInPicture
    >
      {load && (
        <>
          <source src={video.webm} type="video/webm" />
          <source src={video.mp4} type="video/mp4" />
        </>
      )}
    </video>
  );
}
