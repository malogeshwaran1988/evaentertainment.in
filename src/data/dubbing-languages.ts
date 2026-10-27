/* Language hub pages under /dubbing-studio/<lang> (SEO lip-sync tree v2).
   Owns "<Language> dubbing and voice-over". Pair pages keep "X to Y dubbing".
   A page is indexed and linked only when published projects target that language. */
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
};

function buildLanguage(name: LanguagePlanName, extras: LangExtras): DubbingLanguage {
  const slug = slugifyAscii(name);
  const keyword = `${name} dubbing and voice-over`;
  const leadMedia = media("languages-lead");
  return {
    slug,
    name,
    keyword,
    subtitle: `Convert film OTT ads and narration into ${name} with lip-sync dubbing and voice-over from our Andheri West studio.`,
    icon: "icon-translate2",
    ...leadMedia,
    ogImage: "/images/og/indian-languages.jpg",
    ogImageAlt: `Voice artist and director working on a ${name} dubbing session at EVA Entertainment Mumbai`,
    page: {
      seoTitle: `${name} Dubbing and Voice-Over | Lip-Sync Studio Mumbai | EVA`,
      description: `${name} dubbing and voice-over for film OTT ads and narration. Lip-sync adaptation native artists and mixes from EVA Entertainment Mumbai. Get a quote.`,
      h1: `${name} Language Dubbing and Voice-Over`,
      serviceType: `${name} language dubbing and voice-over`,
      languages: [name],
      leadHeading: `Content that speaks ${name}`,
      lead: [
        `**${keyword} means we take your finished title and deliver a ${name} version audiences can watch or hear with clear dialogue that fits the picture.** EVA Entertainment does this work in Andheri West Mumbai for producers platforms and brands that need content converted into ${name} without losing the original performance.`,
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
                `Commercials that need lip-sync or a ${name} voice-over read`,
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
}

/**
 * All plan language pages. Live visibility is driven by published `to` matches
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
            "We cast Hindi artists to the register the brief asks for (neutral film Hindi or a named regional colour). Owner dialect sheet for each title still sets the final choice. [NEED OWNER ACCENT GUIDE]",
          castingNote:
            "Casting starts from the character list age gender and tone in your brief. We propose Hindi artists from our Mumbai roster then lock them after your approval. [NEED OWNER CASTING NOTES]",
          faqs: [
            {
              q: "Is this the same as a Telugu to Hindi dubbing page?",
              a: "No. [Telugu to Hindi dubbing](/dubbing/telugu-to-hindi) owns that exact pair. This page owns Hindi dubbing and voice-over across sources plus narration in Hindi.",
            },
            {
              q: "Do you also do Hindi voice-over without lip sync?",
              a: "Yes. Narration commercials and reads that do not need matched lips are covered here and on our [Voice Over](/voice-over-studio) craft page.",
            },
            {
              q: "Can you dub Hollywood titles into Hindi?",
              a: "Yes when the brief is English-source lip-sync into Hindi. See also [Hollywood movies dubbing](/dubbing-studio/hollywood) for the content-type page.",
            },
          ],
        },
      ],
      [
        "Bengali",
        {
          leadExtra:
            "When published projects target Bengali this page lists those titles. Pair pages that end in Bengali stay the owners of each source-to-Bengali query.",
          accentNote:
            "Bengali accent and dialect choices follow the brief (standard film Bengali or a named regional colour). [NEED OWNER ACCENT GUIDE]",
          castingNote:
            "We cast Bengali-speaking artists to match character age gender and tone then confirm with you before the session. [NEED OWNER CASTING NOTES]",
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
            "Marathi register follows the brief. Name any city or community colour you need before casting. [NEED OWNER ACCENT GUIDE]",
          castingNote:
            "We propose Marathi artists against your character list and lock them after approval. [NEED OWNER CASTING NOTES]",
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
            "Telugu accent choices follow the brief (standard film Telugu or a named regional colour). [NEED OWNER ACCENT GUIDE]",
          castingNote:
            "Casting for Telugu destination roles uses artists who match the character brief. We confirm the slate with you before recording. [NEED OWNER CASTING NOTES]",
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
            "Tamil register follows the brief. Call out any regional colour before we cast. [NEED OWNER ACCENT GUIDE]",
          castingNote:
            "We cast Tamil artists to character age gender and tone then lock the slate after your approval. [NEED OWNER CASTING NOTES]",
          faqs: [
            {
              q: "Is this the same as Kollywood movies dubbing?",
              a: "No. [Kollywood movies dubbing](/dubbing-studio/kollywood) owns Tamil-film content types. This page owns Tamil dubbing and voice-over as a language destination from any source.",
            },
            {
              q: "Where does English to Tamil dubbing sit?",
              a: "[English to Tamil dubbing](/dubbing/english-to-tamil) owns that pair. This page links those pairs and owns the broader Tamil language intent.",
            },
            {
              q: "Do you record Tamil voice-over without lip sync?",
              a: "Yes. See also [Voice Over](/voice-over-studio) for the craft parent.",
            },
          ],
        },
      ],
      [
        "Gujarati",
        {
          leadExtra:
            "Gujarati destination credits appear here when published projects list Gujarati as a target. Pair pages ending in Gujarati keep the exact-pair keywords.",
          accentNote:
            "Gujarati accent and dialect follow the brief. [NEED OWNER ACCENT GUIDE]",
          castingNote:
            "We cast Gujarati-speaking artists to the character brief and confirm before the session. [NEED OWNER CASTING NOTES]",
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
            "Urdu register and formality follow the brief (film Urdu or a named style). [NEED OWNER ACCENT GUIDE]",
          castingNote:
            "Casting proposes Urdu artists against your character list then locks after approval. [NEED OWNER CASTING NOTES]",
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
            "Kannada accent choices follow the brief. [NEED OWNER ACCENT GUIDE]",
          castingNote:
            "We cast Kannada artists to match the character brief and confirm the slate with you. [NEED OWNER CASTING NOTES]",
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
            "Odia accent and dialect follow the brief. [NEED OWNER ACCENT GUIDE]",
          castingNote:
            "Casting proposes Odia-speaking artists against your character list. [NEED OWNER CASTING NOTES]",
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
            "Malayalam register follows the brief. Name any regional colour before casting. [NEED OWNER ACCENT GUIDE]",
          castingNote:
            "We cast Malayalam artists to character age gender and tone then lock after your approval. [NEED OWNER CASTING NOTES]",
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
            "English destination work (titles dubbed or voiced into English) is owned here. English-source Hollywood work sits on the [Hollywood movies dubbing](/dubbing-studio/hollywood) segment and on English-source pair pages.",
          accentNote:
            "English accent (Indian English British or American colour) follows the brief. [NEED OWNER ACCENT GUIDE]",
          castingNote:
            "We cast English-speaking artists to the character brief and confirm before recording. [NEED OWNER CASTING NOTES]",
          faqs: [
            {
              q: "Is this for dubbing Indian films into English?",
              a: "Yes when English is the target language. Live titles appear below once published in admin.",
            },
            {
              q: "Where does English to Tamil sit?",
              a: "[English to Tamil dubbing](/dubbing/english-to-tamil) owns that pair. This page owns English as a destination plus English voice-over.",
            },
          ],
        },
      ],
    ] as [LanguagePlanName, LangExtras][]
  ).map(([name, extras]) => {
    const lang = buildLanguage(name, extras);
    return [lang.slug, lang] as const;
  }),
);

export const LANGUAGE_SLUGS = Object.keys(LANGUAGE_PAGES);

export const languageHref = (slug: string) => `${DUBBING_STUDIO_HREF}/${slug}`;

export const getLanguage = (slug: string) => LANGUAGE_PAGES[slug];

/** Published projects whose `to` list includes this language name. */
export function projectsForLanguage(lang: DubbingLanguage, projects: readonly Project[]) {
  const target = lang.name.toLowerCase();
  return projects.filter((p) =>
    (p.to ?? []).some((t) => String(t).toLowerCase() === target),
  );
}

/** Language nav/hub links for pages that currently have at least one published target match. */
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

