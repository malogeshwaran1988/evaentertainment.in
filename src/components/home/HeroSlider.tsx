"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import ImageEffects from "@@/components/common/ImageEffects";
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
