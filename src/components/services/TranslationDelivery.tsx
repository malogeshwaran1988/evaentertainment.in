import type { CSSProperties } from "react";
import s from "./TranslationDelivery.module.scss";

const FORMATS = ["Movies", "TV series", "Web series"];

/**
 * Crisp HTML overlay for the Translation lead image (svc-translation-delivery.avif, 1440x1080):
 * a Hindi subtitle typing onto the film on the wall TV, a cursor on the subtitle editor and
 * chips naming where the scripts are delivered. Positions are % of the source image.
 */
export default function TranslationDelivery() {
  return (
    <div className={s.stage} aria-hidden="true">
      <span className={s.subtitle} lang="hi">
        <span>मैं तुम्हारा इंतज़ार करूँगा</span>
      </span>
      <span className={s.cursor} />
      <span className={s.tile} />
      <ul className={s.chips}>
        {FORMATS.map((f, i) => (
          <li key={f} style={{ "--i": i } as CSSProperties}>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
