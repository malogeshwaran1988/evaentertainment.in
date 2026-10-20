import { APP_BASE_URL } from "@@/constants/constants";

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
    "With over 13 years of industry experience, our engineers are capable of meeting the needs of your recording project - however large or small. With state-of-the-art equipment, separate soundproof studios for artists and multi-track digital recording facility, we undertake all types of recordings, dubbing etc.",
  ],
};

export const EQUIPMENT_EXPERIENCE = {
  eyebrow: "The studio experience",
  heading: "A calm, quiet room built around your voice",
  intro:
    "Every session runs through the same professional chain: isolated booths for the artist, studio-grade microphones, accurate monitoring and a Pro Tools workflow our engineers have refined over more than a decade.",
  highlights: [
    { value: "13+", label: "Years of industry experience" },
    { value: "Soundproof", label: "Separate studios for artists" },
    { value: "5.1", label: "Surround mixing" },
    { value: "Multi-track", label: "Digital recording facility" },
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
  /** Decorative "live" overlay: level meters, REC + sound rings, or speaker pulse. */
  overlay: "meter" | "rec" | "pulse";
  /** Where the rings sit on the photo, in % (x, y). */
  focus: { x: number; y: number };
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
    overlay: "meter",
    focus: { x: 50, y: 50 },
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
    overlay: "rec",
    focus: { x: 40, y: 32 },
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
    overlay: "rec",
    focus: { x: 50, y: 48 },
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
    overlay: "pulse",
    focus: { x: 47, y: 40 },
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
    overlay: "pulse",
    focus: { x: 22, y: 31 },
    credit: {
      author: "Audio Mix House",
      license: "CC BY 2.0",
      source:
        "https://commons.wikimedia.org/wiki/File:Yamaha_NS-10_monitor_at_Audio_Mix_House,_Studio_C_(13430679745).jpg",
    },
  },
];
