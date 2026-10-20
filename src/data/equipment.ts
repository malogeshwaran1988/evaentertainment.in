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

export type EquipmentItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  /** "photo" fills the frame; "product" is a cut-out shown whole. */
  fit: "photo" | "product";
};

/** Generic brand labels only: images are representative, not a claim of exact models. */
export const EQUIPMENT_ITEMS: EquipmentItem[] = [
  {
    id: "pro-tools",
    name: "Avid Pro Tools",
    description: "Industry-standard recording and editing, with extra plug-ins for mixing and clean-up.",
    image: "/images/equipment/pro-tools.avif",
    alt: "Pro Tools editing window showing multitrack audio waveforms",
    width: 800,
    height: 400,
    fit: "photo",
  },
  {
    id: "neumann",
    name: "Neumann studio microphones",
    description: "Large-diaphragm condenser mics for clear, natural dialogue and vocals.",
    image: "/images/equipment/neumann.avif",
    alt: "Neumann large-diaphragm condenser studio microphone",
    width: 205,
    height: 720,
    fit: "product",
  },
  {
    id: "rode",
    name: "Rode microphones",
    description: "Low-noise condenser mics with pop filters for voice-over and dubbing sessions.",
    image: "/images/equipment/rode.avif",
    alt: "Rode condenser microphone in a shock mount with pop filter",
    width: 398,
    height: 453,
    fit: "product",
  },
  {
    id: "genelec",
    name: "Genelec studio monitors",
    description: "Accurate active monitors for precise mixing and quality checks.",
    image: "/images/equipment/genelec.avif",
    alt: "Genelec active studio monitor speaker",
    width: 701,
    height: 720,
    fit: "product",
  },
  {
    id: "yamaha",
    name: "Yamaha studio monitors",
    description: "Flat-response speakers for a second, honest reference while mixing.",
    image: "/images/equipment/yamaha.avif",
    alt: "Yamaha studio monitor speaker with white woofer",
    width: 491,
    height: 720,
    fit: "product",
  },
];
