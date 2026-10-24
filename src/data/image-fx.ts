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
  | { kind: "waveline"; y: number }
  /** An LED on a level meter that flickers like a VU reading. */
  | { kind: "vu"; x: number; y: number; size: number; color?: string; delay?: number }
  /** A small back-and-forth turn highlight centred on a knob. */
  | { kind: "knob"; x: number; y: number; size: number; delay?: number }
  /** A light sweep across a panel (x, y = top-left; w, h in % of width / height). */
  | { kind: "gloss"; x: number; y: number; w: number; h: number; rotate?: number };

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
      { kind: "gloss", x: 0, y: 8, w: 62, h: 46, rotate: -14 },
      { kind: "gloss", x: 30, y: 58, w: 62, h: 40, rotate: -14 },
      { kind: "knob", x: 42.5, y: 24.5, size: 7.5 },
      { kind: "knob", x: 32.5, y: 27.5, size: 7, delay: 0.9 },
      { kind: "knob", x: 51, y: 83, size: 7, delay: 0.4 },
      { kind: "knob", x: 41.5, y: 92, size: 7, delay: 1.3 },
      { kind: "vu", x: 63, y: 24.1, size: 3.2, color: RED },
      { kind: "vu", x: 66.7, y: 22.2, size: 3.2, color: RED, delay: 0.15 },
      { kind: "vu", x: 70.3, y: 20.5, size: 3.2, color: RED, delay: 0.3 },
      { kind: "vu", x: 80.2, y: 15.7, size: 3.2, color: RED, delay: 0.45 },
      { kind: "vu", x: 69.1, y: 70.3, size: 3, color: RED, delay: 0.2 },
      { kind: "vu", x: 72.8, y: 66.4, size: 3, color: RED, delay: 0.35 },
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

/** Overlays for the original studio images in /images/services/svc-*.avif (all 1440×1080, measured on a 10% grid). */
const P = (items: FxItem[]): ImageFx => ({ width: 1440, height: 1080, items });

export const PHOTO_FX: Record<string, ImageFx> = {
  "dub-studio": P([
    { kind: "waves", x: 21, y: 38, size: 12, side: "right" },
    { kind: "glow", x: 74, y: 31, size: 18, color: WHITE },
    { kind: "glow", x: 55, y: 4, size: 12, color: WARM, delay: 0.6 },
  ]),
  "foley-lead": P([
    { kind: "pulse", x: 41, y: 80, size: 7 },
    { kind: "pulse", x: 55, y: 79, size: 7, delay: 0.6 },
    { kind: "glow", x: 80, y: 40, size: 10, color: WARM, delay: 0.3 },
    { kind: "waveline", y: 93 },
  ]),
  "foley-what": P([
    { kind: "waves", x: 58, y: 90, size: 12, side: "left" },
    { kind: "glow", x: 12, y: 60, size: 5, color: WARM, delay: 0.5 },
  ]),
  "foley-studio": P([
    { kind: "waves", x: 57, y: 30, size: 14, side: "right" },
    { kind: "glow", x: 40, y: 38, size: 9, color: WHITE, delay: 0.4 },
  ]),
  "mix-problems": P([
    { kind: "playhead", x: 81, y: 32, w: 16, h: 24 },
    { kind: "vu", x: 97.5, y: 60, size: 2.4, color: GREEN },
    { kind: "pulse", x: 23, y: 50, size: 6 },
    { kind: "pulse", x: 72, y: 50, size: 6, delay: 0.4 },
    { kind: "knob", x: 15, y: 84, size: 5, delay: 0.8 },
  ]),
  "mix51-lead": P([
    { kind: "pulse", x: 3.5, y: 46, size: 5 },
    { kind: "pulse", x: 23.5, y: 45.5, size: 5, delay: 0.2 },
    { kind: "pulse", x: 96.5, y: 47.5, size: 5, delay: 0.4 },
    { kind: "pulse", x: 84, y: 81, size: 6, delay: 0.6 },
    { kind: "meter", x: 43, y: 63, w: 9, h: 1.2, bars: 10 },
    { kind: "meter", x: 58, y: 63, w: 6, h: 1.2, bars: 7 },
    { kind: "glow", x: 61, y: 26, size: 24, color: WARM, delay: 0.8 },
  ]),
  "song-lead": P([
    { kind: "waves", x: 54, y: 40, size: 14, side: "left" },
    { kind: "glow", x: 40, y: 6, size: 14, color: WARM, delay: 0.6 },
  ]),
  "song-session": P([
    { kind: "playhead", x: 29, y: 63, w: 21, h: 16 },
    { kind: "waves", x: 55, y: 35, size: 9, side: "right" },
    { kind: "pulse", x: 31, y: 55, size: 4 },
    { kind: "pulse", x: 87, y: 61, size: 4, delay: 0.4 },
    { kind: "glow", x: 93, y: 78, size: 8, color: WARM, delay: 0.7 },
  ]),
  "song-studio": P([
    { kind: "meter", x: 30, y: 56, w: 28, h: 1.2, bars: 20 },
    { kind: "playhead", x: 35, y: 42, w: 14, h: 10 },
    { kind: "pulse", x: 26, y: 46, size: 5 },
    { kind: "pulse", x: 66, y: 46, size: 5, delay: 0.4 },
  ]),
  "stock-curated": P([
    { kind: "playhead", x: 13, y: 45, w: 23, h: 25 },
    { kind: "pulse", x: 49, y: 73, size: 6, delay: 0.3 },
    { kind: "bokeh", x: 88, y: 8, size: 8, color: WARM, delay: 1 },
    { kind: "waveline", y: 94 },
  ]),
  "stock-lead": P([
    { kind: "playhead", x: 30, y: 41, w: 18, h: 13 },
    { kind: "glow", x: 51, y: 24, size: 12, color: RED },
    { kind: "vu", x: 49, y: 72, size: 1.6, color: GREEN },
    { kind: "vu", x: 54, y: 72, size: 1.6, color: RED, delay: 0.5 },
    { kind: "pulse", x: 12, y: 59, size: 6, delay: 0.2 },
    { kind: "twinkle", x: 67, y: 8, size: 1.6, color: WARM, delay: 0.9 },
  ]),
  "stock-voice": P([
    { kind: "waves", x: 35, y: 50, size: 9, side: "left" },
    { kind: "waves", x: 72, y: 50, size: 9, side: "right", delay: 0.8 },
    { kind: "glow", x: 53, y: 26, size: 6, color: WARM, delay: 0.4 },
  ]),
  "sub-south": P([
    { kind: "glow", x: 57, y: 33, size: 26, color: WHITE },
    { kind: "caption", x: 47, y: 49, w: 22, h: 2.2 },
  ]),
  "sub-together": P([
    { kind: "caption", x: 64, y: 52, w: 17, h: 2.5 },
    { kind: "playhead", x: 67, y: 76, w: 30, h: 18 },
    { kind: "glow", x: 75, y: 40, size: 14, color: BLUE, delay: 0.6 },
  ]),
  "tr-languages": P([
    { kind: "cursor", x: 66, y: 70, h: 3 },
    { kind: "glow", x: 90, y: 40, size: 8, color: WARM, delay: 0.5 },
  ]),
  "tr-transcreation": P([
    { kind: "glow", x: 30, y: 30, size: 14, color: WARM },
    { kind: "glow", x: 80, y: 20, size: 10, color: WARM, delay: 1 },
    { kind: "playhead", x: 25, y: 70, w: 18, h: 12 },
  ]),
  "translation-lead": P([
    { kind: "cursor", x: 63, y: 58, h: 4 },
    { kind: "caption", x: 76, y: 46, w: 18, h: 2 },
  ]),
  "vo-studio": P([
    { kind: "waves", x: 72, y: 55, size: 12, side: "left" },
    { kind: "glow", x: 77, y: 25, size: 18, color: BLUE, delay: 0.5 },
  ]),
  "vo-voices": P([{ kind: "waves", x: 58, y: 52, size: 16, side: "left" }]),
};
