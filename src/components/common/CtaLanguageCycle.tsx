"use client";

import { useEffect, useState } from "react";
import styles from "./ContactCta.module.scss";

const INTERVAL_MS = 2200;

/** Cycles the highlighted language word; all words share one grid cell so width never jumps. */
export default function CtaLanguageCycle({ languages }: { languages: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (languages.length < 2) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % languages.length), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [languages.length]);

  return (
    <span className={styles.cycle}>
      {languages.map((lang, i) => (
        <span
          key={lang}
          className={`${styles.word} ${i === index ? styles.wordActive : ""}`}
          aria-hidden={i === index ? undefined : true}
        >
          {lang}
        </span>
      ))}
    </span>
  );
}
