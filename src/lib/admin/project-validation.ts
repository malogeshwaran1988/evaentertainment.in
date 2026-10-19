/**
 * Single source of truth for validating project form data. Used by the add/edit server actions and
 * by the CSV import (each CSV row is turned into the same FormData the form submits).
 */
import { z } from "zod";
import {
  PROJECT_AUDIO_HOURS_MAX,
  PROJECT_CATEGORIES,
  PROJECT_SERVICES,
  PROJECT_DESCRIPTION_MAX,
  PROJECT_LANGUAGES,
  PROJECT_YEAR_MIN,
  PROJECT_YEAR_ONGOING,
  type ProjectInput,
} from "@@/data/projects";

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
      .array(z.enum(PROJECT_LANGUAGES), { error: "Choose valid target languages." }),
    category: z.enum(PROJECT_CATEGORIES, { error: "Choose a category." }),
    services: z.array(z.enum(PROJECT_SERVICES, { error: "Choose services from the list." })),
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

/**
 * The "Page content (SEO)" fields were removed from the form; project SEO is generated
 * automatically. Any such fields in a submission are ignored.
 */
function parseContent(_formData: FormData) {
  void _formData;
  return { content: {} as Partial<ProjectInput>, errors: {} as ProjectFieldErrors };
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
    services: formData.getAll("services"),
    year: formData.get("year") ?? undefined,
    published: formData.get("published") === "on",
  });
  if (result.success) {
    // Keep target languages in the canonical PROJECT_LANGUAGES order.
    // "Dubbed into" is optional (a project can be worked on in its own language).
    const to = PROJECT_LANGUAGES.filter((l) => result.data.to.includes(l));
    const services = PROJECT_SERVICES.filter((s) => result.data.services.includes(s));
    if (Object.keys(extra.errors).length) return { fieldErrors: extra.errors };
    const { services: _s, ...rest } = result.data;
    void _s;
    return {
      data: { ...rest, to, ...(services.length ? { services } : {}), ...extra.content } satisfies ProjectInput,
    };
  }
  const fieldErrors: ProjectFieldErrors = { ...extra.errors };
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof ProjectInput;
    fieldErrors[key] ??= issue.message;
  }
  return { fieldErrors };
}
