"use client";

import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

/**
 * Below-the-fold <img> whose request starts only when it nears the viewport (or after window
 * load at the latest), so it never competes with the LCP. Native loading="lazy" starts up to
 * 2500px early on slow connections, which is too soon for the home services grid.
 * Without JS, the <noscript> copy loads normally.
 */
export default function NearViewImg({ src, alt, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => setOn(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) show();
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    if (document.readyState === "complete") show();
    else window.addEventListener("load", show, { once: true });
    return () => {
      io.disconnect();
      window.removeEventListener("load", show);
    };
  }, []);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={ref} src={on ? src : undefined} alt={alt} {...rest} />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} {...rest} />
      </noscript>
    </>
  );
}
