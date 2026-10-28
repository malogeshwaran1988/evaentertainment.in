/* Content-type (segment) pages under /dubbing-studio/<slug> (SEO lip-sync tree v2).
   Language children live in dubbing-languages.ts on the same URL prefix.
   Credits come from live admin projects at render time; pages with zero matches 404. */
import type { Project } from "@@/data/projects";
import type { ServicePageContent } from "@@/data/service-page-types";
import { STUDIO_CONTACT } from "@@/data/service-pages-markets";
import { SERVICE_MEDIA } from "@@/data/service-media";
import type { ImageFx } from "@@/data/image-fx";

export const DUBBING_STUDIO_HREF = "/dubbing-studio" as const;

/** Plan slugs for the segment track. Only entries in SEGMENT_PAGES are shipped. */
export const SEGMENT_PLAN_SLUGS = [
  "hollywood",
  "bollywood",
  "kollywood",
  "animation-movies",
  "short-films",
  "documentaries",
  "ott",
  "tv-serials",
  "commercials",
  "audiobooks",
  "korean-drama",
  "youtube",
] as const;

export type SegmentPlanSlug = (typeof SEGMENT_PLAN_SLUGS)[number];

export type DubbingSegment = {
  slug: SegmentPlanSlug;
  /** Short nav / card label. */
  name: string;
  /** Primary keyword this page owns. */
  keyword: string;
  subtitle: string;
  icon: string;
  image: string;
  alt: string;
  fx: ImageFx;
  ogImage: string;
  ogImageAlt: string;
  /** How to pick published projects that belong on this page. */
  match: (project: Project) => boolean;
  /** Owner exception: page stays live (menu, sitemap, links) even with zero matched projects. */
  alwaysLive?: boolean;
  page: ServicePageContent;
  /** Related segment slugs (shipped ones only are linked). */
  relatedSegments: SegmentPlanSlug[];
  /** Market hub to interlink when it exists. */
  marketHref?: string;
  marketLabel?: string;
};

const media = (key: string) => {
  const m = SERVICE_MEDIA[key];
  return { image: m.src, alt: m.alt, fx: m.fx as ImageFx };
};

const CTA = {
  heading: "Get a dubbing quote",
  text: "Tell us the title runtime target languages and release date. We will reply with a plan and a quote.",
  label: "Request a dubbing quote",
  contact: STUDIO_CONTACT,
  secondary: "Book a studio session",
} as const;

/**
 * Shipped segment pages. Skipped plan slugs (no honest credits yet) stay out of this map
 * and are listed in the build report instead of shipping thin pages.
 */
export const SEGMENT_PAGES: Record<string, DubbingSegment> = {
  hollywood: {
    slug: "hollywood",
    name: "Hollywood",
    keyword: "Hollywood movies dubbing",
    subtitle:
      "Lip-sync dubbing of Hollywood and international films into Indian languages from our Andheri West studio.",
    icon: "icon-play-circle",
    ...media("hollywood-lead"),
    ogImage: "/images/og/hollywood-dubbing-indian-languages.jpg",
    ogImageAlt:
      "Sound engineer at EVA Entertainment watching an English film scene while a voice artist dubs it in the booth",
    match: (p) => p.from === "English",
    relatedSegments: ["bollywood", "kollywood"],
    marketHref: "/hollywood-dubbing-indian-languages",
    marketLabel: "Hollywood dubbing for distributors",
    page: {
      seoTitle: "Hollywood Movies Dubbing | Lip-Sync Studio Mumbai | EVA",
      description:
        "Hollywood movies dubbing into Tamil Telugu Hindi and more. Lip-sync adaptation native artists and mixes timed to your release. Get a quote from EVA Mumbai.",
      h1: "Hollywood Movies Dubbing",
      serviceType: "Hollywood film dubbing",
      languages: [
        "English",
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
      ],
      leadHeading: "English titles that feel local",
      lead: [
        "**Hollywood movies dubbing turns an English-language film into a version Indian audiences can watch with dialogue that matches the actors' lips.** EVA Entertainment does this lip-sync work in Andheri West Mumbai for studios distributors and platforms that need Indian-language versions without losing the original performance.",
        "We adapt the script for sync cast voice artists who fit each face record with a dubbing director and mix the new dialogue onto your M&E so the release can land on time. For the distributor-facing overview of the same craft see [Hollywood dubbing for distributors](/hollywood-dubbing-indian-languages).",
      ],
      sections: [
        {
          heading: "Who this page is for",
          icon: "icon-like",
          blocks: [
            {
              t: "p",
              text: "Producers studios and localisation buyers who need Hollywood or other English-language features and series dubbed into one or more Indian languages with true lip sync not a voice-over read.",
            },
            {
              t: "ul",
              items: [
                "**International distributors** clearing Indian-language rights for theatrical OTT or satellite.",
                "**OTT and channel teams** that need Tamil Telugu Hindi or other versions before a fixed drop date.",
                "**Indian buyers** bringing an English title into a regional market with a native-sounding cast.",
              ],
            },
          ],
          media: "hollywood-onevoice",
        },
        {
          heading: "Our Hollywood dubbing process",
          icon: "icon-settings",
          blocks: [
            {
              t: "ol",
              items: [
                "**Brief and assets.** Locked picture dialogue list or script and the M&E track plus target languages and the release date.",
                "**Lip-sync adaptation.** Native writers rewrite every line so length rhythm and mouth shapes fit while jokes and intent stay clear. See [script translation](/translation-services).",
                "**Casting.** We shortlist artists per character and share samples before any booth session.",
                "**Directed recording.** Artists record loop by loop with a dubbing director and engineer in our soundproof booth.",
                "**Edit and sync check.** Lines are fitted to picture frame by frame; anything that sits wrong is re-recorded.",
                "**Mix and delivery.** New dialogue is mixed with the M&E in [stereo or 5.1](/5-1-mixing-studio). If effects are thin we can rebuild them with [Foley](/foley-recording).",
              ],
            },
          ],
        },
        {
          heading: "Quality check before you sign off",
          icon: "icon-like",
          blocks: [
            {
              t: "ul",
              items: [
                "**Lip sync.** Mouth opens and closes where the new words need them to.",
                "**Accent and tone.** Each character stays consistent from the first reel to the last.",
                "**Continuity.** Names terms and performance energy match across scenes.",
                "**Mix levels.** Dialogue sits cleanly over music and effects without clipping or burying lines.",
              ],
            },
          ],
        },
        {
          heading: "Delivery timed to your release",
          icon: "icon-settings",
          blocks: [
            {
              t: "p",
              text: "We plan the booth cast and mix schedule backwards from the date you give us so dubbed stems and masters are ready before the release not after. Share the drop date with the brief and we lock the calendar around it.",
            },
          ],
        },
        {
          heading: "Voice and accent matching per character",
          icon: "icon-voiceover",
          blocks: [
            {
              t: "p",
              text: "A lead that sounds too young too polished or too \"dubbed\" breaks the spell. We match age tone and energy to the on-screen actor share samples for approval and keep that casting through every language version when you need more than one.",
            },
          ],
        },
      ],
      faqs: [
        {
          q: "What is Hollywood movies dubbing?",
          a: "It is lip-sync replacement of English (or other foreign) dialogue with an Indian language so the new lines match the actors' mouth movements and the film feels shot in that language.",
        },
        {
          q: "Which Indian languages can you dub a Hollywood film into?",
          a: "We work in Hindi Bengali Marathi Telugu Tamil Gujarati Urdu Kannada Odia and Malayalam plus more on request. Tell us the list with your brief.",
        },
        {
          q: "How is this different from the Hollywood distributors page?",
          a: "This page covers the craft of dubbing Hollywood titles. The [English language page](/dubbing-studio/english) holds the one-voice multi-language demo. The [distributors hub](/hollywood-dubbing-indian-languages) is for foreign producers and buyers packaging a release.",
        },
        {
          q: "Can you meet a fixed OTT or theatrical date?",
          a: "Yes when the booth and cast are free. Send the runtime language list and release date and we will say what is realistic before we start.",
        },
      ],
      cta: { ...CTA },
    },
  },

  bollywood: {
    slug: "bollywood",
    name: "Bollywood",
    keyword: "Bollywood movies dubbing",
    subtitle:
      "Lip-sync dubbing of Hindi films into Tamil Telugu Kannada and other Indian languages.",
    icon: "icon-play-circle",
    ...media("panindia-lead"),
    ogImage: "/images/og/pan-india-film-dubbing.jpg",
    ogImageAlt: "Release planning board for a multi-language film dub at EVA Entertainment",
    match: (p) => p.from === "Hindi",
    alwaysLive: true,
    relatedSegments: ["kollywood", "hollywood"],
    marketHref: "/pan-india-film-dubbing",
    marketLabel: "Pan-India film dubbing",
    page: {
      seoTitle: "Bollywood Movies Dubbing | Hindi Films to Other Languages | EVA",
      description:
        "Bollywood movies dubbing from Hindi into Tamil Telugu Kannada and more. Lip-sync writers native artists and release-timed delivery from EVA Mumbai.",
      h1: "Bollywood Movies Dubbing",
      serviceType: "Bollywood film dubbing",
      languages: [
        "Hindi",
        "Tamil",
        "Telugu",
        "Kannada",
        "Malayalam",
        "Bengali",
        "Marathi",
        "Gujarati",
        "Urdu",
        "Odia",
        "English",
      ],
      leadHeading: "Hindi films for every Indian screen",
      lead: [
        "**Bollywood movies dubbing takes a Hindi feature and builds lip-synced versions in the languages your other markets need.** EVA Entertainment adapts the dialogue casts native artists and mixes to your M&E from our studio in Andheri West Mumbai.",
        "When a Hindi title also needs a multi-language theatrical or OTT plan see our [pan-India film dubbing](/pan-india-film-dubbing) hub. This page stays on the craft of dubbing Bollywood titles themselves.",
      ],
      sections: [
        {
          heading: "Who this page is for",
          icon: "icon-like",
          blocks: [
            {
              t: "p",
              text: "Hindi producers distributors and platform teams who need South Indian or other language versions of a Bollywood film without a flat voice-over read.",
            },
            {
              t: "ul",
              items: [
                "**Hindi producers** clearing Tamil Telugu Kannada or Malayalam rights.",
                "**Satellite and OTT teams** that need matching language drops on one date.",
                "**Buyers** who want the same lip-sync standard they expect on the Hindi original.",
              ],
            },
          ],
          media: "panindia-mix",
        },
        {
          heading: "Our Bollywood dubbing process",
          icon: "icon-settings",
          blocks: [
            {
              t: "ol",
              items: [
                "**Brief and assets.** Locked cut Hindi script or dialogue list M&E and the target language list with your release date.",
                "**Adaptation.** Native writers fit meaning jokes and lip shapes in the target language. See [script translation](/translation-services).",
                "**Casting and samples.** Character-matched artists approved before recording.",
                "**Directed sessions.** Booth recording with a native-language dubbing director.",
                "**Sync edit and mix.** Frame-level fitting then a [stereo or 5.1 mix](/5-1-mixing-studio) on your M&E.",
                "**QC and delivery.** Final watch for sync accent and levels then masters and stems to your spec.",
              ],
            },
          ],
        },
        {
          heading: "Quality check before you sign off",
          icon: "icon-like",
          blocks: [
            {
              t: "ul",
              items: [
                "**Lip sync** on every featured character.",
                "**Accent match** so a Mumbai lead does not sound out of place in the target market.",
                "**Name and term continuity** across reels and songs when lyrics are also localised.",
                "**Mix balance** so punches whispers and songs still read clearly.",
              ],
            },
          ],
        },
        {
          heading: "Delivery timed to your release",
          icon: "icon-settings",
          blocks: [
            {
              t: "p",
              text: "Multi-language Bollywood releases fail when one language arrives late. We schedule cast and booth time from your locked date so each language version can clear QC before the drop.",
            },
          ],
        },
        {
          heading: "Voice and accent matching per character",
          icon: "icon-voiceover",
          blocks: [
            {
              t: "p",
              text: "We cast for the face on screen not a generic \"Hindi hero\" voice in the new language. Samples go to you first; the approved artist stays on that character for the full runtime.",
            },
          ],
        },
      ],
      faqs: [
        {
          q: "What is Bollywood movies dubbing?",
          a: "It is lip-sync dubbing of Hindi films into other languages so regional audiences hear dialogue that fits the actors' mouths and the original tone.",
        },
        {
          q: "Which languages do you dub Bollywood films into?",
          a: "Common targets are Tamil Telugu Kannada and Malayalam. Other Indian languages and English are available on request.",
        },
        {
          q: "How is this different from pan-India film dubbing?",
          a: "This page is about dubbing Bollywood titles as a content type. [Pan-India film dubbing](/pan-india-film-dubbing) is the multi-language release plan for any film that needs many versions at once.",
        },
      ],
      cta: { ...CTA },
    },
  },

  kollywood: {
    slug: "kollywood",
    name: "Kollywood",
    keyword: "Kollywood / Tamil film dubbing",
    subtitle:
      "Lip-sync dubbing of Tamil films into Hindi Telugu Malayalam Kannada and other languages.",
    icon: "icon-play-circle",
    ...media("regional-lead"),
    ogImage: "/images/og/regional-film-dubbing.jpg",
    ogImageAlt:
      "Dubbing director and voice artist watching a South Indian film scene together at EVA Entertainment",
    match: (p) => p.from === "Tamil",
    relatedSegments: ["bollywood", "hollywood"],
    marketHref: "/regional-film-dubbing",
    marketLabel: "Regional film dubbing",
    page: {
      seoTitle: "Kollywood Dubbing | Tamil Film Lip-Sync Studio Mumbai | EVA",
      description:
        "Kollywood and Tamil film dubbing into Hindi Telugu Malayalam Kannada and more. Lip-sync adaptation native casts and release-timed delivery from EVA Mumbai.",
      h1: "Kollywood and Tamil Film Dubbing",
      serviceType: "Kollywood film dubbing",
      languages: [
        "Tamil",
        "Hindi",
        "Telugu",
        "Malayalam",
        "Kannada",
        "Bengali",
        "Marathi",
        "Gujarati",
        "Urdu",
        "Odia",
        "English",
      ],
      leadHeading: "Tamil films that travel",
      lead: [
        "**Kollywood and Tamil film dubbing takes a Tamil feature and builds lip-synced versions for Hindi and other Indian markets.** EVA Entertainment writes to the mouth casts native artists and mixes in Andheri West Mumbai so the new version feels shot for that audience.",
        "South producers selling rights across India also use our [regional film dubbing](/regional-film-dubbing) hub. This page owns the Kollywood content-type craft; that hub owns the South-producer market journey.",
      ],
      sections: [
        {
          heading: "Who this page is for",
          icon: "icon-like",
          blocks: [
            {
              t: "p",
              text: "Tamil producers distributors and platform teams who need Hindi or other language versions of a Kollywood title with true lip sync.",
            },
            {
              t: "ul",
              items: [
                "**Kollywood producers** clearing Hindi or other South Indian language rights.",
                "**OTT and satellite teams** scheduling a Tamil original beside its dubbed versions.",
                "**Buyers** who want the same punch lines and emotion to land in the new language.",
              ],
            },
          ],
          media: "regional-adapt",
        },
        {
          heading: "Our Kollywood dubbing process",
          icon: "icon-settings",
          blocks: [
            {
              t: "ol",
              items: [
                "**Brief and assets.** Locked Tamil picture script or dialogue list M&E target languages and release date.",
                "**Lip-sync adaptation.** Native writers rebuild lines for mouth shapes and local humour. See [script translation](/translation-services).",
                "**Casting.** Samples per lead and key supporting role before the booth is booked.",
                "**Directed recording.** Native-language directors guide every loop in our booth.",
                "**Edit mix and QC.** Sync edit [stereo or 5.1 mix](/5-1-mixing-studio) and a final native-speaker watch.",
                "**Delivery.** Full mix dialogue stem and M&E named to your spec.",
              ],
            },
          ],
        },
        {
          heading: "Quality check before you sign off",
          icon: "icon-like",
          blocks: [
            {
              t: "ul",
              items: [
                "**Lip sync** on dialogue and reaction lines.",
                "**Accent fit** for the target market without flattening the character.",
                "**Continuity** of names insults and running jokes across scenes.",
                "**Mix** that keeps fights songs and quiet scenes intelligible.",
              ],
            },
          ],
        },
        {
          heading: "Delivery timed to your release",
          icon: "icon-settings",
          blocks: [
            {
              t: "p",
              text: "Tamil theatrical and OTT dates are fixed early. We reverse-plan casting and booth days from that date so the dubbed master clears QC before the first show or drop.",
            },
          ],
        },
        {
          heading: "Voice and accent matching per character",
          icon: "icon-voiceover",
          blocks: [
            {
              t: "p",
              text: "A Kollywood hero villain or comic sidekick needs a voice that fits the face and the target audience. We cast per character share samples and keep that artist for the full film.",
            },
          ],
        },
      ],
      faqs: [
        {
          q: "What is Kollywood dubbing?",
          a: "It is lip-sync dubbing of Tamil (Kollywood) films into Hindi and other languages so new audiences hear dialogue that matches the actors' mouths.",
        },
        {
          q: "Do you only dub Tamil into Hindi?",
          a: "No. Hindi is common but we also dub Tamil films into Telugu Malayalam Kannada and other languages when the brief asks for them.",
        },
        {
          q: "How is this different from the regional film dubbing page?",
          a: "This page is the Kollywood content-type page. [Regional film dubbing](/regional-film-dubbing) is the market hub for South producers selling rights across languages.",
        },
      ],
      cta: { ...CTA },
    },
  },
};

export const SEGMENT_SLUGS = Object.keys(SEGMENT_PAGES) as SegmentPlanSlug[];

export const segmentHref = (slug: string) => `${DUBBING_STUDIO_HREF}/${slug}`;

export const getSegment = (slug: string) => SEGMENT_PAGES[slug];

/** Published projects that belong on a segment page. */
export function projectsForSegment(segment: DubbingSegment, projects: readonly Project[]) {
  return projects.filter(segment.match);
}

/** Live when it has a published match, or when the owner pinned it live (Bollywood). */
export function segmentIsLive(segment: DubbingSegment, projects: readonly Project[]) {
  return Boolean(segment.alwaysLive) || projectsForSegment(segment, projects).length > 0;
}

/** Menu and hub order for segment links. */
const SEGMENT_LINK_ORDER: readonly string[] = ["hollywood", "kollywood", "bollywood"];

/** Segment nav/hub links for live pages (Hollywood, Kollywood, Bollywood order). */
export function liveSegmentLinks(projects: readonly Project[]) {
  const rank = (s: string) => {
    const i = SEGMENT_LINK_ORDER.indexOf(s);
    return i === -1 ? SEGMENT_LINK_ORDER.length : i;
  };
  return [...SEGMENT_SLUGS].sort((a, b) => rank(a) - rank(b)).flatMap((slug) => {
    const segment = getSegment(slug);
    if (!segment) return [];
    if (!segmentIsLive(segment, projects)) return [];
    return [{ label: segment.name, href: segmentHref(slug), keyword: segment.keyword }];
  });
}

/** Plan slugs not shipped in this wave (thin or no honest credits). */
export const SKIPPED_SEGMENTS: {
  slug: SegmentPlanSlug;
  reason: string;
}[] = [
  {
    slug: "animation-movies",
    reason: "No published animation or anime credits in admin data for this environment.",
  },
  {
    slug: "short-films",
    reason: "No published short-film credits in admin data.",
  },
  {
    slug: "documentaries",
    reason: "No published documentary credits in admin data; narration scope still open vs voice-over.",
  },
  {
    slug: "ott",
    reason: "No published web-series or OTT-season credits in admin data; feature films alone are too thin for an OTT-owner page.",
  },
  {
    slug: "tv-serials",
    reason: "No published TV serial credits in admin data.",
  },
  {
    slug: "commercials",
    reason: "No published lip-sync commercial credits in admin data; VO ads stay on the voice-over parent.",
  },
  {
    slug: "audiobooks",
    reason: "Open question whether audiobooks belong under lip-sync or voice-over; no credits yet.",
  },
  {
    slug: "korean-drama",
    reason: "No published Korean drama credits in admin data.",
  },
  {
    slug: "youtube",
    reason: "No published YouTube-creator dubbing credits in admin data.",
  },
];
