import "server-only";
import { FOUNDER_FEATURED_MAX } from "@@/data/founder";
import { PROJECT_YEAR_ONGOING, projectIsPublished, type Project } from "@@/data/projects";
import { getPublicProjects } from "@@/lib/projects-public";
import { getProjects } from "@@/lib/projects-store";

/**
 * Automatic order: this year's projects (and ongoing ones) first, newest added (createdAt) first;
 * then everything else by year, newest first, ties by createdAt.
 */
export function compareFounderWork(a: Project, b: Project, currentYear = String(new Date().getFullYear())) {
  const isNow = (p: Project) => p.year === currentYear || p.year === PROJECT_YEAR_ONGOING;
  const na = isNow(a);
  const nb = isNow(b);
  if (na !== nb) return na ? -1 : 1;
  if (!na) {
    const ya = Number(a.year) || -Infinity;
    const yb = Number(b.year) || -Infinity;
    if (ya !== yb) return yb > ya ? 1 : -1;
  }
  return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
}

/** Up to 5 published projects: the admin's featured picks in order, else the automatic list. */
export async function getFounderWork(featuredIds: string[]) {
  try {
    const published = (await getProjects()).filter(projectIsPublished);
    const byIdRaw = new Map(published.map((p) => [p.id, p]));
    const picked = featuredIds.flatMap((id) => byIdRaw.get(id) ?? []);
    const ids = (picked.length > 0 ? picked : [...published].sort((a, b) => compareFounderWork(a, b)))
      .slice(0, FOUNDER_FEATURED_MAX)
      .map((p) => p.id);
    const { projects } = await getPublicProjects();
    const byId = new Map(projects.map((p) => [p.id, p]));
    return ids.flatMap((id) => byId.get(id) ?? []);
  } catch {
    return [];
  }
}
