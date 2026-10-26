import type { Project, ProjectLanguage } from "@@/data/projects";
import { slugifyAscii } from "@@/lib/project-seo";

/** Language hub pages: /dubbing/<from>-to-<to>, e.g. /dubbing/telugu-to-hindi. */
export const LANGUAGE_HUB_PREFIX = "/dubbing";
/** A hub is indexed (and in the sitemap) only when it lists at least this many projects. */
export const LANGUAGE_HUB_MIN_PROJECTS = 3;

export function languagePairSlug(
  from: ProjectLanguage | string,
  to: ProjectLanguage | string,
) {
  return `${slugifyAscii(from)}-to-${slugifyAscii(to)}`;
}

export function languageHubHref(from: string, to: string) {
  return `${LANGUAGE_HUB_PREFIX}/${languagePairSlug(from, to)}`;
}

/**
 * Pair URLs that are folded into a stronger page and 308-redirect there (see LEGACY_REDIRECTS).
 * languagePairs() never returns them, so no page, card, footer link or sitemap entry recreates them.
 */
export const MERGED_PAIR_REDIRECTS: Record<string, string> = {
  "english-to-hindi": "/hollywood-dubbing-indian-languages",
};

export const isMergedPair = (from: string, to: string) =>
  languagePairSlug(from, to) in MERGED_PAIR_REDIRECTS;

/**
 * Pairs we offer and keep a page for even before a published project exists (owner request, Oct 2026).
 * Their pages carry service facts only; project counts and titles appear once real projects are published.
 */
export const OFFERED_PAIRS: { from: ProjectLanguage; to: ProjectLanguage }[] = [
  { from: "English", to: "Tamil" },
];

export type LanguagePair = {
  slug: string;
  from: ProjectLanguage;
  to: ProjectLanguage;
  projects: Project[];
};

export function languagePairs(projects: readonly Project[]): LanguagePair[] {
  const map = new Map<string, LanguagePair>();
  for (const p of projects) {
    for (const t of p.to) {
      const slug = languagePairSlug(p.from, t);
      if (slug in MERGED_PAIR_REDIRECTS) continue;
      const entry = map.get(slug) ?? {
        slug,
        from: p.from,
        to: t,
        projects: [],
      };
      entry.projects.push(p);
      map.set(slug, entry);
    }
  }
  for (const { from, to } of OFFERED_PAIRS) {
    const slug = languagePairSlug(from, to);
    if (!map.has(slug)) map.set(slug, { slug, from, to, projects: [] });
  }
  return [...map.values()].sort(
    (a, b) => b.projects.length - a.projects.length,
  );
}
