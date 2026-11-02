/**
 * Static site media (images, video) served from the public Cloudflare R2 bucket "eva-media"
 * at NEXT_PUBLIC_MEDIA_BASE_URL (https://media.evaentertainment.in).
 *
 * media("/images/careers/careers-voice.avif") returns the R2 URL when that folder's group is in
 * MIGRATED_GROUPS, else the local /public path. Rollback for a group = remove it from the list
 * (only while its files are still in public/).
 *
 * R2 layout: eva/pages/<slug>/..., eva/shared/<group>/..., eva/og/<file>.
 */
const FOLDERS: Record<string, { group: string; prefix: string }> = {
  "/images/careers/": { group: "careers", prefix: "eva/pages/careers/" },
  "/images/partners/": { group: "careers", prefix: "eva/pages/careers/" },
  "/images/about/": { group: "about-us", prefix: "eva/pages/about-us/" },
  "/images/clients/": { group: "clients", prefix: "eva/shared/clients/" },
  "/images/equipment/": { group: "studio-equipment", prefix: "eva/pages/studio-equipment/" },
  "/images/og/": { group: "og", prefix: "eva/og/" },
};

/** Page groups whose media is served from R2. */
export const MIGRATED_GROUPS: readonly string[] = ["careers", "about-us", "clients", "studio-equipment", "og"];

const DEFAULT_BASE = "https://media.evaentertainment.in";

export const mediaBaseUrl = () => (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || DEFAULT_BASE).replace(/\/$/, "");

export function media(localPath: string): string {
  for (const [folder, { group, prefix }] of Object.entries(FOLDERS)) {
    if (localPath.startsWith(folder)) {
      if (!MIGRATED_GROUPS.includes(group)) return localPath;
      return `${mediaBaseUrl()}/${prefix}${localPath.slice(folder.length)}`;
    }
  }
  return localPath;
}
