import { media as mediaUrl } from "@@/lib/media";
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
  const craftIntro = craftOf(pair)?.intro;
  if (craftIntro) return craftIntro;
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
  const craft = pairCraft(pair);
  if (craft) return craft.description;
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
    ? { src: mediaUrl(`/images/services/lp-${id}.avif`), alt: PAIR_IMAGES[id] }
    : {
        src: mediaUrl("/images/services/svc-dub-studio.avif"),
        alt: "Indian voice artist with headphones at a condenser microphone reading a script to a film on the booth monitor",
      };
}

export const pairSections = (pair: Pair) => {
  const { from: S, to: T } = pair;
  const c = craftOf(pair);
  return {
  projects: `${S} to ${T} Dubbing Projects`,
  process: c?.processHeading ?? `How Our ${S} to ${T} Dubbing Works`,
  studio: c?.craftHeading ?? "Voice Artists and Studio Quality",
  why: c?.whyHeading ?? `Why Choose EVA for ${T} Dubbing`,
  related: "Other Language Pairs",
  faq: `${S} to ${T} Dubbing FAQs`,
  quote: `Get ${/^[AEIOU]/.test(S) ? "an" : "a"} ${S} to ${T} Dubbing Quote`,
  };
};

export const pairSteps = (pair: Pair) => {
  const c = craftOf(pair);
  if (c) return c.steps;
  const { from: S, to: T } = pair;
  return [
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
};

export const pairStudio = (pair: Pair) => {
  const c = craftOf(pair);
  if (c) return c.craft;
  const { from: S, to: T } = pair;
  return [
  `Every ${T} line is voiced by a native ${T} artist, so the dub sounds right to ${LANG_AUDIENCE[T] ?? `${T} viewers`}. We cast male, female and child voices of all ages.`,
  `A dubbing director who knows both ${S} and ${T} sits in on each session with a sound engineer at our Andheri West studio in Mumbai.`,
  ];
};

export const pairWhy = (pair: Pair) => {
  const { from: S, to: T, projects } = pair;
  const count = {
    title: `${plural(projects.length, `${S} title`, `${S} titles`)} in ${T}`,
    text:
      projects.length === 1
        ? `A real ${S} to ${T} credit, shown on this page.`
        : `Real ${S} to ${T} projects, each listed on this page.`,
  };
  const c = craftOf(pair);
  if (c) return [count, ...c.why];
  return [
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
};

/** `others` = the other languages we have dubbed this source into (real pairs), so each pair's FAQ differs. */
export const pairFaqs = (pair: Pair, others: string[] = []) => {
  const { from: S, to: T, projects } = pair;
  const copy = offered(pair);
  if (copy) return copy.faqs;
  const titles = listJoin(projects.slice(0, 3).map((p) => p.title));
  const reach = LANG_AUDIENCE[T] ?? `${T} viewers`;
  const credits =
    projects.length === 1
      ? {
          q: `Which ${S} title has ${SITE_NAME} dubbed into ${T}?`,
          a: `${titles}${projects[0]?.year ? ` (${projects[0].year})` : ""}, shown on this page.`,
        }
      : {
          q: `Which ${S} titles has ${SITE_NAME} dubbed into ${T}?`,
          a: `Our ${S} to ${T} work includes ${titles}. All ${projects.length} projects are listed on this page.`,
        };
  const c = craftOf(pair);
  if (c) return [credits, ...c.faqs];
  return [
    credits,
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

export const pairQuote = (pair: Pair) => craftOf(pair)?.quote ?? defaultQuote(pair);
const defaultQuote = ({ from: S, to: T }: Pair) =>
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

/**
 * Hand-written, pair-only copy for the live pair pages. Each pair talks about its own craft so no
 * two pages share body text; the general lip-sync process lives once on /dubbing-studio.
 * Facts only: credits and years come from published projects. Pairs without an entry here fall
 * back to the template sections below.
 */
type PairCraft = {
  intro?: string;
  description: string;
  processHeading: string;
  steps: { title: string; text: string }[];
  craftHeading: string;
  craft: string[];
  whyHeading: string;
  why: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
  quote: string;
};

const PROCESS_POINTER =
  "Recording, lip sync checks and the final mix follow the same studio workflow as every title we dub, set out on our [lip-sync dubbing studio](/dubbing-studio) page.";

const PAIR_CRAFT: Record<string, PairCraft> = {
  "Telugu>Hindi": {
    description:
      "Telugu to Hindi dubbing in Mumbai with mass dialogue and comedy rebuilt for Hindi viewers. See our {count} Telugu titles dubbed into Hindi. Free quote.",
    processHeading: "How We Take a Telugu Title into Hindi",
    steps: [
      {
        title: "Meaning first, then the mouth",
        text: "A Hindi line often runs longer than the Telugu one. The writer trims it to the core meaning first and only then fits it to the actor's lips, so nobody sounds rushed.",
      },
      {
        title: "Punch dialogue kept punchy",
        text: "Mass scenes live on build up and pause. We keep the beat before the big line so a hero moment hits Hindi viewers as hard as it hit the Telugu audience.",
      },
      {
        title: "Voices cast to Telugu energy",
        text: "Telugu characters are often played big. Hindi voices are chosen for the age and energy of each role with samples shared before the booth.",
      },
    ],
    craftHeading: "Comedy That Survives the Crossing",
    craft: [
      "A joke that lands in Telugu can feel flat in Hindi when it is translated word for word. Our writers rebuild the laugh for a North Indian audience and then fit the new line to the actor's mouth.",
      "Telugu to Hindi is the biggest share of our published credits, each one listed on this page.",
    ],
    whyHeading: "Why Producers Bring Telugu Films to EVA",
    why: [
      {
        title: "Laughs rebuilt in Hindi",
        text: "Comic lines are written again for Hindi humour instead of being translated literally.",
      },
      {
        title: "From Telugu master to Hindi release",
        text: "Send the Telugu master and get back a mixed Hindi track ready for theatres or OTT.",
      },
    ],
    faqs: [
      {
        q: "What is hardest about a Telugu to Hindi dub?",
        a: "Comedy and mass punch lines. A joke that lands in Telugu can feel flat in Hindi if it is translated word for word so the writer rebuilds the laugh for a North Indian audience before fitting it to the actor's mouth.",
      },
      {
        q: "Who watches the Hindi version of a Telugu film?",
        a: "Hindi viewers across North India and on national OTT platforms. A natural Hindi track lets a Telugu title play to them as if it were made in their language.",
      },
      {
        q: "Do you also dub Telugu films into Tamil?",
        a: "Yes. Jack went from Telugu into both Hindi and Tamil. See [Telugu to Tamil dubbing](/dubbing/telugu-to-tamil).",
      },
    ],
    quote:
      "Tell us about your Telugu film and its Hindi release plan. We will come back with a free quote for the Hindi version.",
  },
  "Tamil>Hindi": {
    description:
      "Tamil to Hindi dubbing that keeps sharp Tamil writing, songs and crowd scenes alive in Hindi. {count} Tamil titles dubbed at our Mumbai studio. Free quote.",
    processHeading: "What Changes When Tamil Becomes Hindi",
    steps: [
      {
        title: "Writing that keeps its bite",
        text: "A cutting Tamil remark or a quiet family line is rewritten so it carries the same weight in Hindi. The Hindi version should feel like the same film, not a softer copy.",
      },
      {
        title: "References Hindi viewers can follow",
        text: "Local jokes and cultural references stay where Hindi viewers will follow them. Where they would not, the line is adapted so the meaning still comes through.",
      },
      {
        title: "Songs and crowds recorded in Hindi",
        text: "Crowd scenes and song portions are recorded in Hindi too, so the busiest moments of the film feel as alive as the Tamil original.",
      },
    ],
    craftHeading: "Keeping Tamil Writing Sharp in Hindi",
    craft: [
      "Tamil and Hindi sentences rarely line up word for word. Our writers work line by line so the Hindi sits on the actor's lips while the edge of the Tamil dialogue survives.",
      "Our Tamil to Hindi credits stretch back to 2009, longer than any other pair we have published.",
    ],
    whyHeading: "Why Tamil Titles Come to EVA",
    why: [
      {
        title: "Dialogue with the same edge",
        text: "Each line is adapted for weight and lip sync together, never one at the cost of the other.",
      },
      {
        title: "Full scenes, not just leads",
        text: "Background voices and song portions are part of the Hindi recording plan.",
      },
    ],
    faqs: [
      {
        q: "What is hardest about a Tamil to Hindi dub?",
        a: "Holding on to the sharpness of Tamil writing. A literal Hindi line can sound flat or rude in the wrong way so the writer picks words that keep the original tone.",
      },
      {
        q: "Do you dub the songs and crowd scenes in Tamil films?",
        a: "Yes. We record crowd scenes and song portions in Hindi so the dubbed film does not go quiet in its busiest moments.",
      },
      {
        q: "Who is a Hindi version of a Tamil film for?",
        a: "Viewers across North India and on national OTT platforms who want the story in their own language with the performances intact.",
      },
    ],
    quote:
      "Share the Tamil title you want in Hindi along with your release date. Our team will send a free quote.",
  },
  "Malayalam>Hindi": {
    description:
      "Malayalam to Hindi dubbing with restrained Hindi performances and the original sound design kept intact. Recent credit: Oddum Kuthira Chaddum Kuthira.",
    processHeading: "How We Dub a Quiet Malayalam Film into Hindi",
    steps: [
      {
        title: "Dense dialogue made to fit",
        text: "Malayalam dramas are dialogue heavy. Writers condense long exchanges so the Hindi keeps every idea without making the actor appear to speed up.",
      },
      {
        title: "Performances kept small",
        text: "Hindi artists are directed to hold back. A quiet line stays quiet so the realism of the original is not lost to a louder dub.",
      },
      {
        title: "Original sound design protected",
        text: "The Hindi dialogue is laid into the original ambience and effects so streaming and broadcast viewers hear the film the way it was designed.",
      },
    ],
    craftHeading: "Why a Malayalam Dub Has to Be Subtle",
    craft: [
      "Malayalam humour and drama often sit in the delivery more than in the words. If the Hindi voice pushes too hard the moment disappears, so our directors keep each take close to the pitch and pace of the original actor.",
      "Oddum Kuthira Chaddum Kuthira (2025) is our published Malayalam to Hindi credit.",
    ],
    whyHeading: "What You Get with a Malayalam Title",
    why: [
      {
        title: "Quiet scenes stay quiet",
        text: "Direction aims for natural Hindi that matches a realistic Malayalam performance.",
      },
      {
        title: "Ready for streaming and broadcast",
        text: "A clean Hindi mix delivered on top of the original sound design.",
      },
    ],
    faqs: [
      {
        q: "Will the Hindi dub sound louder than the Malayalam film?",
        a: "No. We direct Hindi artists toward restrained performances so the dub keeps the realism of the original.",
      },
      {
        q: "Can you keep the original sound design?",
        a: "Yes. The Hindi dialogue is mixed into the original music and effects so the film keeps its atmosphere.",
      },
    ],
    quote:
      "Have a Malayalam film that needs a Hindi version? Send us the details for a free quote.",
  },
  "Telugu>Tamil": {
    intro:
      "Telugu and Tamil are neighbours yet a Tamil viewer still wants a film in Tamil. A dub of a Telugu title has to sound written in Chennai, not borrowed from Hyderabad, with every punch line and joke reworked for Tamil ears.",
    description:
      "Telugu to Tamil dubbing that reworks punch lines and comedy timing for Tamil viewers. Credit: Jack, dubbed from Telugu into Tamil and Hindi in 2025.",
    processHeading: "Moving a Telugu Film into Tamil",
    steps: [
      {
        title: "Two South Indian rhythms",
        text: "Telugu and Tamil dialogue have different beats. Writers rework each punch line so the pause and the hit land where a Tamil audience expects them.",
      },
      {
        title: "Comedy timed for Tamil",
        text: "Gags are rewritten for a Tamil ear and timed to the action on screen rather than to the Telugu words.",
      },
      {
        title: "Native Tamil voices",
        text: "Native Tamil artists record under a Tamil-speaking director at our Andheri West studio.",
      },
    ],
    craftHeading: "One Telugu Film, Two Dubbed Versions",
    craft: [
      "Jack (2025) went from Telugu into both Tamil and Hindi at EVA. Each version got its own script adaptation, since a line written for Hindi viewers is rarely the line a Tamil audience wants.",
    ],
    whyHeading: "Why Dub Telugu into Tamil with EVA",
    why: [
      {
        title: "Tamil that sounds local",
        text: "Dialogue written for Tamil viewers in India and abroad.",
      },
      {
        title: "Hindi alongside Tamil",
        text: "The same Telugu title can also be dubbed into Hindi for a national release.",
      },
    ],
    faqs: [
      {
        q: "Why dub a Telugu film into Tamil when the languages are close?",
        a: "Close is not the same. Tamil viewers notice Telugu rhythm in a line straight away. A proper Tamil dub lets the film play as their own.",
      },
      {
        q: "Can you make a Hindi version at the same time?",
        a: "Yes. Jack was dubbed from Telugu into both Tamil and Hindi. See [Telugu to Hindi dubbing](/dubbing/telugu-to-hindi).",
      },
    ],
    quote:
      "Planning a Tamil release for a Telugu film? Tell us the title and we will reply with a free quote.",
  },
  "English>Tamil": {
    intro:
      "English dialogue moves fast and leans on idiom. A Tamil dub has to keep that speed while sounding written in Tamil, because viewers in Tamil Nadu and the Tamil audience abroad expect dialogue that feels native.",
    description:
      "English to Tamil dubbing that adapts idioms, jokes and fast dialogue for Tamil viewers. Credit: The owl & co, sessions 1 and 2 dubbed into Tamil.",
    processHeading: "Turning English Dialogue into Tamil",
    steps: [
      {
        title: "Idioms rebuilt in Tamil",
        text: "An English idiom rarely survives a literal Tamil translation. Writers find a Tamil expression with the same meaning and the same tone.",
      },
      {
        title: "Fast lines, Tamil mouths",
        text: "Quick English exchanges are reworked so the Tamil fits English mouth shapes without the artist racing.",
      },
      {
        title: "Subtitles from the same script",
        text: "When you need Tamil [subtitles](/subtitling-services) too, they come from the adapted dub script so screen text and speech agree.",
      },
    ],
    craftHeading: "English Humour in Tamil",
    craft: [
      "The owl & co (2013) is our English to Tamil credit, with sessions 1 and 2 dubbed into Tamil. Humour in a show like this lives on timing so the Tamil line is written to hit on the same beat as the English one.",
      "English feature films going into several Indian languages are covered on [Hollywood dubbing into Indian languages](/hollywood-dubbing-indian-languages).",
    ],
    whyHeading: "Why English Content Comes to EVA for Tamil",
    why: [
      {
        title: "Idiom that lands in Tamil",
        text: "Expressions are swapped for Tamil ones viewers actually use.",
      },
      {
        title: "Dub and subtitles that match",
        text: "One adapted script feeds both the Tamil track and the Tamil subtitles.",
      },
    ],
    faqs: [
      {
        q: "What is hardest about English to Tamil dubbing?",
        a: "Idioms and jokes. Carried over literally they lose their sense, so the writer picks a Tamil line that keeps the joke and still fits the mouth.",
      },
      {
        q: "Can you add Tamil subtitles too?",
        a: "Yes. We create Tamil [subtitles](/subtitling-services) from the same adapted script so the dub and the subtitles match.",
      },
      {
        q: "Do you dub English feature films into Tamil?",
        a: "Yes. Feature films are covered on our [Hollywood dubbing](/hollywood-dubbing-indian-languages) page.",
      },
    ],
    quote:
      "Send us your English series or film with the Tamil delivery you need. We will reply with a free quote.",
  },
};
const craftOf = (pair: Pair) =>
  pair.projects.length ? PAIR_CRAFT[keyOf(pair)] : undefined;

/** Pair-only page copy, or undefined to use the template sections. */
export function pairCraft(pair: Pair) {
  const c = craftOf(pair);
  if (!c) return undefined;
  const count = String(pair.projects.length);
  return { ...c, description: c.description.replaceAll("{count}", count), pointer: PROCESS_POINTER };
}
