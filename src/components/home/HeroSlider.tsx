"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import ImageEffects from "@@/components/common/ImageEffects";
import BrandMark from "@@/components/common/BrandMark";
import Link from "@@/components/common/NavLink";
import { Routes } from "@@/constants/routes";
import { HERO_SLIDES } from "@@/data/home";
import { imageLoading } from "@@/lib/image-loading";

/** "72% 40%" -> CSS vars shared by the photo crop and the effects stage so overlays stay on their objects. */
function focusVars(focus: string) {
  const [x, y = "50%"] = focus.split(" ");
  return { "--fx-x": x, "--fx-y": y };
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

  // Perf: below-fold section backgrounds (globals.scss, html.eva-bg-ready) load after window load.
  useEffect(() => {
    const ready = () => document.documentElement.classList.add("eva-bg-ready");
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    return () => window.removeEventListener("load", ready);
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
          // Hover/focus only holds autoplay; the zoom and effects keep moving unless off-screen or stopped.
          data-paused={paused || stopped || undefined}
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
              <div
                className="img--holder eva-hero-media eva-fx-host"
                style={slide.focus ? (focusVars(slide.focus) as CSSProperties) : undefined}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  {...imageLoading(i)}
                  sizes="100vw"
                  className={`eva-hero-media-img${slide.flip ? " eva-hero-media-img--flip" : ""}`}
                />
                <ImageEffects fx={slide.fx} />
                <BrandMark />
              </div>
              <div className="slide-content left">
                <div className="vert-wrap container">
                  <div className="vert">
                    <div className="container">
                      {/* Original hero style: line boxes that hug each line (gradient heading, white tagline). */}
                      <div className="eva-hero-lines">
                        {slide.headingLevel === "h1" ? (
                          <h1 className="slide-line slide-line--title h-gradient eva-hero-heading" style={{ "--line": 0 } as CSSProperties}>
                            <span><span className="slide-line-text">{slide.heading}</span></span>
                          </h1>
                        ) : (
                          <h2 className="slide-line slide-line--title h-gradient eva-hero-heading" style={{ "--line": 0 } as CSSProperties}>
                            <span><span className="slide-line-text">{slide.heading}</span></span>
                          </h2>
                        )}
                        <p className="slide-line slide-line--title eva-hero-tagline" style={{ "--line": 1 } as CSSProperties}>
                          <span><span className="slide-line-text">{slide.tagline}</span></span>
                        </p>
                        <div className="eva-hero-ctas" inert={i !== index}>
                          <Link href={slide.cta.href} className="btn btn--lg">
                            <span>{slide.cta.label}</span>
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
