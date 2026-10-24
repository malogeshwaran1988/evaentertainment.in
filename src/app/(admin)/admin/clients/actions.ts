"use server";

import { revalidatePath, updateTag } from "next/cache";
import { Routes } from "@@/constants/routes";
import { CLIENT_NAME_MAX } from "@@/data/clients";
import { requireAdmin } from "@@/lib/admin-auth";
import { AdminRoutes } from "@@/lib/admin-session";
import {
  CLIENTS_TAG,
  createClient,
  deleteClient,
  deleteClientLogoQuietly,
  getClientsFresh,
  saveClientLogo,
  updateClient,
} from "@@/lib/clients-store";

export type ClientFormState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: { name?: string; logo?: string };
};

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const cleanName = (v: FormDataEntryValue | null) =>
  (typeof v === "string" ? v : "").replace(CONTROL, "").replace(/\s+/g, " ").trim().slice(0, CLIENT_NAME_MAX);
const nameKey = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "");

function logoFile(formData: FormData) {
  const value = formData.get("logo");
  return value instanceof File && value.size > 0 ? value : null;
}

function revalidateClients() {
  updateTag(CLIENTS_TAG);
  revalidatePath(Routes.CLIENTS);
  revalidatePath("/projects/[slug]", "page");
  revalidatePath(AdminRoutes.CLIENTS);
}

async function duplicate(name: string, exceptId?: string): Promise<ClientFormState | null> {
  const clash = (await getClientsFresh()).find((c) => c.id !== exceptId && nameKey(c.name) === nameKey(name));
  if (!clash) return null;
  const message = `A client named “${clash.name}” already exists.`;
  return { fieldErrors: { name: message }, message };
}

export async function createClientAction(_prev: ClientFormState, formData: FormData): Promise<ClientFormState> {
  await requireAdmin();
  const name = cleanName(formData.get("name"));
  const file = logoFile(formData);
  const fieldErrors: ClientFormState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Enter the client name.";
  if (!file) fieldErrors.logo = "Upload the client logo.";
  if (fieldErrors.name || fieldErrors.logo) return { fieldErrors, message: "Please fix the highlighted fields." };
  let logo: string | undefined;
  try {
    const clash = await duplicate(name);
    if (clash) return clash;
    const saved = await saveClientLogo(file!, name);
    if (!saved.ok) return { fieldErrors: { logo: saved.error }, message: saved.error };
    logo = saved.logo;
    const client = await createClient({ name, logo: saved.logo, width: saved.width, height: saved.height });
    revalidateClients();
    return { ok: true, message: `“${client.name}” added.` };
  } catch (err) {
    console.error("Failed to create client", err);
    await deleteClientLogoQuietly(logo);
    return { message: "Couldn't save the client. Please try again." };
  }
}

export async function updateClientAction(
  id: string,
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  await requireAdmin();
  const name = cleanName(formData.get("name"));
  if (!name) return { fieldErrors: { name: "Enter the client name." }, message: "Please fix the highlighted fields." };
  let uploaded: string | undefined;
  try {
    const clash = await duplicate(name, id);
    if (clash) return clash;
    const file = logoFile(formData);
    let logoMeta = {};
    if (file) {
      const saved = await saveClientLogo(file, name);
      if (!saved.ok) return { fieldErrors: { logo: saved.error }, message: saved.error };
      uploaded = saved.logo;
      logoMeta = { logo: saved.logo, width: saved.width, height: saved.height };
    }
    const result = await updateClient(id, { name, ...logoMeta });
    if (!result) {
      await deleteClientLogoQuietly(uploaded);
      return { message: "This client no longer exists." };
    }
    if (uploaded && result.previous.logo !== uploaded) await deleteClientLogoQuietly(result.previous.logo);
    revalidateClients();
    revalidatePath(`${AdminRoutes.CLIENTS}/${id}/edit`);
    return { ok: true, message: `“${result.client.name}” updated.` };
  } catch (err) {
    console.error("Failed to update client", id, err);
    await deleteClientLogoQuietly(uploaded);
    return { message: "Couldn't save the client. Please try again." };
  }
}

export async function deleteClientAction(id: string): Promise<ClientFormState> {
  await requireAdmin();
  let removed;
  try {
    removed = await deleteClient(id);
  } catch (err) {
    console.error("Failed to delete client", id, err);
    return { message: "Couldn't delete the client. Please try again." };
  }
  if (!removed) return { message: "This client was already deleted." };
  await deleteClientLogoQuietly(removed.logo);
  revalidateClients();
  return { ok: true, message: `“${removed.name}” deleted.` };
}
