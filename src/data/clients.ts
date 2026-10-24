/** Shared by the admin and the public site, so no server-only imports here. */

/** "wide" wordmarks (default), "square" icons, "tall" stacked marks: sizes the logo box for even optical weight. */
export type ClientShape = "square" | "tall";

export type Client = {
  id: string;
  name: string;
  /** A /public path for the original logos, or "/images/client-logos/<file>.avif" for uploads. */
  logo: string;
  width: number;
  height: number;
  shape?: ClientShape;
  createdAt?: string;
  updatedAt?: string;
};

/** Just what a project view needs. */
export type ProjectClient = Pick<Client, "name" | "logo" | "width" | "height">;

export const CLIENT_NAME_MAX = 120;
export const CLIENT_LOGO_URL_PREFIX = "/images/client-logos/";
export const CLIENT_LOGO_FILE_PATTERN = /^client-[a-z0-9-]+\.avif$/;
/** Value the project form's Client select sends for "no client". */
export const NO_CLIENT = "none";

/** Width / height: below this a logo is "tall", up to the upper bound "square", wider is a wordmark. */
export function clientShapeFor(width: number, height: number): ClientShape | undefined {
  const ratio = width / Math.max(1, height);
  if (ratio < 0.95) return "tall";
  if (ratio <= 1.6) return "square";
  return undefined;
}

/**
 * The logos the /clients page showed before clients moved to the admin. The store starts from this
 * list (the first admin save writes it to Blob) and the page falls back to it if the store is empty
 * or can't be read. Logos live in /public/images/clients (AVIF, max 600px wide).
 */
export const CLIENTS_SEED: Client[] = [
  { id: "jiocinema", name: "JioCinema", logo: "/images/clients/jiocinema.avif", width: 300, height: 300, shape: "square" },
  { id: "angel-tv", name: "Angel TV", logo: "/images/clients/angel.avif", width: 346, height: 300, shape: "square" },
  { id: "etv-bal-bharat", name: "ETV Bal Bharat", logo: "/images/clients/etv-bal-bharat.avif", width: 454, height: 300, shape: "square" },
  { id: "sony-pictures-networks", name: "Sony Pictures Networks", logo: "/images/clients/sony-pictures-networks.avif", width: 261, height: 300, shape: "tall" },
  { id: "viacom18", name: "Viacom18", logo: "/images/clients/viacom18.avif", width: 600, height: 115 },
  { id: "mx-gold", name: "MX Player MX Gold", logo: "/images/clients/mx-gold.avif", width: 600, height: 147 },
  { id: "storytel", name: "Storytel", logo: "/images/clients/storytel.avif", width: 492, height: 300, shape: "square" },
  { id: "jumbaya", name: "Jumbaya", logo: "/images/clients/jumbaya.avif", width: 600, height: 195 },
];

export function toProjectClient(client: Client | undefined | null): ProjectClient | undefined {
  return client ? { name: client.name, logo: client.logo, width: client.width, height: client.height } : undefined;
}
