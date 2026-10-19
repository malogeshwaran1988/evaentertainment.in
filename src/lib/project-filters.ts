import { PROJECT_CATEGORIES, PROJECT_LANGUAGES, projectLanguageLine } from "@@/data/projects";

/**
 * Shared, data-driven filters for the public gallery and the admin table.
 *
 * Language filters match the SOURCE language (`from`), the first half of the
 * "Telugu to Hindi" label. Nearly every project targets Hindi, so matching
 * targets too would make "Hindi" a no-op that selects everything.
 */
export const FILTER_ALL = "all";

type Filterable = { from: string; to: readonly string[]; category: string; title: string };

export type ProjectFacets = { language: string; category: string };

const sortBy = (order: readonly string[]) => (a: string, b: string) => {
  const ia = order.indexOf(a);
  const ib = order.indexOf(b);
  if (ia !== -1 || ib !== -1) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  return a.localeCompare(b);
};

export function matchesFacets(p: Filterable, f: ProjectFacets) {
  if (f.language !== FILTER_ALL && p.from !== f.language) return false;
  if (f.category !== FILTER_ALL && p.category !== f.category) return false;
  return true;
}

/** Options that still return at least one project given the OTHER facet (faceted search). */
export function facetOptions<T extends Filterable>(projects: readonly T[], f: ProjectFacets) {
  const languages = new Set<string>();
  const categories = new Set<string>();
  for (const p of projects) {
    if (f.category === FILTER_ALL || p.category === f.category) languages.add(p.from);
    if (f.language === FILTER_ALL || p.from === f.language) {
      const c = p.category?.trim();
      if (c) categories.add(c);
    }
  }
  return {
    languages: [...languages].filter(Boolean).sort(sortBy(PROJECT_LANGUAGES)),
    categories: [...categories].sort(sortBy(PROJECT_CATEGORIES)),
  };
}

/** Drop a selected value that no longer has data (or came from a bad URL) back to All. */
export function sanitizeFacets<T extends Filterable>(projects: readonly T[], f: ProjectFacets): ProjectFacets {
  const all = facetOptions(projects, { language: FILTER_ALL, category: FILTER_ALL });
  let language = all.languages.includes(f.language) ? f.language : FILTER_ALL;
  let category = all.categories.includes(f.category) ? f.category : FILTER_ALL;
  // Combination with no results: keep the language, release the category.
  if (!projects.some((p) => matchesFacets(p, { language, category }))) category = FILTER_ALL;
  if (!projects.some((p) => matchesFacets(p, { language, category }))) language = FILTER_ALL;
  return { language, category };
}

/** Case-insensitive, trimmed search over title, language line and category. */
export function matchesSearch(p: Filterable, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [p.title, projectLanguageLine(p as never), p.category]
    .some((s) => (s ?? "").toLowerCase().includes(q));
}
