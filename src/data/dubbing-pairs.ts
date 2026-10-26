/**
 * All copy for the /dubbing hub and /dubbing/<from>-to-<to> pages lives here (one config spot).
 * Facts only: counts, titles and years come from published projects; process copy matches the
 * dubbing service pages. Never add prices or turnaround promises here.
 */
import type { Project } from "@@/data/projects";
import { SITE_NAME } from "@@/constants/constants";

type Pair = { from: string; to: string; projects: readonly Project[] };

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;
const listJoin = (items: string[]) =>
  items.length <= 1
    ? (items[0] ?? "")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

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

const an = (word: string) => (/^[AEIOU]/.test(word) ? "an" : "a");
const keyOf = ({ from, to }: { from: string; to: string }) => `${from}>${to}`;

/**
 * Pairs offered before any published project (see OFFERED_PAIRS in src/lib/project-links.ts).
 * Service facts only, taken from the voice-over, subtitling and Hollywood pages. No titles or counts.
 * English to Tamil owns "English to Tamil dubbing" for series, animation, documentaries and training video;
 * Hollywood feature films stay with /hollywood-dubbing-indian-languages.
 */
const OFFERED_COPY: Record<
  string,
  {
    intro: string;
    facts: string;
    description: string;
    faqs: { q: string; a: string }[];
  }
> = {
  "English>Tamil": {
    intro:
      "English to Tamil dubbing gives English series, animation, documentaries and training videos a Tamil version for viewers in Tamil Nadu and the Tamil audience abroad. Tamil is the language of Kollywood in Chennai so viewers expect dialogue that sounds written in Tamil, not translated.",
    facts:
      "Our writers adapt English idioms, jokes and fast dialogue into natural Tamil. Native Tamil voice artists record in our Andheri West studio under a Tamil-speaking director. We cast male, female and child voices plus character and cartoon voices for animation. Tamil subtitles can come from the same adapted script.",
    description:
      "English to Tamil dubbing for series, animation, documentaries and training video. Native Tamil voice artists, lip sync and Tamil subtitles from one Mumbai studio.",
    faqs: [
      {
        q: "What kind of English content do you dub into Tamil?",
        a: "Series, animation, documentaries, training and corporate video. For Hollywood feature films see [Hollywood dubbing into Indian languages](/hollywood-dubbing-indian-languages).",
      },
      {
        q: "Who voices the Tamil version?",
        a: "Native Tamil voice artists. We cast male, female and child voices plus character and cartoon voices for animation.",
      },
      {
        q: "Can you add Tamil subtitles too?",
        a: "Yes. We create Tamil [subtitles](/subtitling-services) from the same adapted script, so the dub and the subtitles match.",
      },
      {
        q: "What do I need to send?",
        a: "Your English video plus a script if you have one. We handle translation, voice casting, direction and the final Tamil mix.",
      },
      {
        q: "Can I hear Tamil voice samples before booking?",
        a: "Yes. Tell us about your content and we will share samples from suitable native Tamil voice artists.",
      },
    ],
  },
};
const offered = (pair: Pair) =>
  pair.projects.length ? undefined : OFFERED_COPY[keyOf(pair)];

/** Where each language's films come from and who a dub in it reaches (facts from the /dubbing language guide). */
const LANG_HOME: Record<string, string> = {
  Telugu: "Tollywood in Hyderabad, one of India's biggest film industries",
  Tamil: "Kollywood in Chennai",
  Malayalam: "Mollywood in Kerala, known for dialogue-heavy dramas",
  Kannada: "Sandalwood in Bengaluru",
  Hindi: "Bollywood",
  English: "Hollywood and international studios",
};
const LANG_AUDIENCE: Record<string, string> = {
  Hindi: "viewers across North India and on national OTT platforms",
  Tamil: "Tamil viewers in India and abroad",
  Telugu: "Telugu viewers in Andhra Pradesh and Telangana",
  Kannada: "Kannada viewers across Karnataka",
  Malayalam: "Malayalam viewers in Kerala",
  English: "English-speaking viewers in India and overseas",
};
/** What the adaptation has to protect, per source language (from the hand-written intros above). */
const ADAPT_FOCUS: Record<string, string> = {
  Telugu: "the punch of mass dialogues and comedy timing",
  Tamil: "sharp writing plus the energy of songs and crowd scenes",
  Malayalam: "quiet, realistic performances",
  Kannada: "every line's meaning while it fits the lip movement",
  English: "idioms, jokes and the timing of fast dialogue",
  Hindi: "cultural fit for each regional audience",
};
const focus = (from: string) =>
  ADAPT_FOCUS[from] ?? "the meaning and tone of every line";

/** Hand-written intros are for dubs into Hindi; every other pair gets one built from both languages. */
export function pairIntro(pair: Pair) {
  const { from, to } = pair;
  const copy = offered(pair);
  if (copy) return copy.intro;
  const own = PAIR_INTRO[from];
  if (own && to === "Hindi") return own;
  const home = LANG_HOME[from]
    ? `${from} films come from ${LANG_HOME[from]}.`
    : `${from} stories travel well.`;
  const reach = LANG_AUDIENCE[to] ?? `${to} viewers`;
  return `${home} ${an(to) === "an" ? "An" : "A"} ${to} dub takes them to ${reach}. Our writers keep ${focus(from)} while native ${to} voice artists match each character's age and energy.`;
}

/** Second intro paragraph built from real project facts, so every pair page says something different. */
export function pairFacts(pair: Pair) {
  const { from, to, projects } = pair;
  const copy = offered(pair);
  if (copy) return copy.facts;
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

export const pairHeading = ({ from, to }: Pair) =>
  `${from} to ${to} Dubbing Services`;
export const pairLinkLabel = ({ from, to }: Pair) => `${from} to ${to} Dubbing`;

/** "{S} to {T} Dubbing Services | EVA Entertainment", dropping " Services" past 60 characters. */
export function pairTitle(pair: Pair) {
  const full = `${pairHeading(pair)} | ${SITE_NAME}`;
  return full.length <= 60 ? full : `${pairLinkLabel(pair)} | ${SITE_NAME}`;
}

/** Fact-led: real title count plus the newest title, kept within 140-160 characters. */
export function pairDescription(pair: Pair) {
  const { from, to, projects } = pair;
  const copy = offered(pair);
  if (copy) return copy.description;
  const n = plural(projects.length, `${from} title`, `${from} titles`);
  const first = projects[0]?.title;
  const parts = [
    `${from} to ${to} dubbing from our Mumbai studio: ${n} dubbed into ${to}${first ? ` including ${first}` : ""}.`,
    `Native ${to} voices with lip sync.`,
    "Free quote.",
  ];
  let d = parts.join(" ");
  if (d.length < 140)
    d = d.replace("with lip sync.", "with lip sync and a final mix.");
  if (d.length > 160) d = `${parts[0]} Native ${to} voices.`;
  if (d.length > 160)
    d = `${from} to ${to} dubbing from our Mumbai studio: ${n} dubbed into ${to}. Native ${to} voices with lip sync.`;
  return d;
}

/** Topic image per pair (original studio photos); falls back to the dubbing studio photo. */
const LANG_CODE: Record<string, string> = {
  Telugu: "te",
  Tamil: "ta",
  Malayalam: "ml",
  Kannada: "kn",
  English: "en",
  Hindi: "hi",
};
const PAIR_IMAGES: Record<string, string> = {
  "te-hi":
    "Indian translator comparing a printed film script with a laptop draft in a dubbing studio",
  "ta-hi":
    "Indian woman translator writing on a script page beside editing monitors with a brass lamp and filter coffee",
  "ml-hi":
    "Indian dubbing artist with headphones speaking at a condenser microphone in a recording booth",
  "kn-hi":
    "Two Indian writers discussing a marked up dialogue script at a mixing console",
  "en-hi":
    "Indian female voice artist with headphones laughing during a take at a studio microphone",
  "te-ta":
    "Indian dubbing director at a mixing console pointing at an action scene on the studio screen",
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
  quote: `Get ${/^[AEIOU]/.test(S) ? "an" : "a"} ${S} to ${T} Dubbing Quote`,
});

export const pairSteps = ({ from: S, to: T }: Pair) => [
  {
    title: "Script adaptation",
    text: `Writers turn the ${S} dialogue into natural ${T}, keeping ${focus(S)}. Each line is then fitted to the actor's lip movement.`,
  },
  {
    title: "Voice casting",
    text: `We cast native ${T} dubbing artists for every character and share ${T} voice samples before we record.`,
  },
  {
    title: "Recording",
    text: `A ${T}-speaking dubbing director records each line to picture with our sound engineers in the booth.`,
  },
  {
    title: "Lip sync",
    text: `Every ${T} take is checked against the ${S} picture so the new dialogue matches the actors' lips.`,
  },
  {
    title: "Mix and QC",
    text: `The ${T} track is mixed with the original music and effects (5.1 when you need it) and checked before delivery.`,
  },
];

export const pairStudio = ({ from: S, to: T }: Pair) => [
  `Every ${T} line is voiced by a native ${T} artist, so the dub sounds right to ${LANG_AUDIENCE[T] ?? `${T} viewers`}. We cast male, female and child voices of all ages.`,
  `A dubbing director who knows both ${S} and ${T} sits in on each session with a sound engineer at our Andheri West studio in Mumbai.`,
];

export const pairWhy = ({ from: S, to: T, projects }: Pair) => [
  projects.length
    ? {
        title: `${plural(projects.length, `${S} title`, `${S} titles`)} in ${T}`,
        text: `Real ${S} to ${T} projects, each listed on this page.`,
      }
    : {
        title: `Native ${T} voices`,
        text: `Every ${T} line is performed live by a native artist. We never use voice cloning.`,
      },
  {
    title: "One complete team",
    text: `Translators, ${T} writers, dubbing artists, directors and sound engineers work together on your title.`,
  },
  {
    title: `${S} video in, ${T} video out`,
    text: `Hand over the ${S} master and receive a finished, mixed ${T} version.`,
  },
];

/** `others` = the other languages we have dubbed this source into (real pairs), so each pair's FAQ differs. */
export const pairFaqs = (pair: Pair, others: string[] = []) => {
  const { from: S, to: T, projects } = pair;
  const copy = offered(pair);
  if (copy) return copy.faqs;
  const titles = listJoin(projects.slice(0, 3).map((p) => p.title));
  const reach = LANG_AUDIENCE[T] ?? `${T} viewers`;
  return [
    {
      q: `Which ${S} titles has ${SITE_NAME} dubbed into ${T}?`,
      a: `Our ${S} to ${T} work includes ${titles}. All ${plural(projects.length, "project is", "projects are")} listed on this page.`,
    },
    {
      q: `Who watches ${an(T)} ${T} dub of ${an(S)} ${S} film?`,
      a: `${an(T) === "an" ? "An" : "A"} ${T} version opens a ${S} title to ${reach}, in their own language.`,
    },
    {
      q: `What is hardest about adapting ${S} dialogue into ${T}?`,
      a: `Keeping ${focus(S)}. Our writers adapt each line for meaning first, then fit it to the actor's lips.`,
    },
    others.length
      ? {
          q: `Do you dub ${S} titles into other languages too?`,
          a: `Yes. We have also dubbed ${S} titles into ${listJoin(others)}. See [all language pairs](/dubbing).`,
        }
      : {
          q: `What do I need to send for ${S} to ${T} dubbing?`,
          a: `Your ${S} video plus a script if you have one. We handle translation, voice casting, direction and the final ${T} mix.`,
        },
    {
      q: `Can I hear ${T} voice samples before booking?`,
      a: `Yes. Tell us about your content and we will share samples from suitable native ${T} voice artists.`,
    },
  ];
};

export const pairQuote = ({ from: S, to: T }: Pair) =>
  `Send us your ${S} title and tell us about the ${T} version you need. Our team will reply with a free quote.`;

/** Footer column and /dubbing hub. */
export const DUBBING_HUB = {
  footerHeading: "Dubbing by Language",
  footerLimit: 8,
  viewAll: "View all languages",
  heading: "Dubbing by Language",
  intro: "Pick a language pair to see the titles we have dubbed in it.",
  listHeading: "All language pairs",
};
