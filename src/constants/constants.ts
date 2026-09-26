export const APP_BASE_URL = "https://evaentertainment.in";
export const SITE_NAME = "EVA Entertainment";
export const DEFAULT_OG_IMAGE = "/images/home/slide-1.jpg";
export const DEFAULT_OG_IMAGE_ALT = "EVA Entertainment dubbing and recording studio";
export const LOGO_ALT = "EVA Entertainment logo";

/** Microsoft Clarity project ID (public; it appears in the script URL). Env var overrides it. */
export const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "yoam4umvyi";

export const CONTACT = {
  addressLines: [
    "No.228, 2nd Floor,",
    "Mohid Heights,Near RTO Office,",
    "Opp Four Bungalows,",
    "Andheri(W) Mumbai-400053.",
  ],
  person: "Felix Anthony",
  whatsapp: "+918652063177",
  whatsappDisplay: "+91 8652063177",
  landline: "+22 49721957",
  bookingEmail: "felixanthony@evaentertainment.in",
  infoEmail: "info@evaentertainment.in",
} as const;

export const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/felix-anthony-5b1114173/",
    iconClass: "icon icon-linkedin-logo",
  },
  {
    label: "IMDb",
    href: "https://www.imdb.com/name/nm9896831/",
    iconClass: "fab fa-imdb",
  },
] as const;
