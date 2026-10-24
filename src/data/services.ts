import { SERVICE_MEDIA } from "@@/data/service-media";
import { APP_BASE_URL } from "@@/constants/constants";
import { serviceHref, type ServiceSlug } from "@@/constants/routes";
import type { SvgIconName } from "@@/components/common/Icons";
import { SERVICE_FX, type ImageFx } from "@@/data/image-fx";

type ServiceIcon = { icon: string; svg?: never } | { svg: SvgIconName; icon?: never };

export type Service = ServiceIcon & {
  slug: ServiceSlug;
  /** Short name for cards, menus and the contact form. */
  name: string;
  h1: string;
  subtitle: string;
  /** One-line summary for cards. */
  summary: string;
  seo: { title: string; description: string };
  image: string;
  alt: string;
  fx: ImageFx;
  ogImage: string;
  ogImageAlt: string;
  introHeading: string;
  intro: string[];
  extra?: { heading: string; paragraphs: string[] };
  highlights: { title: string; text: string }[];
  idealFor: string[];
  faqs: { q: string; a: string }[];
  related: ServiceSlug[];
};

export const SERVICES: Service[] = [
  {
    slug: "dubbing-studio",
    name: "Lip-Sync Dubbing",
    icon: "icon-lip-syncdubbing-01",
    h1: "Lip-Sync Dubbing Studio in Mumbai",
    subtitle: "Natural, fully lip-synced dubbing for films, series, ads and e-learning in Indian and international languages.",
    summary: "Natural, fully lip-synced dubbing in any language.",
    seo: {
      title: "Lip-Sync Dubbing Studio in Mumbai | EVA Entertainment",
      description:
        "Lip-sync dubbing studio in Andheri, Mumbai for movies, series, ad films, documentaries and e-learning. Native dubbing artists, directors and translators.",
    },
    image: "/images/services/equipment-01.avif",
    alt: "Condenser microphones in a dubbing booth",
    fx: SERVICE_FX.microphones,
    ogImage: "/images/og/dubbing-studio-mumbai.jpg",
    ogImageAlt: "Condenser microphones in EVA Entertainment's dubbing booth",
    introHeading: "One-stop dubbing in any language",
    intro: [
      "We offer to dub in various languages for movies, Fiction & Non-Fictions, ad films, documentaries, E-learning etc. Normally, a professional dubbing team consists of Sound Eng, Dubbing Artists, Dubbing Directors, Scriptwriter, Artist coordinator, and Translator. The main idea behind Dubbing is to ensure that the voice behind the video is in synchronization with the display.",
      "We offer complete one-stop dubbing solutions. You can simply hand over your video in the source language to us and we shall provide you a final finished video in the target language of your choice.",
      "Our Dubbing team works in complete coordination to yield a finished output video which looks natural. We provide you dubbed videos with complete lip sync.",
    ],
    highlights: [
      { title: "Complete dubbing team", text: "Sound engineers, dubbing artists, directors, scriptwriters, coordinators and translators working together on your project." },
      { title: "True lip sync", text: "Dialogue is adapted and recorded to match on-screen lip movement, so the dubbed version looks natural." },
      { title: "Source to final video", text: "Hand over the video in its source language and receive a finished, mixed video in your target language." },
    ],
    idealFor: ["Feature films", "Web and TV series", "Fiction and non-fiction shows", "Ad films", "Documentaries", "E-learning"],
    faqs: [
      { q: "What is lip-sync dubbing?", a: "Lip-sync dubbing replaces the original dialogue with a new language recorded so that it matches the actors' lip movements on screen, making the film feel as if it was shot in that language." },
      { q: "What do I need to send you?", a: "Your video in the source language, plus a script if you have one. We handle translation, casting, recording, direction and the final mix." },
      { q: "Which languages can you dub into?", a: "We work with native dubbing artists for Indian and international languages. Tell us your target languages when you contact us and we will share voice samples." },
    ],
    related: ["voice-over-studio", "translation-services", "5-1-mixing-studio"],
  },
  {
    slug: "voice-over-studio",
    name: "Voice Over",
    icon: "icon-voiceover",
    h1: "Voice Over Studio in Mumbai",
    subtitle: "Native male, female and child voices for e-learning, films, IVR, corporate videos and ads.",
    summary: "Native male, female and child voices for every format.",
    seo: {
      title: "Voice Over Studio in Mumbai | Native Voice Artists | EVA",
      description:
        "Voice-over recording studio in Andheri, Mumbai with native male, female and child voice artists for e-learning, IVR, films, ads and corporate videos.",
    },
    image: "/images/services/equipment-02.avif",
    alt: "Microphone preamps for voice-over recording",
    fx: SERVICE_FX.preamps,
    ogImage: "/images/og/voice-over-studio-mumbai.jpg",
    ogImageAlt: "Microphone preamps in EVA Entertainment's voice-over studio",
    introHeading: "Native voices for every project",
    intro: [
      "We have a group of native professional artists who are familiar with their mother tongue. We provide voice talents i.e. male, female and child of all ages. Depending on your content, we shall provide you voice samples.",
      "The areas in which we offer voice over services include e-learning, movies, documentaries, IVR, TV Serials, corporate commercials, ad films etc. To fit into such needs, we have a team of voice over talents that are rich in diversity and our artists work on a wide array of recording modules.",
      "We offer our services in Multiple languages that include both Indian and international languages. Our voice over talent pool comprises of various voice over artists that are native speakers of their language and are true professionals.",
    ],
    highlights: [
      { title: "Native speakers", text: "Every voice artist records in their mother tongue, so pronunciation and tone sound right to local listeners." },
      { title: "Voices of all ages", text: "Male, female and child voices, with samples shared up front so you can choose the right one." },
      { title: "Indian and international languages", text: "One studio for all the language versions of your script." },
    ],
    idealFor: ["E-learning", "Movies and documentaries", "IVR and phone systems", "TV serials", "Corporate videos", "Ad films"],
    faqs: [
      { q: "Can I hear voice samples before booking?", a: "Yes. Tell us about your content and we will share samples from suitable voice artists." },
      { q: "Do you record voice-overs for IVR systems?", a: "Yes. We record IVR prompts as well as e-learning, documentary, corporate and advertising voice-overs." },
      { q: "Can you record the same script in several languages?", a: "Yes. We cast native artists for each language and deliver every version from the same studio." },
    ],
    related: ["dubbing-studio", "translation-services", "song-recording-studio"],
  },
  {
    slug: "foley-recording",
    name: "Foley Recording",
    icon: "icon-folleyrecording",
    h1: "Foley Recording & Sound Design in Mumbai",
    subtitle: "Foley, sound effects and sound design that bring every scene to life.",
    summary: "Foley and sound effects that bring every scene to life.",
    seo: {
      title: "Foley Recording & Sound Design Studio in Mumbai | EVA",
      description:
        "Foley recording, sound effects and sound design in Andheri, Mumbai for films, series, shows, events and special projects.",
    },
    image: SERVICE_MEDIA["foley-lead"].src,
    alt: SERVICE_MEDIA["foley-lead"].alt,
    fx: SERVICE_MEDIA["foley-lead"].fx,
    ogImage: "/images/og/foley-recording-mumbai.jpg",
    ogImageAlt: "Foley and sound design workstation at EVA Entertainment",
    introHeading: "What Foley and sound design add",
    intro: [
      "Sound design is commonly known as foley and sound effects. It is a process of specifying, acquiring, manipulating or generating audio elements. It employs a variety of disciplines including filmmaking, television, theatre, sound recording, live performance, sound art, and post-production.",
      "Sound design most commonly involves the manipulation of previously composed or recorded audio, such as sound effects and dialogue. In some instances, it may also involve the composition or manipulation of audio to create a desired effect or mood. A sound designer is one who practices the art of sound design.",
    ],
    extra: {
      heading: "Importance of Sound Design and Foley",
      paragraphs: [
        "Sound design is an essential part to many variety shows, events to even special projects. Not only does our team of sound designer spice up your project, but they also create great dynamics and ambiance to a good show. If you have been raking your brains on what went wrong, then it must be a professional sound fx director, sound designer or engineer that had been missing from your team.",
      ],
    },
    highlights: [
      { title: "Foley performed to picture", text: "Footsteps, cloth, props and movement recorded in sync with your edit." },
      { title: "Sound effects and design", text: "Effects created, edited and layered to set the mood of each scene." },
      { title: "Ready for the mix", text: "Foley and effects delivered on clean tracks for the final mix, or mixed in-house." },
    ],
    idealFor: ["Films and series", "Dubbed versions that need new effects tracks", "Variety shows", "Events", "Special projects", "Ads"],
    faqs: [
      { q: "What is Foley?", a: "Foley is the everyday sound of a scene, such as footsteps, clothing and props, performed and recorded in sync with the picture after filming." },
      { q: "Why does a dubbed film need Foley?", a: "When the original dialogue is replaced, effects that were recorded with it are often lost. Foley rebuilds them so the new version sounds complete." },
      { q: "Can you also mix the final soundtrack?", a: "Yes. We can deliver Foley as separate tracks or take the project through to a stereo or 5.1 mix." },
    ],
    related: ["5-1-mixing-studio", "dubbing-studio", "stock-music-library"],
  },
  {
    slug: "5-1-mixing-studio",
    name: "5.1 Mixing & Mastering",
    svg: "podcast",
    h1: "5.1 Mixing & Mastering Studio in Mumbai",
    subtitle: "From mono voice tracks to Dolby E 5.1 mixes for broadcast, film, corporate and multimedia.",
    summary: "From mono voice tracks to Dolby E 5.1 broadcast mixes.",
    seo: {
      title: "5.1 Mixing & Mastering Studio in Mumbai | EVA Entertainment",
      description:
        "5.1 surround and stereo mixing and mastering in Andheri, Mumbai for broadcast, film, corporate and multimedia, from IVR voice tracks to Dolby E.",
    },
    image: SERVICE_MEDIA["mix51-lead"].src,
    alt: SERVICE_MEDIA["mix51-lead"].alt,
    fx: SERVICE_MEDIA["mix51-lead"].fx,
    ogImage: "/images/og/5-1-mixing-studio-mumbai.jpg",
    ogImageAlt: "Studio patch bay used for 5.1 mixing at EVA Entertainment",
    introHeading: "Creative mixes, on budget and on time",
    intro: [
      "We create and mix audio for the broadcast, film, corporate and multimedia industries; the award-winning team behind EVA Entertainment is committed to delivering creative mixes on budget & on time.",
      "EVA Entertainment is known throughout Asia for its exceptional commitment in every project it undertakes, from mono voice tracks for IVR systems through to complex 5.1 mixes encoded with Dolby E for international broadcasters.",
    ],
    highlights: [
      { title: "5.1 surround and stereo", text: "Mixes for cinema, broadcast and online platforms." },
      { title: "Broadcast delivery", text: "Complex 5.1 mixes encoded with Dolby E for international broadcasters." },
      { title: "Any size of project", text: "From a single mono voice track for an IVR system to a full feature mix." },
    ],
    idealFor: ["Films", "Broadcast and TV", "Dubbed versions", "Corporate videos", "Multimedia and e-learning", "IVR systems"],
    faqs: [
      { q: "What is a 5.1 mix?", a: "A 5.1 mix spreads the soundtrack across five full-range speakers and one subwoofer, giving cinema and home-theatre audiences surround sound." },
      { q: "Do you also deliver stereo mixes?", a: "Yes. We deliver stereo and mono mixes as well as 5.1, depending on where the content will be shown." },
      { q: "Can you mix a dubbed version of my film?", a: "Yes. We mix the new dialogue with music and effects so the dubbed version sounds like the original." },
    ],
    related: ["foley-recording", "dubbing-studio", "song-recording-studio"],
  },
  {
    slug: "subtitling-services",
    name: "Subtitling",
    icon: "icon-translate1",
    h1: "Subtitling Services in Mumbai",
    subtitle: "Time-stamped subtitles written by native speakers, in the language your audience reads.",
    summary: "Time-stamped subtitles written by native speakers.",
    seo: {
      title: "Subtitling Services in Mumbai | Movie & Video Subtitles | EVA",
      description:
        "Time-stamped subtitling in Indian and international languages for movies, corporate videos, games and ads, written by native speakers. Based in Mumbai.",
    },
    image: "/images/services/equipment-05.avif",
    alt: "Subtitled video beside a subtitle file",
    fx: SERVICE_FX.subtitles,
    ogImage: "/images/og/subtitling-services-mumbai.jpg",
    ogImageAlt: "Subtitled video beside a subtitle file at EVA Entertainment",
    introHeading: "Subtitles that carry the meaning",
    intro: [
      "We offer International language subtitles for your English/Other language movies in the language of your requirement. If you require our services for subtitling projects with time stamping, we can provide you with a range of text services for corporate videos, movies, DVDs, games, advertisements and other media. So in case you are a professional/amateur filmmaker and require subtitling to be done for your movies/advertisement, you are welcome to contact us. By this way, you can increase potential viewers for your films.",
      "EVA ENTERTAINMENT uses only native speakers when it comes to creating subtitles for movies, so you can be sure that the depth of your film's dialogues has been conveyed. Translation and subtitling experts of EVA Entertainment can develop subtitles in English for foreign to international language movies and voice over. Our experience in providing subtitles for movies to several filmmakers has made us a leading provider of subtitles for movies.",
    ],
    highlights: [
      { title: "Native-speaker subtitlers", text: "Subtitles written by native speakers, so the depth of your dialogue comes across." },
      { title: "Time-stamped files", text: "Subtitles timed to your video and delivered ready to use." },
      { title: "Every kind of media", text: "Movies, corporate videos, DVDs, games, advertisements and more." },
    ],
    idealFor: ["Feature films and shorts", "Independent filmmakers", "Corporate videos", "Games", "Advertisements", "Festival submissions"],
    faqs: [
      { q: "Do you provide time-stamped subtitle files?", a: "Yes. Subtitles are timed to your video and delivered as files ready for your player or platform." },
      { q: "Who writes the subtitles?", a: "Native speakers of the target language, working with our translation team." },
      { q: "Can you subtitle a film into English?", a: "Yes. We create English subtitles for films in other languages, as well as subtitles in other languages for English films." },
    ],
    related: ["translation-services", "dubbing-studio", "voice-over-studio"],
  },
  {
    slug: "song-recording-studio",
    name: "Song Recording",
    icon: "icon-songrecording",
    h1: "Song Recording Studio in Mumbai",
    subtitle: "Record vocals and instruments in a quiet, private studio in Andheri (W).",
    summary: "Vocals and instruments in a quiet, private studio.",
    seo: {
      title: "Song Recording Studio in Mumbai (Andheri) | EVA Entertainment",
      description:
        "Song recording studio in Andheri, Mumbai for vocals and instruments, with mixing and mastering under one roof. Contact EVA Entertainment to plan your session.",
    },
    image: SERVICE_MEDIA["song-lead"].src,
    alt: SERVICE_MEDIA["song-lead"].alt,
    fx: SERVICE_MEDIA["song-lead"].fx,
    ogImage: "/images/og/song-recording-studio-mumbai.jpg",
    ogImageAlt: "Control room and mixing console at EVA Entertainment's recording studio",
    introHeading: "A studio built for recording",
    intro: [
      "The EVA Entertainment Recording Studio is the brainchild of Sound who understand that the best art comes from the best environment. Our studio is quiet, private and has every possible amenity you could desire.",
      "Record lead vocals, harmonies and instruments with an engineer at the console, then take your song through editing, mixing and mastering without changing studios.",
    ],
    highlights: [
      { title: "Quiet, private rooms", text: "A calm space to perform, away from distractions." },
      { title: "Engineer on every session", text: "A sound engineer at the console from setup to final take." },
      { title: "Recording to master", text: "Editing, mixing and mastering in the same studio." },
    ],
    idealFor: ["Singers and bands", "Film and album songs", "Jingles for ads", "Covers and demos", "Devotional music", "Podcasts and narration"],
    faqs: [
      { q: "How do I book a recording session?", a: "Use the Contact Us page to send your preferred date and time, and we will confirm availability." },
      { q: "Can you mix and master my song too?", a: "Yes. We can mix and master the song in the same studio after recording." },
      { q: "Do you record jingles for ads?", a: "Yes. We record jingles and songs for ad films as well as film and independent music." },
    ],
    related: ["5-1-mixing-studio", "voice-over-studio", "stock-music-library"],
  },
  {
    slug: "translation-services",
    name: "Translation",
    svg: "language",
    h1: "Script Translation Services in Mumbai",
    subtitle: "Script translation for dubbing, voice-over and subtitles in Indian and international languages.",
    summary: "Script translation for Indian and international languages.",
    seo: {
      title: "Script Translation Services in Mumbai | EVA Entertainment",
      description:
        "Script translation for dubbing, voice-over and subtitling in Indian and international languages by native translators. Based in Andheri, Mumbai.",
    },
    image: SERVICE_MEDIA["translation-lead"].src,
    alt: SERVICE_MEDIA["translation-lead"].alt,
    fx: SERVICE_MEDIA["translation-lead"].fx,
    ogImage: "/images/og/translation-services-mumbai.jpg",
    ogImageAlt: "Translated script and subtitle file at EVA Entertainment",
    introHeading: "Translation made for the screen",
    intro: [
      "A good dub or subtitle starts with a good script. Our native translators adapt your script into the target language so it sounds natural when spoken and reads clearly on screen.",
      "For dubbing, the translation is fitted to the length of each line and the actors' lip movements. For voice-over and subtitles, it is written for timing and reading speed, keeping the meaning and tone of the original.",
    ],
    highlights: [
      { title: "Native translators", text: "Scripts translated by native speakers of the target language." },
      { title: "Written for dubbing and subtitles", text: "Lines adapted for lip sync, timing and on-screen reading." },
      { title: "Part of one workflow", text: "The same team takes your translated script into recording or subtitling." },
    ],
    idealFor: ["Film and series scripts", "Dubbing projects", "Voice-over scripts", "Subtitles", "E-learning courses", "Corporate videos"],
    faqs: [
      { q: "Do you translate scripts for dubbing?", a: "Yes. Dubbing scripts are adapted to fit lip movement and line length, not just translated word for word." },
      { q: "Which languages do you translate?", a: "Indian and international languages, by native translators. Tell us your source and target languages when you contact us." },
      { q: "Can you record or subtitle the translated script?", a: "Yes. We can take the translation straight into dubbing, voice-over or subtitling." },
    ],
    related: ["subtitling-services", "dubbing-studio", "voice-over-studio"],
  },
  {
    slug: "stock-music-library",
    name: "Stock Library",
    icon: "icon-stocklibrary",
    h1: "Stock Music & Sound Library",
    subtitle: "Amplify your ideas and explore our curated stock music library.",
    summary: "A curated library of stock music for your projects.",
    seo: {
      title: "Stock Music & Sound Library for Films & Ads | EVA Entertainment",
      description:
        "Curated stock music and sound library from EVA Entertainment, Mumbai, for films, ads, corporate videos, e-learning and online content.",
    },
    image: SERVICE_MEDIA["stock-lead"].src,
    alt: SERVICE_MEDIA["stock-lead"].alt,
    fx: SERVICE_MEDIA["stock-lead"].fx,
    ogImage: "/images/og/stock-music-library.jpg",
    ogImageAlt: "Music workstation for EVA Entertainment's stock music library",
    introHeading: "Music for your next project",
    intro: [
      "Amplify your ideas and explore our curated stock music library. Find background music and sounds for films, ads, corporate videos, e-learning and online content.",
      "Tell us about your project and its mood, and we will suggest tracks from the library that fit. Music can also be edited to length and mixed with your voice-over in our studio.",
    ],
    highlights: [
      { title: "Curated tracks", text: "A library chosen for film, advertising and corporate work." },
      { title: "Help choosing", text: "Describe your project and we will suggest suitable tracks." },
      { title: "Edited to fit", text: "Tracks cut to length and mixed with your voice-over or dialogue." },
    ],
    idealFor: ["Ad films", "Corporate videos", "E-learning", "Documentaries", "YouTube and social videos", "Podcasts"],
    faqs: [
      { q: "How do I choose music from the library?", a: "Contact us with a short description of your project and its mood, and we will share suitable tracks." },
      { q: "Can you edit a track to my video's length?", a: "Yes. We can edit music to length and mix it with your voice-over or dialogue." },
      { q: "Do you also offer sound effects?", a: "Yes. Ask us about sound effects, or see our Foley recording service for custom effects." },
    ],
    related: ["song-recording-studio", "foley-recording", "5-1-mixing-studio"],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const servicePageUrl = (slug: ServiceSlug) => `${APP_BASE_URL}${serviceHref(slug)}`;

export const SERVICE_NAMES = Object.fromEntries(SERVICES.map((s) => [s.slug, s.name])) as Record<
  ServiceSlug,
  string
>;
