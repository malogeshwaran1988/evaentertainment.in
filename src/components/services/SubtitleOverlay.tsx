import type { CSSProperties } from "react";
import s from "./SubtitleOverlay.module.scss";

type Vars = CSSProperties & Record<`--${string}`, string | number>;
type Pos = { x: number; y: number };
type Line = Pos & { text: string; lang?: string; size: number };
type Chip = Pos & { text: string; lang?: string; size: number };
type Overlay = {
  ratio: number;
  line?: Line;
  chips?: Chip[];
  cursor?: Pos & { h: number };
  bar?: Pos & { w: number; h: number; deg: number };
};

/**
 * Crisp HTML text for the subtitling photos (svc-sub-*.avif, 1440x1080). Generated images
 * never carry readable text, so subtitle lines, language chips and file formats are drawn here.
 * Positions are % of the source image (x = centre, y = top), sizes in % of its width.
 */
const OVERLAYS: Record<string, Overlay> = {
  "sub-south": {
    ratio: 4 / 3,
    line: { text: "आशीर्वाद दीजिए, बाबूजी।", lang: "hi", x: 67, y: 46, size: 2.2 },
    chips: [{ text: "తెలుగు → हिन्दी", x: 67, y: 3.5, size: 1.8 }],
    cursor: { x: 36, y: 63, h: 2.4 },
  },
  "sub-together": {
    ratio: 4 / 3,
    line: { text: "हम घर कब चलेंगे?", lang: "hi", x: 57.5, y: 56.6, size: 1.15 },
    chips: [
      { text: "Hindi dub", x: 24, y: 7, size: 1.8 },
      { text: "Hindi subtitles", x: 57.5, y: 40.5, size: 1.8 },
    ],
  },
  "sub-workflow": {
    ratio: 4 / 3,
    line: { text: "Wait. Don't go yet.", lang: "en", x: 59, y: 30.5, size: 1.9 },
    chips: [{ text: "00:12:04:18 → 00:12:06:02", x: 47, y: 10, size: 1.5 }],
  },
  "sub-formats": {
    ratio: 4 / 3,
    line: { text: "खाना ठंडा हो रहा है!", lang: "hi", x: 61, y: 36.5, size: 2 },
    chips: [
      { text: ".srt", x: 36.2, y: 59.5, size: 1.7 },
      { text: ".vtt", x: 46.3, y: 59, size: 1.7 },
      { text: ".stl", x: 55.8, y: 58.5, size: 1.7 },
    ],
    // Centre, length and tilt of the laptop screen's bar slot (the baked bar was removed from the AVIF).
    bar: { x: 46.04, y: 71.62, w: 25.5, h: 0.7, deg: -5.47 },
  },
};

export default function SubtitleOverlay({ id }: { id: string }) {
  const o = OVERLAYS[id];
  if (!o) return null;
  return (
    <div className={s.stage} style={{ "--ratio": o.ratio } as Vars} aria-hidden="true">
      {o.line ? (
        <span
          className={s.line}
          lang={o.line.lang}
          style={{ left: `${o.line.x}%`, top: `${o.line.y}%`, "--fs": o.line.size } as Vars}
        >
          <span>{o.line.text}</span>
        </span>
      ) : null}
      {o.chips?.map((c, i) => (
        <span
          key={c.text}
          className={s.chip}
          lang={c.lang}
          style={{ left: `${c.x}%`, top: `${c.y}%`, "--fs": c.size, "--i": i } as Vars}
        >
          {c.text}
        </span>
      ))}
      {o.cursor ? (
        <span className={s.cursor} style={{ left: `${o.cursor.x}%`, top: `${o.cursor.y}%`, "--h": o.cursor.h } as Vars} />
      ) : null}
      {o.bar ? (
        <span
          className={s.bar}
          style={{ left: `${o.bar.x}%`, top: `${o.bar.y}%`, "--w": o.bar.w, "--h": o.bar.h, "--deg": `${o.bar.deg}deg` } as Vars}
        >
          <span />
        </span>
      ) : null}
    </div>
  );
}
