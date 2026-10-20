export const Routes = {
  HOME: "/",
  ABOUT: "/about-us",
  PROJECTS: "/our-projects",
  EQUIPMENT: "/studio-equipment",
  CONTACT: "/contact-us",
  THANK_YOU: "/thank-you",
  PRIVACY: "/privacy-policy",
  TERMS: "/terms-conditions",
  BLOG: "/blog",
  CLIENTS: "/clients",
  /** Per-project detail: `/projects/<slug>`. */
  project: (slug: string) => `/projects/${slug}` as const,
  /** Blog post: `/blog/<slug>`. */
  blogPost: (slug: string) => `/blog/${slug}` as const,
} as const;

export type AppRoute = (typeof Routes)[keyof typeof Routes];

/** One page per service, at the site root (keyword slugs; old "-mumbai" URLs 301 here). */
export const SERVICE_SLUGS = [
  "dubbing-studio",
  "voice-over-studio",
  "foley-recording",
  "5-1-mixing-studio",
  "subtitling-services",
  "song-recording-studio",
  "translation-services",
  "stock-music-library",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const serviceHref = (slug: ServiceSlug) => `/${slug}`;

/** Services hub: the home page lists every service in its "What We Do" section (no #fragment URLs). */
export const WHAT_WE_DO_HREF = "/";

/** Old URLs, permanently redirected to their replacements (see next.config.ts). */
export const LEGACY_REDIRECTS: { from: string; to: string; statusCode?: 301 }[] = [
  { from: "/about", to: Routes.ABOUT },
  { from: "/contact", to: Routes.CONTACT },
  { from: "/projects", to: Routes.PROJECTS },
  { from: "/equipment", to: Routes.EQUIPMENT },
  // Studio booking page removed (Oct 2026): enquiries go through the contact form.
  ...["/book", "/book-studio-session"].map(
    (from) => ({ from, to: Routes.CONTACT, statusCode: 301 as const }),
  ),
  { from: "/privacy", to: Routes.PRIVACY },
  { from: "/terms", to: Routes.TERMS },
  { from: "/services", to: WHAT_WE_DO_HREF },
  // Service pages dropped the "-mumbai" suffix (Oct 2026); "Mumbai" stays in titles and copy.
  ...SERVICE_SLUGS.filter((slug) => slug !== "stock-music-library").map((slug) => ({
    from: `/${slug}-mumbai`,
    to: serviceHref(slug),
    statusCode: 301 as const,
  })),
  // Next matches redirect sources case-insensitively, so these also cover /OURCLIENTS, /Our-Clients …
  // (never list a casing of /clients itself: that would loop).
  ...["/our-clients", "/ourclients"].map(
    (from) => ({ from, to: Routes.CLIENTS, statusCode: 301 as const }),
  ),
];


export type NavItem = { label: string; href: string; children?: readonly ServiceSlug[] };

/** Primary nav links (Contact is a separate header CTA). */
export const NAV_ITEMS: NavItem[] = [
  { label: "HOME", href: Routes.HOME },
  { label: "ABOUT", href: Routes.ABOUT },
  // Parent links to the flagship service page: "/" would duplicate HOME (React key clash) and # URLs are not allowed.
  { label: "SERVICES", href: serviceHref("dubbing-studio"), children: SERVICE_SLUGS },
  { label: "OUR PROJECTS", href: Routes.PROJECTS },
  { label: "OUR CLIENTS", href: Routes.CLIENTS },
  { label: "EQUIPMENT", href: Routes.EQUIPMENT },
  { label: "BLOG", href: Routes.BLOG },
];
