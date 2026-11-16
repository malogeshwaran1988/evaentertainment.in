/* Language hub pages under /dubbing-studio/<lang> (SEO lip-sync tree v2).
   Owns "<Language> dubbing and voice-over". Pair pages keep "X to Y dubbing".
   A page is indexed and linked when published projects target that language.
   English also counts English-source titles so the one-voice capability page can go live. */
import type { Project } from "@@/data/projects";
import type { ServicePageContent } from "@@/data/service-page-types";
import { STUDIO_CONTACT } from "@@/data/service-pages-markets";
import { SERVICE_MEDIA } from "@@/data/service-media";
import type { ImageFx } from "@@/data/image-fx";
import { slugifyAscii } from "@@/lib/project-seo";
import type { LanguagePair } from "@@/lib/project-links";
export const DUBBING_STUDIO_HREF = "/dubbing-studio" as const;

export type DubbingLanguage = {
  slug: string;
  /** Display name matching admin `to` values (e.g. Hindi). */
  name: string;
  keyword: string;
  subtitle: string;
  icon: string;
  image: string;
  alt: string;
  fx: ImageFx;
  ogImage: string;
  ogImageAlt: string;
  page: ServicePageContent;
};

const media = (key: string) => {
  const m = SERVICE_MEDIA[key];
  return { image: m.src, alt: m.alt, fx: m.fx as ImageFx };
};

const CTA = {
  heading: "Get a dubbing or voice-over quote",
  text: "Tell us the title runtime target language and release date. We will reply with a plan and a quote.",
  label: "Request a quote",
  contact: STUDIO_CONTACT,
  secondary: "Book a studio session",
} as const;

/** Plan rollout order (Census 2011 top 10 + English). */
export const LANGUAGE_PLAN = [
  "Hindi",
  "Bengali",
  "Marathi",
  "Telugu",
  "Tamil",
  "Gujarati",
  "Urdu",
  "Kannada",
  "Odia",
  "Malayalam",
  "English",
] as const;

export type LanguagePlanName = (typeof LANGUAGE_PLAN)[number];

type LangExtras = {
  /** Short unique line for the lead after the shared convert-into sentence. */
  leadExtra: string;
  /** Accent / dialect note. Use honest GAP wording when owner facts are missing. */
  accentNote: string;
  /** One casting note that does not invent credits. */
  castingNote: string;
  faqs: { q: string; a: string }[];
  /**
   * Hand-written page for a live language. Replaces the template lead, sections, meta and CTA so
   * no two live language pages share body copy.
   */
  custom?: LangCustom;
};

type LangCustom = {
  subtitle: string;
  description: string;
  leadHeading: string;
  lead: string[];
  sections: ServicePageContent["sections"];
  ctaText: string;
  /** Show the content-type segment links (kept on one language page only). */
  segments?: boolean;
  titlesHeading?: string;
};

const article = (word: string) => (/^[AEIOU]/i.test(word) ? "an" : "a");

function buildLanguage(name: LanguagePlanName, extras: LangExtras): DubbingLanguage {
  const slug = slugifyAscii(name);
  const keyword = `${name} dubbing and voice-over`;
  const leadMedia = media("languages-lead");
  const custom = extras.custom;
  const lang: DubbingLanguage = {
    slug,
    name,
    keyword,
    subtitle: `Convert film OTT ads and narration into ${name} with lip-sync dubbing and voice-over from our Andheri West studio.`,
    icon: "icon-translate2",
    ...leadMedia,
    ogImage: "/images/og/indian-languages.jpg",
    ogImageAlt: `Voice artist and director working on ${article(name)} ${name} dubbing session at EVA Entertainment Mumbai`,
    page: {
      seoTitle: `${name} Dubbing and Voice-Over | Lip-Sync Studio Mumbai | EVA`,
      description: `${name} dubbing and voice-over for film OTT ads and narration. Lip-sync adaptation native artists and mixes from EVA Entertainment Mumbai. Get a quote.`,
      h1: `${name} Language Dubbing and Voice-Over`,
      serviceType: `${name} language dubbing and voice-over`,
      languages: [name],
      leadHeading: `Content that speaks ${name}`,
      lead: [
        `**${keyword} means we take your finished title and deliver ${article(name)} ${name} version audiences can watch or hear with clear dialogue that fits the picture.** EVA Entertainment does this work in Andheri West Mumbai for producers platforms and brands that need content converted into ${name} without losing the original performance.`,
        extras.leadExtra,
      ],
      sections: [
        {
          heading: "Who this page is for",
          icon: "icon-like",
          blocks: [
            {
              t: "p",
              text: `Buyers who need titles converted into ${name}: film and OTT localisation teams regional distributors brands and creators. Pair pages such as Telugu to Hindi own the exact source-to-target query. This page owns the broader ${name} dubbing and voice-over intent.`,
            },
          ],
        },
        {
          heading: "Formats we deliver in this language",
          icon: "icon-play-circle",
          blocks: [
            {
              t: "p",
              text: `Lip-sync film and episodic dubbing into ${name} plus narration-style voice-over when the brief does not need matched lips. Typical briefs include theatrical and OTT features trailers commercials and long-form spoken tracks.`,
            },
            {
              t: "ul",
              items: [
                `Feature films and series dubbed into ${name}`,
                `Trailers and promos with timed ${name} dialogue`,
                `Commercials that need lip-sync or ${article(name)} ${name} voice-over read`,
                `Narration and voice-over in ${name} (see [Voice Over](/voice-over-studio) for the craft parent)`,
              ],
            },
          ],
        },
        {
          heading: "Accent and dialect",
          icon: "icon-mic",
          blocks: [
            {
              t: "p",
              text: extras.accentNote,
            },
          ],
        },
        {
          heading: "Our process for this language",
          icon: "icon-settings",
          blocks: [
            {
              t: "ol",
              items: [
                `Script adaptation into ${name} with lip-sync timing where the brief needs it`,
                `Voice casting for each role then booth recording with a dubbing director`,
                "Edit sync checks and continuity pass",
                "Mix and deliver stems or a print master timed to your release",
              ],
            },
          ],
        },
        {
          heading: "Voice casting",
          icon: "icon-users",
          blocks: [
            {
              t: "p",
              text: extras.castingNote,
            },
          ],
        },
        {
          heading: "QC before delivery",
          icon: "icon-like",
          blocks: [
            {
              t: "ul",
              items: [
                "Lip sync against picture on dialogue scenes",
                `Accent and register fit for the ${name} audience named in the brief`,
                "Character continuity across reels or episodes",
                "Mix levels and M&E alignment before the final deliverable",
              ],
            },
          ],
        },
        {
          heading: "Voice-over in this language",
          icon: "icon-mic",
          blocks: [
            {
              t: "p",
              text: `When the brief is narration explainer or a commercial read rather than matched lips we record ${name} voice-over in the same Mumbai rooms. The craft parent is [Voice Over](/voice-over-studio). This page covers both dubbing into ${name} and voice-over in ${name} so buyers searching for either land on one clear owner.`,
            },
          ],
        },
      ],
      faqs: extras.faqs,
      cta: { ...CTA },
    },
  };
  if (custom) {
    lang.subtitle = custom.subtitle;
    lang.page = {
      ...lang.page,
      description: custom.description,
      leadHeading: custom.leadHeading,
      lead: custom.lead,
      sections: custom.sections,
      cta: { ...CTA, text: custom.ctaText },
    };
  }
  return lang;
}

/** Live language options read by the language page view. */
export const languageOptions = (slug: string) => {
  const c = LANGUAGE_EXTRAS_CUSTOM[slug];
  return { segments: c?.segments ?? true, titlesHeading: c?.titlesHeading };
};
const LANGUAGE_EXTRAS_CUSTOM: Record<string, LangCustom | undefined> = {};

/**
 * All plan language pages. Live visibility is driven by published project matches
 * (zero-project pages 404 and stay out of nav/sitemap until credits exist).
 */
export const LANGUAGE_PAGES: Record<string, DubbingLanguage> = Object.fromEntries(
  (
    [
      [
        "Hindi",
        {
          leadExtra:
            "Most of our published credits today are titles dubbed into Hindi from Telugu Tamil Malayalam and English sources. Browse exact pairs on the [language pair index](/dubbing) when you already know the source language.",
          accentNote:
            "We cast Hindi artists to the register the brief asks for (neutral film Hindi or a named regional colour). Owner dialect sheet for each title still sets the final choice.",
          castingNote:
            "Casting starts from the character list age gender and tone in your brief. We propose Hindi artists from our Mumbai roster then lock them after your approval.",
          faqs: [
            {
              q: "Is this the same as the Telugu to Hindi dubbing page?",
              a: "No. [Telugu to Hindi dubbing](/dubbing/telugu-to-hindi) covers that one pair in depth. This page covers Hindi as the target for every source language plus Hindi narration.",
            },
            {
              q: "Can I hear Hindi voice samples before booking?",
              a: "Yes. Tell us about your content and we will share samples from suitable native Hindi voice artists.",
            },
            {
              q: "Can you dub Hollywood titles into Hindi?",
              a: "Yes. English source titles going into Hindi are also covered on [Hollywood movies dubbing](/dubbing-studio/hollywood).",
            },
          ],
          custom: {
            subtitle:
              "Telugu, Tamil, Malayalam and English titles turned into Hindi versions for theatres, OTT and broadcast from our Andheri West studio.",
            description:
              "Hindi dubbing in Mumbai for South Indian and English titles. Most of our published credits are Hindi versions, led by Telugu films. Get a free quote.",
            leadHeading: "Where most of our work ends up",
            lead: [
              "**Hindi is the language most of our published work is dubbed into.** Telugu films make up the bulk of those credits, followed by Tamil titles, with Malayalam and English sources as well.",
              "A Hindi version opens a South Indian or international title to viewers across North India and on national OTT platforms. Each source language has its own page on the [language pair index](/dubbing).",
            ],
            sections: [
              {
                heading: "South Indian films into Hindi",
                icon: "icon-translate2",
                blocks: [
                  {
                    t: "p",
                    text: "Telugu and Tamil titles reach Hindi audiences through our studio more than any other route. Writers adapt each line for Hindi lip sync before directors cast Hindi voices to the age and energy of the original cast. The craft for each pair is on [Telugu to Hindi](/dubbing/telugu-to-hindi) and [Tamil to Hindi](/dubbing/tamil-to-hindi).",
                  },
                ],
              },
              {
                heading: "Hindi for national OTT",
                icon: "icon-play-circle",
                blocks: [
                  {
                    t: "p",
                    text: "Streaming platforms serve Hindi to a national audience so the track is usually neutral film Hindi. When the brief names a regional colour we cast to that register instead.",
                  },
                ],
              },
              {
                heading: "Child and character voices in Hindi",
                icon: "icon-users",
                blocks: [
                  {
                    t: "p",
                    text: "Family films and animation need more than adult leads. We cast male, female and child voices for Hindi versions plus character voices for animated titles such as Night of the Zoopocalypse.",
                  },
                ],
              },
              {
                heading: "A Hindi mix that sits on the original M&E",
                icon: "icon-audio",
                blocks: [
                  {
                    t: "p",
                    text: "Most Hindi versions are mixed against the producer's music and effects track. Levels are matched so the Hindi dialogue sits where the original did, in stereo or [5.1](/5-1-mixing-studio) when the release needs it.",
                  },
                ],
              },
              {
                heading: "Hindi voice-over",
                icon: "icon-mic",
                blocks: [
                  {
                    t: "p",
                    text: "For narration, ads and reads without matched lips we record Hindi voice-over in the same rooms. See [Voice Over](/voice-over-studio).",
                  },
                ],
              },
            ],
            ctaText:
              "Tell us the source language and runtime plus your Hindi release date. We will reply with a plan and a quote.",
            segments: true,
          },
        },
      ],
      [
        "Bengali",
        {
          leadExtra:
            "When published projects target Bengali this page lists those titles. Pair pages that end in Bengali stay the owners of each source-to-Bengali query.",
          accentNote:
            "Bengali accent and dialect choices follow the brief (standard film Bengali or a named regional colour).",
          castingNote:
            "We cast Bengali-speaking artists to match character age gender and tone then confirm with you before the session.",
          faqs: [
            {
              q: "Does this page replace Bengali pair pages?",
              a: "No. Each /dubbing/<source>-to-bengali page owns that pair. This page owns Bengali dubbing and voice-over as a language destination.",
            },
            {
              q: "Do you offer Bengali voice-over as well as dubbing?",
              a: "Yes. Lip-sync dubbing into Bengali and Bengali voice-over both sit here with the craft parent at [Voice Over](/voice-over-studio).",
            },
          ],
        },
      ],
      [
        "Marathi",
        {
          leadExtra:
            "Marathi destination work appears here once published projects list Marathi in the target languages. Exact pairs keep their own pages under /dubbing.",
          accentNote:
            "Marathi register follows the brief. Name any city or community colour you need before casting.",
          castingNote:
            "We propose Marathi artists against your character list and lock them after approval.",
          faqs: [
            {
              q: "Is Marathi film content covered here?",
              a: "This page is for converting content into Marathi. Source-side Marathi titles that we dub into other languages belong on the matching pair and segment pages.",
            },
            {
              q: "Can brands book Marathi commercial voice-over here?",
              a: "Yes. Commercial reads and lip-sync ads into Marathi are in scope. See [Voice Over](/voice-over-studio) for the craft parent.",
            },
          ],
        },
      ],
      [
        "Telugu",
        {
          leadExtra:
            "Telugu as a destination (content dubbed into Telugu) is what this page owns. Telugu-source titles dubbed into Hindi or Tamil stay on their pair pages and on segments such as regional film work.",
          accentNote:
            "Telugu accent choices follow the brief (standard film Telugu or a named regional colour).",
          castingNote:
            "Casting for Telugu destination roles uses artists who match the character brief. We confirm the slate with you before recording.",
          faqs: [
            {
              q: "How is this different from Telugu to Hindi dubbing?",
              a: "[Telugu to Hindi dubbing](/dubbing/telugu-to-hindi) owns that pair. This page owns converting content into Telugu plus Telugu voice-over.",
            },
            {
              q: "Do you dub into Telugu from English or Hindi?",
              a: "Yes when the brief names Telugu as the target. Live titles appear below once they are published in admin.",
            },
          ],
        },
      ],
      [
        "Tamil",
        {
          leadExtra:
            "Published credits that target Tamil appear on this page. Kollywood is the Tamil-film content-type page when the source is Tamil cinema. This page owns Tamil as the language you convert into.",
          accentNote:
            "Tamil register follows the brief. Call out any regional colour before we cast.",
          castingNote:
            "We cast Tamil artists to character age gender and tone then lock the slate after your approval.",
          faqs: [
            {
              q: "Is this the same as Kollywood movies dubbing?",
              a: "No. [Kollywood movies dubbing](/dubbing-studio/kollywood) is about Tamil films going into other languages. This page is about any title coming into Tamil.",
            },
            {
              q: "Can I hear Tamil voice samples first?",
              a: "Yes. Share the brief and we will send samples from native Tamil artists who suit your characters.",
            },
            {
              q: "Do you record Tamil voice-over without lip sync?",
              a: "Yes. Narration and ad reads in Tamil are part of our [Voice Over](/voice-over-studio) work.",
            },
          ],
          custom: {
            subtitle:
              "Films and series from other languages turned into natural Tamil, voiced by native Tamil artists at our Andheri West studio.",
            description:
              "Dubbing into Tamil from Telugu, English and other sources with native Tamil artists, lip sync and Tamil subtitles. Credits include Jack and The owl & co.",
            leadHeading: "Tamil as the language you dub into",
            lead: [
              "**This page is about content going into Tamil.** A Telugu film or an English series arrives at our studio and leaves with a Tamil version that sounds written in Tamil.",
              "Tamil films going out to other languages are a different job, covered on [Kollywood movies dubbing](/dubbing-studio/kollywood).",
            ],
            sections: [
              {
                heading: "What Tamil viewers expect",
                icon: "icon-like",
                blocks: [
                  {
                    t: "p",
                    text: "Tamil is the language of Kollywood in Chennai. Viewers in Tamil Nadu and the Tamil audience abroad expect dialogue that sounds native, not translated, so each line is adapted for meaning and lip sync before a native Tamil artist records it.",
                  },
                ],
              },
              {
                heading: "Sources we bring into Tamil",
                icon: "icon-translate2",
                blocks: [
                  {
                    t: "ul",
                    items: [
                      "**Telugu.** Jack (2025) was dubbed from Telugu into Tamil as well as Hindi. See [Telugu to Tamil](/dubbing/telugu-to-tamil).",
                      "**English.** The owl & co (2013) had sessions 1 and 2 dubbed into Tamil. See [English to Tamil](/dubbing/english-to-tamil).",
                      "**Other sources.** Hindi and other titles can be dubbed into Tamil whenever Tamil is the named target.",
                    ],
                  },
                ],
              },
              {
                heading: "Native Tamil voices",
                icon: "icon-users",
                blocks: [
                  {
                    t: "p",
                    text: "We cast Tamil artists to the age, gender and tone of each character, including child and cartoon voices for animation. The slate is locked only after you approve it.",
                  },
                ],
              },
              {
                heading: "Tamil subtitles from the dub script",
                icon: "icon-play-circle",
                blocks: [
                  {
                    t: "p",
                    text: "When a release needs Tamil [subtitles](/subtitling-services) as well, they are written from the same adapted script so the on-screen text and the Tamil voices agree.",
                  },
                ],
              },
              {
                heading: "Tamil voice-over",
                icon: "icon-mic",
                blocks: [
                  {
                    t: "p",
                    text: "Narration and commercial reads in Tamil that do not need matched lips are booked through our [Voice Over](/voice-over-studio) studio.",
                  },
                ],
              },
            ],
            ctaText:
              "Send the source title and your Tamil delivery date. We will come back with a plan and a quote.",
            segments: false,
          },
        },
      ],
      [
        "Gujarati",
        {
          leadExtra:
            "Gujarati destination credits appear here when published projects list Gujarati as a target. Pair pages ending in Gujarati keep the exact-pair keywords.",
          accentNote:
            "Gujarati accent and dialect follow the brief.",
          castingNote:
            "We cast Gujarati-speaking artists to the character brief and confirm before the session.",
          faqs: [
            {
              q: "Can you dub ads into Gujarati?",
              a: "Yes for lip-sync commercials and for Gujarati voice-over reads. The voice-over craft parent is [Voice Over](/voice-over-studio).",
            },
            {
              q: "Do pair pages still matter?",
              a: "Yes. Each source-to-Gujarati pair owns its query. This page owns Gujarati dubbing and voice-over overall.",
            },
          ],
        },
      ],
      [
        "Urdu",
        {
          leadExtra:
            "Urdu destination work is listed here once published projects target Urdu. Exact pairs remain under /dubbing.",
          accentNote:
            "Urdu register and formality follow the brief (film Urdu or a named style).",
          castingNote:
            "Casting proposes Urdu artists against your character list then locks after approval.",
          faqs: [
            {
              q: "Is Urdu voice-over included?",
              a: "Yes. Dubbing into Urdu and Urdu voice-over both sit on this page with [Voice Over](/voice-over-studio) as the craft parent.",
            },
            {
              q: "How do pair pages relate?",
              a: "Pair pages own source-to-Urdu queries. This page owns Urdu dubbing and voice-over as a language destination.",
            },
          ],
        },
      ],
      [
        "Kannada",
        {
          leadExtra:
            "Kannada as a destination is owned here. Kannada-source titles dubbed into other languages stay on their pair and segment pages.",
          accentNote:
            "Kannada accent choices follow the brief.",
          castingNote:
            "We cast Kannada artists to match the character brief and confirm the slate with you.",
          faqs: [
            {
              q: "Do you convert content into Kannada from Hindi or English?",
              a: "Yes when Kannada is the named target. Live titles show below once published.",
            },
            {
              q: "Is Kannada voice-over available?",
              a: "Yes. See [Voice Over](/voice-over-studio) for the craft parent.",
            },
          ],
        },
      ],
      [
        "Odia",
        {
          leadExtra:
            "Odia destination credits appear when published projects list Odia as a target language.",
          accentNote:
            "Odia accent and dialect follow the brief.",
          castingNote:
            "Casting proposes Odia-speaking artists against your character list.",
          faqs: [
            {
              q: "Can platforms book Odia dubbing here?",
              a: "Yes. This page owns Odia dubbing and voice-over. Pair pages own each exact source-to-Odia query.",
            },
            {
              q: "Is voice-over included?",
              a: "Yes alongside lip-sync. The craft parent is [Voice Over](/voice-over-studio).",
            },
          ],
        },
      ],
      [
        "Malayalam",
        {
          leadExtra:
            "Malayalam as a destination is owned here. Malayalam-source titles (for example Malayalam to Hindi) stay on their pair pages.",
          accentNote:
            "Malayalam register follows the brief. Name any regional colour before casting.",
          castingNote:
            "We cast Malayalam artists to character age gender and tone then lock after your approval.",
          faqs: [
            {
              q: "How is this different from Malayalam to Hindi?",
              a: "[Malayalam to Hindi dubbing](/dubbing/malayalam-to-hindi) owns that pair. This page owns converting content into Malayalam plus Malayalam voice-over.",
            },
            {
              q: "Do you offer Malayalam commercial voice-over?",
              a: "Yes. See [Voice Over](/voice-over-studio) for the craft parent.",
            },
          ],
        },
      ],
      [
        "English",
        {
          leadExtra:
            "This page owns English as a destination and the English lead-voice craft: one artist records the English master then the same voice into India's top languages. Craft for English-source Hollywood titles also sits on [Hollywood movies dubbing](/dubbing-studio/hollywood) and on English-source pair pages.",
          accentNote:
            "English accent (Indian English British or American colour) follows the brief.",
          castingNote:
            "We cast English-speaking artists to the character brief and confirm before recording.",
          faqs: [
            {
              q: "Do you dub Indian films into English?",
              a: "Yes when English is the target language. Brief us on the audience and the accent you want.",
            },
            {
              q: "Can one artist voice a character in English and in Indian languages?",
              a: "Yes. The same English voice artist performs the lead in Hindi, Bengali, Marathi, Telugu, Tamil and more, guided by native-language directors. Packages for Hollywood buyers are on [Hollywood dubbing for distributors](/hollywood-dubbing-indian-languages).",
            },
            {
              q: "Where does English to Tamil sit?",
              a: "[English to Tamil dubbing](/dubbing/english-to-tamil) covers that pair, including The owl & co.",
            },
          ],
          custom: {
            subtitle:
              "English versions of Indian titles plus one English lead voice carried into Hindi, Tamil and other Indian languages.",
            description:
              "English dubbing in Mumbai: Indian titles delivered in English and one English lead voice recorded into Hindi, Tamil and more Indian languages. Free quote.",
            leadHeading: "Two kinds of English work",
            lead: [
              "**English dubbing at EVA is two jobs.** One is an Indian or foreign title delivered in English for viewers who want that version. The other is an English lead voice that we then record into Hindi, Bengali, Marathi, Telugu, Tamil and the rest of the list, so a campaign or a trailer keeps one performance across languages.",
              "Hollywood source titles also have a content type home on [Hollywood movies dubbing](/dubbing-studio/hollywood).",
            ],
            sections: [
              {
                heading: "English versions of Indian titles",
                icon: "icon-translate2",
                blocks: [
                  {
                    t: "p",
                    text: "When English is the target, writers adapt the original dialogue into natural English and an English-speaking director casts to the character brief. Accent follows the brief, whether Indian English or a British or American colour.",
                  },
                ],
              },
              {
                heading: "English voice-over",
                icon: "icon-mic",
                blocks: [
                  {
                    t: "p",
                    text: "Corporate films, explainers and ads that need an English read without lip sync are recorded in our booth too. See [Voice Over](/voice-over-studio).",
                  },
                ],
              },
            ],
            ctaText:
              "Tell us whether you need an English version or one English voice across languages. We will reply with a plan and a quote.",
            segments: false,
            titlesHeading: "Our English source and English target credits",
          },
        },
      ],
    ] as [LanguagePlanName, LangExtras][]
  ).map(([name, extras]) => {
    const lang = buildLanguage(name, extras);
    LANGUAGE_EXTRAS_CUSTOM[lang.slug] = extras.custom;
    return [lang.slug, lang] as const;
  }),
);


/** Studio one-voice demo: moved from the Hollywood distributors market page onto English. */
const ENGLISH_ONE_VOICE_SECTION = {
  heading: "One English voice carried into India's top 10 languages",
  icon: "icon-voiceover",
  blocks: [
    {
      t: "p" as const,
      text: "International titles often reach India through a different vendor for each language, so a lead character can sound like five different people in five markets. We cast once and keep that voice across every version.",
    },
    {
      t: "ul" as const,
      items: [
        "**The English lead voice.** A professional English voice artist records the primary English version, matched to the original actor's age, tone and energy.",
        "**The same voice in 10 Indian languages.** That same voice artist performs the character in Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia and Malayalam, guided by native-language dubbing directors.",
        "**Human performance only.** Every line in every language is performed live in our booth. We do not use AI voices or voice cloning.",
        "**More languages on request.** Punjabi, Bhojpuri, Assamese and international languages such as Arabic and Spanish can be added with native voice artists.",
      ],
    },
    {
      t: "p" as const,
      text: "One casting decision then holds in every market, which keeps a franchise character consistent from the first trailer to the last sequel.",
    },
  ],
  media: "hollywood-onevoice" as const,
};

{
  const eng = LANGUAGE_PAGES.english;
  if (eng) {
    eng.page.sections = [ENGLISH_ONE_VOICE_SECTION, ...eng.page.sections];
  }
}

/** Single ordering source: India gross box office share (Ormax Box Office Report 2024).
 * Hindi 40% Telugu 20% Tamil 15% Malayalam 10% English 8% Kannada 3% Punjabi 2% Marathi 1% Gujarati 1% Bengali 1%.
 * Languages not listed (Odia Urdu and others) follow in their data order. */
export const LANGUAGE_ORDER: readonly string[] = [
  "hindi",
  "telugu",
  "tamil",
  "malayalam",
  "english",
  "kannada",
  "punjabi",
  "marathi",
  "gujarati",
  "bengali",
];

const languageRank = (slug: string) => {
  const i = LANGUAGE_ORDER.indexOf(slug);
  return i === -1 ? LANGUAGE_ORDER.length : i;
};

/** Sort language slugs by market share (stable for unlisted languages). */
export const sortLanguageSlugs = <T extends string>(slugs: readonly T[]): T[] =>
  [...slugs].sort((a, b) => languageRank(a) - languageRank(b));

export const LANGUAGE_SLUGS = sortLanguageSlugs(Object.keys(LANGUAGE_PAGES));

export const languageHref = (slug: string) => `${DUBBING_STUDIO_HREF}/${slug}`;

export const getLanguage = (slug: string) => LANGUAGE_PAGES[slug];

/**
 * Published projects for a language page.
 * Default: `to` includes the language.
 * English also matches `from` English so English-source Hollywood titles keep /dubbing-studio/english live
 * while destination-English credits are still empty.
 */
export function projectsForLanguage(lang: DubbingLanguage, projects: readonly Project[]) {
  const target = lang.name.toLowerCase();
  return projects.filter((p) => {
    const inTo = (p.to ?? []).some((t) => String(t).toLowerCase() === target);
    if (inTo) return true;
    if (lang.slug === "english") {
      return String(p.from ?? "").toLowerCase() === "english";
    }
    return false;
  });
}

/** Language nav/hub links for pages that currently have at least one published match. */
export function liveLanguageLinks(projects: readonly Project[]) {
  return LANGUAGE_SLUGS.flatMap((slug) => {
    const lang = getLanguage(slug);
    if (!lang) return [];
    if (!projectsForLanguage(lang, projects).length) return [];
    return [{ label: lang.name, href: languageHref(slug), keyword: lang.keyword }];
  });
}

/** Pairs whose target matches this language (for interlinks; never invents pairs). */
export function pairsIntoLanguage(lang: DubbingLanguage, pairs: readonly LanguagePair[]) {
  const target = lang.name.toLowerCase();
  return pairs.filter((p) => p.to.toLowerCase() === target && p.projects.length > 0);
}

