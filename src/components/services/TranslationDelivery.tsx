import type { CSSProperties } from "react";
import s from "./TranslationDelivery.module.scss";

type Scene = { format: string; lang: string; line: string; img?: string };

// Movies uses the scene painted into svc-translation-delivery.avif; the other two are
// screen-sized patches (same perspective) that crossfade over the wall TV.
const SCENES: Scene[] = [
  { format: "Movies", lang: "hi", line: "मैं तुम्हारा इंतज़ार करूँगा" },
  { format: "TV series", lang: "ta", line: "நீ எப்போதும் எங்கள் மகள்தான்", img: "/images/services/svc-translation-screen-tv.avif" },
  { format: "Web series", lang: "en", line: "We ship tonight. No excuses.", img: "/images/services/svc-translation-screen-web.avif" },
];

/**
 * Crisp HTML overlay for the Translation lead image (1440x1080). The wall TV rotates through a
 * Hindi movie, a Tamil TV series and an English web series, each with its subtitle, while the
 * matching chip lights up. Positions are % of the source image.
 */
export default function TranslationDelivery() {
  return (
    <div
      className={s.stage}
      role="img"
      aria-label="The wall TV cycles through a Hindi movie, a Tamil TV series and an English web series, each with subtitles"
    >
      {SCENES.map((sc, i) =>
        sc.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={sc.format}
            className={s.screen}
            src={sc.img}
            alt=""
            width={590}
            height={364}
            loading="lazy"
            decoding="async"
            style={{ "--i": i } as CSSProperties}
          />
        ) : null,
      )}
      {SCENES.map((sc, i) => (
        <span key={sc.format} className={s.subtitle} lang={sc.lang} style={{ "--i": i } as CSSProperties}>
          {sc.line}
        </span>
      ))}
      <ul className={s.chips} aria-hidden="true">
        {SCENES.map((sc, i) => (
          <li key={sc.format} style={{ "--i": i } as CSSProperties}>
            {sc.format}
          </li>
        ))}
      </ul>
    </div>
  );
}
