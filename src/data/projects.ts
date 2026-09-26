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
/** Public URL prefix for admin-uploaded posters (files live in public/images/our-projects). */
export const POSTER_URL_PREFIX = "/images/our-projects/";

export type Project = {
  id: string;
  title: string;
  from: ProjectLanguage;
  to: ProjectLanguage[];
  category: string;
  /** Path under /public, e.g. "/images/projects/sardar-2.jpg" */
  poster?: string;
  /** Alt text for the poster; the website falls back to "<title> poster". */
  posterAlt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectInput = Pick<
  Project,
  "title" | "from" | "to" | "category" | "poster" | "posterAlt"
>;

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
