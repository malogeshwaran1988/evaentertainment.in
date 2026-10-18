import {
  PROJECT_LANGUAGES,
  type Project,
  type ProjectLanguage,
  type PublicProject,
} from "@@/data/projects";

export type LanguageHours = {
  language: ProjectLanguage;
  hours: number;
};

export type ProjectImpactStats = {
  totalAudioHours: number;
  /** Round(total / 24) for the “days without pause” metaphor. */
  careDays: number;
  /** Top languages by hours (capped). */
  hoursByLanguage: LanguageHours[];
  /** Languages with hours &gt; 0 before capping. */
  languageCount: number;
};

type HoursProject = Pick<Project | PublicProject, "to" | "audioHours">;

function projectHours(p: HoursProject): number {
  const n = p.audioHours;
  return typeof n === "number" && Number.isFinite(n) && n > 0 ? n : 0;
}

/** Format hours for display (drop trailing .0). */
export function formatAudioHours(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return "0";
  const rounded = Math.round(hours * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/**
 * Site total = sum of project hours once.
 * Language totals credit full project hours to each target language.
 */
export function aggregateProjectImpact(
  projects: readonly HoursProject[],
  languageCap = 6,
): ProjectImpactStats {
  let totalAudioHours = 0;
  const byLang = new Map<ProjectLanguage, number>();

  for (const project of projects) {
    const hours = projectHours(project);
    if (!hours) continue;
    totalAudioHours += hours;
    for (const lang of project.to) {
      byLang.set(lang, (byLang.get(lang) ?? 0) + hours);
    }
  }

  // Stable order: hours desc, then canonical language list order.
  const allLanguages = PROJECT_LANGUAGES.map((language) => ({
    language,
    hours: byLang.get(language) ?? 0,
  }))
    .filter((row) => row.hours > 0)
    .sort((a, b) => {
      if (b.hours !== a.hours) return b.hours - a.hours;
      return PROJECT_LANGUAGES.indexOf(a.language) - PROJECT_LANGUAGES.indexOf(b.language);
    });

  const careDays =
    totalAudioHours > 0 ? Math.max(1, Math.round(totalAudioHours / 24)) : 0;

  return {
    totalAudioHours: Math.round(totalAudioHours * 10) / 10,
    careDays,
    hoursByLanguage: allLanguages.slice(0, languageCap),
    languageCount: allLanguages.length,
  };
}
