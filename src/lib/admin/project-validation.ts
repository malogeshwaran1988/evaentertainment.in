/**
 * Single source of truth for validating project form data. Used by the add/edit server actions and
 * by the CSV import (each CSV row is turned into the same FormData the form submits).
 */
import { z } from "zod";
import {
  PROJECT_AUDIO_HOURS_MAX,
  PROJECT_CATEGORIES,
  PROJECT_DESCRIPTION_MAX,
  PROJECT_LANGUAGES,
  PROJECT_SYNOPSIS_MAX,
  PROJECT_YEAR_MIN,
  PROJECT_YEAR_ONGOING,
  type ProjectInput,
} from "@@/data/projects";
import { parseFaqs, parseLines, parseVoiceCast, youtubeId } from "@@/lib/project-content";

export type ProjectFieldErrors = Partial<Record<keyof ProjectInput, string>>;

const YEAR_ERROR = "Choose the year or Ongoing.";

const projectSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Enter the project name.")
      .max(120, "Keep the project name under 120 characters."),
    posterAlt: z
      .string()
      .trim()
      .max(150, "Keep the ALT name under 150 characters.")
      .transform((v) => v || undefined),
    description: z
      .string()
      .trim()
      .max(
        PROJECT_DESCRIPTION_MAX,
        `Keep the description under ${PROJECT_DESCRIPTION_MAX} characters.`,
      )
      .transform((v) => {
        const cleaned = v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
        return cleaned || undefined;
      }),
    audioHours: z.string().trim().transform((raw, ctx) => {
      if (!raw) return undefined;
      const n = Number(raw);
      if (!Number.isFinite(n)) {
        ctx.addIssue({ code: "custom", message: "Enter hours as a number." });
        return z.NEVER;
      }
      if (n <= 0) {
        ctx.addIssue({ code: "custom", message: "Hours must be greater than zero." });
        return z.NEVER;
      }
      if (n > PROJECT_AUDIO_HOURS_MAX) {
        ctx.addIssue({
          code: "custom",
          message: `Keep hours under ${PROJECT_AUDIO_HOURS_MAX.toLocaleString("en-IN")}.`,
        });
        return z.NEVER;
      }
      if (Math.round(n * 10) !== n * 10) {
        ctx.addIssue({ code: "custom", message: "Use at most one decimal place." });
        return z.NEVER;
      }
      return n;
    }),
    from: z.enum(PROJECT_LANGUAGES, { error: "Choose the source language." }),
    to: z
      .array(z.enum(PROJECT_LANGUAGES))
      .min(1, "Choose at least one target language."),
    category: z.enum(PROJECT_CATEGORIES, { error: "Choose a category." }),
    year: z
      .string({ error: YEAR_ERROR })
      .refine(
        (v) =>
          v === PROJECT_YEAR_ONGOING ||
          (/^\d{4}$/.test(v) &&
            Number(v) >= PROJECT_YEAR_MIN &&
            Number(v) <= new Date().getFullYear()),
        YEAR_ERROR,
      ),
    published: z.boolean(),
  })
  .refine((v) => !v.to.includes(v.from), {
    path: ["to"],
    message: "Target languages can't include the source language.",
  });

const str = (formData: FormData, key: string, max: number) =>
  String(formData.get(key) ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);

/** Optional per-film page content. Empty fields become undefined so stored rows stay lean. */
function parseContent(formData: FormData) {
  const errors: ProjectFieldErrors = {};
  const synopsisRaw = String(formData.get("synopsis") ?? "").trim();
  if (synopsisRaw.length > PROJECT_SYNOPSIS_MAX) {
    errors.synopsis = `Keep the synopsis under ${PROJECT_SYNOPSIS_MAX} characters.`;
  }
  const originalRelease = str(formData, "originalRelease", 10);
  if (originalRelease && !/^\d{4}(-\d{2}(-\d{2})?)?$/.test(originalRelease)) {
    errors.originalRelease = "Use YYYY, YYYY-MM or YYYY-MM-DD.";
  }
  const trailerUrl = str(formData, "trailerUrl", 300);
  if (trailerUrl && !youtubeId(trailerUrl)) {
    errors.trailerUrl = "Paste a YouTube video link (youtube.com/watch?v=… or youtu.be/…).";
  }
  const voiceArtistsRaw = str(formData, "evaVoiceArtists", 6);
  const voiceArtists = voiceArtistsRaw ? Number(voiceArtistsRaw) : undefined;
  if (voiceArtists !== undefined && (!Number.isInteger(voiceArtists) || voiceArtists < 1 || voiceArtists > 999)) {
    errors.evaWork = "Voice artists must be a whole number from 1 to 999.";
  }
  const evaWork = {
    ...(formData.get("evaLipSync") === "on" ? { lipSync: true } : {}),
    ...(formData.get("evaSongs") === "on" ? { songs: true } : {}),
    ...(str(formData, "evaMix", 80) ? { mix: str(formData, "evaMix", 80) } : {}),
    ...(voiceArtists ? { voiceArtists } : {}),
    ...(str(formData, "evaDubbingDirector", 120)
      ? { dubbingDirector: str(formData, "evaDubbingDirector", 120) }
      : {}),
    ...(str(formData, "evaNotes", 1500) ? { notes: str(formData, "evaNotes", 1500) } : {}),
  };
  const cast = parseLines(String(formData.get("cast") ?? ""), 20, 80);
  const voiceCast = parseVoiceCast(String(formData.get("voiceCast") ?? ""));
  const faqs = parseFaqs(String(formData.get("faqs") ?? ""));
  const content = {
    synopsis: synopsisRaw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") || undefined,
    director: str(formData, "director", 120) || undefined,
    cast: cast.length ? cast : undefined,
    originalRelease: originalRelease || undefined,
    productionHouse: str(formData, "productionHouse", 120) || undefined,
    evaWork: Object.keys(evaWork).length ? evaWork : undefined,
    voiceCast: voiceCast.length ? voiceCast : undefined,
    trailerUrl: trailerUrl || undefined,
    whereToWatch: str(formData, "whereToWatch", 200) || undefined,
    faqs: faqs.length ? faqs : undefined,
  };
  return { content, errors };
}

export function parseProjectForm(
  formData: FormData,
): { data: ProjectInput; fieldErrors?: undefined } | { data?: undefined; fieldErrors: ProjectFieldErrors } {
  const extra = parseContent(formData);
  const result = projectSchema.safeParse({
    title: formData.get("title"),
    posterAlt: formData.get("posterAlt") ?? "",
    description: formData.get("description") ?? "",
    audioHours: formData.get("audioHours") ?? "",
    from: formData.get("from"),
    to: formData.getAll("to"),
    category: formData.get("category"),
    year: formData.get("year") ?? undefined,
    published: formData.get("published") === "on",
  });
  if (result.success) {
    // Keep target languages in the canonical PROJECT_LANGUAGES order.
    const to = PROJECT_LANGUAGES.filter((l) => result.data.to.includes(l));
    if (Object.keys(extra.errors).length) return { fieldErrors: extra.errors };
    return { data: { ...result.data, to, ...extra.content } satisfies ProjectInput };
  }
  const fieldErrors: ProjectFieldErrors = { ...extra.errors };
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof ProjectInput;
    fieldErrors[key] ??= issue.message;
  }
  return { fieldErrors };
}
