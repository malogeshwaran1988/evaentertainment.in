import { APP_BASE_URL, SITE_NAME } from "@@/constants/constants";
import {
  POSTER_URL_PREFIX,
  PROJECT_YEAR_ONGOING,
  projectLanguageLine,
  projectYearLabel,
  type Project,
  type ProjectLanguage,
} from "@@/data/projects";

const BRAND_SLUG = "eva-entertainment";
const DUBBING_BRAND_SLUG = "dubbing-eva-entertainment";
const SEO_ALT_SUFFIX = "dubbing by EVA Entertainment";

export const EVA_ORG_ID = `${APP_BASE_URL}/#organization`;

/** Lowercase ASCII slug; non-alphanumerics become hyphens. */
export function slugifyAscii(text: string, maxLen = 80): string {
  return text
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLen)
    .replace(/-+$/, "");
}

export function targetsSlug(to: readonly string[]): string {
  return to.map((lang) => slugifyAscii(lang)).filter(Boolean).join("-") || "dubbed";
}

export function projectHref(slug: string) {
  return `/projects/${slug}`;
}

/** ALT or title used as the human-facing name stem for files. */
export function posterNameStem(input: { title: string; posterAlt?: string }) {
  return input.posterAlt?.trim() || input.title;
}

/**
 * Branded poster basename without extension:
 * `<stem>-<targets>-dubbing-eva-entertainment`
 * Skips re-appending brand segments if already present.
 */
export function posterFileBaseName(input: {
  title: string;
  posterAlt?: string;
  to: readonly ProjectLanguage[];
}): string {
  const stem = slugifyAscii(posterNameStem(input)) || "poster";
  const targets = targetsSlug(input.to);
  let base = stem;
  if (!base.includes(targets) && targets) {
    base = `${base}-${targets}`;
  }
  if (base.includes(DUBBING_BRAND_SLUG) || base.endsWith(`-${BRAND_SLUG}`)) {
    if (!/-dubbing(?:-|$)/.test(base) && !base.includes("dubbing")) {
      base = base.replace(new RegExp(`-${BRAND_SLUG}$`), `-dubbing-${BRAND_SLUG}`);
    }
    return base.replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  if (base.endsWith("-dubbing")) {
    return `${base}-${BRAND_SLUG}`;
  }
  return `${base}-dubbing-${BRAND_SLUG}`;
}

export function projectPageSlugBase(input: {
  title: string;
  to: readonly ProjectLanguage[];
}): string {
  const title = slugifyAscii(input.title) || "project";
  const targets = targetsSlug(input.to);
  const base = `${title}-${targets}-dubbing`;
  return base.replace(/-+/g, "-").replace(/^-|-$/g, "");
}

/** Append -2, -3, … when `desired` is already taken (exact match). */
export function uniqueSlug(
  desired: string,
  taken: ReadonlySet<string>,
): string {
  const root = desired.replace(/-+$/, "") || "item";
  if (!taken.has(root)) return root;
  for (let n = 2; n < 1000; n++) {
    const candidate = `${root}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${root}-${Date.now().toString(36)}`;
}

/** Basenames (no extension) of uploaded posters for other projects. */
export function takenPosterBases(
  projects: readonly Pick<Project, "id" | "poster">[],
  excludeProjectId?: string,
): Set<string> {
  const taken = new Set<string>();
  for (const p of projects) {
    if (excludeProjectId && p.id === excludeProjectId) continue;
    if (!p.poster?.startsWith(POSTER_URL_PREFIX)) continue;
    const file = p.poster.slice(POSTER_URL_PREFIX.length).split("?")[0];
    const base = file.replace(/\.(jpg|png|webp|avif)$/i, "");
    if (base) taken.add(base);
  }
  return taken;
}

export function uniquePosterBaseName(
  desired: string,
  projects: readonly Pick<Project, "id" | "poster">[],
  excludeProjectId?: string,
): string {
  return uniqueSlug(desired, takenPosterBases(projects, excludeProjectId));
}

export function takenProjectSlugs(
  projects: readonly Pick<Project, "id" | "slug">[],
  excludeProjectId?: string,
): Set<string> {
  const taken = new Set<string>();
  for (const p of projects) {
    if (excludeProjectId && p.id === excludeProjectId) continue;
    if (p.slug) taken.add(p.slug);
  }
  return taken;
}

export function uniqueProjectSlug(
  input: { title: string; to: readonly ProjectLanguage[] },
  projects: readonly Pick<Project, "id" | "slug">[],
  excludeProjectId?: string,
): string {
  return uniqueSlug(
    projectPageSlugBase(input),
    takenProjectSlugs(projects, excludeProjectId),
  );
}

function targetsPhrase(to: readonly string[]) {
  if (to.length <= 1) return to.join("") || "target languages";
  return `${to.slice(0, -1).join(", ")} and ${to[to.length - 1]}`;
}

/** Stored ALT or default; plus SEO suffix unless already present. */
export function projectSeoAlt(
  project: Pick<Project, "title" | "posterAlt" | "from" | "to">,
): string {
  const base = project.posterAlt?.trim() || `${project.title} movie poster`;
  if (new RegExp(SEO_ALT_SUFFIX, "i").test(base)) return base;
  const line = projectLanguageLine(project);
  return `${base} – ${line} ${SEO_ALT_SUFFIX}`;
}

/** @deprecated Use projectSeoAlt — kept as the public render helper name. */
export function projectPosterAlt(
  project: Pick<Project, "title" | "posterAlt" | "from" | "to">,
) {
  return projectSeoAlt(project);
}

export function projectSeoTitle(
  project: Pick<Project, "title" | "from" | "to" | "year">,
): string {
  const targets = targetsPhrase(project.to);
  const yearPart =
    project.year && project.year !== PROJECT_YEAR_ONGOING
      ? ` (${project.year})`
      : project.year === PROJECT_YEAR_ONGOING
        ? " (Ongoing)"
        : "";
  return `${project.title} ${project.from} to ${targets} Dubbing${yearPart} | ${SITE_NAME}`;
}

export function projectSeoDescription(
  project: Pick<Project, "title" | "from" | "to">,
): string {
  const targets = targetsPhrase(project.to);
  return `${project.title} was dubbed from ${project.from} into ${targets} by ${SITE_NAME}, a dubbing and voice-over studio in Andheri, Mumbai.`;
}

export function projectDubbingLine(
  project: Pick<Project, "from" | "to" | "category" | "year">,
): string {
  const targets = project.to.join(", ");
  const year =
    project.year === PROJECT_YEAR_ONGOING
      ? "Ongoing"
      : project.year
        ? projectYearLabel(project.year)
        : "";
  const parts = [
    `Dubbed by ${SITE_NAME}`,
    `${project.from} → ${targets}`,
    project.category,
    year,
  ].filter(Boolean);
  return parts.join(" · ");
}

export function evaOrganizationLd() {
  return {
    "@type": "Organization" as const,
    "@id": EVA_ORG_ID,
    name: SITE_NAME,
    url: APP_BASE_URL,
  };
}

export function projectAbsolutePosterUrl(poster: string | undefined): string | undefined {
  if (!poster) return undefined;
  if (poster.startsWith("http://") || poster.startsWith("https://")) return poster;
  return `${APP_BASE_URL}${poster.startsWith("/") ? poster : `/${poster}`}`;
}
