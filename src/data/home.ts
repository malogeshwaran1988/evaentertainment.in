import { APP_BASE_URL, DEFAULT_OG_IMAGE } from "@@/constants/constants";

export const HOME_PAGE_URL = `${APP_BASE_URL}/`;
export const HOME_OG_IMAGE = DEFAULT_OG_IMAGE;

export const HOME_SEO = {
  title: "EVA Entertainment | Content Localization & Recording Studio Mumbai",
  description:
    "EVA Entertainment in Andheri, Mumbai offers lip-sync dubbing, voice-over, Foley recording, 5.1 mixing, subtitling, and multimedia localization services.",
};

export const WHAT_WE_DO = [
  { icon: "icon icon-lip-syncdubbing-01", title: "Lip-Sync Dubbing", fa: false },
  { icon: "icon icon-voiceover", title: "Voice Over", fa: false },
  { icon: "icon icon-songrecording", title: "Song Recording", fa: false },
  { icon: "icon icon-folleyrecording", title: "Folley Recording", fa: false },
  { icon: "icon icon-stocklibrary", title: "Stock Library", fa: false },
  { icon: "fas fa-podcast", title: "5.1 Mixing & Mastering", fa: true },
  { icon: "icon icon-translate1", title: "Subtitling", fa: false },
  { icon: "fas fa-language", title: "Translation", fa: true },
] as const;

export const HOME_INTRO =
  "The EVA Entertainment Recording Studio is the brainchild of Sound who understand that the best art comes from the best environment.";

export const SERVICE_CARDS = [
  {
    href: "/services#Lip-Sync",
    image: "/images/home/services-grid-1.jpg",
    eyebrow: "Offering",
    title: "Language Dubbing",
    description:
      "Our studio is the ideal place for Lip-Sync & voice-over dubbing; it's quiet, it's private and has every possible amenity you could desire.",
  },
  {
    href: "/services#mixing",
    image: "/images/home/services-grid-2.jpg",
    eyebrow: "Digital",
    title: "5.1 Mixing",
    description: "",
  },
  {
    href: "/services#Folley",
    image: "/images/home/services-grid-3.jpg",
    eyebrow: "Royal",
    title: "Folley Recording",
    description: "",
  },
  {
    href: "/services",
    image: "/images/home/services-grid-4.jpg",
    eyebrow: "Voice",
    title: "Translation",
    description:
      "facilities deliver audio production, creative sound design and studio direction for...",
  },
  {
    href: "/services",
    image: "/images/home/services-grid-5.jpg",
    eyebrow: "Royal",
    title: "Stock Library",
    description: "Amplify your ideas and explore our curated stock music library.",
  },
  {
    href: "/services#Subtitling",
    image: "/images/home/services-grid-6.jpg",
    eyebrow: "Text Services",
    title: "Subtitling",
    description:
      "You are welcome to contact us. By this way, you can increase potential viewers for your films.",
  },
] as const;

export const HERO_SLIDES = [
  {
    image: "/images/home/slide-1.jpg",
    lines: [
      {
        role: "h1" as const,
        className: "h-gradient",
        text: "EVA Entertainment",
      },
      {
        role: "title" as const,
        className: "",
        text: "We can record Anything",
      },
    ],
  },
  {
    image: "/images/home/slide-2.jpg",
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
