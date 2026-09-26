"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  PROJECT_CATEGORIES,
  PROJECT_LANGUAGES,
  type ProjectInput,
} from "@@/data/projects";
import { requireAdmin } from "@@/lib/admin-auth";
import { AdminRoutes } from "@@/lib/admin-session";
import { deletePoster, savePoster } from "@@/lib/project-posters";
import * as store from "@@/lib/projects-store";

export type ProjectFormState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Partial<Record<keyof ProjectInput, string>>;
};

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
    from: z.enum(PROJECT_LANGUAGES, { error: "Choose the source language." }),
    to: z
      .array(z.enum(PROJECT_LANGUAGES))
      .min(1, "Choose at least one target language."),
    category: z.enum(PROJECT_CATEGORIES, { error: "Choose a category." }),
  })
  .refine((v) => !v.to.includes(v.from), {
    path: ["to"],
    message: "Target languages can't include the source language.",
  });

function parse(formData: FormData) {
  const result = projectSchema.safeParse({
    title: formData.get("title"),
    posterAlt: formData.get("posterAlt") ?? "",
    from: formData.get("from"),
    to: formData.getAll("to"),
    category: formData.get("category"),
  });
  if (result.success) {
    // Keep target languages in the canonical PROJECT_LANGUAGES order.
    const to = PROJECT_LANGUAGES.filter((l) => result.data.to.includes(l));
    return { data: { ...result.data, to } satisfies ProjectInput };
  }
  const fieldErrors: ProjectFormState["fieldErrors"] = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof ProjectInput;
    fieldErrors[key] ??= issue.message;
  }
  return { fieldErrors };
}

/** An empty file input still submits a zero-byte File, which means "no new poster". */
function posterFile(formData: FormData) {
  const value = formData.get("poster");
  return value instanceof File && value.size > 0 ? value : null;
}

function revalidateProjects() {
  revalidatePath("/projects");
  revalidatePath(AdminRoutes.PROJECTS);
}

export async function createProjectAction(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();
  const { data, fieldErrors } = parse(formData);
  if (!data) return { fieldErrors, message: "Please fix the highlighted fields." };

  let poster: string | undefined;
  const file = posterFile(formData);
  if (file) {
    const saved = await savePoster(file, data.title);
    if (!saved.ok) return { fieldErrors: { poster: saved.error }, message: saved.error };
    poster = saved.path;
  }

  const project = await store.createProject({
    ...data,
    poster,
    posterAlt: poster ? data.posterAlt : undefined,
  });
  revalidateProjects();
  return { ok: true, message: `“${project.title}” added.` };
}

export async function updateProjectAction(
  id: string,
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();
  const { data, fieldErrors } = parse(formData);
  if (!data) return { fieldErrors, message: "Please fix the highlighted fields." };

  const existing = await store.getProject(id);
  if (!existing) return { message: "This project no longer exists." };

  let poster = existing.poster;
  const file = posterFile(formData);
  if (file) {
    const saved = await savePoster(file, data.title);
    if (!saved.ok) return { fieldErrors: { poster: saved.error }, message: saved.error };
    poster = saved.path;
  } else if (formData.get("removePoster") === "on") {
    poster = undefined;
  }

  const project = await store.updateProject(id, {
    ...data,
    poster,
    posterAlt: poster ? data.posterAlt : undefined,
  });
  if (!project) {
    if (poster !== existing.poster) await deletePoster(poster);
    return { message: "This project no longer exists." };
  }
  if (existing.poster !== poster) await deletePoster(existing.poster);
  revalidateProjects();
  revalidatePath(`${AdminRoutes.PROJECTS}/${id}/edit`);
  return { ok: true, message: `“${project.title}” updated.` };
}

export async function deleteProjectAction(id: string): Promise<ProjectFormState> {
  await requireAdmin();
  const removed = await store.deleteProject(id);
  if (!removed) return { message: "This project was already deleted." };
  await deletePoster(removed.poster);
  revalidateProjects();
  return { ok: true, message: "Project deleted." };
}
