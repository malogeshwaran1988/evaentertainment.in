/**
 * All copy for the /dubbing hub and /dubbing/<from>-to-<to> pages lives here (one config spot).
 * Facts only: counts, titles and years come from published projects; process copy matches the
 * dubbing service pages. Never add prices or turnaround promises here.
 */
import type { Project } from "@@/data/projects";
import { SITE_NAME } from "@@/constants/constants";

type Pair = { from: string; to: string; projects: readonly Project[] };

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const listJoin = (items: string[]) =>
  items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

/** Hand-written intro per source language (unchanged wording). */
export const PAIR_INTRO: Record<string, string> = {
  Telugu:
    "Telugu cinema travels well beyond Andhra Pradesh and Telangana and a natural Hindi version opens it to audiences across North India and on national OTT platforms. Our team adapts the dialogue for lip sync, keeps the punch of mass dialogues and comedy timing and casts Hindi voices that match each character's age and energy.",
  Tamil:
    "Tamil films are known for sharp writing and strong performances. When we dub Tamil titles into Hindi we rewrite lines so they sit naturally on the actors' lips, keep cultural references understandable for Hindi viewers and record songs and crowd scenes so the dubbed version feels as alive as the original.",
  Malayalam:
    "Malayalam cinema is often quieter and more realistic, so the dub has to be subtle. We focus on restrained, natural Hindi performances, careful script adaptation and clean mixes that preserve the original sound design for streaming and broadcast releases.",
  Kannada:
    "Kannada films are reaching national audiences faster than ever. We handle script translation, lip-sync adaptation, Hindi voice casting with recording and the final mix, delivering broadcast and OTT ready masters.",
  English:
    "Hollywood and international English content needs Hindi dubbing that sounds local, not translated. We adapt idioms and jokes for Hindi audiences, match the timing of fast dialogue and deliver mixes to platform specifications.",
  Hindi:
    "Hindi films and series dubbed into South Indian languages reach audiences in their mother tongue. Our native-speaker writers and voice artists adapt each line for lip sync and cultural fit.",
};

/** The source-language intros above are written for Hindi dubs; other targets get a neutral intro. */
export function pairIntro({ from, to }: Pair) {
  const own = PAIR_INTRO[from];
  if (own && (to === "Hindi" || from === "Hindi")) return own;
  return `${from} stories reach new viewers when they sound native in ${to}. Our translators adapt every ${from} line for lip sync and cultural fit while native ${to} voice artists match each character's age and energy.`;
}

/** Second intro paragraph built from real project facts, so every pair page says something different. */
export function pairFacts({ from, to, projects }: Pair) {
  const titles = projects.slice(0, 3).map((p) => p.title);
  const categories = [...new Set(projects.map((p) => p.category))];
  const years = projects.map((p) => Number(p.year)).filter(Number.isFinite);
  const span = years.length
    ? Math.min(...years) === Math.max(...years)
      ? ` in ${Math.min(...years)}`
      : ` between ${Math.min(...years)} and ${Math.max(...years)}`
    : "";
  return `${SITE_NAME} has dubbed ${plural(projects.length, `${from} title`, `${from} titles`)} into ${to}${span}, covering ${listJoin(categories.map((c) => c.toLowerCase()))}. ${titles.length > 1 ? "Recent work includes" : "Our work includes"} ${listJoin(titles)}.`;
}

export const pairHeading = ({ from, to }: Pair) => `${from} to ${to} Dubbing Services`;
export const pairLinkLabel = ({ from, to }: Pair) => `${from} to ${to} Dubbing`;

/** "{S} to {T} Dubbing Services | EVA Entertainment", dropping " Services" past 60 characters. */
export function pairTitle(pair: Pair) {
  const full = `${pairHeading(pair)} | ${SITE_NAME}`;
  return full.length <= 60 ? full : `${pairLinkLabel(pair)} | ${SITE_NAME}`;
}

/** SEO Expert wording, kept within 140-160 characters. */
export function pairDescription({ from, to, projects }: Pair) {
  const n = plural(projects.length, "completed project", "completed projects");
  const base = (by: string) =>
    `Professional ${from} to ${to} dubbing for films, web series and TV by ${by}. See ${n} and get a free quote today.`;
  let d = base(SITE_NAME);
  if (d.length < 140) d = base(`${SITE_NAME} in Mumbai`);
  if (d.length > 160) d = d.replace("Professional ", "").replace(/^./, (c) => c.toUpperCase());
  return d;
}

/** Topic image per pair (original studio photos); falls back to the dubbing studio photo. */
const LANG_CODE: Record<string, string> = { Telugu: "te", Tamil: "ta", Malayalam: "ml", Kannada: "kn", English: "en", Hindi: "hi" };
const PAIR_IMAGES: Record<string, string> = {
  "te-hi": "Indian translator comparing a printed film script with a laptop draft in a dubbing studio",
  "ta-hi": "Indian woman translator writing on a script page beside editing monitors with a brass lamp and filter coffee",
  "ml-hi": "Indian dubbing artist with headphones speaking at a condenser microphone in a recording booth",
  "kn-hi": "Two Indian writers discussing a marked up dialogue script at a mixing console",
  "en-hi": "Indian female voice artist with headphones laughing during a take at a studio microphone",
  "te-ta": "Indian dubbing director at a mixing console pointing at an action scene on the studio screen",
};
export function pairImage({ from, to }: Pair) {
  const id = `${LANG_CODE[from] ?? "x"}-${LANG_CODE[to] ?? "x"}`;
  return PAIR_IMAGES[id]
    ? { src: `/images/services/lp-${id}.avif`, alt: PAIR_IMAGES[id] }
    : {
        src: "/images/services/svc-dub-studio.avif",
        alt: "Indian voice artist with headphones at a condenser microphone reading a script to a film on the booth monitor",
      };
}

export const pairSections = ({ from: S, to: T }: Pair) => ({
  projects: `${S} to ${T} Dubbing Projects`,
  process: `How Our ${S} to ${T} Dubbing Works`,
  studio: "Voice Artists and Studio Quality",
  why: `Why Choose EVA for ${T} Dubbing`,
  related: "Other Language Pairs",
  faq: `${S} to ${T} Dubbing FAQs`,
  quote: `Get a ${S} to ${T} Dubbing Quote`,
});

export const pairSteps = ({ from: S, to: T }: Pair) => [
  { title: "Script adaptation", text: `Translators and scriptwriters turn the ${S} dialogue into natural ${T} that fits each actor's lip movement.` },
  { title: "Voice casting", text: `We cast native ${T} dubbing artists for every character and share voice samples before we record.` },
  { title: "Recording", text: "Dubbing directors record each line to picture with our sound engineers in the booth." },
  { title: "Lip sync", text: `Every take is checked against the screen so the ${T} dialogue matches the actors' lips.` },
  { title: "Mix and QC", text: "The final track is mixed (5.1 when you need it) and checked before we deliver the finished video." },
];

export const pairStudio = ({ to: T }: Pair) => [
  `Every ${T} line is voiced by a native artist working in their mother tongue, so pronunciation and tone sound right to local viewers. We cast male, female and child voices of all ages.`,
  "Sessions run in our Andheri West studio in Mumbai with a dubbing director and a sound engineer guiding every take.",
];

export const pairWhy = ({ from: S, to: T, projects }: Pair) => [
  { title: `${plural(projects.length, "completed title", "completed titles")}`, text: `Real ${S} to ${T} projects you can see on this page.` },
  { title: "One complete team", text: "Sound engineers, dubbing artists, directors, scriptwriters, coordinators and translators work together on your project." },
  { title: "Source video in, final video out", text: `Hand over the ${S} video and receive a finished, mixed ${T} version.` },
];

export const pairFaqs = ({ from: S, to: T, projects }: Pair) => {
  const titles = listJoin(projects.slice(0, 3).map((p) => p.title));
  return [
    { q: `What is ${S} to ${T} dubbing?`, a: `It replaces the original ${S} dialogue with ${T} dialogue recorded to match the actors' lip movements, so the film feels as if it was shot in ${T}.` },
    { q: `What do I need to send for ${S} to ${T} dubbing?`, a: `Your video in ${S} plus a script if you have one. We handle the translation, voice casting, dubbing direction and the final mix.` },
    { q: `Which ${S} titles has ${SITE_NAME} dubbed into ${T}?`, a: `Our ${S} to ${T} work includes ${titles}. All ${plural(projects.length, "project is", "projects are")} listed on this page.` },
    { q: `Can I hear ${T} voice samples before booking?`, a: `Yes. Tell us about your content and we will share samples from suitable native ${T} voice artists.` },
  ];
};

export const pairQuote = ({ from: S, to: T }: Pair) =>
  `Send us your ${S} title and tell us about the ${T} version you need. Our team will reply with a free quote.`;

/** Footer column and /dubbing hub. */
export const DUBBING_HUB = {
  footerHeading: "Dubbing by Language",
  footerLimit: 8,
  viewAll: "View all languages",
  title: `Dubbing by Language | ${SITE_NAME}`,
  heading: "Dubbing by Language",
  description: `Every language pair ${SITE_NAME} dubs, with real project counts: Telugu, Tamil, Malayalam, Kannada and English films dubbed into Hindi and more.`,
  intro: "Choose a language pair to see the films and series we have dubbed and how we work.",
  listHeading: "All language pairs",
};
