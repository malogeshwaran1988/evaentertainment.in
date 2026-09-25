"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { HERO_SLIDES } from "@@/data/home";

function SlideLine({
  role,
  className,
  text,
}: {
  role: "h1" | "title" | "subtitle";
  className: string;
  text: string;
}) {
  const classes = [className || undefined].filter(Boolean).join(" ");

  if (role === "h1") {
    return (
      <h1 className={classes || undefined}>
        <span>{text}</span>
      </h1>
    );
  }

  const lineClass =
    role === "subtitle"
      ? `slide-line slide-line--sub ${classes}`.trim()
      : `slide-line slide-line--title ${classes}`.trim();

  return (
    <p className={lineClass}>
      <span>{text}</span>
    </p>
  );
}

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const count = HERO_SLIDES.length;

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 6000);
    return () => window.clearInterval(id);
  }, [count]);

  return (
    <div className="block bottom-null block--slider">
      <div className="mainSliderWrapper">
        <div
          id="mainSlider"
          className="mainSlider slick-initialized eva-hero-slider"
          style={{ opacity: 1 }}
        >
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.image}
              className={`slide${i === index ? " is-active" : ""}`}
              aria-hidden={i !== index}
            >
              <div className="img--holder eva-hero-media">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  preload={i === 0}
                  fetchPriority={i === 0 ? "high" : undefined}
                  sizes="100vw"
                  className="eva-hero-media-img"
                />
              </div>
              <div className="slide-content left">
                <div className="vert-wrap container">
                  <div className="vert">
                    <div className="container">
                      {slide.lines.map((line) => (
                        <SlideLine
                          key={line.text}
                          role={line.role}
                          className={line.className}
                          text={line.text}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

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

          <div className="eva-hero-dots" role="tablist" aria-label="Hero slides">
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.image}
                type="button"
                className={i === index ? "is-active" : undefined}
                aria-label={`Show slide ${i + 1}`}
                aria-selected={i === index}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
