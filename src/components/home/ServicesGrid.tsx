import type { CSSProperties, ReactNode } from "react";
import Link from "@@/components/common/NavLink";
import InViewFx from "@@/components/common/InViewFx";
import { SERVICE_CARDS } from "@@/data/home";
import NearViewImg from "@@/components/common/NearViewImg";

const EQ_BARS = Array.from({ length: 16 }, (_, i) => i);

/** % of the source image (x of width, y of height); d = diameter in % of width. */
const at = (x: number, y: number, d?: number, extra?: CSSProperties) =>
  ({ left: `${x}%`, top: `${y}%`, ...(d ? { width: `${d}%` } : {}), ...extra }) as CSSProperties;

const Rings = ({ x, y, d, cls = "" }: { x: number; y: number; d: number; cls?: string }) => (
  <span className={`svc-rings ${cls}`.trim()} style={at(x, y, d)}>
    <i />
    <i />
    <i />
  </span>
);

/** Natural size of each services-grid image (all are shown uncropped on desktop). */
const SIZE: Record<string, [number, number]> = {
  "/images/home/services-grid-1.avif": [630, 322],
  "/images/home/services-grid-2.avif": [630, 614],
  "/images/home/services-grid-3.avif": [630, 614],
  "/images/home/services-grid-4.avif": [630, 322],
  "/images/home/services-grid-5.avif": [630, 322],
  "/images/home/services-grid-6.avif": [630, 614],
};

/** Per-image overlays, positions measured on the source images. */
const OVERLAYS: Record<string, { kind: string; layer: ReactNode }> = {
  // Dubbing artist: rings from the Neumann grille, voice waveform between mouth and mic.
  "/images/home/services-grid-1.avif": {
    kind: "dub",
    layer: (
      <>
        <Rings x={32} y={34} d={16} />
        <span className="svc-voice" style={at(38, 31, 9)}>
          {Array.from({ length: 7 }, (_, i) => (
            <i key={i} style={{ "--i": i } as CSSProperties} />
          ))}
        </span>
      </>
    ),
  },
  // 5.1 room: surround pulse from each speaker in turn, console glow.
  "/images/home/services-grid-2.avif": {
    kind: "mix",
    layer: (
      <>
        <span className="svc-glow-spot" style={at(30, 75, 60)} />
        {[
          [15, 24, 8],
          [23, 46, 6],
          [52, 48, 6],
          [85, 45, 6],
          [90, 24, 8],
        ].map(([x, y, d], i) => (
          <span key={i} className="svc-rings svc-rings--seq" style={{ ...at(x, y, d), "--i": i } as CSSProperties}>
            <i />
            <i />
          </span>
        ))}
      </>
    ),
  },
  // Foley: rings from the Rode shotgun tip, impact rings on gravel, wood and props, glints on brass and steel.
  "/images/home/services-grid-3.avif": {
    kind: "foley",
    layer: (
      <>
        <Rings x={51} y={47} d={10} />
        {[
          [49, 70, 9],
          [28, 68, 8],
          [16, 82, 9],
          [36, 91, 9],
          [72, 77, 9],
        ].map(([x, y, d], i) => (
          <span key={i} className="svc-rings svc-rings--seq" style={{ ...at(x, y, d), "--i": i } as CSSProperties}>
            <i />
            <i />
          </span>
        ))}
        {[
          [9, 70],
          [87, 72],
          [92, 82],
        ].map(([x, y], i) => (
          <span key={i} className="svc-cap" style={{ ...at(x, y, 12), "--i": i } as CSSProperties} />
        ))}
      </>
    ),
  },
  // Translator: rings from the headphones, script glyphs drifting over the window and wall.
  "/images/home/services-grid-4.avif": {
    kind: "tr",
    layer: (
      <>
        <Rings x={35} y={40} d={10} />
        {[
          ["அ", 64, 12],
          ["ह", 76, 20],
          ["త", 86, 10],
          ["ক", 93, 30],
          ["ਅ", 70, 32],
        ].map(([g, x, y], i) => (
          <span key={i} className="svc-glyph" style={{ ...at(Number(x), Number(y)), "--i": i } as CSSProperties}>
            {g}
          </span>
        ))}
      </>
    ),
  },
  // Pro Tools screens: level meters along the mixer strip, scrolling waveform on the edit screen.
  "/images/home/services-grid-5.avif": {
    kind: "stock",
    layer: (
      <>
        <span className="svc-meters" style={at(45, 54, 15, { height: "6%" })}>
          {Array.from({ length: 12 }, (_, i) => (
            <i key={i} style={{ "--i": i } as CSSProperties} />
          ))}
        </span>
        <span className="svc-scroll" style={at(46, 40, 14, { height: "10%" })}>
          <span />
        </span>
      </>
    ),
  },
  // Laptop: playhead running along the subtitle timeline, lamp light breathing.
  "/images/home/services-grid-6.avif": {
    kind: "sub",
    layer: (
      <>
        <span className="svc-track" style={at(50, 55, 36, { height: "13%" })}>
          <span />
        </span>
        <span className="svc-cap" style={{ ...at(91, 21, 16), "--i": 0 } as CSSProperties} />
      </>
    ),
  },
};

/** Home "services" photo grid. Each photo + overlay sits in a stage with the image's own
 *  aspect ratio, so the zoom and hover tilt move them together and nothing drifts off. */
export default function ServicesGrid() {
  return (
    <div className="row gutter-15 services-grid">
      {[0, 1, 2].map((col) => (
        <div className="col-sm-4" key={col}>
          {SERVICE_CARDS.slice(col * 2, col * 2 + 2).map((card) => {
            const [w, h] = SIZE[card.image] ?? [630, 322];
            const ov = OVERLAYS[card.image];
            return (
              <Link key={card.title + card.image} className="service-item" href={card.href}>
                <InViewFx className={`service-item-photo eva-fx-lazy svc-live${ov ? ` svc-live--${ov.kind}` : ""}`}>
                  <span className="svc-frame" style={{ "--ar": `${w} / ${h}`, "--arn": w / h } as CSSProperties}>
                    <span className="svc-stage">
                      <NearViewImg
                        src={card.image}
                        alt={card.alt}
                        width={w}
                        height={h}
                        loading="lazy"
                        fetchPriority="low"
                        decoding="async"
                      />
                      {ov ? (
                        <span className="svc-layer" aria-hidden="true">
                          {ov.layer}
                        </span>
                      ) : null}
                    </span>
                  </span>
                  <span className="eva-eq" aria-hidden="true">
                    {EQ_BARS.map((i) => (
                      <span key={i} style={{ "--i": i } as CSSProperties} />
                    ))}
                  </span>
                </InViewFx>
                <div className="service-item-caption">
                  <div className="clearfix">
                    <span className="service-item-price">{card.eyebrow}</span>
                    <span className="service-item-title h-gradient">
                      <span>{card.title}</span>
                    </span>
                  </div>
                  {card.description ? (
                    <div className="service-item-description">
                      <span>{card.description}</span>
                    </div>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
