import type { CSSProperties, ReactNode } from "react";
import Link from "@@/components/common/NavLink";
import InViewFx from "@@/components/common/InViewFx";
import { SERVICE_CARDS } from "@@/data/home";

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
  // Singer + mic: rings from the mic grille, voice waveform between mouth and mic.
  "/images/home/services-grid-1.avif": {
    kind: "dub",
    layer: (
      <>
        <Rings x={22.9} y={33.6} d={20} />
        <span className="svc-voice" style={at(34, 22, 13)}>
          {Array.from({ length: 9 }, (_, i) => (
            <i key={i} style={{ "--i": i } as CSSProperties} />
          ))}
        </span>
      </>
    ),
  },
  // Engineer at console: surround pulse from the visible monitors, console glow.
  "/images/home/services-grid-2.avif": {
    kind: "mix",
    layer: (
      <>
        <span className="svc-glow-spot" style={at(50, 82, 90)} />
        {[
          [4.3, 38.4, 10],
          [11.1, 26, 4],
          [21.4, 46.9, 4],
          [25.4, 46.9, 3],
        ].map(([x, y, d], i) => (
          <span key={i} className="svc-rings svc-rings--seq" style={{ ...at(x, y, d), "--i": i } as CSSProperties}>
            <i />
            <i />
          </span>
        ))}
      </>
    ),
  },
  // Console close-up: red buttons glow softly in a wave, fader caps catch a moving light.
  "/images/home/services-grid-3.avif": {
    kind: "foley",
    layer: (
      <>
        {[
          [14.3, 27.1],
          [25.7, 22],
          [37.1, 16.9],
          [47.9, 12.5],
          [56.9, 8.4],
          [65, 5.1],
          [72.6, 1.9],
        ].map(([x, y], i) => (
          <span key={i} className="svc-btn" style={{ ...at(x, y, 7), "--i": i } as CSSProperties} />
        ))}
        {[
          [10, 69],
          [39.5, 62.5],
          [69, 59],
          [72, 39],
          [92, 26],
        ].map(([x, y], i) => (
          <span key={i} className="svc-cap" style={{ ...at(x, y, 16), "--i": i } as CSSProperties} />
        ))}
      </>
    ),
  },
  // Headphones: rings from the ear cups, script glyphs drifting in the dark area.
  "/images/home/services-grid-4.avif": {
    kind: "tr",
    layer: (
      <>
        <Rings x={15.7} y={42} d={15} />
        <Rings x={71} y={28} d={18} cls="svc-rings--late" />
        {[
          ["अ", 34, 12],
          ["த", 46, 8],
          ["త", 58, 13],
          ["ক", 88, 14],
          ["ਅ", 95, 34],
        ].map(([g, x, y], i) => (
          <span key={i} className="svc-glyph" style={{ ...at(Number(x), Number(y)), "--i": i } as CSSProperties}>
            {g}
          </span>
        ))}
      </>
    ),
  },
  // Pro Tools screens: level meters on the mixer screen, scrolling waveform on the edit screen.
  "/images/home/services-grid-5.avif": {
    kind: "stock",
    layer: (
      <>
        <span className="svc-meters" style={at(43, 17, 19, { height: "12%" })}>
          {Array.from({ length: 12 }, (_, i) => (
            <i key={i} style={{ "--i": i } as CSSProperties} />
          ))}
        </span>
        <span className="svc-scroll" style={at(15, 24, 23, { height: "8%" })}>
          <span />
        </span>
      </>
    ),
  },
  // Laptop: subtitle lines typing in over the video, playhead running along the waveform.
  "/images/home/services-grid-6.avif": {
    kind: "sub",
    layer: (
      <>
        <span className="svc-subs" style={at(29, 31.5, 30)}>
          <i style={{ "--w": "100%" } as CSSProperties} />
          <i style={{ "--w": "72%" } as CSSProperties} />
        </span>
        <span className="svc-track" style={at(7, 43.5, 70, { height: "7.5%" })}>
          <span />
        </span>
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
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
