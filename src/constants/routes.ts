export const Routes = {
  HOME: "/",
  ABOUT: "/about",
  SERVICES: "/services",
  PROJECTS: "/projects",
  EQUIPMENT: "/equipment",
  CONTACT: "/contact",
  BOOK: "/book",
  THANK_YOU: "/thank-you",
  PRIVACY: "/privacy-policy",
  TERMS: "/terms-conditions",
} as const;

export type AppRoute = (typeof Routes)[keyof typeof Routes];

/** Primary nav links (Contact is a separate header CTA). */
export const NAV_ITEMS: { label: string; href: AppRoute }[] = [
  { label: "HOME", href: Routes.HOME },
  { label: "ABOUT", href: Routes.ABOUT },
  { label: "SERVICES", href: Routes.SERVICES },
  // { label: "OUR PROJECTS", href: Routes.PROJECTS },
  { label: "OUR EQUIPMENT", href: Routes.EQUIPMENT },
];
