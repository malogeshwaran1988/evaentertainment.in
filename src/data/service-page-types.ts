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
  cta: { heading: string; text: string; label: string };
};
