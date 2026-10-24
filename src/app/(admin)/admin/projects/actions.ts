"use server";

import { revalidatePath, updateTag } from "next/cache";
import { PROJECTS_TAG } from "@@/lib/cache-tags";
import {
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
import { parseProjectForm as parse } from "@@/lib/admin/project-validation";
import { CSV_MAX_BYTES, validateProjectCsv, type CsvRowResult } from "@@/lib/admin/project-csv";
import * as store from "@@/lib/projects-store";
import { getClientsFresh } from "@@/lib/clients-store";

/** Drops a client id that no longer exists (deleted in another tab), so the project saves without one. */
async function withKnownClient(data: ProjectInput): Promise<ProjectInput> {
  if (!data.clientId) return data;
  const known = (await getClientsFresh()).some((c) => c.id === data.clientId);
  return known ? data : { ...data, clientId: undefined };
}

export type ProjectFormState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Partial<Record<keyof ProjectInput, string>>;
};

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
  const clash = (await store.getProjectsFresh()).find(
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
  // Drop the cached Blob JSON first so this request and the next visitors read the saved data.
  updateTag(PROJECTS_TAG);
  revalidatePath(Routes.HOME);
  revalidatePath(Routes.PROJECTS);
  revalidatePath("/sitemap.xml");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/dubbing/[pair]", "page");
  revalidatePath(AdminRoutes.PROJECTS);
  if (slug) revalidatePath(Routes.project(slug));
}

export async function createProjectAction(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();
  const { data: parsed, fieldErrors } = parse(formData);
  if (!parsed) return { fieldErrors, message: "Please fix the highlighted fields." };
  const data = await withKnownClient(parsed);

  let poster: string | undefined;
  try {
    const duplicate = await duplicateNameState(data.title);
    if (duplicate) return duplicate;

    const projects = await store.getProjectsFresh();
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
  const { data: parsed, fieldErrors } = parse(formData);
  if (!parsed) return { fieldErrors, message: "Please fix the highlighted fields." };
  const data = await withKnownClient(parsed);

  let existing: Project | null = null;
  let uploaded: string | undefined;
  /** A same-name replace overwrote the old file, so it must not be deleted on failure. */
  const discardUploaded = () =>
    isSamePosterFile(uploaded, existing?.poster) ? undefined : deletePosterQuietly(uploaded);
  try {
    existing = await store.getProjectFresh(id);
    if (!existing) return { message: "This project no longer exists." };
    const duplicate = await duplicateNameState(data.title, id);
    if (duplicate) return duplicate;

    const projects = await store.getProjectsFresh();
    // Clearing "Dubbed into" never renames an existing page.
    const slug =
      data.to.length === 0 && existing.slug
        ? existing.slug
        : uniqueProjectSlug({ title: data.title, to: data.to }, projects, id);
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
  if (typeof url !== "string") return { ok: false, error: "Paste an image URL." };
  return fetchPosterImageFromUrl(url);
}

// ----- CSV bulk import -----

/** The client only needs the summary + errors, not the parsed payload. */
function withoutData(row: CsvRowResult): CsvRowResult {
  const copy = { ...row };
  delete copy.data;
  return copy;
}

export type CsvPreviewState =
  | { ok: true; rows: CsvRowResult[]; warnings: string[]; validCount: number; csv: string }
  | { ok: false; error: string };

async function readCsvFile(formData: FormData): Promise<{ text: string } | { error: string }> {
  const file = formData.get("csv");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a CSV file." };
  if (file.size > CSV_MAX_BYTES) {
    return { error: `The file is ${Math.ceil(file.size / 1024)} KB. The maximum is ${CSV_MAX_BYTES / 1024} KB.` };
  }
  if (!/\.csv$/i.test(file.name) && !/csv|text\/plain|excel/i.test(file.type)) {
    return { error: "Upload a .csv file." };
  }
  return { text: await file.text() };
}

/** Step 1: server-side validation preview (one fresh read of projects.json, no writes). */
export async function previewProjectCsvAction(formData: FormData): Promise<CsvPreviewState> {
  await requireAdmin();
  const file = await readCsvFile(formData);
  if ("error" in file) return { ok: false, error: file.error };
  try {
    const existing = await store.getProjectsFresh();
    const parsed = validateProjectCsv(file.text, existing);
    if (!parsed.ok) return parsed;
    const rows = parsed.rows.map(withoutData);
    return {
      ok: true,
      rows,
      warnings: parsed.warnings,
      validCount: rows.filter((r) => !r.errors.length).length,
      csv: file.text,
    };
  } catch (err) {
    console.error("CSV preview failed", err);
    return { ok: false, error: "Couldn't check the file. Please try again." };
  }
}

export type CsvImportState =
  | { ok: true; message: string; imported: number; posterIssues: { row: number; title: string; reason: string }[] }
  | { ok: false; error: string; rows?: CsvRowResult[] };

class ImportAbort extends Error {
  constructor(public rows: CsvRowResult[]) {
    super("CSV rows no longer valid");
  }
}

/**
 * Step 2: all-or-nothing import. Re-validates on the server inside the write queue against the
 * current projects; if any row is invalid nothing is written. Posters were fetched + converted to
 * AVIF in the browser (same path as the form) and arrive as `poster-<row>` files; a failed fetch
 * arrives as `posterError-<row>`. Rows whose poster failed are imported unpublished without one.
 * One read and one write of projects.json for the whole batch.
 */
export async function importProjectCsvAction(formData: FormData): Promise<CsvImportState> {
  await requireAdmin();
  const csv = formData.get("csvText");
  if (typeof csv !== "string" || !csv) return { ok: false, error: "Upload the CSV again." };
  if (new TextEncoder().encode(csv).length > CSV_MAX_BYTES) return { ok: false, error: "The file is too large." };

  const savedPosters: string[] = [];
  try {
    const { added, result: posterIssues } = await store.createProjects(async (projects) => {
      const parsed = validateProjectCsv(csv, projects);
      if (!parsed.ok) throw new ImportAbort([]);
      if (parsed.rows.some((r) => r.errors.length)) throw new ImportAbort(parsed.rows);
      const issues: { row: number; title: string; reason: string }[] = [];
      const inputs: (ProjectInput & { slug: string })[] = [];
      // Names/slugs must also be unique against rows added earlier in this batch.
      const pending: Pick<Project, "id" | "poster" | "title" | "to" | "slug">[] = [...projects];
      for (const row of parsed.rows) {
        const data = row.data!;
        let poster: string | undefined;
        let published = data.published === true;
        if (row.posterUrl) {
          const file = formData.get(`poster-${row.row}`);
          const reason = formData.get(`posterError-${row.row}`);
          if (file instanceof File && file.size > 0) {
            const saved = await savePoster(file, posterNameCtx(data), { projects: pending });
            if (saved.ok) {
              poster = saved.path;
              savedPosters.push(saved.path);
            } else {
              issues.push({ row: row.row, title: data.title, reason: saved.error });
            }
          } else {
            issues.push({
              row: row.row,
              title: data.title,
              reason: typeof reason === "string" && reason ? reason : "Poster wasn't fetched.",
            });
          }
          if (!poster) published = false;
        }
        const slug = uniqueProjectSlug({ title: data.title, to: data.to }, pending);
        pending.push({ id: `csv-${row.row}`, poster, title: data.title, to: data.to, slug });
        inputs.push({ ...data, published, slug, poster, posterAlt: poster ? data.posterAlt : undefined });
      }
      return { inputs, result: issues };
    });
    // A Blob version conflict re-runs the batch; drop posters the final write doesn't reference.
    const kept = new Set(added.map((p) => p.poster));
    for (const p of savedPosters) if (!kept.has(p)) await deletePosterQuietly(p);
    revalidateProjects();
    for (const p of added) revalidatePath(Routes.project(p.slug));
    const n = added.length;
    return {
      ok: true,
      imported: n,
      posterIssues,
      message: `${n} project${n === 1 ? "" : "s"} imported${posterIssues.length ? `, ${posterIssues.length} without a poster (left unpublished)` : ""}.`,
    };
  } catch (err) {
    for (const p of savedPosters) await deletePosterQuietly(p);
    if (err instanceof ImportAbort) {
      return {
        ok: false,
        error: "Nothing was imported: some rows are no longer valid (for example a project with the same name was just added). Fix the file and upload it again.",
        rows: err.rows.map(withoutData),
      };
    }
    console.error("CSV import failed", err);
    return { ok: false, error: "Nothing was imported. Please try again." };
  }
}
