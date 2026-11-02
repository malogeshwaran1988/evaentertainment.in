/**
 * Static site media (images, video) served from the public Cloudflare R2 bucket "eva-projects"
 * at NEXT_PUBLIC_MEDIA_BASE_URL (https://cdn.evaentertainment.in).
 *
 * media("/images/careers/careers-voice.avif") returns the R2 URL when that folder's group is in
 * MIGRATED_GROUPS, else the local /public path. Rollback for a group = remove it from the list
 * (only while its files are still in public/).
 *
 * R2 layout: eva/<slug>/..., eva/shared/<group>/..., eva/shared/og/<file>.
 */
const FOLDERS: Record<string, { group: string; prefix: string }> = {
  "/images/careers/": { group: "careers", prefix: "eva/careers/" },
  "/images/partners/": { group: "careers", prefix: "eva/careers/" },
  "/images/about/": { group: "about-us", prefix: "eva/about-us/" },
  "/images/clients/": { group: "clients", prefix: "eva/shared/clients/" },
  "/images/equipment/": { group: "studio-equipment", prefix: "eva/studio-equipment/" },
  "/images/og/": { group: "og", prefix: "eva/shared/og/" },
};

/** Page groups whose media is served from R2. */
export const MIGRATED_GROUPS: readonly string[] = ["careers", "about-us", "clients", "studio-equipment", "og"];

const DEFAULT_BASE = "https://cdn.evaentertainment.in";

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
