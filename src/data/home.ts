import { APP_BASE_URL, DEFAULT_OG_IMAGE } from "@@/constants/constants";
import { serviceHref, type ServiceSlug } from "@@/constants/routes";
import { HERO_FX } from "@@/data/image-fx";

export const HOME_PAGE_URL = `${APP_BASE_URL}/`;
export const HOME_OG_IMAGE = DEFAULT_OG_IMAGE;
export const HOME_OG_IMAGE_ALT = "Singer recording vocals at a studio microphone at EVA Entertainment";

export const HOME_SEO = {
  title: "Film Dubbing Studio in India - Hollywood to Hindi | EVA",
  description:
    "Film dubbing studio in Mumbai for regional, pan-India and Hollywood films. One English voice artist carried into India's top 10 languages. Get a quote.",
};

/** "What We Do" cards on the home page, in display order. */
export const WHAT_WE_DO: ServiceSlug[] = [
  "dubbing-studio",
  "hollywood-dubbing-indian-languages",
  "pan-india-film-dubbing",
  "regional-film-dubbing",
  "indian-languages",
  "voice-over-studio",
  "song-recording-studio",
  "foley-recording",
  "stock-music-library",
  "5-1-mixing-studio",
  "subtitling-services",
  "translation-services",
];

export const HOME_INTRO =
  "The EVA Entertainment Recording Studio is the brainchild of Sound who understand that the best art comes from the best environment.";

/** How many posters the home strip shows (keep out of client modules — server imports can see `0`). */
export const HOME_PROJECTS_LIMIT = 10;

export const SERVICE_CARDS = [
  {
    href: serviceHref("dubbing-studio"),
    image: "/images/home/services-grid-1.avif",
    alt: "Voice artist dubbing at a studio microphone",
    eyebrow: "Offering",
    title: "Language Dubbing",
    description:
      "Our studio is the ideal place for Lip-Sync & voice-over dubbing; it's quiet, it's private and has every possible amenity you could desire.",
  },
  {
    href: serviceHref("5-1-mixing-studio"),
    image: "/images/home/services-grid-2.avif",
    alt: "Sound engineer at a 5.1 mixing console",
    eyebrow: "Digital",
    title: "5.1 Mixing",
    description: "",
  },
  {
    href: serviceHref("foley-recording"),
    image: "/images/home/services-grid-3.avif",
    alt: "Mixing console faders for Foley recording",
    eyebrow: "Royal",
    title: "Foley Recording",
    description: "",
  },
  {
    href: serviceHref("translation-services"),
    image: "/images/home/services-grid-4.avif",
    alt: "Studio headphones resting on piano keys",
    eyebrow: "Voice",
    title: "Translation",
    description:
      "Our facilities deliver audio production, creative sound design and studio direction for every language.",
  },
  {
    href: serviceHref("stock-music-library"),
    image: "/images/home/services-grid-5.avif",
    alt: "Producer browsing a stock music library",
    eyebrow: "Royal",
    title: "Stock Library",
    description: "Amplify your ideas and explore our curated stock music library.",
  },
  {
    href: serviceHref("subtitling-services"),
    image: "/images/home/services-grid-6.avif",
    alt: "Laptop running subtitle editing software",
    eyebrow: "Text Services",
    title: "Subtitling",
    description:
      "You are welcome to contact us. By this way, you can increase potential viewers for your films.",
  },
] as const;

export const HERO_SLIDES = [
  {
    image: "/images/home/slide-1.avif",
    alt: "Female vocalist recording a voice-over",
    fx: HERO_FX.singer,
    lines: [
      {
        role: "h1" as const,
        className: "h-gradient",
        text: "Film Dubbing Studio in India for Regional, Pan-India and Hollywood Films",
      },
      {
        role: "title" as const,
        className: "",
        text: "We can record Anything",
      },
    ],
  },
  {
    image: "/images/home/slide-2.avif",
    alt: "Recording studio control room with mixing console",
    fx: HERO_FX.console,
    lines: [
      {
        role: "subtitle" as const,
        className: "hidden-xs",
        text: "Bring visual to life",
      },
      {
        role: "title" as const,
        className: "h-gradient",
        text: "No studio yet?",
      },
      {
        role: "title" as const,
        className: "",
        text: "No problem.",
      },
    ],
  },
] as const;
