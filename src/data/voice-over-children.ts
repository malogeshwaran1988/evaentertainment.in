/* Child pages under /voice-over-studio/<slug>. Copy uses only claims already on /voice-over-studio. */
import type { ServicePageContent } from "@@/data/service-page-types";
import { STUDIO_CONTACT } from "@@/data/service-pages-markets";
import { SERVICE_MEDIA } from "@@/data/service-media";
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

const vo = SERVICE_MEDIA["vo-studio"];

export const DOCUMENTARY_NARRATION: VoiceOverChild = {
  slug: "documentary-narration",
  name: "Documentary Narration",
  keyword: "documentary voice over in Hindi",
  subtitle:
    "Hindi narration for documentaries and non-fiction shows recorded with native narrators at our Mumbai studio.",
  icon: "icon-voiceover",
  image: vo.src,
  alt: vo.alt,
  fx: vo.fx,
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

export const VOICE_OVER_CHILDREN = [DOCUMENTARY_NARRATION] as const;
export const voiceOverChildHref = (slug: string) => `${VOICE_OVER_HREF}/${slug}`;
