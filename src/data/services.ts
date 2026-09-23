import { APP_BASE_URL, DEFAULT_OG_IMAGE } from "@@/constants/constants";

export const SERVICES_PAGE_URL = `${APP_BASE_URL}/services`;
export const SERVICES_OG_IMAGE = DEFAULT_OG_IMAGE;

export const SERVICES_SEO = {
  title: "Services | Lip-Sync Dubbing, Voice Over & Subtitling | EVA Entertainment",
  description:
    "Explore EVA Entertainment services: lip-sync dubbing, voice-over, Foley recording, 5.1 mixing, and subtitling for film, TV, e-learning, and multimedia.",
};

export type ServiceBlock = {
  id?: string;
  title: string;
  image: string;
  dark?: boolean;
  paragraphs: string[];
  extraHeading?: string;
};

export const SERVICE_BLOCKS: ServiceBlock[] = [
  {
    id: "Lip-Sync",
    title: "Lip-Sync Dubbing",
    image: "/images/services/equipment-01.jpg",
    paragraphs: [
      "We offer to dub in various languages for movies, Fiction & Non-Fictions, ad films, documentaries, E-learning etc. Normally, a professional dubbing team consists of Sound Eng, Dubbing Artists, Dubbing Directors, Scriptwriter, Artist coordinator, and Translator. The main idea behind Dubbing is to ensure that the voice behind the video is in synchronization with the display.",
      "We offer complete one-stop dubbing solutions. You can simply hand over your video in the source language to us and we shall provide you a final finished video in the target language of your choice.",
      "Our Dubbing team works in complete coordination to yield a finished output video which looks natural. We provide you dubbed videos with complete lip sync.",
    ],
  },
  {
    title: "Voice Over",
    image: "/images/services/equipment-02.jpg",
    dark: true,
    paragraphs: [
      "We have a group of native professional artists who are familiar with their mother tongue. We provide voice talents i.e. male, female and child of all ages. Depending on your content, we shall provide you voice samples.",
      "The areas in which we offer voice over services include e-learning, movies, documentaries, IVR, TV Serials, corporate commercials, ad films etc. To fit into such needs, we have a team of voice over talents that are rich in diversity and our artists work on a wide array of recording modules.",
      "We offer our services in Multiple languages that include both Indian and international languages. Our voice over talent pool comprises of various voice over artists that are native speakers of their language and are true professionals.",
    ],
  },
  {
    id: "Folley",
    title: "Folley Recording",
    image: "/images/services/equipment-03.jpg",
    paragraphs: [
      "Sound design is commonly known as foley and sound effects. It is a process of specifying, acquiring, manipulating or generating audio elements. It employs a variety of disciplines including filmmaking, television, theatre, sound recording, live performance, sound art, and post-production.",
      "Sound design most commonly involves the manipulation of previously composed or recorded audio, such as sound effects and dialogue. In some instances, it may also involve the composition or manipulation of audio to create a desired effect or mood. A sound designer is one who practices the art of sound design.",
    ],
    extraHeading: "Importance of Sound Design and Foley",
  },
  {
    id: "mixing",
    title: "5.1 Mixing",
    image: "/images/services/equipment-04.jpg",
    dark: true,
    paragraphs: [
      "We create and mix audio for the broadcast, film, corporate and multimedia industries; the award-winning team behind EVA Entertainment is committed to delivering creative mixes on budget & on time.",
      "EVA Entertainment is known throughout Asia for its exceptional commitment in every project it undertakes, from mono voice tracks for IVR systems through to complex 5.1 mixes encoded with Dolby E for international broadcasters.",
    ],
  },
  {
    id: "Subtitling",
    title: "Subtitling",
    image: "/images/services/equipment-05.jpg",
    paragraphs: [
      "We offer International language subtitles for your English/Other language movies in the language of your requirement. If you require our services for subtitling projects with time stamping, we can provide you with a range of text services for corporate videos, movies, DVDs, games, advertisements and other media. So in case you are a professional/amateur filmmaker and require subtitling to be done for your movies/advertisement, you are welcome to contact us. By this way, you can increase potential viewers for your films.",
      "EVA ENTERTAINMENT uses only native speakers when it comes to creating subtitles for movies, so you can be sure that the depth of your film's dialogues has been conveyed. Translation and subtitling experts of EVA Entertainment can develop subtitles in English for foreign to international language movies and voice over. Our experience in providing subtitles for movies to several filmmakers has made us a leading provider of subtitles for movies.",
    ],
  },
];

/** Extra Foley paragraph after the heading (matches original page) */
export const FOLLEY_EXTRA_PARAGRAPH =
  "Sound design is an essential part to many variety shows, events to even special projects. Not only does our team of sound designer spice up your project, but they also create great dynamics and ambiance to a good show. If you have been raking your brains on what went wrong, then it must be a professional sound fx director, sound designer or engineer that had been missing from your team.";
