/**
 * Decorative animations layered over photos. Positions are percentages of the
 * source image (x across, y down); sizes are percentages of the image width.
 */
export type FxItem =
  | { kind: "waves"; x: number; y: number; size: number; side?: "left" | "right"; delay?: number }
  | { kind: "glow"; x: number; y: number; size: number; color?: string; delay?: number }
  | { kind: "pulse"; x: number; y: number; size: number; delay?: number }
  | { kind: "twinkle"; x: number; y: number; size: number; color?: string; delay?: number }
  | { kind: "bokeh"; x: number; y: number; size: number; color?: string; delay?: number }
  | { kind: "meter"; x: number; y: number; w: number; h: number; bars: number; rotate?: number }
  | { kind: "playhead"; x: number; y: number; w: number; h: number }
  | { kind: "caption"; x: number; y: number; w: number; h: number }
  | { kind: "cursor"; x: number; y: number; h: number }
  | { kind: "waveline"; y: number };

export type ImageFx = {
  /** Source image size, used to match the `object-fit: cover` crop. */
  width: number;
  height: number;
  items: FxItem[];
};

const WHITE = "255, 255, 255";
const RED = "255, 70, 50";
const GREEN = "120, 230, 90";
const BLUE = "90, 140, 255";
const WARM = "255, 220, 170";

export const HERO_FX: Record<"singer" | "console", ImageFx> = {
  singer: {
    width: 1920,
    height: 1078,
    items: [
      { kind: "waves", x: 71.2, y: 35, size: 11, side: "left" },
      { kind: "glow", x: 62.7, y: 33.5, size: 7, color: WHITE },
      { kind: "twinkle", x: 45.3, y: 5.6, size: 2.5, color: WHITE },
      { kind: "glow", x: 89.4, y: 23.5, size: 8, color: WARM, delay: 1.2 },
      { kind: "waveline", y: 86 },
    ],
  },
  console: {
    width: 1920,
    height: 1078,
    items: [
      { kind: "meter", x: 47.5, y: 42.6, w: 26, h: 1.4, bars: 28, rotate: 8.6 },
      { kind: "playhead", x: 66.2, y: 27.5, w: 13.4, h: 8.6 },
      { kind: "pulse", x: 55.8, y: 31, size: 4 },
      { kind: "pulse", x: 56, y: 39.3, size: 4.6, delay: 0.25 },
      { kind: "pulse", x: 92, y: 31, size: 4, delay: 0.5 },
      { kind: "pulse", x: 92.3, y: 44.9, size: 4.6, delay: 0.75 },
      { kind: "twinkle", x: 14.5, y: 4.2, size: 1.8, color: WHITE },
      { kind: "twinkle", x: 43.4, y: 5.2, size: 1.6, color: WHITE, delay: 0.7 },
      { kind: "twinkle", x: 49.1, y: 5.2, size: 1.6, color: WHITE, delay: 1.4 },
      { kind: "twinkle", x: 86.1, y: 3.1, size: 1.8, color: WHITE, delay: 2.1 },
    ],
  },
};

export const SERVICE_FX: Record<string, ImageFx> = {
  microphones: {
    width: 960,
    height: 641,
    items: [
      { kind: "waves", x: 42.2, y: 21, size: 24 },
      { kind: "waves", x: 89, y: 23.4, size: 16, delay: 1 },
    ],
  },
  preamps: {
    width: 962,
    height: 572,
    items: [
      { kind: "glow", x: 63, y: 24.1, size: 3.2, color: RED },
      { kind: "glow", x: 66.7, y: 22.2, size: 3.2, color: RED, delay: 0.3 },
      { kind: "glow", x: 70.3, y: 20.5, size: 3.2, color: RED, delay: 0.6 },
      { kind: "glow", x: 80.2, y: 15.7, size: 3.2, color: RED, delay: 0.9 },
      { kind: "glow", x: 69.1, y: 70.3, size: 3, color: RED, delay: 0.45 },
      { kind: "glow", x: 72.8, y: 66.4, size: 3, color: RED, delay: 0.75 },
      { kind: "glow", x: 12, y: 48.4, size: 3, color: GREEN, delay: 0.2 },
      { kind: "glow", x: 22.5, y: 43.5, size: 3, color: GREEN, delay: 0.5 },
      { kind: "glow", x: 87.8, y: 80.8, size: 3.6, color: BLUE, delay: 0.8 },
    ],
  },
  workstation: {
    width: 960,
    height: 538,
    items: [
      { kind: "playhead", x: 33.6, y: 19.5, w: 30.8, h: 16.5 },
      { kind: "pulse", x: 10.9, y: 39.4, size: 7 },
      { kind: "pulse", x: 90.9, y: 38.7, size: 7, delay: 0.4 },
      { kind: "twinkle", x: 27.9, y: 66.9, size: 1.6, color: RED },
      { kind: "twinkle", x: 51.6, y: 61.9, size: 2, color: RED, delay: 0.8 },
    ],
  },
  cables: {
    width: 960,
    height: 577,
    items: [
      { kind: "bokeh", x: 76.6, y: 10.4, size: 9, color: WARM },
      { kind: "bokeh", x: 62.5, y: 4.3, size: 5, color: BLUE, delay: 1.5 },
      { kind: "bokeh", x: 68.8, y: 3.5, size: 6, color: WARM, delay: 3 },
      { kind: "bokeh", x: 87, y: 26, size: 6, color: "255, 120, 200", delay: 2 },
      { kind: "bokeh", x: 72.9, y: 17.3, size: 5, color: BLUE, delay: 4 },
    ],
  },
  subtitles: {
    width: 960,
    height: 577,
    items: [
      { kind: "caption", x: 14, y: 82.5, w: 36, h: 6.2 },
      { kind: "cursor", x: 73.6, y: 64.5, h: 1.8 },
    ],
  },
};
