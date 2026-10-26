"use server";

import { revalidateContent } from "@@/lib/revalidate-content";
import { FOUNDER_FEATURED_MAX, FOUNDER_HIGHLIGHTS_MAX } from "@@/data/founder";
import { projectIsPublished } from "@@/data/projects";
import { requireAdmin } from "@@/lib/admin-auth";
import { getFounderFresh, saveFounder, saveFounderPhoto } from "@@/lib/founder-store";
import { getProjectsFresh } from "@@/lib/projects-store";

export type FounderFormState = { ok?: boolean; message?: string };

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const clean = (v: FormDataEntryValue | null, max: number) =>
  (typeof v === "string" ? v : "").replace(CONTROL, "").trim().slice(0, max);

export async function saveFounderAction(
  _prev: FounderFormState,
  formData: FormData,
): Promise<FounderFormState> {
  await requireAdmin();
  const current = await getFounderFresh();

  const name = clean(formData.get("name"), 120);
  if (!name) return { message: "Enter the founder's name." };
  const linkedinUrl = clean(formData.get("linkedinUrl"), 300);
  if (linkedinUrl && !/^https:\/\/([a-z]{2,3}\.)?linkedin\.com\//i.test(linkedinUrl)) {
    return { message: "The LinkedIn URL must start with https://www.linkedin.com/ (or leave it empty to hide the button)." };
  }
  const bio = clean(formData.get("bio"), 3000)
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean)
    .slice(0, 6);
  const highlights = Array.from({ length: FOUNDER_HIGHLIGHTS_MAX }, (_, i) => ({
    value: clean(formData.get(`highlightValue${i}`), 60),
    label: clean(formData.get(`highlightLabel${i}`), 120),
  })).filter((h) => h.value || h.label);

  const published = new Set((await getProjectsFresh()).filter(projectIsPublished).map((p) => p.id));
  const featuredProjectIds = formData
    .getAll("featured")
    .filter((v): v is string => typeof v === "string" && published.has(v))
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, FOUNDER_FEATURED_MAX);

  let photo = current.photo;
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    const saved = await saveFounderPhoto(file);
    if (!saved.ok) return { message: saved.error };
    photo = saved.path;
  }

  try {
    await saveFounder({
      name,
      title: clean(formData.get("title"), 160),
      photo,
      photoAlt: clean(formData.get("photoAlt"), 200) || `${name}, founder of EVA Entertainment`,
      linkedinUrl,
      bio,
      highlights,
      featuredProjectIds,
    });
  } catch (err) {
    console.error("Failed to save founder", err);
    return { message: "Couldn't save. Please try again." };
  }
  revalidateContent("founder");
  return { ok: true, message: "Saved. The About page is updated." };
}
