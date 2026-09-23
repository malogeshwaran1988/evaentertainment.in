export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "h3"; text: string };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};
