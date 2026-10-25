/* Home page story: regional, pan-India and Hollywood positioning (Oct 2026 SEO plan). Rendered with the shared service-page sections. */
import type { ServicePageContent, ServicePageSection } from "@@/data/service-page-types";
import { STUDIO_CONTACT, TOP_10_LANGUAGES } from "@@/data/service-pages-markets";

export const HOME_SECTIONS: ServicePageSection[] = [
  {
    heading: "A film dubbing studio for three kinds of cinema",
    icon: "icon-mic",
    blocks: [
      {
        t: "p",
        text: "**EVA Entertainment is a film dubbing studio in Andheri West, Mumbai that dubs regional, pan-India and Hollywood films into Hindi and India's other top languages.** We have dubbed around 30 films, mostly Telugu, Tamil, Malayalam and Kannada titles for Hindi audiences. We bring the same craft to English-language films made for the rest of the world.",
      },
      {
        t: "p",
        text: "Kollywood, Bollywood and Hollywood each expect something different from a dub. A Tamil mass entertainer needs a confident hero voice and punch dialogues that land. A Hindi family drama needs warmth and restraint. A Hollywood release needs a voice that matches a world-famous character in every language. Our writers, voice artists, directors and engineers work on all three under one roof.",
      },
    ],
  },
  {
    heading: "Regional films for every Indian audience",
    icon: "icon-play-circle",
    blocks: [
      {
        t: "p",
        text: "Most of our feature film work is regional cinema: Telugu, Tamil, Malayalam and Kannada films dubbed into Hindi for OTT platforms, satellite TV and cinemas. Our writers adapt every line to the actors' lips and to the new audience, so a punch line still lands and a joke still gets its laugh. Credits include [Mass Jathara](/projects/mass-jathara-hindi-dubbing), [Ghaati](/projects/ghaati-hindi-dubbing) and [Oddum Kuthira Chaddum Kuthira](/projects/oddum-kuthira-chaddum-kuthira-hindi-dubbing).",
      },
      {
        t: "p",
        text: "See [regional film dubbing](/regional-film-dubbing) for the language pairs we dub most often.",
      },
    ],
  },
  {
    heading: "Pan-India films: one release, ten languages",
    icon: "icon-translate2",
    blocks: [
      {
        t: "p",
        text: "A pan-India release puts one film in front of audiences in several languages on the same day. We handle every version from one studio, with one adapted master script, one glossary of names and terms and one mix standard. The Hindi, Telugu, Tamil and Bengali versions sound like the same film because the same team made them.",
      },
      {
        t: "p",
        text: "See [pan-India film dubbing](/pan-india-film-dubbing) for how we plan a multi-language release.",
      },
    ],
  },
  {
    heading: "Hollywood and international films: one voice across India",
    icon: "icon-voiceover",
    blocks: [
      {
        t: "p",
        text: "For Hollywood and other international films, a professional English voice artist records the primary English version of a character. The same voice artist then performs that character in Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia and Malayalam. Viewers hear one familiar voice in English and all 10 Indian languages.",
      },
      {
        t: "p",
        text: "Every line is a live human performance recorded in our booth with a native-language director. We do not use AI voices or voice cloning. Languages beyond the ten, such as Punjabi, Bhojpuri and Assamese, are available on request with native voice artists. See [Hollywood dubbing into Indian languages](/hollywood-dubbing-indian-languages).",
      },
    ],
  },
  {
    heading: "How a dubbing project works",
    icon: "icon-settings",
    blocks: [
      {
        t: "ol",
        items: [
          "**Brief.** Send the locked cut, the dialogue list if you have one, the M&E track and your target languages.",
          "**Script adaptation.** Native writers adapt each line for lip-sync and for the new audience. See [script translation](/translation-services).",
          "**Casting.** We share voice samples for the main characters and record only after you approve them.",
          "**Recording.** Directed sessions in our [dubbing studio](/dubbing-studio) in Andheri West.",
          "**Mix and check.** Dialogue is synced and mixed with your M&E in stereo or [5.1 surround](/5-1-mixing-studio), then checked against picture.",
          "**Delivery.** Final mixes, stems and [subtitles](/subtitling-services) in the formats you need.",
        ],
      },
    ],
  },
  {
    heading: "Why producers choose EVA",
    icon: "icon-like",
    blocks: [
      {
        t: "ul",
        items: [
          "**One team from script to mix.** Translation, casting, direction, studio recording and mixing happen in one studio, so nothing is lost between vendors.",
          "**Film dialogue is our daily work.** We know how South Indian dialogue maps onto Hindi and how English dialogue maps onto every major Indian language.",
          "**One voice in 11 languages.** For international titles the same voice artist performs in English and all 10 Indian languages.",
          "**Direct contact.** You deal with Felix and the studio team directly on WhatsApp or email.",
        ],
      },
    ],
  },
  {
    heading: "Languages we work in",
    icon: "icon-translate1",
    languages: {
      groups: [
        { label: "Source languages", codes: ["en", "te", "ta", "ml", "kn", "hi"], main: "en" },
        { label: "Target languages", codes: TOP_10_LANGUAGES, main: "hi" },
      ],
      caption: "Punjabi, Bhojpuri, Assamese and international languages available on request.",
    },
    blocks: [
      {
        t: "p",
        text: "We dub, voice and subtitle in English plus India's ten most spoken languages: Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia and Malayalam. See every [Indian language we dub](/indian-languages).",
      },
    ],
  },
  {
    heading: "Our studio in Andheri West",
    icon: "icon-travel",
    blocks: [
      {
        t: "p",
        text: "Our studio is at No. 228, 2nd Floor, Mohid Heights, near the RTO Office in Andheri West, Mumbai. Alongside dubbing we offer [voice over](/voice-over-studio), [Foley recording](/foley-recording), [5.1 mixing](/5-1-mixing-studio), [song recording](/song-recording-studio) and a [stock music library](/stock-music-library). Producers in India can visit the studio. Producers abroad can work with us by WhatsApp and email.",
      },
    ],
  },
];

export const HOME_FAQS = [
  {
    q: "What does EVA Entertainment do?",
    a: "We are a film dubbing studio in Andheri West, Mumbai. We dub regional, pan-India and Hollywood films into Hindi and India's other top languages. We also offer voice over, subtitling, script translation, Foley and 5.1 mixing.",
  },
  {
    q: "Can you dub Hollywood films into Hindi and other Indian languages?",
    a: "Yes. We dub English-language films into Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia and Malayalam with lip sync.",
  },
  {
    q: "Can the same voice artist voice a character in English and Indian languages?",
    a: "Yes. A professional English voice artist records the English version and performs the same character in all 10 Indian languages. It is a live human performance, never voice cloning.",
  },
  {
    q: "Which languages do you dub into?",
    a: "English plus India's top 10 languages. Punjabi, Bhojpuri, Assamese and international languages such as Arabic and Spanish are available on request.",
  },
  {
    q: "Do you dub South Indian films into Hindi?",
    a: "Yes. Telugu, Tamil, Malayalam and Kannada films dubbed into Hindi make up most of our feature film work, around 30 films so far.",
  },
  {
    q: "Can you dub one film into several languages for a pan-India release?",
    a: "Yes. We dub every language version from one studio with one adapted script and one mix standard, so all versions stay consistent.",
  },
  {
    q: "Do you work with producers outside India?",
    a: "Yes. We work with studios, distributors and OTT platforms in India and abroad. Send us your brief on WhatsApp or by email.",
  },
  {
    q: "How do I get a quote?",
    a: "Send the title, its runtime and the languages you need on WhatsApp at +91 86520 63177 or to info@evaentertainment.in. We will reply with a plan and a quote.",
  },
];

/** Home CTA, shaped like a service page so the shared CTA block can render it. */
export const HOME_CTA: Pick<ServicePageContent, "cta"> = {
  cta: {
    heading: "Tell us about your film",
    text: "Share the title, its runtime and the languages you need. We will reply with a plan and a quote.",
    label: "Get a dubbing quote",
    contact: STUDIO_CONTACT,
  },
};
