import { APP_BASE_URL } from "@@/constants/constants";

export const PROJECTS_PAGE_URL = `${APP_BASE_URL}/our-projects`;
export const PROJECTS_OG_IMAGE = "/images/og/projects.jpg";
export const PROJECTS_OG_IMAGE_ALT = "Editing workstation with control surfaces for dubbing projects";

export const PROJECTS_SEO = {
  title: "Our Projects | Movie Dubbing Portfolio | EVA Entertainment",
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

/** Server safety cap. The admin UI converts posters client-side to AVIF under 149 KB first. */
export const POSTER_MAX_BYTES = 150 * 1024;
/** Types savePoster still accepts (sniffed by magic bytes). New uploads from the form are AVIF. */
export const POSTER_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;
export const POSTER_ACCEPT = POSTER_TYPES.join(",");
/** Public URL prefix for admin-uploaded posters, served by the /images/our-projects route. */
export const POSTER_URL_PREFIX = "/images/our-projects/";

export type Project = {
  id: string;
  /** Public URL segment under /projects/[slug]. */
  slug: string;
  title: string;
  from: ProjectLanguage;
  to: ProjectLanguage[];
  category: string;
  /** Seeded: a /public path. Uploaded: "/images/our-projects/<name>?v=<version>". */
  poster?: string;
  /** Typed ALT only; public pages render SEO ALT via projectSeoAlt. */
  posterAlt?: string;
  /** Optional public blurb on /projects/[slug]. */
  description?: string;
  /** Finished hours of dubbed audio delivered for this project. */
  audioHours?: number;
  /** "ongoing" (still being dubbed) or a release year like "2025". Older projects have none. */
  year?: string;
  /** When false, hidden from the live site (admin still sees it). Missing → treat as true. */
  published: boolean;
  /** Optional per-film content that makes each project page unique (all optional, older rows omit them). */
  synopsis?: string;
  director?: string;
  /** Lead cast of the original film. */
  cast?: string[];
  /** Original release date, "YYYY-MM-DD" or "YYYY-MM" or "YYYY". */
  originalRelease?: string;
  productionHouse?: string;
  /** What EVA did on the project. */
  evaWork?: ProjectEvaWork;
  /** Hindi (target) voice cast: who voiced which role. */
  voiceCast?: ProjectVoiceRole[];
  /** YouTube URL of the dubbed trailer. */
  trailerUrl?: string;
  /** Where the dubbed version can be watched (platform / channel). */
  whereToWatch?: string;
  faqs?: ProjectFaq[];
  createdAt: string;
  updatedAt: string;
};

export type ProjectEvaWork = {
  lipSync?: boolean;
  songs?: boolean;
  /** e.g. "5.1 and stereo" */
  mix?: string;
  voiceArtists?: number;
  dubbingDirector?: string;
  notes?: string;
};
export type ProjectVoiceRole = { role: string; artist: string };
export type ProjectFaq = { q: string; a: string };

/** Content fields edited in the admin "Page content" section. */
export const PROJECT_CONTENT_KEYS = [
  "synopsis",
  "director",
  "cast",
  "originalRelease",
  "productionHouse",
  "evaWork",
  "voiceCast",
  "trailerUrl",
  "whereToWatch",
  "faqs",
] as const;

export const PROJECT_SYNOPSIS_MAX = 2000;

/** What the website and `GET /api/projects` expose: no internal timestamps or publish flag. */
export type PublicProject = Omit<Project, "createdAt" | "updatedAt" | "published"> & {
  /** "Ongoing" or the release year; absent for older projects. */
  yearLabel?: string;
};

export type ProjectInput = Pick<
  Project,
  | "title"
  | "from"
  | "to"
  | "category"
  | "poster"
  | "posterAlt"
  | "description"
  | "audioHours"
  | "year"
  | "published"
  | (typeof PROJECT_CONTENT_KEYS)[number]
>;

/** Older stored rows omit `published`; those stay live on the website. */
export function projectIsPublished(project: { published?: boolean }) {
  return project.published !== false;
}

/** Max length for the public project description (admin + store). */
export const PROJECT_DESCRIPTION_MAX = 800;
/** Max finished audio hours per project (admin validation). */
export const PROJECT_AUDIO_HOURS_MAX = 10_000;

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

export function projectLanguageLine(project: Pick<Project, "from" | "to">) {
  const targets = project.to;
  const list =
    targets.length <= 1
      ? targets.join("")
      : `${targets.slice(0, -1).join(", ")} and ${targets[targets.length - 1]}`;
  return `${project.from} to ${list}`;
}
