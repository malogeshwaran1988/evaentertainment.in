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
  CAREERS: "/careers",
  /** Per-project detail: `/projects/<slug>`. */
  project: (slug: string) => `/projects/${slug}` as const,
  /** Blog post: `/blog/<slug>`. */
  blogPost: (slug: string) => `/blog/${slug}` as const,
} as const;

export type AppRoute = (typeof Routes)[keyof typeof Routes];

/** One page per service, at the site root (keyword slugs; old "-mumbai" URLs 301 here). */
export const SERVICE_SLUGS = [
  "dubbing-studio",
  "hollywood-dubbing-indian-languages",
  "pan-india-film-dubbing",
  "regional-film-dubbing",
  "voice-over-studio",
  "foley-recording",
  "5-1-mixing-studio",
  "subtitling-services",
  "song-recording-studio",
  "translation-services",
  "stock-music-library",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

/** Pages that never had a "-mumbai" URL, so they get no legacy redirect. */
const NO_LEGACY_SLUGS = new Set<ServiceSlug>([
  "stock-music-library",
  "hollywood-dubbing-indian-languages",
  "pan-india-film-dubbing",
  "regional-film-dubbing",
]);

export const serviceHref = (slug: ServiceSlug) => `/${slug}`;

/** Services hub: the home page lists every service in its "What We Do" section (no #fragment URLs). */
export const WHAT_WE_DO_HREF = "/";

/** Old URLs, permanently redirected to their replacements (see next.config.ts). */
export const LEGACY_REDIRECTS: { from: string; to: string; statusCode?: 301 }[] = [
  // Old static-site home URL (GSC 404): one 308 hop to the real home page.
  { from: "/index.html", to: Routes.HOME },
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
  ...SERVICE_SLUGS.filter((slug) => !NO_LEGACY_SLUGS.has(slug)).map((slug) => ({
    from: `/${slug}-mumbai`,
    to: serviceHref(slug),
    statusCode: 301 as const,
  })),
  // Next matches redirect sources case-insensitively, so these also cover /OURCLIENTS, /Our-Clients …
  // (never list a casing of /clients itself: that would loop).
  // Content merges (Oct 2026 uniqueness audit): one 308 hop each, never chained.
  { from: "/indian-languages", to: "/dubbing" },
  { from: "/dubbing/english-to-hindi", to: "/hollywood-dubbing-indian-languages" },
  ...["/our-clients", "/ourclients"].map(
    (from) => ({ from, to: Routes.CLIENTS, statusCode: 301 as const }),
  ),
];


export type NavLinkChild = {
  label: string;
  href: string;
  /** Nested flyout under this row (e.g. segment pages under Lip-Sync Dubbing). */
  children?: readonly NavLinkChild[];
};

export type NavItem = {
  label: string;
  href: string;
  /** Service slug children (resolved to names via SERVICE_NAMES). */
  children?: readonly ServiceSlug[];
  /** Plain label+href children (Languages; Services may be rebuilt with nested segments). */
  links?: readonly NavLinkChild[];
};

/** Services dropdown rows. Hollywood distributors market page stays routable but is omitted here so it does not duplicate the Hollywood segment under Lip-Sync Dubbing. */
export const NAV_SERVICE_SLUGS: readonly ServiceSlug[] = SERVICE_SLUGS.filter(
  (slug) => slug !== "hollywood-dubbing-indian-languages",
);

/** Nav links for segment pages that resolve on the live admin store (non-empty match).
 * Bollywood stays in SEGMENT_PAGES + sitemap (zero-hide) but out of the menu until Hindi-from credits exist. */
export const SEGMENT_NAV: readonly NavLinkChild[] = [
  { label: "Hollywood", href: "/dubbing-studio/hollywood" },
  { label: "Kollywood", href: "/dubbing-studio/kollywood" },
];

/** Nav seed for language pages; layout overrides with liveLanguageLinks (zero-hide). */
export const LANGUAGE_NAV: readonly NavLinkChild[] = [
  { label: "Hindi", href: "/dubbing-studio/hindi" },
  { label: "Tamil", href: "/dubbing-studio/tamil" },
];

/** Primary nav links (Contact is a separate header CTA). */
export const NAV_ITEMS: NavItem[] = [
  { label: "HOME", href: Routes.HOME },
  { label: "ABOUT", href: Routes.ABOUT },
  // Parent links to the flagship service page: "/" would duplicate HOME (React key clash) and # URLs are not allowed.
  // Live segment pages nest under Lip-Sync Dubbing in Header (no top-level SEGMENTS menu).
  { label: "SERVICES", href: serviceHref("dubbing-studio"), children: NAV_SERVICE_SLUGS },
  // Languages stay top-level. Live links override in Header.
  { label: "LANGUAGES", href: serviceHref("dubbing-studio"), links: LANGUAGE_NAV },
  { label: "OUR PROJECTS", href: Routes.PROJECTS },
  { label: "OUR CLIENTS", href: Routes.CLIENTS },
  { label: "EQUIPMENT", href: Routes.EQUIPMENT },
  { label: "BLOG", href: Routes.BLOG },
  { label: "CAREERS", href: Routes.CAREERS },
];
