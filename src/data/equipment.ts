import { APP_BASE_URL } from "@@/constants/constants";
import { getYearsOfExperience, getYearsOfExperienceLabel } from "@@/constants/experience";

export const EQUIPMENT_PAGE_URL = `${APP_BASE_URL}/studio-equipment`;
export const EQUIPMENT_OG_IMAGE = "/images/og/equipment.jpg";
export const EQUIPMENT_OG_IMAGE_ALT = "Studio monitors, MIDI keyboard and workstation at EVA Entertainment";

export const EQUIPMENT_SEO = {
  title: "Studio Equipment | Pro Tools Recording Studio Mumbai | EVA",
  description:
    "EVA Entertainment studios use Pro Tools, Rode & Neumann microphones, Genelec & Yamaha speakers, and multi-track digital recording for dubbing and production.",
};

export const EQUIPMENT_CONTENT = {
  pageTitle: "Studio Equipment",
  heading: "Equipment at EVA Entertainment",
  paragraphs: [
    "We use Pro Tools with extra plug-ins, Neumann and Rode microphones, and Genelec and Yamaha speakers.",
    "The studio is designed to allow flexibility to accommodate the demands of various audio recording situations.",
    `With over ${getYearsOfExperience()} years of industry experience, our engineers are capable of meeting the needs of your recording project - however large or small. With state-of-the-art equipment, separate soundproof studios for artists and multi-track digital recording facility, we undertake all types of recordings, dubbing etc.`,
  ],
};

export const EQUIPMENT_EXPERIENCE = {
  heading: "A calm, quiet room built around your voice",
  intro:
    "Every session runs through the same professional chain: isolated booths for the artist, studio-grade microphones, accurate monitoring and a Pro Tools workflow our engineers have refined over more than a decade.",
  highlights: [
    { icon: "icon-clock", value: `${getYearsOfExperienceLabel()} years`, label: "Of industry experience" },
    { icon: "icon-mic-3", value: "Soundproof", label: "Separate studios for artists" },
    { icon: "icon-sound-on", value: "5.1", label: "Surround mixing" },
    { icon: "icon-music-equalizer", value: "Multi-track", label: "Digital recording facility" },
  ],
};

export type EquipmentItem = {
  id: string;
  /** Small label above the name, e.g. the stage of the workflow. */
  role: string;
  name: string;
  description: string;
  workflow: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  /**
   * Decorative "live" overlay, measured on the 1400x1050 (4:3, uncropped) source.
   * Emitter x/y = centre in % of image width/height; d = diameter in % of image width.
   */
  live: {
    kind: "surround" | "mic" | "speaker";
    /** ch = 5.1 channel label (surround only), fired in array order. */
    emitters: { x: number; y: number; d: number; ch?: string }[];
    /** Surround only: low-frequency pulse and the mix (listening) position. */
    lfe?: { x: number; y: number; d: number };
    sweet?: { x: number; y: number };
    rec?: "tl" | "tr";
    led?: { x: number; y: number };
    glow: { x: number; y: number };
  };
};

/** Original studio images showing the equipment we use. */
export const EQUIPMENT_ITEMS: EquipmentItem[] = [
  {
    id: "pro-tools",
    role: "Recording & editing",
    name: "Avid Pro Tools",
    description:
      "The industry-standard workstation for film and television audio, extended with extra plug-ins for mixing, clean-up and finishing.",
    workflow: "Every take is recorded, edited, synced to picture and mixed in Pro Tools, up to 5.1 delivery.",
    image: "/images/equipment/pro-tools-studio.avif",
    alt: "Indian engineer mixing in Pro Tools in a compact Mumbai control room with 5.1 monitors",
    width: 1400,
    height: 1050,
    live: {
      kind: "surround",
      emitters: [
        { ch: "L", x: 33, y: 54, d: 7 },
        { ch: "C", x: 61, y: 33, d: 7 },
        { ch: "R", x: 89, y: 57, d: 8 },
        { ch: "Rs", x: 92, y: 9, d: 8 },
        { ch: "Ls", x: 30, y: 14, d: 8 },
      ],
      lfe: { x: 75, y: 90, d: 20 },
      sweet: { x: 20, y: 45 },
      glow: { x: 62, y: 38 },
    },
  },
  {
    id: "neumann",
    role: "Dialogue & vocals",
    name: "Neumann studio microphones",
    description:
      "Large-diaphragm condenser microphones known for a clear, natural and detailed sound that flatters every voice.",
    workflow: "Our first choice for lip-sync dubbing, where every breath and nuance of the performance matters.",
    image: "/images/equipment/neumann-studio.avif",
    alt: "Neumann condenser microphone in a shock mount with an Indian voice artist in the booth",
    width: 1400,
    height: 1050,
    live: { kind: "mic", emitters: [{ x: 31, y: 26, d: 22 }], rec: "tr", glow: { x: 31, y: 26 } },
  },
  {
    id: "rode",
    role: "Voice-over",
    name: "Rode microphones",
    description:
      "Low-noise condenser microphones paired with pop filters for a clean, consistent voice in every line.",
    workflow: "Used in our soundproof booths for voice-over, narration and long dubbing sessions.",
    image: "/images/equipment/rode-studio.avif",
    alt: "Rode condenser microphone with a pop filter in a voice-over booth",
    width: 1400,
    height: 1050,
    live: { kind: "mic", emitters: [{ x: 41, y: 44, d: 22 }], rec: "tr", glow: { x: 41, y: 44 } },
  },
  {
    id: "genelec",
    role: "Monitoring",
    name: "Genelec studio monitors",
    description:
      "Precise active monitors that reveal exactly what is in the mix, with nothing added and nothing hidden.",
    workflow: "Engineers mix and quality-check every reel on Genelec monitors before delivery.",
    image: "/images/equipment/genelec-studio.avif",
    alt: "Genelec active studio monitor on a desk in a Mumbai studio",
    width: 1400,
    height: 1050,
    live: { kind: "speaker", emitters: [{ x: 47, y: 53, d: 30 }], led: { x: 48, y: 22 }, glow: { x: 47, y: 50 } },
  },
  {
    id: "yamaha",
    role: "Reference listening",
    name: "Yamaha studio monitors",
    description:
      "Honest, flat-response speakers that show how a mix will translate to everyday listening.",
    workflow: "A second reference so dialogue, music and effects sit right on any screen or speaker.",
    image: "/images/equipment/yamaha-studio.avif",
    alt: "Pair of Yamaha studio monitors on a mixing desk in a control room",
    width: 1400,
    height: 1050,
    live: {
      kind: "speaker",
      emitters: [
        { x: 24, y: 51, d: 15 },
        { x: 83, y: 51, d: 15 },
      ],
      glow: { x: 50, y: 55 },
    },
  },
];
