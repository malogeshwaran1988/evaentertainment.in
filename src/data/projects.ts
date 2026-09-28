import { APP_BASE_URL, DEFAULT_OG_IMAGE } from "@@/constants/constants";

export const PROJECTS_PAGE_URL = `${APP_BASE_URL}/projects`;
export const PROJECTS_OG_IMAGE = DEFAULT_OG_IMAGE;

export const PROJECTS_SEO = {
  title: "Our Projects | Movie Dubbing Portfolio",
  description:
    "Explore EVA Entertainment's movie dubbing portfolio across Tamil, Telugu, Hindi, Malayalam, Kannada and English, delivered from our Mumbai studio.",
};

export const PROJECT_LANGUAGES = [
  "English",
  "Tamil",
  "Hindi",
  "Telugu",
  "Malayalam",
  "Kannada",
] as const;

export type ProjectLanguage = (typeof PROJECT_LANGUAGES)[number];

export const PROJECT_CATEGORIES = [
  "Movie Dubbing",
  "Dubbing",
  "Voice Over",
  "Subtitling",
] as const;

export const POSTER_MAX_BYTES = 150 * 1024;
export const POSTER_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;
export const POSTER_ACCEPT = POSTER_TYPES.join(",");
/** Public URL prefix for admin-uploaded posters, served by the /images/our-projects route. */
export const POSTER_URL_PREFIX = "/images/our-projects/";

export type Project = {
  id: string;
  title: string;
  from: ProjectLanguage;
  to: ProjectLanguage[];
  category: string;
  /** Seeded: a /public path. Uploaded: "/images/our-projects/<name>?v=<version>". */
  poster?: string;
  /** Alt text for the poster; the website falls back to "<title> poster". */
  posterAlt?: string;
  /** "ongoing" (still being dubbed) or a release year like "2025". Older projects have none. */
  year?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectInput = Pick<
  Project,
  "title" | "from" | "to" | "category" | "poster" | "posterAlt" | "year"
>;

export const PROJECT_YEAR_ONGOING = "ongoing";
export const PROJECT_YEAR_MIN = 1990;

/** "ongoing" first, then the current year down to PROJECT_YEAR_MIN. */
export function projectYearOptions() {
  const years: string[] = [PROJECT_YEAR_ONGOING];
  for (let y = new Date().getFullYear(); y >= PROJECT_YEAR_MIN; y--) years.push(String(y));
  return years;
}

export function projectYearLabel(year: string) {
  return year === PROJECT_YEAR_ONGOING ? "Ongoing" : year;
}

/** Ongoing first, then newest year, then projects without a year; ties go to the newest added. */
export function compareProjects(a: Project, b: Project) {
  const rank = (p: Project) =>
    p.year === PROJECT_YEAR_ONGOING ? Infinity : p.year ? Number(p.year) : -Infinity;
  const diff = rank(b) - rank(a);
  if (diff !== 0 && !Number.isNaN(diff)) return diff;
  return b.createdAt.localeCompare(a.createdAt);
}

/**
 * Two projects clash when their names match ignoring case, accents, spaces and punctuation
 * ("Biker", "biker" and "Biker!" are the same project). Works for any script, not just Latin.
 */
export function projectNameKey(title: string) {
  return title
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

export function projectPosterAlt(project: Pick<Project, "title" | "posterAlt">) {
  return project.posterAlt || `${project.title} poster`;
}

export function projectLanguageLine(project: Pick<Project, "from" | "to">) {
  const targets = project.to;
  const list =
    targets.length <= 1
      ? targets.join("")
      : `${targets.slice(0, -1).join(", ")} and ${targets[targets.length - 1]}`;
  return `${project.from} to ${list}`;
}
