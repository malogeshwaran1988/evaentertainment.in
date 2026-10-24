/** Rich copy for the service pages. Inline text supports **bold**, [label](/path) and the {years} token. */
export type RichBlock =
  | { t: "p"; text: string }
  | { t: "h3"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] };

/** "live:<equipment id>" uses a LivePhoto from EQUIPMENT_ITEMS; other keys map to SERVICE_MEDIA. */
export type ServiceMediaKey = string;

export type ServicePageSection = {
  heading: string;
  icon: string;
  blocks: RichBlock[];
  media?: ServiceMediaKey;
  /** Visual language cards (native-script glyphs). Rendered after the heading, before `blocks`. */
  languages?: LanguageCardsData;
};

export type LanguageCode = "te" | "ta" | "ml" | "kn" | "hi" | "en";

export type LanguageCardsData = {
  groups: { label: string; codes: LanguageCode[]; main?: LanguageCode }[];
  caption?: string;
};

export type ServicePageContent = {
  seoTitle: string;
  description: string;
  h1: string;
  serviceType: string;
  languages: string[];
  leadHeading: string;
  lead: string[];
  sections: ServicePageSection[];
  faqs: { q: string; a: string }[];
  /** Project slugs for the poster strip; shown only when those projects are published. */
  posterStrip?: string[];
  cta: {
    heading: string;
    text: string;
    label: string;
    /** Second action from the PDF (e.g. "Book a studio session"), links to the contact page. */
    secondary?: string;
    /** Contact lines exactly as the PDF lists them. */
    contact: { label: string; value: string; href?: string }[];
  };
};
