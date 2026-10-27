/* Market pages for the regional, pan-India and Hollywood positioning (Oct 2026 SEO plan).
   Claims stay to what EVA has confirmed: one English voice artist who also performs all 10 Indian languages. */
import type { LanguageCode, ServicePageContent } from "@@/data/service-page-types";

/** India's ten most spoken languages (Census 2011), in that order. */
export const TOP_10_LANGUAGES: LanguageCode[] = ["hi", "bn", "mr", "te", "ta", "gu", "ur", "kn", "or", "ml"];
export const TOP_10_LANGUAGE_NAMES = [
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
];

export const STUDIO_CONTACT: ServicePageContent["cta"]["contact"] = [
  { label: "WhatsApp Felix", value: "+91 86520 63177", href: "https://wa.me/918652063177" },
  { label: "Email", value: "info@evaentertainment.in", href: "mailto:info@evaentertainment.in" },
];

const REGIONAL_CREDITS = [
  "mass-jathara-hindi-dubbing",
  "ghaati-hindi-dubbing",
  "show-time-hindi-dubbing",
  "biker-hindi-dubbing",
  "nari-nari-naduma-murari-hindi-dubbing",
  "anaganaga-oka-raju-hindi-dubbing",
  "oddum-kuthira-chaddum-kuthira-hindi-dubbing",
];

export const MARKET_SERVICE_PAGES: Record<string, ServicePageContent> = {
  "hollywood-dubbing-indian-languages": {
    seoTitle: "Hollywood Dubbing for Distributors | Indian Languages | EVA",
    description:
      "Hollywood dubbing for foreign distributors and studios. Lip-sync Indian-language versions from an English master with casting mix and delivery timed to your release. Get a quote.",
    h1: "Hollywood Dubbing for Distributors and Studios",
    serviceType: "Film dubbing",
    languages: ["English", ...TOP_10_LANGUAGE_NAMES],
    leadHeading: "One voice from English to every Indian screen",
    lead: [
      "**Hollywood dubbing for distributors turns an English-language film into versions Indian audiences can watch in Hindi Tamil Telugu and other languages with dialogue that matches the actors' lips and emotion.** EVA Entertainment does this from our studio in Andheri West Mumbai for studios distributors and OTT platforms in the US the UK the UAE and India. For the content-type craft page see [Hollywood movies dubbing](/dubbing-studio/hollywood).",
      "What sets us apart is the voice. See [English dubbing and voice-over](/dubbing-studio/english) for the one-voice demo: the same artist records the English lead and then the Hindi Bengali Marathi Telugu Tamil and other Indian versions so a franchise character stays familiar across markets.",
    ],
    sections: [
      {
        heading: "What we deliver for international titles",
        icon: "icon-play-circle",
        blocks: [
          {
            t: "ul",
            items: [
              "**Lip-sync dubs.** Feature films, TV series and web series dubbed with dialogue written to the actors' lip movements. See our [lip-sync dubbing studio](/dubbing-studio).",
              "**Mixes built on your M&E.** New dialogue mixed with the original music and effects in stereo or [5.1 surround](/5-1-mixing-studio).",
              "**Subtitles from the same script.** [Subtitles](/subtitling-services) in English and Indian languages that use the same names and terms as the dub.",
              "**Trailers and promos.** Dubbed trailers, teasers and promos so your campaign launches in every language at once.",
              "**Stems and masters.** Dialogue stems, M&E and full mixes named to your delivery specification.",
            ],
          },
        ],
      },
      {
        heading: "Languages for Hollywood dubbing",
        icon: "icon-translate2",
        languages: {
          groups: [
            { label: "Source language", codes: ["en"], main: "en" },
            { label: "Indian languages", codes: TOP_10_LANGUAGES, main: "hi" },
          ],
          caption: "Punjabi, Bhojpuri, Assamese and international languages available on request.",
        },
        blocks: [
          {
            t: "p",
            text: "Hindi reaches the widest audience, but a film released in all ten languages reaches viewers across every state in their own language. See all the [Indian languages we dub](/dubbing).",
          },
        ],
      },
      {
        heading: "How a Hollywood dubbing project works",
        icon: "icon-settings",
        blocks: [
          {
            t: "ol",
            items: [
              "**Brief and assets.** Send the locked picture, the dialogue list and the M&E track with the languages you need.",
              "**Script adaptation.** Native writers adapt every English line for lip-sync and for Indian audiences, keeping jokes, slang and cultural references meaningful. See [script translation](/translation-services).",
              "**Casting and samples.** We share samples of the English lead voice and the Indian-language versions for your approval before recording.",
              "**Directed recording.** Each language is recorded in our Andheri West studio with a native-language dubbing director.",
              "**Mix and quality check.** Dialogue is edited, synced and mixed with the M&E, then checked against picture by a native speaker.",
              "**Delivery.** Final mixes, stems and subtitle files delivered to your specification.",
            ],
          },
        ],
      },
      {
        heading: "Who we work with",
        icon: "icon-people",
        blocks: [
          {
            t: "ul",
            items: [
              "**Hollywood and international studios** releasing films in Indian cinemas.",
              "**Distributors** who hold Indian-language rights for international catalogues.",
              "**OTT platforms** that need Hindi and regional audio tracks for English films and series.",
              "**Producers abroad** in the US, the UK and the UAE who want one point of contact in India.",
            ],
          },
          {
            t: "p",
            text: "Message us on WhatsApp or email from any time zone and the studio team in Mumbai will reply.",
          },
        ],
      },
      {
        heading: "English to Hindi dubbing: our recent work",
        icon: "icon-play-circle",
        blocks: [
          {
            t: "p",
            text: "English to Hindi is the pair most international titles start with. We adapt idioms and jokes for Hindi audiences, match the timing of fast dialogue and deliver mixes to platform specifications.",
          },
          {
            t: "p",
            text: "Our recent English to Hindi work includes [Night of the Zoopocalypse](/projects/night-of-the-zoopocalypse-hindi-dubbing), a 2024 movie we dubbed into Hindi. See every title on [our projects](/our-projects) page.",
          },
        ],
      },
    ],
    posterStrip: ["night-of-the-zoopocalypse-hindi-dubbing"],
    faqs: [
      {
        q: "Can you dub a Hollywood film into Hindi?",
        a: "Yes. We adapt the English dialogue for lip-sync, cast Hindi voice artists to perform it and mix it with your M&E track to deliver a finished Hindi version.",
      },
      {
        q: "Which Indian languages can you dub English films into?",
        a: "Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia and Malayalam. Punjabi, Bhojpuri, Assamese and other languages are available on request.",
      },
      {
        q: "What does one voice artist across every language mean?",
        a: "One professional voice artist performs the character in English and in all 10 Indian languages, so the character sounds the same in every version. Every line is a live human performance; we do not use voice cloning or synthetic voices.",
      },
      {
        q: "Do you need the M&E track?",
        a: "A clean music and effects track gives the best result. If your M&E is missing or incomplete, tell us; we can rebuild missing effects with [Foley recording](/foley-recording).",
      },
      {
        q: "How long does it take to dub a feature film?",
        a: "It depends on the runtime, the number of characters and how many languages you need. Share your release date and we will plan the schedule backwards from it.",
      },
      {
        q: "Can you dub trailers and promos as well as the film?",
        a: "Yes. We dub trailers, teasers and promos in the same voices as the film so the campaign matches the release.",
      },
      {
        q: "Do you also provide subtitles?",
        a: "Yes. We create subtitles in English and Indian languages from the same adapted script, so the dub and subtitles match.",
      },
    ],
    cta: {
      heading: "Bring your film to Indian audiences",
      text: "Tell us the title, its runtime and the languages you need. We will reply with a plan and a quote.",
      label: "Get a dubbing quote",
      contact: STUDIO_CONTACT,
    },
  },

  "regional-film-dubbing": {
    seoTitle: "Regional Film Dubbing: South Indian Films to Hindi | EVA",
    description:
      "Regional film dubbing from Mumbai. Telugu, Tamil, Malayalam and Kannada films dubbed into Hindi and other Indian languages with lip sync. Get a quote.",
    h1: "Regional Film Dubbing: South Indian Films in Hindi",
    serviceType: "Film dubbing",
    languages: ["Hindi", "Telugu", "Tamil", "Malayalam", "Kannada", "English"],
    leadHeading: "Kollywood and Tollywood films for every Indian audience",
    lead: [
      "**Regional film dubbing takes a film made for one Indian language audience and gives it a natural, lip-synced version in another.** At EVA Entertainment most of our feature film work is exactly that: Telugu, Tamil, Malayalam and Kannada films dubbed into Hindi for OTT, satellite TV and cinema. Tamil titles also sit on [Kollywood dubbing](/dubbing-studio/kollywood).",
      "We have dubbed around 30 films from Tollywood, Kollywood, Mollywood and Sandalwood. We work the other way too, taking Hindi and English content into South Indian and other Indian languages.",
    ],
    sections: [
      {
        heading: "Mass films that land with a new audience",
        icon: "icon-translate2",
        blocks: [
          {
            t: "p",
            text: "A mass dialogue that works in Telugu can fall flat when translated word for word. Character names, places and cultural details stay true to the original film while the line itself is rewritten for the new audience.",
          },
          {
            t: "p",
            text: "How our writers do this is covered on our [script translation and lip-sync adaptation](/translation-services) page.",
          },
        ],
        media: "regional-adapt",
      },
      {
        heading: "Voices that fit the star",
        icon: "icon-voiceover",
        blocks: [
          {
            t: "p",
            text: "Audiences notice when a hero's dubbed voice changes from one film to the next. We cast each character carefully, share samples before recording and keep notes so the same voice can return for the next release.",
          },
          {
            t: "p",
            text: "Every session is directed by a native dubbing director in our [lip-sync dubbing studio](/dubbing-studio) in Andheri West.",
          },
        ],
      },
      {
        heading: "Language pairs we dub",
        icon: "icon-translate1",
        languages: {
          groups: [
            { label: "Source languages", codes: ["te", "ta", "ml", "kn", "hi"], main: "te" },
            { label: "Target languages", codes: ["hi", "ta", "te", "ml", "kn", "en"], main: "hi" },
          ],
          caption: "Bengali, Marathi, Gujarati, Urdu and Odia versions are also available.",
        },
        blocks: [
          {
            t: "p",
            text: "Telugu to Hindi and Tamil to Hindi are our most frequent pairs. See our [Telugu to Hindi](/dubbing/telugu-to-hindi) and [Tamil to Hindi](/dubbing/tamil-to-hindi) dubbing work.",
          },
          {
            t: "p",
            text: "Releasing in several languages at once? See [pan-India film dubbing](/pan-india-film-dubbing).",
          },
        ],
      },
      {
        heading: "A final mix that matches the original",
        icon: "icon-settings",
        blocks: [
          {
            t: "p",
            text: "We mix the new dialogue with your music and effects track in stereo or [5.1 surround](/5-1-mixing-studio). Missing effects are rebuilt on our [Foley recording](/foley-recording) stage so the dubbed version sounds as full as the original.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Which regional languages do you dub from?",
        a: "Mostly Telugu, Tamil, Malayalam and Kannada. We also dub Hindi and English content into South Indian and other Indian languages.",
      },
      {
        q: "Can you dub a Telugu film into Hindi with lip sync?",
        a: "Yes. Telugu to Hindi is our most common pair. Writers adapt the dialogue to the actors' lip movements and native Hindi artists perform it.",
      },
      {
        q: "How many films have you dubbed?",
        a: "Around 30 films, mostly South Indian titles dubbed into Hindi. See [our projects](/our-projects).",
      },
      {
        q: "Can the same artist voice a star across several films?",
        a: "Yes, where the artist is available. We keep casting notes so a returning voice can be booked for the next release.",
      },
      {
        q: "What do I need to send for a regional dub?",
        a: "A locked cut of the film, the dialogue list if you have one and the music and effects track.",
      },
      {
        q: "Do you also subtitle regional films?",
        a: "Yes. We create [subtitles](/subtitling-services) in Hindi, English and other Indian languages from the same adapted script.",
      },
    ],
    posterStrip: REGIONAL_CREDITS,
    cta: {
      heading: "Dub your regional film",
      text: "Tell us the film, its runtime and the languages you need. We will reply with a plan and a quote.",
      label: "Request a dubbing quote",
      contact: STUDIO_CONTACT,
    },
  },

  "pan-india-film-dubbing": {
    seoTitle: "Pan-India Film Dubbing in 10 Languages | EVA Studio",
    description:
      "Pan-India film dubbing for multi-language releases. One studio dubs your film into Hindi, Telugu, Tamil and 7 more languages with matching quality. Get a quote.",
    h1: "Pan-India Film Dubbing for Multi-Language Releases",
    serviceType: "Film dubbing",
    languages: ["English", ...TOP_10_LANGUAGE_NAMES],
    leadHeading: "One release, ten languages, one standard",
    lead: [
      "**Pan-India film dubbing prepares one film for release in several Indian languages at the same time.** EVA Entertainment handles every version from one studio in Andheri West, Mumbai, so the Hindi, Telugu, Tamil and other versions share the same script decisions, casting notes and mix standard. See also [Kollywood dubbing](/dubbing-studio/kollywood) when the title is a Tamil feature. Hindi multi-language releases stay on this pan-India hub until Bollywood segment credits are published.",
      "We dub into India's top 10 languages: Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia and Malayalam. More languages are available on request.",
    ],
    sections: [
      {
        heading: "Why one studio for every language",
        icon: "icon-like",
        blocks: [
          {
            t: "p",
            text: "When each language goes to a different vendor, small differences add up: a name spelt three ways, a punch line that changes meaning, one version mixed louder than the rest. A single studio keeps every version consistent.",
          },
          {
            t: "ul",
            items: [
              "**One adapted script.** Every language is adapted from the same master script with a shared glossary of names and terms.",
              "**One casting plan.** Voices for each character are chosen to match across languages and approved before recording.",
              "**One mix standard.** All versions are mixed to the same loudness and delivery specification.",
              "**One point of contact.** You deal with Felix and the studio team for every language.",
            ],
          },
        ],
      },
      {
        heading: "Languages for a pan-India release",
        icon: "icon-translate2",
        languages: {
          groups: [{ label: "Release languages", codes: TOP_10_LANGUAGES, main: "hi" }],
          caption: "Punjabi, Bhojpuri, Assamese and international languages available on request.",
        },
        blocks: [
          {
            t: "p",
            text: "Read more about each of the [ten Indian languages](/dubbing) we dub.",
          },
        ],
      },
      {
        heading: "A matched mix in every version",
        icon: "icon-settings",
        blocks: [
          {
            t: "p",
            text: "Each language is mixed with the same music and effects track in stereo or [5.1 surround](/5-1-mixing-studio), so a scene sounds the same in every theatre and on every platform.",
          },
          {
            t: "p",
            text: "Releasing an English title in India? See [Hollywood dubbing into Indian languages](/hollywood-dubbing-indian-languages).",
          },
        ],
        media: "panindia-mix",
      },
      {
        heading: "How a multi-language release works",
        icon: "icon-play-circle",
        blocks: [
          {
            t: "ol",
            items: [
              "**Plan.** Share the locked cut, the M&E and your release languages. We plan every version together.",
              "**Adapt.** Native writers adapt the master script into each language from a shared glossary.",
              "**Cast and record.** Voices are approved per language and recorded with native dubbing directors.",
              "**Mix and check.** Every version is mixed to one standard and checked against picture.",
              "**Deliver.** Mixes, stems and [subtitles](/subtitling-services) delivered for each language.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is pan-India film dubbing?",
        a: "It is dubbing one film into several Indian languages for a release across the country, usually Hindi plus South Indian and other major languages.",
      },
      {
        q: "Which languages can you dub a pan-India film into?",
        a: "Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia and Malayalam. Other languages are available on request.",
      },
      {
        q: "Why use one studio for every language?",
        a: "One studio keeps names, terms, casting and mix levels consistent in every version and gives you a single point of contact.",
      },
      {
        q: "Can you dub all languages for the same release date?",
        a: "Tell us your release date and the languages you need. We will plan the recording schedule backwards from it.",
      },
      {
        q: "Do you deliver 5.1 mixes for each language?",
        a: "Yes. We deliver stereo and 5.1 mixes with dialogue stems and M&E for every language.",
      },
      {
        q: "Can you also create subtitles for each language?",
        a: "Yes. Subtitles come from the same adapted script so they match the dub.",
      },
    ],
    posterStrip: REGIONAL_CREDITS,
    cta: {
      heading: "Plan your pan-India release",
      text: "Tell us the film, its runtime and your release languages. We will reply with a plan and a quote.",
      label: "Get a dubbing quote",
      contact: STUDIO_CONTACT,
    },
  },
};

/** Copy for the /dubbing hub (moved from the retired /indian-languages page, which 308-redirects there). */
export const DUBBING_LANGUAGES_PAGE: ServicePageContent = {
    seoTitle: "Dubbing by Language: 10 Indian Languages + English | EVA",
    description:
      "Every language pair EVA Entertainment dubs with real project counts plus the ten Indian languages we work in, from Hindi and Bengali to Odia and Malayalam.",
    h1: "Dubbing by Language: Pairs and 10 Indian Languages",
    serviceType: "Film dubbing",
    languages: ["English", ...TOP_10_LANGUAGE_NAMES],
    leadHeading: "English plus India's ten most spoken languages",
    lead: [
      "**Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia and Malayalam are the ten most spoken languages in India.** EVA Entertainment dubs films, TV series and web series in all ten, plus English, from our studio in Andheri West, Mumbai.",
      "Below you will find every language pair we have dubbed with the real projects behind it, followed by a short guide to each of the ten languages. Other Indian and international languages are available on request with native voice artists.",
    ],
    sections: [
      {
        heading: "The ten languages we dub",
        icon: "icon-translate2",
        languages: {
          groups: [{ label: "Indian languages", codes: TOP_10_LANGUAGES, main: "hi" }],
          caption: "Plus English as a source or target language.",
        },
        blocks: [
          {
            t: "ul",
            items: [
              "**Hindi.** India's most spoken language and the language of Bollywood. Our most requested dubbing language.",
              "**Bengali.** The language of Bengali cinema in Kolkata and of a large audience in Bangladesh.",
              "**Marathi.** Spoken across Maharashtra, home to Marathi cinema and to our studio in Mumbai.",
              "**Telugu.** The language of Tollywood in Hyderabad, one of India's biggest film industries.",
              "**Tamil.** The language of Kollywood in Chennai, with a large audience in India and abroad.",
              "**Gujarati.** Spoken across Gujarat and by a large Gujarati audience overseas.",
              "**Urdu.** Close to Hindi in speech, with its own vocabulary and poetry that a dub must respect.",
              "**Kannada.** The language of Sandalwood in Bengaluru.",
              "**Odia.** The language of Odisha and its Ollywood film industry.",
              "**Malayalam.** The language of Mollywood in Kerala, known for dialogue-heavy dramas.",
            ],
          },
        ],
      },
      {
        heading: "Why these ten languages",
        icon: "icon-like",
        blocks: [
          {
            t: "p",
            text: "These are the ten most spoken languages in India according to the 2011 Census. A film released in all ten reaches most of the country in its own language, from Kolkata to Kochi.",
          },
          {
            t: "p",
            text: "Planning a release in several of them at once? Our [pan-India film dubbing](/pan-india-film-dubbing) page explains how we keep every version consistent.",
          },
        ],
      },
      {
        heading: "Native teams for every language",
        icon: "icon-people",
        blocks: [
          {
            t: "p",
            text: "Each language is adapted by a native writer and recorded under a native-language dubbing director, so dialogue sounds like it was written in that language.",
          },
          {
            t: "p",
            text: "Every line is a live human performance recorded in our booth. Dubbing [Hollywood and international films](/hollywood-dubbing-indian-languages) works the same way.",
          },
        ],
        media: "languages-artists",
      },
      {
        heading: "More languages on request",
        icon: "icon-mic-2",
        blocks: [
          {
            t: "p",
            text: "Beyond the ten, we can arrange Punjabi, Bhojpuri, Assamese and other Indian languages, plus international languages such as Arabic and Spanish, with native voice artists. Tell us what you need and we will confirm availability.",
          },
          {
            t: "p",
            text: "Every language is also available as [subtitles](/subtitling-services) and [voice over](/voice-over-studio).",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What are the top 10 languages in India?",
        a: "By number of speakers in the 2011 Census: Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia and Malayalam.",
      },
      {
        q: "Do you dub into languages beyond the ten?",
        a: "Yes, on request. Punjabi, Bhojpuri, Assamese and international languages such as Arabic and Spanish can be arranged with native voice artists.",
      },
      {
        q: "Can you dub between two Indian languages, such as Tamil to Telugu?",
        a: "Yes. We dub between Indian languages as well as from and into English. See [regional film dubbing](/regional-film-dubbing).",
      },
      {
        q: "Do you offer subtitles in these languages?",
        a: "Yes. We create subtitles for movies, TV series and web series in all ten languages and English.",
      },
      {
        q: "How do I get a quote for several languages?",
        a: "Send us the title, its runtime and the list of languages on WhatsApp or by email. We will reply with a plan and a quote.",
      },
    ],
    cta: {
      heading: "Dub your film in every language",
      text: "Tell us the title, its runtime and the languages you need. We will reply with a plan and a quote.",
      label: "Get a dubbing quote",
      contact: STUDIO_CONTACT,
    },
  };
