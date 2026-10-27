/* Service entries for the regional, pan-India and Hollywood market pages (routes, menu, cards and contact form). */
import { SERVICE_MEDIA } from "@@/data/service-media";
import type { Service } from "@@/data/services";

const media = (key: string) => {
  const m = SERVICE_MEDIA[key];
  return { image: m.src, alt: m.alt, fx: m.fx };
};

export const MARKET_SERVICES: Service[] = [
  {
    slug: "hollywood-dubbing-indian-languages",
    name: "Hollywood Dubbing",
    icon: "icon-play-circle",
    h1: "Hollywood Dubbing for Distributors and Studios",
    subtitle: "One professional voice artist in English and all 10 of India's top languages for international films and series.",
    summary: "Hollywood dubbing for foreign distributors and studios.",
    seo: {
      title: "Hollywood Dubbing for Distributors | Indian Languages | EVA",
      description:
        "Hollywood dubbing for foreign distributors and studios. One English voice artist carries each character into Hindi Tamil Telugu and 7 more Indian languages. Get a quote.",
    },
    ...media("hollywood-lead"),
    ogImage: "/images/og/hollywood-dubbing-indian-languages.jpg",
    ogImageAlt: "Sound engineer at EVA Entertainment watching an English film scene while a voice artist dubs it in the booth",
    introHeading: "One voice from English to every Indian screen",
    intro: [],
    highlights: [],
    idealFor: ["Hollywood and international studios", "Distributors", "OTT platforms", "Producers in the US, UK and UAE"],
    faqs: [],
    related: ["pan-india-film-dubbing", "dubbing-studio", "voice-over-studio"],
  },
  {
    slug: "pan-india-film-dubbing",
    name: "Pan-India Dubbing",
    svg: "film",
    h1: "Pan-India Film Dubbing for Multi-Language Releases",
    subtitle: "One studio for every language version of your release, from Hindi to Malayalam.",
    summary: "One film released in up to 10 Indian languages.",
    seo: {
      title: "Pan-India Film Dubbing in 10 Languages | EVA Studio",
      description:
        "Pan-India film dubbing for multi-language releases. One studio dubs your film into Hindi, Telugu, Tamil and 7 more languages with matching quality. Get a quote.",
    },
    ...media("panindia-lead"),
    ogImage: "/images/og/pan-india-film-dubbing.jpg",
    ogImageAlt: "Release planning board for a multi-language film dub at EVA Entertainment",
    introHeading: "One release, ten languages, one standard",
    intro: [],
    highlights: [],
    idealFor: ["Producers", "Distributors", "OTT platforms"],
    faqs: [],
    related: ["regional-film-dubbing", "hollywood-dubbing-indian-languages", "5-1-mixing-studio"],
  },
  {
    slug: "regional-film-dubbing",
    name: "Regional Film Dubbing",
    svg: "video",
    h1: "Regional Film Dubbing: South Indian Films in Hindi",
    subtitle: "Telugu, Tamil, Malayalam and Kannada films dubbed into Hindi and other Indian languages.",
    summary: "South Indian films dubbed into Hindi and more.",
    seo: {
      title: "Regional Film Dubbing: South Indian Films to Hindi | EVA",
      description:
        "Regional film dubbing studio in Mumbai. Telugu, Tamil, Malayalam and Kannada films dubbed into Hindi and other Indian languages with lip sync. Get a quote.",
    },
    ...media("regional-lead"),
    ogImage: "/images/og/regional-film-dubbing.jpg",
    ogImageAlt: "Dubbing director and voice artist watching a South Indian film scene together at EVA Entertainment",
    introHeading: "Kollywood and Tollywood films for every Indian audience",
    intro: [],
    highlights: [],
    idealFor: ["Producers", "Distributors", "OTT platforms", "Satellite channels"],
    faqs: [],
    related: ["pan-india-film-dubbing", "dubbing-studio", "translation-services"],
  },
];
