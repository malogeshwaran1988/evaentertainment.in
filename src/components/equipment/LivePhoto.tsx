import BrandMark from "@@/components/common/BrandMark";
import type { CSSProperties } from "react";
import type { EquipmentItem } from "@@/data/equipment";

const pos = (x: number, y: number, d?: number) =>
  ({
    left: `${x}%`,
    top: `${y}%`,
    ...(d ? { width: `${d}%` } : {}),
  }) as CSSProperties;

/**
 * Photo + decorative "live" overlay. The overlay sits inside the same zoomed stage as the
 * <img> and the img is shown at its exact 4:3 source ratio (no crop), so every ring stays
 * locked to the device it was measured on.
 */
export default function LivePhoto({ item, eager, alt }: { item: EquipmentItem; eager: boolean; alt: boolean }) {
  const { live } = item;
  const steps = live.emitters.length;
  return (
    <div className={`eva-live eva-live--${live.kind}${alt ? " eva-live--alt" : ""}`}>
      <div className="eva-live-stage">
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised AVIF, served as-is */}
        <img
          src={item.image}
          alt={item.alt}
          width={item.width}
          height={item.height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          sizes="(min-width: 992px) 56vw, 100vw"
        />
        <div className="eva-live-layer" aria-hidden="true">
          <span className="eva-live-glow" style={{ "--gx": `${live.glow.x}%`, "--gy": `${live.glow.y}%` } as CSSProperties} />
          <span className="eva-live-sheen" />
          {live.lfe && <span className="eva-live-lfe" style={pos(live.lfe.x, live.lfe.y, live.lfe.d)} />}
          {live.sweet && <span className="eva-live-sweet" style={pos(live.sweet.x, live.sweet.y)} />}
          {live.emitters.map((e, i) => (
            <span
              key={`${e.x}-${e.y}`}
              className="eva-live-emitter"
              style={{ ...pos(e.x, e.y, e.d), "--i": i, "--n": steps } as CSSProperties}
            >
              <i />
              <i />
              <i />
            </span>
          ))}
          {live.led && <span className="eva-live-led" style={pos(live.led.x, live.led.y)} />}
        </div>
      </div>
      <BrandMark />
      {live.rec && (
        <span className={`eva-live-rec eva-live-rec--${live.rec}`} aria-hidden="true">
          <b />
          REC
        </span>
      )}
      {live.kind === "surround" && (
        <span className="eva-live-legend" aria-hidden="true">
          <strong>5.1</strong>
          {live.emitters.map((e, i) => (
            <em key={e.ch} style={{ "--i": i, "--n": steps } as CSSProperties}>
              {e.ch}
            </em>
          ))}
          <em className="eva-live-legend-lfe">LFE</em>
        </span>
      )}
    </div>
  );
}
