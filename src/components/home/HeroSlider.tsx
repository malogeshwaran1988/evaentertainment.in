"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import ImageEffects from "@@/components/common/ImageEffects";
import Link from "@@/components/common/NavLink";
import { Routes } from "@@/constants/routes";
import { HERO_SLIDES } from "@@/data/home";
import { imageLoading } from "@@/lib/image-loading";

function SlideLine({
  role,
  className,
  text,
  line,
}: {
  role: "h1" | "title" | "subtitle";
  className: string;
  text: string;
  line: number;
}) {
  const style = { "--line": line } as CSSProperties;
  const content = (
    <span>
      <span className="slide-line-text">{text}</span>
    </span>
  );

  if (role === "h1") {
    return (
      <h1 className={className || undefined} style={style}>
        {content}
      </h1>
    );
  }

  const lineClass = `slide-line slide-line--${role === "subtitle" ? "sub" : "title"} ${className}`.trim();
  return (
    <p className={lineClass} style={style}>
      {content}
    </p>
  );
}

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // WCAG 2.2.2: autoplay can be stopped by the user, and is off under reduced motion.
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const count = HERO_SLIDES.length;

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    let inView = true;
    const update = () => setPaused(!inView || document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const stopped = userPaused || reduceMotion;
  const autoplayOff = paused || stopped || hoverPaused;

  useEffect(() => {
    if (autoplayOff) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 6000);
    return () => window.clearInterval(id);
  }, [count, autoplayOff]);

  return (
    <div className="block bottom-null block--slider">
      <div className="mainSliderWrapper">
        <div
          ref={sliderRef}
          id="mainSlider"
          className="mainSlider slick-initialized eva-hero-slider"
          style={{ opacity: 1 }}
          data-paused={autoplayOff || undefined}
          role="region"
          aria-roledescription="carousel"
          aria-label="Studio highlights"
          onMouseEnter={() => setHoverPaused(true)}
          onMouseLeave={() => setHoverPaused(false)}
          onFocus={() => setHoverPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHoverPaused(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") goPrev();
            else if (e.key === "ArrowRight") goNext();
          }}
        >
          <div className="eva-hero-slides" aria-live={autoplayOff ? "polite" : "off"}>
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.image}
              className={`slide${i === index ? " is-active" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-current={i === index ? "true" : undefined}
            >
              <div className="img--holder eva-hero-media eva-fx-host">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  {...imageLoading(i)}
                  sizes="100vw"
                  className="eva-hero-media-img"
                />
                <ImageEffects fx={slide.fx} />
              </div>
              <div className="slide-content left">
                <div className="vert-wrap container">
                  <div className="vert">
                    <div className="container">
                      {slide.lines.map((line, lineIndex) => (
                        <SlideLine
                          key={line.text}
                          line={lineIndex}
                          role={line.role}
                          className={line.className}
                          text={line.text}
                        />
                      ))}
                      {/*
                        Serial position / Paradox of the active user: a clear first action in the
                        first viewport. One primary (Von Restorff) + one secondary. Inert on hidden slides.
                      */}
                      <div className="eva-hero-ctas" inert={i !== index}>
                        <Link href={Routes.PROJECTS} className="btn btn--lg">
                          <span>See our projects</span>
                        </Link>
                        <Link href={Routes.CONTACT} className="btn btn--lg btn--border eva-hero-cta-secondary">
                          <span>Contact us</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>

          <button
            type="button"
            className="slick-prev slick-arrow"
            aria-label="Previous slide"
            onClick={goPrev}
          >
            Previous
          </button>
          <button
            type="button"
            className="slick-next slick-arrow"
            aria-label="Next slide"
            onClick={goNext}
          >
            Next
          </button>

          <div className="eva-hero-dots" role="group" aria-label="Choose slide">
            <button
              type="button"
              className="eva-hero-pause"
              aria-label={stopped ? "Play slideshow" : "Pause slideshow"}
              aria-pressed={reduceMotion ? undefined : userPaused}
              onClick={() => {
                if (reduceMotion) {
                  setReduceMotion(false);
                  setUserPaused(false);
                } else setUserPaused((v) => !v);
              }}
            >
              <span aria-hidden="true">{stopped ? "▶" : "❚❚"}</span>
            </button>
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.image}
                type="button"
                className={i === index ? "is-active" : undefined}
                aria-label={`Show slide ${i + 1} of ${count}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
