/** Year EVA's studio experience is counted from. The years figure updates automatically every year. */
export const EXPERIENCE_START_YEAR = 2013;

/** Whole years of experience as of `now` (e.g. 13 in 2026). */
export function getYearsOfExperience(now: Date = new Date()): number {
  return Math.max(0, now.getFullYear() - EXPERIENCE_START_YEAR);
}

/** Label such as "13+". */
export function getYearsOfExperienceLabel(now?: Date): string {
  return `${getYearsOfExperience(now)}+`;
}
