import type { Project, ProjectLanguage } from "@@/data/projects";
import { slugifyAscii } from "@@/lib/project-seo";

/** Language hub pages: /dubbing/<from>-to-<to>, e.g. /dubbing/telugu-to-hindi. */
export const LANGUAGE_HUB_PREFIX = "/dubbing";
/** A hub is indexed (and in the sitemap) only when it lists at least this many projects. */
export const LANGUAGE_HUB_MIN_PROJECTS = 3;

export function languagePairSlug(from: ProjectLanguage | string, to: ProjectLanguage | string) {
  return `${slugifyAscii(from)}-to-${slugifyAscii(to)}`;
}

export function languageHubHref(from: string, to: string) {
  return `${LANGUAGE_HUB_PREFIX}/${languagePairSlug(from, to)}`;
}

export type LanguagePair = { slug: string; from: ProjectLanguage; to: ProjectLanguage; projects: Project[] };

export function languagePairs(projects: readonly Project[]): LanguagePair[] {
  const map = new Map<string, LanguagePair>();
  for (const p of projects) {
    for (const t of p.to) {
      const slug = languagePairSlug(p.from, t);
      const entry = map.get(slug) ?? { slug, from: p.from, to: t, projects: [] };
      entry.projects.push(p);
      map.set(slug, entry);
    }
  }
  return [...map.values()].sort((a, b) => b.projects.length - a.projects.length);
}
