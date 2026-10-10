export const Routes = {
  HOME: "/",
  ABOUT: "/about-us",
  SERVICES: "/services",
  PROJECTS: "/our-projects",
  EQUIPMENT: "/studio-equipment",
  CONTACT: "/contact-us",
  BOOK: "/book-studio-session",
  THANK_YOU: "/thank-you",
  PRIVACY: "/privacy-policy",
  TERMS: "/terms-conditions",
} as const;

export type AppRoute = (typeof Routes)[keyof typeof Routes];

/** One page per service, at the site root (keyword + city slugs). */
export const SERVICE_SLUGS = [
  "dubbing-studio-mumbai",
  "voice-over-studio-mumbai",
  "foley-recording-mumbai",
  "5-1-mixing-studio-mumbai",
  "subtitling-services-mumbai",
  "song-recording-studio-mumbai",
  "translation-services-mumbai",
  "stock-music-library",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const serviceHref = (slug: ServiceSlug) => `/${slug}`;

/** Old URLs, permanently redirected to their replacements (see next.config.ts). */
export const LEGACY_REDIRECTS: { from: string; to: string }[] = [
  { from: "/about", to: Routes.ABOUT },
  { from: "/contact", to: Routes.CONTACT },
  { from: "/projects", to: Routes.PROJECTS },
  { from: "/equipment", to: Routes.EQUIPMENT },
  { from: "/book", to: Routes.BOOK },
  { from: "/privacy", to: Routes.PRIVACY },
  { from: "/terms", to: Routes.TERMS },
];

/** Old `/services#<id>` anchors, which can only be redirected in the browser. */
export const LEGACY_SERVICE_HASHES: Record<string, ServiceSlug> = {
  "Lip-Sync": "dubbing-studio-mumbai",
  Folley: "foley-recording-mumbai",
  mixing: "5-1-mixing-studio-mumbai",
  Subtitling: "subtitling-services-mumbai",
};

/** Primary nav links (Contact is a separate header CTA). */
export const NAV_ITEMS: { label: string; href: AppRoute }[] = [
  { label: "HOME", href: Routes.HOME },
  { label: "ABOUT", href: Routes.ABOUT },
  { label: "SERVICES", href: Routes.SERVICES },
  { label: "OUR PROJECTS", href: Routes.PROJECTS },
  { label: "EQUIPMENT", href: Routes.EQUIPMENT },
];
