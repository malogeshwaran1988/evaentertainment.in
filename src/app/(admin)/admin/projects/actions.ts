"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  PROJECT_CATEGORIES,
  PROJECT_DESCRIPTION_MAX,
  PROJECT_LANGUAGES,
  PROJECT_YEAR_MIN,
  PROJECT_YEAR_ONGOING,
  projectNameKey,
  type Project,
  type ProjectInput,
} from "@@/data/projects";
import { Routes } from "@@/constants/routes";
import { requireAdmin } from "@@/lib/admin-auth";
import { AdminRoutes } from "@@/lib/admin-session";
import { fetchPosterImageFromUrl } from "@@/lib/admin/fetch-poster-url";
import { deletePoster, isSamePosterFile, renamePoster, savePoster } from "@@/lib/project-posters";
import { uniqueProjectSlug } from "@@/lib/project-seo";
import * as store from "@@/lib/projects-store";

export type ProjectFormState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Partial<Record<keyof ProjectInput, string>>;
};

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
  })
  .refine((v) => !v.to.includes(v.from), {
    path: ["to"],
    message: "Target languages can't include the source language.",
  });

function parse(formData: FormData) {
  const result = projectSchema.safeParse({
    title: formData.get("title"),
    posterAlt: formData.get("posterAlt") ?? "",
    description: formData.get("description") ?? "",
    from: formData.get("from"),
    to: formData.getAll("to"),
    category: formData.get("category"),
    year: formData.get("year") ?? undefined,
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

const SAVE_FAILED = "Couldn't save the project. Please try again.";
const DELETE_FAILED = "Couldn't delete the project. Please try again.";

/** Old posters are removed after the project is already saved, so a failure here is only logged. */
async function deletePosterQuietly(poster: string | undefined) {
  try {
    await deletePoster(poster);
  } catch (err) {
    console.error("Failed to delete poster", poster, err);
  }
}

/** Project titles must stay unique (display name and default poster slug). */
async function duplicateNameState(
  title: string,
  exceptId?: string,
): Promise<ProjectFormState | null> {
  const key = projectNameKey(title);
  const clash = (await store.getProjects()).find(
    (p) => p.id !== exceptId && projectNameKey(p.title) === key,
  );
  if (!clash) return null;
  const message = `A project named “${clash.title}” already exists.`;
  return { fieldErrors: { title: message }, message };
}

function posterNameCtx(data: ProjectInput) {
  return {
    title: data.title,
    posterAlt: data.posterAlt,
    to: data.to,
  };
}

function revalidateProjects(slug?: string) {
  revalidatePath(Routes.HOME);
  revalidatePath(Routes.PROJECTS);
  revalidatePath(AdminRoutes.PROJECTS);
  if (slug) revalidatePath(Routes.project(slug));
}

export async function createProjectAction(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();
  const { data, fieldErrors } = parse(formData);
  if (!data) return { fieldErrors, message: "Please fix the highlighted fields." };

  let poster: string | undefined;
  try {
    const duplicate = await duplicateNameState(data.title);
    if (duplicate) return duplicate;

    const projects = await store.getProjects();
    const slug = uniqueProjectSlug({ title: data.title, to: data.to }, projects);
    const file = posterFile(formData);
    if (file) {
      const saved = await savePoster(file, posterNameCtx(data), { projects });
      if (!saved.ok) return { fieldErrors: { poster: saved.error }, message: saved.error };
      poster = saved.path;
    }

    const project = await store.createProject({
      ...data,
      slug,
      poster,
      posterAlt: poster ? data.posterAlt : undefined,
    });
    revalidateProjects(project.slug);
    return { ok: true, message: `“${project.title}” added.` };
  } catch (err) {
    console.error("Failed to create project", err);
    await deletePosterQuietly(poster);
    return { message: SAVE_FAILED };
  }
}

export async function updateProjectAction(
  id: string,
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();
  const { data, fieldErrors } = parse(formData);
  if (!data) return { fieldErrors, message: "Please fix the highlighted fields." };

  let existing: Project | null = null;
  let uploaded: string | undefined;
  /** A same-name replace overwrote the old file, so it must not be deleted on failure. */
  const discardUploaded = () =>
    isSamePosterFile(uploaded, existing?.poster) ? undefined : deletePosterQuietly(uploaded);
  try {
    existing = await store.getProject(id);
    if (!existing) return { message: "This project no longer exists." };
    const duplicate = await duplicateNameState(data.title, id);
    if (duplicate) return duplicate;

    const projects = await store.getProjects();
    const slug = uniqueProjectSlug(
      { title: data.title, to: data.to },
      projects,
      id,
    );
    let poster = existing.poster;
    const file = posterFile(formData);
    const ctx = posterNameCtx(data);
    const posterOpts = { projects, excludeProjectId: id };
    if (file) {
      const saved = await savePoster(file, ctx, posterOpts);
      if (!saved.ok) return { fieldErrors: { poster: saved.error }, message: saved.error };
      poster = uploaded = saved.path;
    } else if (formData.get("removePoster") === "on") {
      poster = undefined;
    } else if (poster) {
      const renamed = await renamePoster(poster, ctx, posterOpts);
      if (renamed !== poster) poster = uploaded = renamed;
    }

    const project = await store.updateProject(id, {
      ...data,
      slug,
      poster,
      posterAlt: poster ? data.posterAlt : undefined,
    });
    if (!project) {
      await discardUploaded();
      return { message: "This project no longer exists." };
    }
    if (!isSamePosterFile(existing.poster, poster)) await deletePosterQuietly(existing.poster);
    revalidateProjects(project.slug);
    if (existing.slug && existing.slug !== project.slug) {
      revalidatePath(Routes.project(existing.slug));
    }
    revalidatePath(`${AdminRoutes.PROJECTS}/${id}/edit`);
    return { ok: true, message: `“${project.title}” updated.` };
  } catch (err) {
    console.error("Failed to update project", id, err);
    await discardUploaded();
    return { message: SAVE_FAILED };
  }
}

export async function deleteProjectAction(id: string): Promise<ProjectFormState> {
  await requireAdmin();
  let removed;
  try {
    removed = await store.deleteProject(id);
  } catch (err) {
    console.error("Failed to delete project", id, err);
    return { message: DELETE_FAILED };
  }
  if (!removed) return { message: "This project was already deleted." };
  await deletePosterQuietly(removed.poster);
  revalidateProjects();
  return { ok: true, message: "Project deleted." };
}

export type FetchPosterFromUrlResult =
  | { ok: true; base64: string; mime: string; filename: string; bytes: number }
  | { ok: false; error: string };

/** Downloads a remote image for the admin poster field (CORS-safe). */
export async function fetchPosterFromUrlAction(url: string): Promise<FetchPosterFromUrlResult> {
  await requireAdmin();
  return fetchPosterImageFromUrl(url);
}
