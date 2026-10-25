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

/**
 * Home hero: one slide per lead service. Only slide 1 holds the page H1; the rest use H2.
 * Slide 1 image is the LCP (eager + high priority); the others lazy-load.
 */
export type HeroSlide = {
  image: string;
  alt: string;
  fx: (typeof HERO_FX)[keyof typeof HERO_FX];
  /** Mirror the photo so the person sits right of the left text block (no text/logos in frame). */
  flip?: boolean;
  /** object-position on tablets and phones so the subject's face stays in frame. */
  focus?: string;
  /** Line 2: short white line in its own black box. */
  tagline: string;
  heading: string;
  headingLevel: "h1" | "h2";
  cta: { label: string; href: string };
};

export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    image: "/images/home/slide-1-iconic.avif",
    alt: "Singer at the microphone in the EVA recording booth",
    fx: HERO_FX.iconic,
    heading: "Film Dubbing Studio in India for Regional, Pan-India and Hollywood Films",
    tagline: "We can record Anything",
    headingLevel: "h1",
    cta: { label: "Explore dubbing", href: "/dubbing-studio" },
  },
  {
    image: "/images/home/hero-voiceover.avif",
    alt: "Voice artist reading a script into a studio microphone in a voice-over booth",
    fx: HERO_FX.voiceover,
    heading: "Voice-over for ads, films and games",
    tagline: "Every age. Every tone.",
    focus: "72% 40%",
    headingLevel: "h2",
    cta: { label: "Explore voice-over", href: "/voice-over-studio" },
  },
  {
    image: "/images/home/slide-1.avif",
    alt: "Female vocalist recording a film song at the microphone",
    fx: HERO_FX.singer,
    heading: "Film songs recorded with care",
    tagline: "Vocals and live instruments",
    headingLevel: "h2",
    cta: { label: "Explore song recording", href: "/song-recording-studio" },
  },
  {
    image: "/images/home/hero-mix51.avif",
    alt: "Sound engineer at a mixing console watching a film on the screen of a 5.1 surround mix theatre",
    fx: HERO_FX.mix51,
    heading: "Cinema sound in 5.1 surround",
    tagline: "Theatre and OTT ready mixes",
    focus: "76% 50%",
    headingLevel: "h2",
    cta: { label: "Explore 5.1 mixing", href: "/5-1-mixing-studio" },
  },
  {
    image: "/images/home/hero-foley.avif",
    alt: "Foley artist stepping on a gravel pit in sync with a film scene on the screen in front of him",
    focus: "62% 50%",
    fx: HERO_FX.foley,
    heading: "Foley that makes scenes feel true",
    tagline: "Performed live to picture",
    headingLevel: "h2",
    cta: { label: "Explore Foley", href: "/foley-recording" },
  },
];
