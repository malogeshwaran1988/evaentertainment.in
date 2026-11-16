/* Child pages under /voice-over-studio/<slug>. Copy uses only claims already on /voice-over-studio. */
import type { ServicePageContent } from "@@/data/service-page-types";
import { STUDIO_CONTACT } from "@@/data/service-pages-markets";
import { media as mediaUrl } from "@@/lib/media";
import type { ImageFx } from "@@/data/image-fx";

export const VOICE_OVER_HREF = "/voice-over-studio" as const;

export type VoiceOverChild = {
  slug: string;
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

/** Hero photo unique to one Voice Over child page (R2: eva/voice-over-studio/<slug>/). */
const hero = (path: string): { image: string; fx: ImageFx } => ({
  image: mediaUrl(`/images/voice-over-studio/${path}.avif`),
  fx: { width: 1440, height: 1080, items: [] },
});

export const DOCUMENTARY_NARRATION: VoiceOverChild = {
  slug: "documentary-narration",
  name: "Documentary Narration",
  keyword: "documentary voice over in Hindi",
  subtitle:
    "Hindi narration for documentaries and non-fiction shows recorded with native narrators at our Mumbai studio.",
  icon: "icon-voiceover",
  ...hero("documentary-narration/hero-narrator"),
  alt: "Senior Indian narrator in a shawl reading a documentary script into a ribbon microphone in a wood-panelled booth at EVA Entertainment",
  ogImage: "/images/og/voice-over-studio-mumbai.jpg",
  ogImageAlt: "Voice-over booth at EVA Entertainment in Mumbai",
  page: {
    seoTitle: "Documentary Voice Over in Hindi | Narration Studio | EVA",
    description:
      "Documentary voice over in Hindi and other Indian languages by native narrators at our Mumbai studio. Script check, directed session and editing.",
    h1: "Documentary Voice Over in Hindi",
    serviceType: "Documentary narration",
    // Same list as /voice-over-studio. FACTS NEEDED: confirm which of these EVA offers for narration.
    languages: ["Hindi", "English", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", "Kannada", "Odia", "Malayalam"],
    leadHeading: "A narrator who can carry a story",
    lead: [
      "**Documentary voice over in Hindi needs a narrator who keeps people watching for the full runtime.** EVA Entertainment records long-form narration for documentaries and non-fiction shows in our soundproof booth in Andheri West Mumbai with a director and engineer on every session.",
      "We cast native speakers so names places and numbers sound right to the audience. For ads e-learning and IVR see our main [voice over studio](/voice-over-studio) page.",
    ],
    sections: [
      {
        heading: "Who this page is for",
        icon: "icon-like",
        blocks: [
          {
            t: "ul",
            items: [
              "**Documentary producers** who need a Hindi narration track.",
              "**OTT and film producers** who need narration or voice-over versions of non-fiction shows.",
              "**Channels and brands** making factual films in Hindi or other Indian languages.",
            ],
          },
        ],
        media: "vo-voices",
      },
      {
        heading: "How a narration project works",
        icon: "icon-settings",
        blocks: [
          {
            t: "ol",
            items: [
              "**Share your script and brief.** Tell us the audience tone and length. A reference cut helps.",
              "**Get voice samples.** We shortlist narrators and send samples so you can pick the voice.",
              "**Script check.** We check pronunciation of names technical terms and numbers before the session.",
              "**Directed recording.** The narrator records in our soundproof booth with a director and engineer. You are welcome to attend.",
              "**Editing.** We remove breaths clicks and mistakes and level the audio so it sounds consistent from start to finish.",
              "**Delivery.** Files in the format you need such as WAV or MP3. We can also sync the voice to your video and mix it in [stereo or 5.1](/5-1-mixing-studio).",
            ],
          },
        ],
      },
      {
        heading: "Languages",
        icon: "icon-translate2",
        blocks: [
          {
            t: "p",
            text: "Hindi is our most requested voice-over language. We also record in English Bengali Marathi Telugu Tamil Gujarati Urdu Kannada Odia and Malayalam. Need the script in Hindi first? Our [script translation team](/translation-services) can adapt it.",
          },
        ],
      },
      {
        heading: "Live voices, never cloned",
        icon: "icon-voiceover",
        blocks: [
          {
            t: "p",
            text: "Every narration is a live human performance captured in our booth with a native-language director. We do not use voice cloning.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Do you record documentary narration in Hindi?",
        a: "Yes. Hindi is our most requested voice-over language and we record long-form documentary narration with native narrators.",
      },
      {
        q: "Can I hear samples before booking?",
        a: "Yes. Tell us about your film and audience and we will share suitable narrator samples before you book.",
      },
      {
        q: "Do you use AI or cloned voices?",
        a: "No. Every narration is a live human performance recorded in our booth.",
      },
    ],
    cta: {
      heading: "Get a narration quote",
      text: "Tell us the runtime language and delivery date. We will reply with samples and a quote.",
      label: "Request a narration quote",
      contact: STUDIO_CONTACT,
      secondary: "Book a studio session",
    },
  },
};

export const AUDIOBOOK_NARRATION: VoiceOverChild = {
  slug: "audiobook-narration",
  name: "Audiobook Narration",
  keyword: "audiobook recording studio India",
  subtitle:
    "Spoken-word recording for authors and publishers in our soundproof booth in Andheri West, Mumbai.",
  icon: "icon-voiceover",
  ...hero("audiobook-narration/hero-narrator"),
  alt: "Indian audiobook narrator in a saree reading a book aloud from a tablet in an armchair at the microphone at EVA Entertainment",
  ogImage: "/images/og/voice-over-studio-mumbai.jpg",
  ogImageAlt: "Narrator at a microphone in EVA Entertainment's Mumbai voice booth",
  page: {
    seoTitle: "Audiobook Recording Studio India | EVA Entertainment",
    description:
      "Audiobook recording studio in India for authors and publishers. Native voices recorded in our Andheri West, Mumbai booth. Get a quote from EVA Entertainment.",
    h1: "Audiobook Recording Studio in India",
    serviceType: "Audiobook narration",
    languages: ["Hindi", "English", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", "Kannada", "Odia", "Malayalam"],
    leadHeading: "A booth built for long-form reading",
    lead: [
      "**An audiobook lives or dies on a voice the listener can stay with for hours.** EVA Entertainment is an audiobook recording studio in India that records spoken-word titles in a soundproof booth in Andheri West, Mumbai. A director and engineer sit in on every session so pacing and pronunciation stay even from the first chapter to the last.",
      "For ad films e-learning and other short-form voice-over see our [voice over studio](/voice-over-studio) page.",
    ],
    sections: [
      {
        heading: "Who this page is for",
        icon: "icon-like",
        blocks: [
          {
            t: "ul",
            items: [
              "**Authors and narrators** who want a quiet booth and an engineer for a spoken-word title.",
              "**Publishers and production teams** who need a native-language narrator and a finished edited audio file.",
              "**Independent creators** who already have a script and want studio-quality recording in Mumbai.",
            ],
          },
        ],
        media: "vo-voices",
      },
      {
        heading: "How an audiobook session works",
        icon: "icon-settings",
        blocks: [
          {
            t: "ol",
            items: [
              "**Share your manuscript and brief.** Tell us the language audience and the tone you want. A sample chapter helps.",
              "**Get voice samples.** We shortlist native narrators and send samples so you can pick the voice.",
              "**Script check.** We check names places and numbers before the session so the reading is not stopped by doubts.",
              "**Directed recording.** The narrator reads in our soundproof booth with a director and engineer. You are welcome to attend.",
              "**Editing.** We remove breaths clicks and mistakes and level the audio so chapters sound consistent.",
              "**Delivery.** Files in the format you need such as WAV or MP3.",
            ],
          },
        ],
      },
      {
        heading: "The recording booth",
        icon: "icon-mic-2",
        blocks: [
          {
            t: "ul",
            items: [
              "A dedicated soundproof voice booth, separate from the control room",
              "Neumann and Rode microphones",
              "Sessions recorded in Pro Tools",
              "An engineer and director on every session",
              "Engineers with {years} years of studio experience",
            ],
          },
          {
            t: "p",
            text: "More details on our [studio equipment page](/studio-equipment).",
          },
        ],
        media: "audiobook-desk",
      },
      {
        heading: "Languages",
        icon: "icon-translate2",
        blocks: [
          {
            t: "p",
            text: "Hindi is our most requested voice-over language. We also record audiobook narration in English, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia and Malayalam. Need the text in another language first? Our [script translation team](/translation-services) can adapt it.",
          },
        ],
      },
      {
        heading: "Live voices, never cloned",
        icon: "icon-voiceover",
        blocks: [
          {
            t: "p",
            text: "Every audiobook we record is a live human reading captured in our booth. We do not use voice cloning.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Do you record audiobooks in India?",
        a: "Yes. We record audiobook narration in our soundproof booth in Andheri West, Mumbai with a director and engineer on the session.",
      },
      {
        q: "Can I hear narrator samples before booking?",
        a: "Yes. Tell us the language and tone of the book and we will share suitable narrator samples before you book.",
      },
      {
        q: "Do you use AI or cloned voices?",
        a: "No. Every audiobook is a live human reading recorded in our booth.",
      },
      {
        q: "Which languages can you record in?",
        a: "Hindi is our most requested language. We also record in English, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia and Malayalam.",
      },
    ],
    cta: {
      heading: "Get an audiobook quote",
      text: "Tell us the language runtime and how you want the files delivered. We will reply with samples and a quote.",
      label: "Request an audiobook quote",
      contact: STUDIO_CONTACT,
      secondary: "Book a studio session",
    },
  },
};

export const AD_COMMERCIALS: VoiceOverChild = {
  slug: "ad-commercials",
  name: "Commercial Voice Over",
  keyword: "commercial voice over Mumbai",
  subtitle:
    "Voice-over for TV radio and digital ads recorded with native artists at our Andheri West studio.",
  icon: "icon-voiceover",
  ...hero("ad-commercials/hero-session"),
  alt: "Voice artist recording a TV commercial in the booth while the ad director gives a thumbs-up behind the glass at EVA Entertainment",
  ogImage: "/images/og/voice-over-studio-mumbai.jpg",
  ogImageAlt: "Voice artist recording a commercial in EVA Entertainment's Mumbai booth",
  page: {
    seoTitle: "Commercial Voice Over Mumbai | TV Radio Digital | EVA",
    description:
      "Commercial voice over in Mumbai for TV radio and digital ads. Native artists and a director in our Andheri West booth. Get samples from EVA Entertainment.",
    h1: "Commercial Voice Over in Mumbai",
    serviceType: "Commercial voice-over",
    languages: ["Hindi", "English", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", "Kannada", "Odia", "Malayalam"],
    leadHeading: "A voice that fits the brand",
    lead: [
      "**A commercial has only a few seconds to earn attention so the voice has to feel right from the first word.** EVA Entertainment records commercial voice over in Mumbai for TV spots radio ads and digital films. We cast a native artist, match the tone to the brand and record in our soundproof booth in Andheri West with a director on the session.",
      "This page covers TV radio and digital ads only. For course narration and other voice-over work see our [voice over studio](/voice-over-studio) page.",
    ],
    sections: [
      {
        heading: "Who this page is for",
        icon: "icon-like",
        blocks: [
          {
            t: "ul",
            items: [
              "**Ad agencies and production houses** in Andheri, Lower Parel and BKC that need a nearby booth for a spot.",
              "**Brands and in-house teams** recording a TV radio or digital campaign in Indian languages.",
              "**Editors who already have a cut** and need a voice that sits cleanly under the picture.",
            ],
          },
        ],
        media: "ad-agency-team",
      },
      {
        heading: "TV radio and digital ads",
        icon: "icon-voiceover",
        blocks: [
          {
            t: "p",
            text: "We record voice-over for television commercials radio spots and online ads including social videos. The session is the same in each case: you share the script and the cut, we send voice samples and we record with a director and engineer in the booth.",
          },
          {
            t: "p",
            text: "We match the voice to the brand. A bank often needs a warm trusted read. A youth brand may want more energy. A baby-care film may need a gentler tone.",
          },
        ],
      },
      {
        heading: "How a commercial session works",
        icon: "icon-settings",
        blocks: [
          {
            t: "ol",
            items: [
              "**Share the script and the cut.** Tell us where the ad will run (TV radio or digital) the language and the tone. A reference track helps.",
              "**Get voice samples.** We shortlist artists and send samples. You pick the voice.",
              "**Script check.** We check brand names and any line that is hard to say in the time you have.",
              "**Directed recording.** The artist records in our soundproof booth with a director and engineer. You are welcome to attend.",
              "**Editing.** We remove breaths clicks and mistakes and level the voice so it sits cleanly in the mix.",
              "**Delivery.** Files in the format you need such as WAV or MP3. We can also sync the voice to your picture and add music from our [stock music library](/stock-music-library). Need a jingle? See our [song recording studio](/song-recording-studio).",
            ],
          },
        ],
      },
      {
        heading: "The recording booth",
        icon: "icon-mic-2",
        blocks: [
          {
            t: "ul",
            items: [
              "A dedicated soundproof voice booth, separate from the control room, in Andheri West",
              "Neumann and Rode microphones",
              "Sessions recorded in Pro Tools",
              "An engineer and director on every session",
              "Engineers with {years} years of studio experience",
            ],
          },
          {
            t: "p",
            text: "More details on our [studio equipment page](/studio-equipment).",
          },
        ],
        media: "ad-booth-mic",
      },
      {
        heading: "Languages",
        icon: "icon-translate2",
        blocks: [
          {
            t: "p",
            text: "Hindi is our most requested voice-over language. We also record commercial reads in English, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia and Malayalam. Need the same script in more than one language? Our [script translation team](/translation-services) can adapt it and we will cast a native artist for each version.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Do you record commercial voice-over in Mumbai?",
        a: "Yes. We record TV radio and digital ad voice-over in our Andheri West studio with a director and engineer on the session.",
      },
      {
        q: "Can I hear samples before booking?",
        a: "Yes. Share a short brief and we will send samples from artists who suit the brand and the audience.",
      },
      {
        q: "Can I attend the session?",
        a: "Yes. You are welcome at the studio in Andheri West.",
      },
      {
        q: "Can you add music or a jingle?",
        a: "Yes. We can mix the voice with music from our stock music library or record a jingle in our song recording studio.",
      },
    ],
    cta: {
      heading: "Get commercial voice samples",
      text: "Send us the script and tell us where the ad will run. We will reply with voice samples and a quote.",
      label: "Request voice samples",
      contact: STUDIO_CONTACT,
      secondary: "Book a recording session",
    },
  },
};

export const E_LEARNING: VoiceOverChild = {
  slug: "e-learning",
  name: "E-Learning Voice Over",
  keyword: "e-learning voice over Hindi",
  subtitle:
    "Hindi course narration recorded with a steady tone and clear technical terms at our Mumbai studio.",
  icon: "icon-voiceover",
  ...hero("e-learning/hero-narrator"),
  alt: "Indian e-learning narrator with headphones recording a training course from a laptop at the microphone at EVA Entertainment",
  ogImage: "/images/og/voice-over-studio-mumbai.jpg",
  ogImageAlt: "Voice artists preparing to record e-learning narration at EVA Entertainment in Mumbai",
  page: {
    seoTitle: "E-Learning Voice Over in Hindi | Training | EVA",
    description:
      "E-learning voice over in Hindi for training courses. Native narrators recorded in our Mumbai booth with consistent tone. Get a quote from EVA Entertainment.",
    h1: "E-Learning Voice Over in Hindi",
    serviceType: "E-learning voice-over",
    languages: ["Hindi", "English", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", "Kannada", "Odia", "Malayalam"],
    leadHeading: "A voice that stays easy to follow",
    lead: [
      "**A training course asks the listener to stay with one voice for a long time so the read has to stay clear and even.** EVA Entertainment records e-learning voice over in Hindi in our soundproof booth in Andheri West, Mumbai. A director and engineer guide every session so tone, level and the pronunciation of technical terms stay consistent from the first module to the last.",
      "For ads and other short-form work see our [voice over studio](/voice-over-studio) page.",
    ],
    sections: [
      {
        heading: "Who this page is for",
        icon: "icon-like",
        blocks: [
          {
            t: "ul",
            items: [
              "**Learning and development teams** building internal training in Hindi.",
              "**Course makers and e-learning companies** who need a native narrator and files split by module.",
              "**Subject experts** who have a script and want technical terms spoken correctly.",
            ],
          },
        ],
        media: "workstation",
      },
      {
        heading: "How an e-learning project works",
        icon: "icon-settings",
        blocks: [
          {
            t: "ol",
            items: [
              "**Share your script and brief.** Tell us the audience subject and how many modules you have. A pronunciation list for technical terms helps.",
              "**Get voice samples.** We shortlist native Hindi narrators and send samples so you can pick the voice.",
              "**Script check.** We check technical terms names and numbers before the session.",
              "**Directed recording.** The narrator records in our soundproof booth with a director and engineer. You are welcome to attend. Longer courses are booked module by module.",
              "**Editing.** We remove breaths clicks and mistakes and level the audio so every module sounds like part of the same course.",
              "**Delivery.** Files in the format you need such as WAV or MP3, split per module when you ask.",
            ],
          },
        ],
      },
      {
        heading: "Multilingual training narration",
        icon: "icon-translate2",
        blocks: [
          {
            t: "p",
            text: "Hindi is our most requested voice-over language and the focus of this page. When a course also needs a regional-language version we use the same booth and the same process.",
          },
          {
            t: "p",
            text: "We record training narration in English, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia and Malayalam as well. Our [script translation team](/translation-services) can adapt the modules and we will cast a native artist for each language so timing and file naming stay aligned.",
          },
        ],
      },
      {
        heading: "The recording booth",
        icon: "icon-mic-2",
        blocks: [
          {
            t: "ul",
            items: [
              "A dedicated soundproof voice booth, separate from the control room, in Andheri West",
              "Neumann and Rode microphones",
              "Sessions recorded in Pro Tools",
              "An engineer and director on every session",
              "Engineers with {years} years of studio experience",
            ],
          },
          {
            t: "p",
            text: "More details on our [studio equipment page](/studio-equipment).",
          },
        ],
        media: "elearning-booth",
      },
      {
        heading: "Updates with the same artist",
        icon: "icon-voiceover",
        blocks: [
          {
            t: "p",
            text: "When a module changes later we can call the same narrator back and record the new lines in the same booth so the update matches the original course.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Do you record e-learning voice-over in Hindi?",
        a: "Yes. Hindi is our most requested voice-over language and we record course narration with native Hindi speakers.",
      },
      {
        q: "Can you keep the same voice if we update a module later?",
        a: "Yes. We can book the same artist again and record the new lines so the update matches the rest of the course.",
      },
      {
        q: "Can you record the course in other languages too?",
        a: "Yes. We can adapt the script and record a native artist in English and other Indian languages, with matching timing and file naming.",
      },
      {
        q: "Can I hear samples before booking?",
        a: "Yes. Tell us about the course and the audience and we will share suitable narrator samples before you book.",
      },
    ],
    cta: {
      heading: "Get an e-learning quote",
      text: "Send us a module and tell us the language and tone you want. We will reply with samples and a quote.",
      label: "Request a course narration quote",
      contact: STUDIO_CONTACT,
      secondary: "Book a studio session",
    },
  },
};

export const VOICE_OVER_CHILDREN = [
  DOCUMENTARY_NARRATION,
  AUDIOBOOK_NARRATION,
  AD_COMMERCIALS,
  E_LEARNING,
] as const;

export const voiceOverChildHref = (slug: string) => `${VOICE_OVER_HREF}/${slug}`;

export function getVoiceOverChild(slug: string): VoiceOverChild | undefined {
  return VOICE_OVER_CHILDREN.find((child) => child.slug === slug);
}
