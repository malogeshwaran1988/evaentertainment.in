import "server-only";
import {
  PROJECT_YEAR_ONGOING,
  projectYearLabel,
  type Project,
  type PublicProject,
} from "@@/data/projects";
import { getProjects } from "@@/lib/projects-store";

export const PUBLIC_PROJECT_STATUSES = ["ongoing", "released"] as const;
export type PublicProjectStatus = (typeof PUBLIC_PROJECT_STATUSES)[number];

function toPublic({
  id,
  slug,
  title,
  from,
  to,
  category,
  poster,
  posterAlt,
  description,
  year,
}: Project): PublicProject {
  return {
    id,
    slug,
    title,
    from,
    to,
    category,
    ...(poster ? { poster } : {}),
    ...(posterAlt ? { posterAlt } : {}),
    ...(description ? { description } : {}),
    ...(year ? { year, yearLabel: projectYearLabel(year) } : {}),
  };
}

/**
 * Projects as the website shows them: ongoing first, then newest year (see compareProjects).
 * Shared by the pages and `GET /api/projects` so they always agree.
 */
export async function getPublicProjects({
  limit,
  status,
}: { limit?: number; status?: PublicProjectStatus } = {}) {
  let projects = await getProjects();
  if (status) {
    const ongoing = status === "ongoing";
    projects = projects.filter((p) => (p.year === PROJECT_YEAR_ONGOING) === ongoing);
  }
  const total = projects.length;
  const shown = limit === undefined ? projects : projects.slice(0, limit);
  return { projects: shown.map(toPublic), total };
}
