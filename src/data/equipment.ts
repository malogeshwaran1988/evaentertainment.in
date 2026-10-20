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
  /** Generic caption: these are representative photos, not EVA's own rooms. */
  caption: string;
  credit: { author: string; license: string; source: string };
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

/** Representative photos from Wikimedia Commons (licences below); not photos of EVA's studio. */
export const EQUIPMENT_ITEMS: EquipmentItem[] = [
  {
    id: "pro-tools",
    role: "Recording & editing",
    name: "Avid Pro Tools",
    description:
      "The industry-standard workstation for film and television audio, extended with extra plug-ins for mixing, clean-up and finishing.",
    workflow: "Every take is recorded, edited, synced to picture and mixed in Pro Tools, up to 5.1 delivery.",
    image: "/images/equipment/pro-tools-studio.avif",
    alt: "Control room with a Pro Tools console, studio monitors and a large mixing desk",
    width: 1400,
    height: 1050,
    caption: "A Pro Tools 5.1 mixing room in a professional studio",
    live: {
      kind: "surround",
      emitters: [
        { ch: "L", x: 30.9, y: 43.8, d: 7 },
        { ch: "C", x: 32.1, y: 22.5, d: 9 },
        { ch: "R", x: 57.9, y: 36.4, d: 8 },
        { ch: "Rs", x: 56.7, y: 54.3, d: 5 },
        { ch: "Ls", x: 3.1, y: 32.8, d: 7 },
      ],
      lfe: { x: 36, y: 84, d: 30 },
      sweet: { x: 50, y: 64 },
      glow: { x: 45, y: 57 },
    },
    credit: {
      author: "Will Fisher",
      license: "CC BY-SA 2.0",
      source:
        "https://commons.wikimedia.org/wiki/File:5.1_mixing_room_for_Radio,_TV,_and_Film_production,_equipt_with_AVID_Pro_Tools_including_ICON_D-Command_-_Control_Room_B,_In_Your_Ear_Studios.jpg",
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
    alt: "Neumann condenser microphone in a shock mount, close up in a recording studio",
    width: 1400,
    height: 1050,
    caption: "A Neumann microphone in a professional recording studio",
    live: { kind: "mic", emitters: [{ x: 35.7, y: 26.7, d: 30 }], rec: "tr", glow: { x: 36, y: 27 } },
    credit: {
      author: "Will Fisher",
      license: "CC BY-SA 2.0",
      source:
        "https://commons.wikimedia.org/wiki/File:Neumann_U87_Condenser_Microphone_-_Studio_A,_In_Your_Ear_Studios.jpg",
    },
  },
  {
    id: "rode",
    role: "Voice-over",
    name: "Rode microphones",
    description:
      "Low-noise condenser microphones paired with pop filters for a clean, consistent voice in every line.",
    workflow: "Used in our soundproof booths for voice-over, narration and long dubbing sessions.",
    image: "/images/equipment/rode-studio.avif",
    alt: "Rode condenser microphone with a pop filter and acoustic reflection filter",
    width: 1400,
    height: 1050,
    caption: "A Rode microphone with pop and reflection filters in a vocal booth",
    live: { kind: "mic", emitters: [{ x: 41.4, y: 44.2, d: 35 }], rec: "tr", glow: { x: 41, y: 44 } },
    credit: {
      author: "Tim Sheerman-Chase",
      license: "CC BY 2.0",
      source:
        "https://commons.wikimedia.org/wiki/File:Condenser_Microphone_with_Pop_Filter_and_Reflection_Filter.jpg",
    },
  },
  {
    id: "genelec",
    role: "Monitoring",
    name: "Genelec studio monitors",
    description:
      "Precise active monitors that reveal exactly what is in the mix, with nothing added and nothing hidden.",
    workflow: "Engineers mix and quality-check every reel on Genelec monitors before delivery.",
    image: "/images/equipment/genelec-studio.avif",
    alt: "Close-up of a Genelec active studio monitor",
    width: 1400,
    height: 1050,
    caption: "A Genelec active studio monitor",
    live: { kind: "speaker", emitters: [{ x: 45, y: 4, d: 52 }], led: { x: 75.7, y: 8.6 }, glow: { x: 45, y: 20 } },
    credit: {
      author: "Tumi-1983",
      license: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Genelec_8030A_activespeaker.jpg",
    },
  },
  {
    id: "yamaha",
    role: "Reference listening",
    name: "Yamaha studio monitors",
    description:
      "Honest, flat-response speakers that show how a mix will translate to everyday listening.",
    workflow: "A second reference so dialogue, music and effects sit right on any screen or speaker.",
    image: "/images/equipment/yamaha-studio.avif",
    alt: "Yamaha studio monitor on top of a mixing console in a control room",
    width: 1400,
    height: 1050,
    caption: "Yamaha studio monitors on a mixing console in a professional control room",
    live: {
      kind: "speaker",
      emitters: [
        { x: 22.9, y: 41, d: 13.5 },
        { x: 9.3, y: 36.8, d: 6.5 },
      ],
      glow: { x: 20, y: 40 },
    },
    credit: {
      author: "Audio Mix House",
      license: "CC BY 2.0",
      source:
        "https://commons.wikimedia.org/wiki/File:Yamaha_NS-10_monitor_at_Audio_Mix_House,_Studio_C_(13430679745).jpg",
    },
  },
];
