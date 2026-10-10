import type { CSSProperties } from "react";
import type { FxItem, ImageFx } from "@@/data/image-fx";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** A voice-like waveform; the second half repeats the first so the scroll loops seamlessly. */
const WAVE_PEAKS = [8, 32, 14, 38, 4, 28, 16, 36, 12, 24, 2, 34, 18, 30, 6, 26];
const WAVE_PATH = `M0 20 ${[...WAVE_PEAKS, ...WAVE_PEAKS]
  .map((y, i) => `Q ${i * 12.5 + 6.25} ${y} ${(i + 1) * 12.5} 20`)
  .join(" ")}`;

function itemStyle(item: FxItem): Vars {
  const style: Vars = { top: `${item.y}%` };
  if ("x" in item) style.left = `${item.x}%`;
  if ("size" in item) style["--s"] = item.size;
  if ("w" in item) style["--w"] = item.w;
  if ("h" in item) style["--h"] = item.h;
  if ("rotate" in item && item.rotate) style["--r"] = `${item.rotate}deg`;
  if ("color" in item && item.color) style["--c"] = item.color;
  if ("delay" in item && item.delay) style["--d"] = `${item.delay}s`;
  return style;
}

function FxChildren({ item }: { item: FxItem }) {
  switch (item.kind) {
    case "waves":
      return [0, 1, 2].map((i) => <span key={i} style={{ "--i": i } as Vars} />);
    case "meter":
      return Array.from({ length: item.bars }, (_, i) => (
        <span key={i} style={{ "--i": i } as Vars} />
      ));
    case "playhead":
    case "caption":
      return <span />;
    case "waveline":
      return (
        <svg viewBox="0 0 400 40" preserveAspectRatio="none">
          <path d={WAVE_PATH} />
        </svg>
      );
    default:
      return null;
  }
}

/** Decorative animation layer sized to match an `object-fit: cover` image underneath. */
export default function ImageEffects({ fx, anchor }: { fx: ImageFx; anchor?: "top-left" }) {
  return (
    <div
      className={`eva-fx-stage${anchor === "top-left" ? " eva-fx-stage--top-left" : ""}`}
      style={{ "--fx-ratio": fx.width / fx.height } as Vars}
      aria-hidden="true"
    >
      {fx.items.map((item, i) => (
        <span
          key={i}
          className={`eva-fx eva-fx--${item.kind}${"side" in item && item.side ? ` eva-fx--${item.side}` : ""}`}
          style={itemStyle(item)}
        >
          <FxChildren item={item} />
        </span>
      ))}
    </div>
  );
}
