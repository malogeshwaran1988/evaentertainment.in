/* Built from the approved service-page PDFs (18 Oct 2026 drafts). Copy marked CONFIRM in the PDFs is left out until EVA confirms it. */
import type { ServicePageContent } from "@@/data/service-page-types";
import { MARKET_SERVICE_PAGES } from "@@/data/service-pages-markets";

export const SERVICE_PAGES: Record<string, ServicePageContent> = {
  "dubbing-studio": {
    seoTitle: "Dubbing Studio in Andheri West, Mumbai | Lip-Sync | EVA",
    description:
      "Lip-sync dubbing studio in Andheri West, Mumbai. Record in our soundproof booth in Hindi, Telugu, Tamil and 7 more Indian languages plus English. Get a quote.",
    h1: "Lip-Sync Dubbing Studio in Andheri West, Mumbai",
    serviceType: "Lip-sync dubbing",
    languages: ["English", "Hindi", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", "Kannada", "Odia", "Malayalam"],
    leadHeading: "Hindi versions that feel native",
    lead: [
      "**From a Telugu action drama to a Malayalam comedy, we turn South Indian films into Hindi versions that feel as if they were shot in Hindi.** EVA Entertainment is a lip-sync dubbing studio in Andheri West run by a team that spends most of its working day matching new Hindi dialogue to someone else's lips. Send us your film in its original language; we hand back a finished, mixed Hindi version ready for OTT, satellite TV or theatrical release.",
      "Most of our work is feature films from Telugu Tamil Malayalam and Kannada cinema. The same team dubs [Hollywood movies](/dubbing-studio/hollywood) and [Kollywood](/dubbing-studio/kollywood) titles works with [foreign distributors](/hollywood-dubbing-indian-languages) prepares [pan-India releases](/pan-india-film-dubbing) and handles web series documentaries and ad films.",
    ],
    sections: [
      {
        heading: "Why lip-sync dubbing is harder than it looks",
        icon: "icon-like",
        blocks: [
          {
            t: "p",
            text: "A good dub is invisible. The audience should forget, within a few minutes, that the actors ever spoke another language. That only happens when three things line up:",
          },
          {
            t: "ul",
            items: [
              "**The script fits the mouth.** A Telugu line and its Hindi meaning rarely have the same length or the same lip shapes. Our writers rework each line so the Hindi words open and close where the actor's lips do, without losing the joke, the threat or the emotion.",
              '**The voice fits the face.** A voice that is too young, too polished or too "dubbed" breaks the spell. We cast each character, from the hero to the tea-stall owner and share samples before recording.',
              "**The performance fits the scene.** Our dubbing directors sit in on every session, pushing for the breath, the pause and the shout that the original actor gave on set.",
            ],
          },
        ],
        media: "dub-why",
      },
      {
        heading: "Our lip-sync dubbing process",
        icon: "icon-settings",
        blocks: [
          {
            t: "p",
            text: "Every project follows the same seven steps, whether it is a two-hour feature or a single ad film.",
          },
          {
            t: "ol",
            items: [
              "**Brief and assets.** You share the video (a locked cut), the original script or dialogue list if you have it and the M&E (music and effects) track. We confirm the target language, delivery specs and deadline.",
              "**Translation and lip-sync adaptation.** Native writers translate the dialogue and then adapt it for sync reading length rhythm and lip movement scene by scene. See our [script translation service](/translation-services).",
              "**Voice casting.** We shortlist dubbing artists for each main character and send you voice samples for approval.",
              "**Recording with a dubbing director.** Artists record in our soundproof booth, loop by loop, with a director and a sound engineer guiding each take.",
              "**Editing and sync check.** Engineers clean and fit every line to picture, frame by frame and re-record anything that does not sit right.",
              "**Mixing.** The new dialogue is mixed with the M&E track in [stereo or 5.1](/5-1-mixing-studio). If the M&E is missing or incomplete, we can rebuild effects with [Foley](/foley-recording).",
              "**Quality check and delivery.** A final watch-through for sync, pronunciation and level, then delivery in the formats you need: full mix, dialogue stem, M&E and stems as required.",
            ],
          },
          {
            t: "p",
            text: "Rush schedules are possible when the booth and cast are free.",
          },
        ],
      },
      {
        heading: "Content types we dub",
        icon: "icon-play-circle",
        blocks: [
          {
            t: "p",
            text: "Lip-sync work is organised by content type as well as by language. Start with the segment that matches your title:",
          },
          {
            t: "ul",
            items: [
              "**[Hollywood movies dubbing](/dubbing-studio/hollywood)** - English and international features into Indian languages.",
              "**[Kollywood and Tamil film dubbing](/dubbing-studio/kollywood)** - Tamil features into Hindi and other languages.",
            ],
          },
          {
            t: "p",
            text: "Market hubs for buyers stay at [Hollywood for distributors](/hollywood-dubbing-indian-languages), [pan-India film dubbing](/pan-india-film-dubbing) and [regional film dubbing](/regional-film-dubbing).",
          },
        ],
      },
      {
        heading: "South Indian films dubbed into Hindi",
        icon: "icon-play-circle",
        blocks: [
          {
            t: "p",
            text: "Hindi audiences now watch more dubbed South Indian cinema than ever, on OTT platforms, satellite channels and YouTube. That is the work we know best. Our portfolio of around 30 films is mostly Telugu, Tamil, Malayalam and Kannada titles dubbed into Hindi, including:",
          },
          {
            t: "ul",
            items: [
              "**Telugu to Hindi:** [Mass Jathara](/projects/mass-jathara-hindi-dubbing), The Constable, [Ghaati](/projects/ghaati-hindi-dubbing), Saaree, [Show Time](/projects/show-time-hindi-dubbing), [Biker](/projects/biker-hindi-dubbing), [Nari Nari Naduma Murari](/projects/nari-nari-naduma-murari-hindi-dubbing) and [Anaganaga Oka Raju](/projects/anaganaga-oka-raju-hindi-dubbing)",
              "**Tamil to Hindi:** Sirai and Annapoorni",
              "**Malayalam to Hindi:** [Oddum Kuthira Chaddum Kuthira](/projects/oddum-kuthira-chaddum-kuthira-hindi-dubbing)",
              "**Kannada to Hindi:** Maharshi Valmiki",
              "**Telugu to Tamil and Hindi:** Jack",
            ],
          },
          {
            t: "p",
            text: "Each genre needs something different. Mass action films need big, confident hero voices and punchy one-liners. Family dramas need warmth and restraint. Comedies live or die on timing, so our writers rework jokes rather than translate them. [See all our dubbing projects](/our-projects).",
          },
        ],
      },
      {
        heading: "Languages we dub",
        icon: "icon-translate2",
        languages: {
          groups: [
            { label: "Source languages", codes: ["te", "ta", "ml", "kn", "hi", "en"] },
            { label: "Target languages", codes: ["hi", "ta", "te"], main: "hi" },
          ],
          caption: "For example, Jack was dubbed from Telugu into both Tamil and Hindi.",
        },
        blocks: [
          {
            t: "p",
            text: "We also dub into Bengali, Marathi, Gujarati, Urdu and Odia. See all [ten Indian languages](/dubbing) we work in.",
          },
        ],
      },
      {
        heading: "Regional, pan-India and Hollywood films",
        icon: "icon-play-circle",
        blocks: [
          {
            t: "ul",
            items: [
              "**Regional films.** Telugu, Tamil, Malayalam and Kannada films dubbed into Hindi and other Indian languages. See [regional film dubbing](/regional-film-dubbing).",
              "**Pan-India releases.** One film dubbed into several Indian languages from one studio with one mix standard. See [pan-India film dubbing](/pan-india-film-dubbing).",
              "**Hollywood and international films.** English titles dubbed into Hindi and other Indian languages. See [Hollywood movies dubbing](/dubbing-studio/hollywood) and the [distributors hub](/hollywood-dubbing-indian-languages).",
            ],
          },
        ],
      },
      {
        heading: "Who we dub for",
        icon: "icon-people",
        blocks: [
          {
            t: "ul",
            items: [
              "**OTT platforms and aggregators** that need Hindi versions of regional films and series, delivered to platform specs.",
              "**Producers and distributors** selling Hindi dubbing rights for satellite TV, YouTube or theatrical release.",
              "**Web series and TV production houses** localising fiction and non-fiction shows.",
              "**Ad agencies** adapting TV commercials and digital ads for other language markets.",
              "**E-learning and corporate teams** who want training videos dubbed rather than subtitled.",
              "**Animation and gaming studios** that need character voices in Hindi or other Indian languages.",
            ],
          },
        ],
      },
      {
        heading: "Built for long dubbing days",
        icon: "icon-mic-2",
        blocks: [
          {
            t: "p",
            text: "Our Andheri West facility is set up for full days of dubbing:",
          },
          {
            t: "ul",
            items: [
              "A separate soundproof recording booth for artists and a control room for the director and engineer",
              "Engineers with {years} years of studio experience",
            ],
          },
          {
            t: "p",
            text: "Read more on our [studio equipment page](/studio-equipment).",
          },
        ],
        media: "dub-studio",
      },
      {
        heading: "Why producers choose EVA Entertainment",
        icon: "icon-like",
        blocks: [
          {
            t: "ul",
            items: [
              "**One team, start to finish.** Translation, casting, direction recording, editing and mixing under one roof, so nothing is lost between vendors.",
              "**Regional, pan-India and Hollywood.** We know how Telugu, Tamil and Malayalam dialogue maps onto Hindi and how English dialogue maps onto every major Indian language.",
              "**Native Hindi voices.** Our dubbing artists perform in their mother tongue, so the Hindi sounds natural, not translated.",
              "**Direct contact.** You deal with Felix and the studio team directly, not a call centre.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is lip-sync dubbing?",
        a: "Lip-sync dubbing replaces the original dialogue with a new language, written and performed so that it matches the actors' lip movements on screen. Done well, the film feels as if it was shot in that language.",
      },
      {
        q: "How long does it take to dub a feature film into Hindi?",
        a: "It depends on the length of the film, the number of characters and the delivery specs. Tell us your release date and we will plan backwards from it.",
      },
      {
        q: "How much does film dubbing cost?",
        a: "Dubbing is usually quoted per project or per minute of content, based on runtime, number of characters, the voice cast and the mix format. Send us the film details on WhatsApp or by email and we will send a quote.",
      },
      {
        q: "What do I need to send you?",
        a: "A locked cut of the video, the original script or dialogue list if available and the M&E track. If you do not have a clean M&E, tell us; we can rebuild missing effects.",
      },
      {
        q: "Can I hear the voices before you record?",
        a: "Yes. We share voice samples for the main characters and record only after you approve the cast.",
      },
      {
        q: "Can you deliver to OTT platform specifications?",
        a: "Yes. We deliver stereo and 5.1 mixes, dialogue stems and M&E as required. Share the platform's delivery specs with your brief.",
      },
      {
        q: "Do you only dub South Indian films?",
        a: "No. South Indian films into Hindi are a large part of our work, but we also dub [Hollywood movies](/dubbing-studio/hollywood) and [international titles for distributors](/hollywood-dubbing-indian-languages) into India's top 10 languages plus [Kollywood](/dubbing-studio/kollywood) films Hindi titles for pan-India releases web series and documentaries.",
      },
    ],
    cta: {
      heading: "Get your film dubbed",
      text: "Tell us the film, its runtime and your deadline and we will reply with a plan and a quote.",
      label: "Request a dubbing quote",
      contact: [
        {
          label: "WhatsApp Felix",
          value: "+91 86520 63177",
          href: "https://wa.me/918652063177",
        },
        {
          label: "Email",
          value: "info@evaentertainment.in",
          href: "mailto:info@evaentertainment.in",
        },
      ],
      secondary: "Book a studio session",
    },
    posterStrip: [
      "mass-jathara-hindi-dubbing",
      "ghaati-hindi-dubbing",
      "show-time-hindi-dubbing",
      "biker-hindi-dubbing",
      "nari-nari-naduma-murari-hindi-dubbing",
      "anaganaga-oka-raju-hindi-dubbing",
      "oddum-kuthira-chaddum-kuthira-hindi-dubbing",
    ],
  },
  "voice-over-studio": {
    seoTitle: "English Voice Over Artist and Studio in Mumbai | EVA",
    description:
      "Voice over studio in Mumbai with a professional English voice artist who also voices India's top 10 languages. Native voices for films, ads and e-learning.",
    h1: "English and Indian-Language Voice Over Studio in Mumbai",
    serviceType: "Voice-over recording",
    languages: ["English", "Hindi", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", "Kannada", "Odia", "Malayalam"],
    leadHeading: "The right voice recorded cleanly",
    lead: [
      "**The right voice makes people listen. The wrong one makes them skip.** EVA Entertainment records voice-overs for ad films, corporate videos, e-learning courses, IVR systems, documentaries and films from our studio in Andheri West, Mumbai. We cast native speakers in English, Hindi and other Indian languages, direct every session and hand over clean, edited audio that is ready to drop into your edit.",
      "Whether you need a single 30-second radio spot or a 40-module training course in six languages, the process is the same: we listen to your brief, send you voice samples record with a director in the room and deliver on time.",
    ],
    sections: [
      {
        heading: "Voice-over services we offer",
        icon: "icon-voiceover",
        blocks: [
          {
            t: "h3",
            text: "Commercials and ad films",
          },
          {
            t: "p",
            text: "TV commercials, digital ads radio spots and social videos. We match the voice to the brand: a warm, trusted voice for a bank, an energetic one for a youth brand, a gentle one for a baby-care product. Need a jingle too? See our [song recording studio](/song-recording-studio).",
          },
          {
            t: "h3",
            text: "Corporate films and presentations",
          },
          {
            t: "p",
            text: "Company profiles, product explainers, investor videos and internal communication. Clear, confident narration that sounds professional without sounding stiff.",
          },
          {
            t: "h3",
            text: "E-learning and training",
          },
          {
            t: "p",
            text: "Course narration needs a voice that stays easy to listen to for hours and pronounces technical terms correctly. We record long scripts in consistent tone and level across every module and can re-record updates months later with the same artist.",
          },
          {
            t: "h3",
            text: "IVR and phone systems",
          },
          {
            t: "p",
            text: "Welcome messages, menu prompts and on-hold messages recorded clean and edited into separate files named to your system's needs.",
          },
          {
            t: "h3",
            text: "Documentaries and narration",
          },
          {
            t: "p",
            text: "Long-form narration for documentaries, audio guides and non-fiction shows, with a narrator who can carry a story.",
          },
          {
            t: "h3",
            text: "Film, series and animation voice-over",
          },
          {
            t: "p",
            text: "Narration, character voices and voice-over versions (where the original dialogue stays audible underneath) for film and TV. For full lip-synced language versions, see [lip-sync dubbing](/dubbing-studio).",
          },
        ],
      },
      {
        heading: "Voices of every age and style",
        icon: "icon-voiceover",
        blocks: [
          {
            t: "p",
            text: "We work with a pool of professional voice artists who record in their mother tongue:",
          },
          {
            t: "ul",
            items: [
              "**Male, female and child voices**, from young children to senior characters",
              "**Styles:** conversational, corporate, promotional and hard-sell, storytelling, character and cartoon voices",
              "**Samples first:** tell us about your content and audience and we will share suitable samples before you book",
            ],
          },
        ],
        media: "vo-voices",
      },
      {
        heading: "Languages",
        icon: "icon-translate2",
        languages: {
          groups: [{ label: "Voice-over languages", codes: ["en", "hi", "bn", "mr", "te", "ta", "gu", "ur", "kn", "or", "ml"], main: "en" }],
        },
        blocks: [
          {
            t: "p",
            text: "Hindi is our most requested voice-over language. We also record in English, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia and Malayalam. Other languages are available on request.",
          },
          {
            t: "p",
            text: "Need the same script in several languages? We translate it with our [script translation team](/translation-services), cast a native artist for each language and deliver every version with matching timing and file naming.",
          },
        ],
      },
      {
        heading: "Live voices, never cloned",
        icon: "icon-voiceover",
        blocks: [
          {
            t: "p",
            text: "Every voice over is a live human performance captured in our booth with a native-language director. We do not use voice cloning. For films and series see [Hollywood dubbing into Indian languages](/hollywood-dubbing-indian-languages).",
          },
        ],
      },
      {
        heading: "How a voice-over project works",
        icon: "icon-settings",
        blocks: [
          {
            t: "ol",
            items: [
              "**Share your script and brief.** Tell us the purpose, audience, tone, length and where the audio will be used. A reference video or track helps.",
              "**Get voice samples.** We shortlist artists and send samples. You pick the voice (or two, if you want a male and a female option).",
              "**Script check.** We check pronunciation of brand names, technical terms and numbers before the session and suggest edits if a line is hard to say naturally.",
              "**Recording session.** The artist records in our soundproof booth with a director and engineer. You are welcome to attend in person.",
              "**Editing.** We remove breaths, clicks and mistakes and level the audio so it sounds consistent from start to finish.",
              "**Delivery.** You receive files in the format you need, such as WAV or MP3, split per module or prompt if required. We can also sync the voice to your video and mix it with music from our [stock music library](/stock-music-library).",
            ],
          },
          {
            t: "p",
            text: "Longer e-learning projects are scheduled module by module.",
          },
        ],
      },
      {
        heading: "The voice booth",
        icon: "icon-mic-2",
        blocks: [
          {
            t: "ul",
            items: [
              "A dedicated, soundproof voice booth, separate from the control room",
              "An engineer and director on every session",
            ],
          },
          {
            t: "p",
            text: "More details on our [studio equipment page](/studio-equipment).",
          },
        ],
        media: "vo-studio",
      },
      {
        heading: "Who books our voice-over studio",
        icon: "icon-people",
        blocks: [
          {
            t: "ul",
            items: [
              "**Ad agencies and production houses** in Andheri, Lower Parel and BKC that need a reliable studio close by",
              "**E-learning companies and corporate L&D teams** building courses in Hindi and regional languages",
              "**OTT and film producers** who need narration, promos or voice-over versions",
              "**Telecom, banking and service companies** recording IVR prompts",
              "**Gaming and animation studios** looking for character voices",
              "**YouTubers, podcasters and authors** who want a professional voice or studio time",
            ],
          },
        ],
      },
      {
        heading: "Why EVA Entertainment",
        icon: "icon-like",
        blocks: [
          {
            t: "ul",
            items: [
              "**Native speakers only.** Pronunciation and tone sound right to local listeners.",
              "**A dubbing studio's discipline.** Our team records hours of film dialogue every week. Timing, sync and consistency are second nature.",
              "**One studio for every language version.** Fewer vendors, consistent quality.",
              "**Simple booking.** Message Felix on WhatsApp, get samples, book a slot.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Can I hear voice samples before I book?",
        a: "Yes. Share a short brief (content type, audience, tone) and we will send samples from artists who suit it.",
      },
      {
        q: "How much does a voice-over cost in Mumbai?",
        a: "It depends on script length, usage (TV, digital, internal), language and the artist. We quote per project after seeing the script.",
      },
      {
        q: "Do you record e-learning voice-overs in Hindi?",
        a: "Yes. We record e-learning narration in Hindi and other Indian languages, with consistent tone across modules and careful pronunciation of technical terms.",
      },
      {
        q: "Can you record IVR prompts?",
        a: "Yes. We record welcome messages, menu options and on-hold messages and deliver each prompt as a separate, named file in the format your phone system needs.",
      },
      {
        q: "Can I attend or direct the session?",
        a: "Yes, you are welcome at the studio in Andheri West.",
      },
      {
        q: "Can you record the same script in several languages?",
        a: "Yes. We translate the script, cast a native artist for each language and deliver all versions with matching timing.",
      },
      {
        q: "Do you provide child voices?",
        a: "Yes. We work with child voice artists for ads, animation and e-learning, with sessions scheduled to suit them.",
      },
    ],
    cta: {
      heading: "Find the right voice for your project",
      text: "Send us your script and tell us who it is for. We will reply with voice samples and a quote.",
      label: "Request voice samples",
      contact: [
        {
          label: "WhatsApp Felix",
          value: "+91 86520 63177",
          href: "https://wa.me/918652063177",
        },
        {
          label: "Email",
          value: "info@evaentertainment.in",
          href: "mailto:info@evaentertainment.in",
        },
      ],
      secondary: "Book a recording session",
    },
  },
  "foley-recording": {
    seoTitle: "Foley Studio in Mumbai | Foley & Sound Design | EVA",
    description:
      "Foley recording, sound effects and sound design in Andheri West, Mumbai. M&E tracks for dubbed films, OTT series, ads and short films. Book a session today.",
    h1: "Foley Recording and Sound Design Studio in Mumbai",
    serviceType: "Foley recording and sound design",
    languages: ["Hindi", "English"],
    leadHeading: "Sound the audience feels",
    lead: [
      "**Footsteps on gravel, the rustle of a saree, a glass set down on a table: you only notice these sounds when they are missing.** EVA Entertainment records Foley, builds sound effects and designs soundscapes for films, web series, ad films and dubbed versions from our studio in Andheri West, Mumbai.",
      "Because most of our work is dubbing South Indian films into Hindi, we spend a lot of time on one particular problem: films that arrive with an incomplete music and effects (M&E) track. When the original dialogue is removed, the sounds recorded with it go too. We rebuild them so the Hindi version sounds as full as the original.",
    ],
    sections: [
      {
        heading: "What is Foley and how is it different from sound design?",
        icon: "icon-folleyrecording",
        blocks: [
          {
            t: "p",
            text: "**Foley** is the everyday sound of a scene, performed and recorded in sync with the picture after filming: footsteps, clothing movement, props, doors, punches, cutlery. It is named after Jack Foley, who developed the technique in early Hollywood.",
          },
          {
            t: "p",
            text: "**Sound effects** are individual sounds, such as a car pass-by, a gunshot or rain. They are taken from libraries or recorded specially, then edited to picture.",
          },
          {
            t: "p",
            text: "**Sound design** is the bigger picture: choosing, shaping and layering all of these sounds, along with ambience, to create mood and tension. A sound designer decides what the audience should feel in a scene, then builds the sound to get there.",
          },
          {
            t: "p",
            text: "On most projects we do all three.",
          },
        ],
        media: "foley-what",
      },
      {
        heading: "Foley and sound services",
        icon: "icon-folleyrecording",
        blocks: [
          {
            t: "h3",
            text: "Foley recording to picture",
          },
          {
            t: "p",
            text: "Footsteps, cloth, props and body movement, performed while watching the scene and recorded on clean, separate tracks.",
          },
          {
            t: "h3",
            text: "M&E track creation and repair for dubbing",
          },
          {
            t: "p",
            text: "OTT platforms, broadcasters and distributors often require a fully filled M&E track: a version of the soundtrack with music and effects but no dialogue. If your film's M&E has gaps, we listen through, find the missing sounds and fill them with Foley and effects so any language can be laid on top. This is especially useful for South Indian films being dubbed into Hindi with our [lip-sync dubbing service](/dubbing-studio).",
          },
          {
            t: "h3",
            text: "Sound effects editing",
          },
          {
            t: "p",
            text: "Spot effects, hard effects and backgrounds cut and placed to picture, from library sounds or custom recordings.",
          },
          {
            t: "h3",
            text: "Ambience and atmosphere",
          },
          {
            t: "p",
            text: "Room tones, crowds, traffic, nature, markets: the background beds that make a location feel real.",
          },
          {
            t: "h3",
            text: "Sound design for promos, ads and trailers",
          },
          {
            t: "p",
            text: "Whooshes, impacts risers and transitions that give trailers, teasers and ads their energy.",
          },
        ],
      },
      {
        heading: "Our Foley and sound design process",
        icon: "icon-settings",
        blocks: [
          {
            t: "ol",
            items: [
              "**Spotting session.** We watch the cut with you (or your notes) and list every sound needed, scene by scene.",
              "**M&E review.** For dubbing projects, we check the existing M&E against the original mix and mark what is missing.",
              "**Foley recording.** Foley is performed in sync with the picture and recorded on separate tracks for feet, cloth and props.",
              "**Effects and ambience editing.** Library and custom effects are cut, layered and fitted frame by frame.",
              "**Premix.** Foley and effects are balanced into clean stems ready for the final mix.",
              "**Final mix and delivery.** We deliver stems for your mixer or take the project through to a [stereo or 5.1 mix](/5-1-mixing-studio) in-house, with a full M&E.",
            ],
          },
        ],
      },
      {
        heading: "One room for Foley, dialogue and mix",
        icon: "icon-mic-2",
        blocks: [
          {
            t: "ul",
            items: [
              "Soundproof recording booth and control room in Andheri West",
              "The same rooms used for dubbing and mixing, so Foley, dialogue and mix stay in one place",
            ],
          },
          {
            t: "p",
            text: "See the [studio equipment page](/studio-equipment).",
          },
        ],
        media: "foley-studio",
      },
      {
        heading: "Who it is for",
        icon: "icon-people",
        blocks: [
          {
            t: "ul",
            items: [
              "**Producers and distributors** preparing a film for Hindi or multi-language release who need a complete M&E",
              "**OTT platforms and aggregators** whose delivery specs require filled M&E and stems",
              "**Independent filmmakers and short-film makers** whose location sound lacks detail",
              "**Web series and TV productions** that need Foley across many episodes",
              "**Ad agencies** that want polished sound design for TVCs and digital films",
              "**Animation and game studios**, where every sound has to be created from scratch",
              "**Events and live shows** that need designed sound beds and stingers",
            ],
          },
        ],
      },
      {
        heading: "Where our Foley work shows up",
        icon: "icon-play-circle",
        blocks: [
          {
            t: "p",
            text: "Our main credits are Hindi dubbed versions of South Indian films such as [Mass Jathara](/projects/mass-jathara-hindi-dubbing), The Constable and [Ghaati](/projects/ghaati-hindi-dubbing).",
          },
        ],
      },
      {
        heading: "Why EVA Entertainment",
        icon: "icon-like",
        blocks: [
          {
            t: "ul",
            items: [
              "**Built around dubbing.** We understand what a dubbed version needs from an M&E, because we fill that gap on our own projects.",
              "**One studio from Foley to final mix.** No handing tracks between vendors and losing sync.",
              "**Clean organised deliverables.** Foley and effects on separate, labelled stems so your mixer can work quickly.",
              "**Direct contact.** Talk to the people doing the work.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is Foley in film?",
        a: "Foley is the everyday sound of a scene, such as footsteps, clothing and props, performed and recorded in sync with the picture after filming. It makes scenes sound real and gives the mixer control over each sound.",
      },
      {
        q: "Why does a dubbed film need Foley?",
        a: "On set, many sounds are recorded together with the dialogue. When the dialogue is replaced with a new language, those sounds disappear. Foley rebuilds them so the dubbed version sounds complete.",
      },
      {
        q: "What is an M&E track?",
        a: "M&E stands for music and effects. It is the full soundtrack without dialogue, used as the base for every language version of a film or series. Most OTT platforms and distributors require one.",
      },
      {
        q: "Can you fix an incomplete M&E track?",
        a: "Yes. We compare it with the original mix, list the missing sounds and fill them with Foley and effects, then deliver a full M&E.",
      },
      {
        q: "Do you deliver separate Foley stems?",
        a: "Yes. Foley, effects and ambience are delivered on separate, labelled stems or mixed by us into a stereo or 5.1 final mix.",
      },
      {
        q: "How long does Foley take for a feature film?",
        a: "It depends on the film's length, genre and how much is missing.",
      },
    ],
    cta: {
      heading: "Need Foley or a full M&E for your film?",
      text: "Send us the cut and your delivery specs and we will tell you what is missing and what it will take.",
      label: "Get a Foley quote",
      contact: [
        {
          label: "WhatsApp Felix",
          value: "+91 86520 63177",
          href: "https://wa.me/918652063177",
        },
        {
          label: "Email",
          value: "info@evaentertainment.in",
          href: "mailto:info@evaentertainment.in",
        },
      ],
      secondary: "Book studio time",
    },
  },
  "5-1-mixing-studio": {
    seoTitle: "5.1 Mixing Studio in Mumbai | Film & OTT Audio Mix | EVA",
    description:
      "5.1 surround and stereo mixing and mastering in Andheri West, Mumbai for films, dubbed versions, OTT series, ads and corporate videos. Book a mix today.",
    h1: "5.1 Mixing and Mastering Studio in Mumbai",
    serviceType: "5.1 surround and stereo film mixing",
    languages: ["Hindi", "Telugu", "Tamil", "Malayalam", "Kannada", "English"],
    leadHeading: "Mixes that pass delivery the first time",
    lead: [
      "**The mix is where everything comes together: dialogue, music, Foley and effects, balanced so the audience hears exactly what the story needs.** EVA Entertainment mixes and masters audio in 5.1 surround and stereo for feature films, dubbed versions, OTT series, ad films, corporate videos and e-learning, from our studio in Andheri West, Mumbai.",
      "A large share of our mixing work is Hindi dubbed versions of South Indian films, where new dialogue has to sit inside an existing music and effects track as naturally as the original did. We also mix original productions, from a single voice track for an IVR system to a full feature-length surround mix.",
    ],
    sections: [
      {
        heading: "Mixing services",
        icon: "icon-mixing",
        blocks: [
          {
            t: "h3",
            text: "5.1 surround mixing",
          },
          {
            t: "p",
            text: "Five full-range channels plus a subwoofer, for cinema, OTT and home-theatre playback. We place dialogue, music and effects across the sound field so the audience feels inside the scene without ever losing the words.",
          },
          {
            t: "h3",
            text: "Stereo mixing",
          },
          {
            t: "p",
            text: "Most people watch on phones, laptops and TVs. Every project gets a stereo mix (or a downmix from 5.1) that keeps dialogue clear on small speakers and earphones.",
          },
          {
            t: "h3",
            text: "Dubbed-version mixing",
          },
          {
            t: "p",
            text: "When a film is dubbed, the new dialogue is recorded in a different room, by different actors, months after the shoot. Our mixers match its level, tone and space to the original, so the Hindi dialogue sounds like it belongs in the scene. If the M&E track is incomplete, we rebuild missing effects with [Foley](/foley-recording) before the mix.",
          },
          {
            t: "h3",
            text: "Broadcast and OTT deliverables",
          },
          {
            t: "p",
            text: "Mixes delivered to platform and broadcaster specifications: loudness targets, channel layouts, stems and M&E.",
          },
          {
            t: "h3",
            text: "Mastering",
          },
          {
            t: "p",
            text: "Final level, tone and loudness for songs, jingles, podcasts and ads, so they sound consistent across platforms. See also our [song recording studio](/song-recording-studio).",
          },
        ],
      },
      {
        heading: "Common problems we fix in dubbed-version mixes",
        icon: "icon-bulb",
        blocks: [
          {
            t: "ul",
            items: [
              '**Dialogue that sounds "pasted on".** Studio-recorded lines are dry; the original scene had a room, a street or a hall. We add matching space and perspective so the voice sits in the location.',
              "**Level jumps between characters.** Different artists record on different days. We even them out so no voice sticks out.",
              "**Missing effects under dialogue.** Where the original effects were tied to the dialogue track, we rebuild them before the mix.",
              "**Music fighting the words.** Hindi lines are often longer than the originals; we ride the music so the dialogue always reads clearly.",
            ],
          },
        ],
        media: "mix-problems",
      },
      {
        heading: "Our mixing process",
        icon: "icon-settings",
        blocks: [
          {
            t: "ol",
            items: [
              "**Session prep.** We receive your tracks (AAF/OMF or stems) and picture, check sync and organise dialogue, music, Foley and effects.",
              "**Dialogue edit and clean-up.** Noise, clicks and room problems are fixed so speech stays clear.",
              "**Premix.** Dialogue, music and effects are balanced into stems.",
              "**Final mix.** The full 5.1 or stereo mix, shaped scene by scene with the director or producer.",
              "**Review and changes.** You review the mix in the studio or remotely and we make the changes.",
              "**Mastering and loudness.** Levels are checked against the platform or broadcaster's loudness target.",
              "**Delivery.** Final mixes, stems (dialogue, music, effects), M&E and stereo downmix, in the formats you need.",
            ],
          },
        ],
      },
      {
        heading: "Formats and deliverables",
        icon: "icon-download",
        blocks: [
          {
            t: "ul",
            items: [
              "5.1 surround mix and stereo (2.0) mix or downmix",
              "Dialogue, music and effects stems",
              "Full M&E track for further language versions",
              "Mono or stereo voice tracks for IVR and e-learning",
              "WAV at the sample rate and bit depth your platform asks for",
              "Loudness-compliant mixes to the target you specify",
            ],
          },
        ],
      },
      {
        heading: "The mixing room",
        icon: "icon-mic-2",
        blocks: [
          {
            t: "ul",
            items: [
              "Recording booth next door, so dialogue fixes and pickups can be recorded during the mix",
            ],
          },
          {
            t: "p",
            text: "Full list on our [studio equipment page](/studio-equipment).",
          },
        ],
        media: "live:pro-tools",
      },
      {
        heading: "Who it is for",
        icon: "icon-people",
        blocks: [
          {
            t: "ul",
            items: [
              "**Producers and distributors** finishing Hindi dubbed versions of Telugu, Tamil, Malayalam and Kannada films",
              "**OTT platforms and aggregators** that need 5.1 and stereo deliverables to spec",
              "**Independent filmmakers** finishing a feature or short film for festivals and release",
              "**Ad agencies and production houses** that need TVC and digital ad mixes",
              "**Corporate and e-learning teams** that need clear, consistent voice and music mixes",
              "**Musicians and podcasters** who need mixing and mastering",
            ],
          },
        ],
      },
      {
        heading: "Projects",
        icon: "icon-play-circle",
        blocks: [
          {
            t: "p",
            text: "Our dubbing portfolio includes Hindi versions of [Mass Jathara](/projects/mass-jathara-hindi-dubbing), Saaree, [Show Time](/projects/show-time-hindi-dubbing) and [Oddum Kuthira Chaddum Kuthira](/projects/oddum-kuthira-chaddum-kuthira-hindi-dubbing).",
          },
        ],
      },
      {
        heading: "Why EVA Entertainment",
        icon: "icon-like",
        blocks: [
          {
            t: "ul",
            items: [
              "**Dubbing and mixing under one roof.** The team that recorded the dialogue mixes it, so there are fewer surprises.",
              "**Dialogue first.** Hindi audiences judge a dub on how natural the voices sound. Our mixes keep them clear and believable.",
              "**Any size of project.** From a 10-second IVR prompt to a two-and-a-half-hour feature.",
              "**On time.** Mixing is usually the last step before release; we plan around your deadline.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is a 5.1 mix?",
        a: "A 5.1 mix spreads the soundtrack across five full-range speakers (left, centre right, left surround right surround) and one subwoofer for low frequencies. It is the standard surround format for cinema, OTT and home theatres.",
      },
      {
        q: "Do I need a 5.1 mix or stereo?",
        a: "For cinema and most OTT platforms, a 5.1 mix plus a stereo version is usually required. For YouTube, social media, corporate and e-learning, stereo is enough. Tell us where the content will be released and we will advise.",
      },
      {
        q: "Can you mix the Hindi dubbed version of my film?",
        a: "Yes. We mix the new Hindi dialogue with your M&E track so it matches the original. If the M&E is incomplete, we fill the gaps with Foley first.",
      },
      {
        q: "What do you need from us to start a mix?",
        a: "The picture (with timecode), the session as an AAF/OMF or as stems, the M&E if it is a dubbed version and the delivery specs.",
      },
      {
        q: "Do you deliver stems and an M&E?",
        a: "Yes. We deliver dialogue, music and effects stems and a full M&E along with the final mix.",
      },
      {
        q: "Can I attend the mix?",
        a: "Yes. Producers and directors are welcome in the studio for the final mix and review.",
      },
    ],
    cta: {
      heading: "Finish your film with a clean release-ready mix",
      text: "Share your runtime, format and delivery specs. We will send a schedule and a quote.",
      label: "Get a mixing quote",
      contact: [
        {
          label: "WhatsApp Felix",
          value: "+91 86520 63177",
          href: "https://wa.me/918652063177",
        },
        {
          label: "Email",
          value: "info@evaentertainment.in",
          href: "mailto:info@evaentertainment.in",
        },
      ],
      secondary: "Book the mix room",
    },
  },
  "subtitling-services": {
    seoTitle: "Subtitling Services | SRT Subtitles for Films and OTT | EVA",
    description:
      "Time-coded SRT subtitles for movies, TV series and web series in English and India's top 10 languages, written to your OTT platform's style guide.",
    h1: "Subtitling Services: SRT Subtitle Files for Films, TV and OTT",
    serviceType: "Subtitling",
    languages: ["English", "Hindi", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", "Kannada", "Odia", "Malayalam"],
    leadHeading: "Subtitles people can actually read",
    lead: [
      "**Good subtitles are read in a glance and forgotten a second later, leaving the viewer with the film, not the text.** EVA Entertainment creates time-coded subtitles for movies, TV series and web series, written by native speakers and timed to your picture. We are based in Andheri West, Mumbai and work with clients across India.",
      "Because we also dub films, we know how dialogue behaves across Telugu, Tamil, Malayalam, Kannada, Hindi and English. Our subtitles keep the meaning, humour and tone of the original, not just the literal words.",
    ],
    sections: [
      {
        heading: "Subtitling services",
        icon: "icon-interface",
        blocks: [
          {
            t: "h3",
            text: "Film and OTT subtitling",
          },
          {
            t: "p",
            text: "Subtitles for feature films and web series ready for theatrical release, OTT platforms, satellite TV or YouTube. Subtitles are written to sensible reading speeds and line lengths and split at natural points in the sentence.",
          },
          {
            t: "h3",
            text: "English subtitles for Indian-language films",
          },
          {
            t: "p",
            text: "For South Indian films travelling to wider audiences, festivals or international buyers, we create English subtitles that carry local expressions and humour in a way English readers understand.",
          },
          {
            t: "h3",
            text: "Hindi and regional-language subtitles",
          },
          {
            t: "p",
            text: "Hindi subtitles for Telugu, Tamil, Malayalam and Kannada films and regional-language subtitles for Hindi and English content.",
          },
          {
            t: "h3",
            text: "English subtitles for Hollywood and international films",
          },
          {
            t: "p",
            text: "Subtitles in Hindi and other Indian languages for English films and series, written from the same adapted script as our [Hollywood dubs](/hollywood-dubbing-indian-languages) when we dub the film too.",
          },
          {
            t: "h3",
            text: "Same-language captions",
          },
          {
            t: "p",
            text: "Captions in the same language as the audio, for accessibility and silent autoplay.",
          },
        ],
      },
      {
        heading: "Subtitling South Indian films: what needs care",
        icon: "icon-play-circle",
        blocks: [
          {
            t: "p",
            text: "Telugu, Tamil, Malayalam and Kannada films are full of things that do not translate directly: forms of address that show respect or affection, dialect that tells you where a character is from, wordplay in punch dialogues and song lyrics full of local imagery. A literal translation loses all of it.",
          },
          {
            t: "p",
            text: 'Our subtitlers decide case by case. A respectful "garu" or "anna" might become a name, a title or simply a warmer tone in the line. A punch dialogue is rewritten so it still lands in Hindi or English. Song lyrics are subtitled when they move the story, in a style the client approves. The aim is simple: the viewer reading the subtitle should laugh, wince or cheer at the same moment as the viewer who understands the original.',
          },
        ],
        media: "sub-south",
      },
      {
        heading: "How our subtitling works",
        icon: "icon-settings",
        blocks: [
          {
            t: "ol",
            items: [
              "**Receive files.** You send the video and, if available, the script or dialogue list. We confirm the languages, format and platform specs.",
              "**Transcription.** If there is no script, we transcribe the dialogue in the original language.",
              "**Translation.** Native translators translate and condense the dialogue into readable subtitles. See [script translation](/translation-services).",
              "**Timing (spotting).** Each subtitle is timed to the speech and adjusted around shot changes, so it appears and disappears cleanly.",
              "**Review.** A second linguist checks meaning, spelling, names and timing against the picture.",
              "**Delivery.** Subtitle files in the format you need or subtitles burned into the video.",
            ],
          },
        ],
        media: "sub-workflow",
      },
      {
        heading: "Subtitle formats",
        icon: "icon-download",
        blocks: [
          {
            t: "p",
            text: "We deliver in the common formats that players and platforms accept, including SRT and can follow a platform's style guide when you share it.",
          },
        ],
        media: "sub-formats",
      },
      {
        heading: "Languages",
        icon: "icon-translate2",
        languages: {
          groups: [{ label: "Subtitle languages", codes: ["en", "hi", "bn", "mr", "te", "ta", "gu", "ur", "kn", "or", "ml"] }],
        },
        blocks: [
          {
            t: "p",
            text: "English and India's top 10 languages: Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia and Malayalam. Every subtitle file is written or reviewed by a native speaker of the target language.",
          },
        ],
      },
      {
        heading: "What makes subtitles good",
        icon: "icon-star",
        blocks: [
          {
            t: "ul",
            items: [
              "**Reading speed.** Viewers need time to read and still watch the picture. We keep subtitles within comfortable reading speeds.",
              "**Line length and breaks.** Two lines at most, split where the sentence naturally pauses.",
              "**Meaning over word-for-word.** Idioms, jokes and cultural references are adapted, not translated literally.",
              "**Consistent names and terms.** Character names, places and recurring terms spelled the same way throughout.",
              "**Clean timing.** Subtitles sync to speech and respect shot changes.",
            ],
          },
        ],
      },
      {
        heading: "Who it is for",
        icon: "icon-people",
        blocks: [
          {
            t: "ul",
            items: [
              "**OTT platforms and aggregators** that need subtitles for regional and dubbed films",
              "**Producers and distributors** preparing films for wider Indian or international release",
              "**Independent filmmakers** submitting to film festivals",
              "**International studios** releasing English films and series in India",
            ],
          },
        ],
      },
      {
        heading: "Subtitles and dubbing from one studio",
        icon: "icon-mic-2",
        blocks: [
          {
            t: "p",
            text: "Many producers now release a film both dubbed and subtitled. Because one team handles both at EVA, the Hindi dub and the subtitles use the same names, terms and tone. Our main credits are Hindi dubbed versions of South Indian films, including [Ghaati](/projects/ghaati-hindi-dubbing), Sirai and [Nari Nari Naduma Murari](/projects/nari-nari-naduma-murari-hindi-dubbing). See [lip-sync dubbing](/dubbing-studio).",
          },
        ],
        media: "sub-together",
      },
      {
        heading: "Why EVA Entertainment",
        icon: "icon-like",
        blocks: [
          {
            t: "ul",
            items: [
              "**Native-speaker subtitlers.** Subtitles read naturally in the target language.",
              "**Film-language know-how.** We work daily with South Indian dialogue and its Hindi equivalents.",
              "**One workflow.** Transcription, translation, timing and review in one place.",
              "**Quick answers.** Message Felix on WhatsApp and get a reply from the studio.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What subtitle file formats do you provide?",
        a: "We provide SRT as standard and can deliver other formats on request. We can also burn subtitles into the video.",
      },
      {
        q: "Can you add English subtitles to a Telugu or Tamil film?",
        a: "Yes. Native translators create English subtitles that keep the meaning and humour of the original dialogue.",
      },
      {
        q: "Do you need a script to create subtitles?",
        a: "No. A script or dialogue list speeds things up, but we can transcribe the dialogue from the video.",
      },
      {
        q: "How long does it take to subtitle a feature film?",
        a: "It depends on the runtime, the language pair and whether a script is available.",
      },
      {
        q: "How much does subtitling cost?",
        a: "Subtitling is usually priced per minute of video, depending on the language pair and whether transcription is needed. Send us the details for a quote.",
      },
      {
        q: "Can you follow a platform's subtitle style guide?",
        a: "Yes. Share the style guide with your brief and we will follow its rules for line length, formatting and reading speed.",
      },
      {
        q: "Do you also dub the same content?",
        a: "Yes. We can dub the film into Hindi and create subtitles from the same translated script, so both versions match.",
      },
    ],
    cta: {
      heading: "Get your film or series subtitled",
      text: "Tell us the runtime, languages and format you need. We will reply with a quote and a delivery date.",
      label: "Request a subtitling quote",
      contact: [
        {
          label: "WhatsApp Felix",
          value: "+91 86520 63177",
          href: "https://wa.me/918652063177",
        },
        {
          label: "Email",
          value: "info@evaentertainment.in",
          href: "mailto:info@evaentertainment.in",
        },
      ],
    },
  },
  "song-recording-studio": {
    seoTitle: "Song Recording Studio in Andheri West, Mumbai | EVA",
    description:
      "Song recording studio in Andheri West, Mumbai for vocals, jingles, covers and film songs, with an engineer on every session plus mixing and mastering.",
    h1: "Song Recording Studio in Andheri West, Mumbai",
    serviceType: "Music recording studio",
    languages: ["Hindi", "Marathi", "Tamil", "Telugu", "English"],
    leadHeading: "A calm room for your best take",
    lead: [
      "**A great take needs a quiet room, a good microphone, an engineer who knows when to stop you and when to keep going and no clock-watching.** EVA Entertainment's recording studio in Andheri West gives singers, composers, bands and agencies exactly that. Record lead vocals, harmonies, instruments, jingles and voice parts, then take the song through editing, mixing and mastering without changing studios.",
      "We are in Andheri West, minutes from the film and music offices of Andheri, Versova, Oshiwara and Lokhandwala.",
    ],
    sections: [
      {
        heading: "What you can record here",
        icon: "icon-songrecording",
        blocks: [
          {
            t: "h3",
            text: "Vocals for original songs and albums",
          },
          {
            t: "p",
            text: "Lead vocals, doubles and harmonies for independent releases, albums and singles recorded in a quiet, private booth.",
          },
          {
            t: "h3",
            text: "Film and web-series songs",
          },
          {
            t: "p",
            text: "Vocals and parts for film and series soundtracks recorded to the composer's guide track.",
          },
          {
            t: "h3",
            text: "Jingles and ad music",
          },
          {
            t: "p",
            text: "Jingles, sonic logos and short songs for TV radio and digital ads, often recorded in more than one language version on the same day.",
          },
          {
            t: "h3",
            text: "Covers, demos and reels",
          },
          {
            t: "p",
            text: "Cover songs, demos for producers and labels and audition reels for singers.",
          },
          {
            t: "h3",
            text: "Devotional and regional music",
          },
          {
            t: "p",
            text: "Bhajans, devotional albums and regional-language songs.",
          },
          {
            t: "h3",
            text: "Podcasts and spoken word",
          },
          {
            t: "p",
            text: "Podcasts, audiobooks and narration, using the same booth and engineers as our [voice-over studio](/voice-over-studio).",
          },
        ],
      },
      {
        heading: "How a recording session works",
        icon: "icon-settings",
        blocks: [
          {
            t: "ol",
            items: [
              "**Book your slot.** Pick a date and time on our [booking page](/contact-us) or message Felix on WhatsApp. Tell us what you are recording and how many people are coming.",
              "**Bring your track.** Bring your backing track or project (stems or a stereo track), lyrics and any reference songs.",
              "**Set-up and sound check.** The engineer sets up the microphone, headphone mix and levels for your voice or instrument.",
              "**Recording.** Record as many takes as you need, with the engineer tracking and keeping notes on the best ones.",
              "**Comping and editing.** We assemble the best parts of each take and clean up timing and noise.",
              "**Mixing and mastering.** Mix the song with your music and master it for streaming radio or video. See [mixing and mastering](/5-1-mixing-studio).",
              "**Take your files home.** Raw takes, edited vocals and final mix delivered as WAV and MP3.",
            ],
          },
        ],
      },
      {
        heading: "Getting the most out of your session",
        icon: "icon-bulb",
        blocks: [
          {
            t: "p",
            text: "A few simple things make a big difference to how much you get done in a booked hour:",
          },
          {
            t: "ul",
            items: [
              "**Rehearse before you arrive.** Studio time is best spent capturing performances, not learning the song.",
              "**Know your key and tempo.** If the backing track is not final, bring the project so changes can be made on the spot.",
              "**Print the lyrics.** Mark breaths, harmonies and ad-libs. Your engineer will use the same sheet to track takes.",
              "**Rest your voice.** Avoid shouting, very cold drinks and dairy just before the session. Warm water helps.",
              "**Bring one trusted ear.** A producer or friend whose judgement you trust is useful. A crowd in the control room usually is not.",
              "**Plan breaks.** Voices tire. Two focused hours with short breaks beat four exhausted ones.",
            ],
          },
        ],
        media: "song-session",
      },
      {
        heading: "Songs in more than one language",
        icon: "icon-translate2",
        blocks: [
          {
            t: "p",
            text: "Because we are a dubbing and localisation studio as well as a recording studio, we are used to working across languages. A jingle can be recorded in Hindi, Marathi, Tamil and Telugu on the same day, with singers who are native speakers of each language and lyrics adapted to fit the melody rather than translated word for word. Our [script translation team](/translation-services) can help adapt lyrics.",
          },
        ],
      },
      {
        heading: "The recording room",
        icon: "icon-mic-2",
        blocks: [
          {
            t: "ul",
            items: [
              "A soundproof recording booth with a separate control room",
              "An engineer on every session",
            ],
          },
          {
            t: "p",
            text: "See the full [studio equipment list](/studio-equipment).",
          },
        ],
        media: "song-studio",
      },
      {
        heading: "Rates and booking",
        icon: "icon-calendar",
        blocks: [
          {
            t: "p",
            text: "Studio time is booked by the hour.",
          },
          {
            t: "p",
            text: "Tell us the date, the session length and what you are recording and we will confirm the slot and the rate on WhatsApp or by email.",
          },
        ],
      },
      {
        heading: "Who records at EVA",
        icon: "icon-people",
        blocks: [
          {
            t: "ul",
            items: [
              "**Singers and independent artists** recording singles, covers and albums",
              "**Composers and music producers** who need a reliable room for vocal sessions",
              "**Ad agencies and brands** recording jingles and ad songs",
              "**Film and web-series music teams** recording song vocals",
              "**Bands** recording vocals and overdubs",
              "**Podcasters and YouTubers** who want clean, professional sound",
            ],
          },
        ],
      },
      {
        heading: "Why record with us",
        icon: "icon-like",
        blocks: [
          {
            t: "ul",
            items: [
              "**Quiet and private.** A calm space to perform, away from distractions.",
              "**Engineers who work with voices all day.** Our team records dubbing and voice-over every week, so they know how to get a clean, expressive vocal.",
              "**Recording to master in one place.** Editing, mixing and mastering in the same studio.",
              "**Easy to reach in Andheri West.** Close to Mumbai's film and music offices.",
              "**Straightforward booking.** Online or on WhatsApp.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "How do I book a recording session?",
        a: "Use the [Book a Studio Session](/contact-us) page to send your preferred date and time or message Felix on WhatsApp at +91 86520 63177. We will confirm availability.",
      },
      {
        q: "Is a sound engineer included?",
        a: "Yes. Every session includes an engineer at the console from set-up to the final take.",
      },
      {
        q: "What should I bring to the session?",
        a: "Your backing track or project stems, lyrics and any reference songs. If you play an instrument, bring it along.",
      },
      {
        q: "Can you mix and master my song too?",
        a: "Yes. We can mix and master the song in the same studio after recording or you can take the raw vocals to your own producer.",
      },
      {
        q: "Do you record jingles for ads?",
        a: "Yes. We record jingles and ad songs, including multiple language versions.",
      },
      {
        q: "How long does it take to record a song?",
        a: "It depends on the song and how prepared you are. A well-rehearsed singer can often finish a lead vocal in two or three hours; harmonies, doubles and ad-libs take longer. We will suggest a session length when you book.",
      },
      {
        q: "Can I record a podcast here?",
        a: "Yes. The booth and engineers we use for voice-over work just as well for podcasts and spoken word.",
      },
    ],
    cta: {
      heading: "Book your recording session",
      text: "Pick a time that suits you and we will have the room ready.",
      label: "Book a studio session",
      contact: [
        {
          label: "WhatsApp Felix",
          value: "+91 86520 63177",
          href: "https://wa.me/918652063177",
        },
        {
          label: "Booking email",
          value: "felixanthony@evaentertainment.in",
          href: "mailto:felixanthony@evaentertainment.in",
        },
      ],
    },
  },
  "translation-services": {
    seoTitle: "Script Translation and Lip-Sync Adaptation for Dubbing | EVA",
    description:
      "Script translation and lip-sync adaptation for film dubbing. English, Telugu, Tamil, Malayalam and Kannada into Hindi and India's top 10 languages.",
    h1: "Script Translation and Lip-Sync Adaptation for Film Dubbing",
    serviceType: "Script translation and adaptation",
    languages: ["Hindi", "English", "Telugu", "Tamil", "Malayalam", "Kannada"],
    leadHeading: "Scripts written for the screen",
    lead: [
      "**A dub can only be as good as its script.** At EVA Entertainment, translation is not a word-for-word exercise. Our native writers adapt your script so it sounds natural when spoken, fits the actors' lips when dubbed and reads easily on screen as subtitles. We work from our studio in Andheri West, Mumbai, translating Telugu, Tamil, Malayalam, Kannada and English content into Hindi and between other Indian and international languages.",
      "Most of our translation work feeds straight into our own dubbing, voice-over and subtitling projects, so every script is written by people who will hear it performed.",
    ],
    sections: [
      {
        heading: "Three kinds of screen translation",
        icon: "icon-translate1",
        blocks: [
          {
            t: "h3",
            text: "1. Dubbing script adaptation (lip-sync)",
          },
          {
            t: "p",
            text: "This is the hardest and the most important. The Hindi line must:",
          },
          {
            t: "ul",
            items: [
              "**match the length** of the original, so it starts and ends with the actor's mouth",
              '**match key lip shapes**, especially closed-lip sounds like "p", "b" and "m" on close-ups',
              "**keep the meaning and emotion** of the scene and the character's way of speaking",
              "**sound like real Hindi**, not translated Hindi",
            ],
          },
          {
            t: "p",
            text: "Our writers work scene by scene with the video, not from a text file alone. The adapted script then goes to the dubbing director and artists in our [lip-sync dubbing studio](/dubbing-studio).",
          },
          {
            t: "h3",
            text: "2. Voice-over script translation",
          },
          {
            t: "p",
            text: "For narration, documentaries, e-learning, corporate films and ads, the script must fit the timing of the video and be easy to say aloud. We check pronunciation of brand names and technical terms and flag lines that are hard to speak. Scripts go straight to our [voice-over studio](/voice-over-studio).",
          },
          {
            t: "h3",
            text: "3. Subtitle translation",
          },
          {
            t: "p",
            text: "Subtitles for movies, TV series and web series are limited by reading speed and line length, so translation here means condensing without losing meaning. Our subtitlers translate and time together. See [subtitling services](/subtitling-services).",
          },
        ],
      },
      {
        heading: "Transcreation for ads and brands",
        icon: "icon-translate1",
        blocks: [
          {
            t: "p",
            text: "Taglines, jingles and ad scripts often rely on wordplay rhyme or cultural references that simply do not exist in the target language. Transcreation means rewriting the idea, not the words, so the ad works as well in Hindi or Tamil as it did in English. We share options and explain the choices before recording.",
          },
        ],
        media: "tr-transcreation",
      },
      {
        heading: "Languages and pairs",
        icon: "icon-translate2",
        blocks: [
          {
            t: "p",
            text: "Our core pairs are the ones we dub every week. Pick a pair to see it in the studio.",
          },
          {
            t: "p",
            text: "Every script is translated or reviewed by a native speaker of the target language.",
          },
        ],
        media: "lang-pairs",
      },
      {
        heading: "How we work",
        icon: "icon-settings",
        blocks: [
          {
            t: "ol",
            items: [
              "**Brief and files.** You share the video, the original script or dialogue list (if available) and your target language. For dubbing, we also ask about the audience and platform.",
              "**Transcription (if needed).** If there is no script, we transcribe the original dialogue from the video.",
              "**Translation.** A native writer creates the first translation, keeping notes on names, terms and cultural references.",
              "**Adaptation.** For dubbing, the script is fitted to lip movement and timing; for subtitles, to reading speed; for voice-over, to the video's length.",
              "**Review.** A second linguist checks meaning, consistency and naturalness. Where possible, the dubbing director reads it against picture.",
              "**Approval.** You review and approve. We update the script with your notes.",
              "**Recording or subtitling.** The approved script goes straight into production in our studio or is delivered to you as a document.",
            ],
          },
        ],
      },
      {
        heading: "Formats we deliver",
        icon: "icon-download",
        blocks: [
          {
            t: "ul",
            items: [
              "Dubbing scripts with timecodes and character names",
              "Voice-over scripts, split by scene or module",
              "Subtitle files (SRT and others on request)",
              "Word or Excel documents or the format your team works in",
            ],
          },
        ],
      },
      {
        heading: "Who it is for",
        icon: "icon-people",
        blocks: [
          {
            t: "ul",
            items: [
              "**Producers and distributors** preparing Hindi dubbed versions of South Indian films",
              "**OTT platforms and aggregators** that need consistent scripts for dubbing and subtitles",
              "**Ad agencies** that need regional versions of TV and digital campaigns",
              "**E-learning companies and corporate L&D teams** translating courses and training videos",
              "**Documentary and non-fiction producers**",
              "**Game and animation studios** that need dialogue localised",
            ],
          },
        ],
      },
      {
        heading: "From our portfolio",
        icon: "icon-play-circle",
        blocks: [
          {
            t: "p",
            text: "Our writers have adapted scripts for Hindi versions of films such as The Constable, Saaree, Sirai and [Oddum Kuthira Chaddum Kuthira](/projects/oddum-kuthira-chaddum-kuthira-hindi-dubbing).",
          },
        ],
      },
      {
        heading: "Why EVA Entertainment",
        icon: "icon-like",
        blocks: [
          {
            t: "ul",
            items: [
              "**Written to be performed.** Our scripts are tested in our own booth by our own dubbing directors.",
              "**South to Hindi experts.** Telugu, Tamil, Malayalam and Kannada to Hindi is our everyday work.",
              "**Native writers.** The target language is always the writer's mother tongue.",
              "**One workflow.** Translation recording, subtitling and mixing in one studio, so scripts, subtitles and dubs stay consistent.",
              "**Confidential.** Scripts are shared only with the team working on your project.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is the difference between translation and dubbing script adaptation?",
        a: "Translation carries the meaning into another language. Dubbing adaptation goes further: the line is rewritten so it fits the actor's lip movements and timing on screen, while still sounding natural.",
      },
      {
        q: "Do you translate scripts for dubbing South Indian films into Hindi?",
        a: "Yes. Telugu, Tamil, Malayalam and Kannada to Hindi is our core work. Our writers adapt each line to fit lip-sync and keep the tone of the original.",
      },
      {
        q: "Can you translate without an original script?",
        a: "Yes. We can transcribe the dialogue from the video first, then translate.",
      },
      {
        q: "Can I get only the translation, without recording?",
        a: "Yes. We deliver translated scripts as documents if you want to record or subtitle elsewhere, though most clients use our studio for the next step.",
      },
      {
        q: "How do you price script translation?",
        a: "Script translation is usually priced per minute of content or per project. Send us the details for a quote.",
      },
      {
        q: "Do you offer transcreation for ads?",
        a: "Yes. We rewrite taglines, jingles and ad scripts so the idea works in the target language and share options before recording.",
      },
      {
        q: "Can you adapt Hollywood scripts for Indian languages?",
        a: "Yes. Native writers adapt English dialogue for lip-sync in Hindi and India's other top languages, keeping jokes and cultural references meaningful. See [Hollywood dubbing](/hollywood-dubbing-indian-languages).",
      },
    ],
    cta: {
      heading: "Start with a script that works on screen",
      text: "Tell us the content, the language pair and your deadline. We will send a plan and a quote.",
      label: "Request a translation quote",
      contact: [
        {
          label: "WhatsApp Felix",
          value: "+91 86520 63177",
          href: "https://wa.me/918652063177",
        },
        {
          label: "Email",
          value: "info@evaentertainment.in",
          href: "mailto:info@evaentertainment.in",
        },
      ],
    },
  },
  "stock-music-library": {
    seoTitle: "Stock Music Library for Films, Ads & Videos | India | EVA",
    description:
      "Background music and sound effects for ads, corporate films, e-learning and YouTube, chosen for your project and edited to fit in our Mumbai studio.",
    h1: "Stock Music and Sound Library for Films, Ads and Videos",
    serviceType: "Stock music licensing",
    languages: ["Hindi", "English"],
    leadHeading: "Music chosen for your edit",
    lead: [
      "**The right music tells the audience how to feel before a single word is spoken.** EVA Entertainment's stock music library gives producers, agencies and video teams a curated choice of background music and sounds for ad films, corporate videos, e-learning, documentaries and online content. And because the library sits inside a working recording studio in Andheri West, Mumbai, we do more than hand over a file: we help you choose, cut the music to your edit and mix it with your voice-over.",
    ],
    sections: [
      {
        heading: "Why use a curated library instead of a giant one?",
        icon: "icon-like",
        blocks: [
          {
            t: "p",
            text: "Big online libraries have millions of tracks. That sounds great until you spend an afternoon scrolling through them. A curated library is smaller and quicker to search and our team helps you find the right track for your brief.",
          },
          {
            t: "ul",
            items: [
              "**Less searching.** Describe the mood, pace and length and we shortlist tracks for you.",
              "**Edited to fit.** Tracks cut to the exact length of your video, with clean endings and hits on key moments.",
              "**Mixed with your voice.** Music balanced with your voice-over or dialogue so every word is clear.",
            ],
          },
        ],
        media: "stock-curated",
      },
      {
        heading: "What is in the library",
        icon: "icon-music-cd",
        blocks: [
          {
            t: "p",
            text: "Alongside music, we can provide sound effects and ambiences. For effects recorded specially for your film, see our [Foley and sound design service](/foley-recording).",
          },
        ],
      },
      {
        heading: "How it works",
        icon: "icon-settings",
        blocks: [
          {
            t: "ol",
            items: [
              "**Tell us about your project.** What the video is, who it is for, the mood you want and the length. A reference track helps a lot.",
              "**Get a shortlist.** We send you a small selection of tracks that fit the brief.",
              "**Choose and confirm usage.** Pick your track and tell us where the video will be used (TV, digital, internal, cinema) so the right licence is issued.",
              "**Edit and mix (optional).** We cut the music to your edit and mix it with your voice-over, dialogue and effects in our studio.",
              "**Delivery.** You receive the final mixed audio or the music file, with licence details.",
            ],
          },
        ],
      },
      {
        heading: "Music for different kinds of video",
        icon: "icon-music-equalizer",
        blocks: [
          {
            t: "h3",
            text: "Ad films and promos",
          },
          {
            t: "p",
            text: "Ads have seconds, not minutes, to make an impression. The music needs a clear identity, a strong start and an ending that lands exactly on the pack shot. We cut tracks to 15, 30 and 60-second versions so every edit of your campaign sounds finished.",
          },
          {
            t: "h3",
            text: "Corporate films",
          },
          {
            t: "p",
            text: "Company profiles and product videos usually need music that feels confident and modern without drawing attention to itself. The voice-over carries the message; the music carries the energy underneath it.",
          },
          {
            t: "h3",
            text: "E-learning and training",
          },
          {
            t: "p",
            text: "Learners may listen for hours, so background music should be gentle, steady and low in the mix or used only for intros and section breaks. We help you choose tracks that will not tire the listener.",
          },
          {
            t: "h3",
            text: "Documentaries",
          },
          {
            t: "p",
            text: "Documentaries need music that can shift with the story, from curious to tense to reflective. We look for tracks with versions or stems that can be shaped across a longer edit.",
          },
          {
            t: "h3",
            text: "YouTube reels and social media",
          },
          {
            t: "p",
            text: "Short, punchy and loop-friendly. We pick tracks that grab attention in the first second and still work when the video is watched on a phone speaker.",
          },
        ],
      },
      {
        heading: "Licensing, in plain words",
        icon: "icon-download",
        blocks: [
          {
            t: "p",
            text: "Every project needs the right to use the music where it will be seen or heard.",
          },
        ],
      },
      {
        heading: "Who uses our library",
        icon: "icon-people",
        blocks: [
          {
            t: "ul",
            items: [
              "**Ad agencies and production houses** making TV and digital ads on tight timelines",
              "**Corporate communication teams** producing company films and internal videos",
              "**E-learning companies** that need calm, unobtrusive background music for long courses",
              "**Documentary makers** who need score-like music without commissioning a composer",
              "**YouTubers, podcasters and social media teams** who want safe, licensed music",
              "**Event companies** that need walk-in music and stings",
            ],
          },
        ],
      },
      {
        heading: "Music plus voice: one studio",
        icon: "icon-mic-2",
        blocks: [
          {
            t: "p",
            text: "Most videos need both music and a voice. At EVA you can record the [voice-over](/voice-over-studio), pick the music, add effects and get a final [stereo or 5.1 mix](/5-1-mixing-studio) in one visit. That saves time and it means the music is chosen and mixed with the voice in mind, not dropped underneath it at the last minute.",
          },
        ],
        media: "stock-voice",
      },
      {
        heading: "Choosing music for your video: quick tips",
        icon: "icon-bulb",
        blocks: [
          {
            t: "ul",
            items: [
              '**Start with the feeling, not the genre.** "Hopeful and building" is a more useful brief than "corporate".',
              "**Mind the voice.** Busy melodies fight with narration. Choose simpler tracks under long voice-overs.",
              "**Match the pace to the edit.** Fast cuts need energy; slow reflective footage needs space.",
              "**Plan the ending.** A track that ends cleanly on your last frame makes the whole video feel finished.",
              "**Check the licence before you publish,** especially for TV, cinema and paid ads.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "How do I choose music from your library?",
        a: "Send us a short description of your project, its mood and length (and a reference track if you have one). We will send a shortlist of suitable tracks.",
      },
      {
        q: "Can you edit a track to my video's length?",
        a: "Yes. We cut music to the exact length of your video, with clean endings and can mix it with your voice-over or dialogue.",
      },
      {
        q: "Do you also offer sound effects?",
        a: "Yes. We can supply sound effects and ambiences and for custom effects recorded to picture, see our Foley service.",
      },
      {
        q: "Can you mix the music with my voice-over?",
        a: "Yes. We can record your voice-over in our booth or take your existing recording and mix it with the music and any effects so the voice stays clear from start to finish. You receive one finished audio track ready to lay under your video.",
      },
      {
        q: "What should I include in a music brief?",
        a: "The type of video, the audience, the mood you want, the length, where it will be published and one or two reference tracks you like. The more specific the brief, the shorter and better the shortlist.",
      },
    ],
    cta: {
      heading: "Find the right music for your next video",
      text: "Tell us about your project and its mood. We will send you a shortlist.",
      label: "Ask for a music shortlist",
      contact: [
        {
          label: "WhatsApp Felix",
          value: "+91 86520 63177",
          href: "https://wa.me/918652063177",
        },
        {
          label: "Email",
          value: "info@evaentertainment.in",
          href: "mailto:info@evaentertainment.in",
        },
      ],
    },
  },
  ...MARKET_SERVICE_PAGES,
};
