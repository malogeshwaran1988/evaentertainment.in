import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp, { type OutputInfo } from "sharp";
import { unstable_cache } from "next/cache";
import {
  CLIENT_LOGO_FILE_PATTERN,
  CLIENT_LOGO_URL_PREFIX,
  CLIENTS_SEED,
  clientShapeFor,
  type Client,
} from "@@/data/clients";
import { POSTER_MAX_BYTES } from "@@/data/projects";
import { deleteBlob, readBlob, readBlobText, USE_BLOB, writeBlob } from "@@/lib/blob";
import { DATA_REVALIDATE_SECONDS } from "@@/lib/cache-tags";

/** Admin saves call updateTag(CLIENTS_TAG); public reads are one small Blob get per cache window. */
export const CLIENTS_TAG = "eva-clients";

const BLOB_FILE = "clients.json";
const DATA_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.EVA_DATA_DIR || "storage");
const FILE = path.join(DATA_DIR, "clients.json");
const LOGO_DIR = path.join(DATA_DIR, "client-logos");
const ONE_YEAR = 60 * 60 * 24 * 365;
/** Logos are small marks: stored at most 600 x 300 so the /clients grid stays light. */
const LOGO_MAX_W = 600;
const LOGO_MAX_H = 300;

/** Serialises writes within this process so two saves can't interleave. */
let writeQueue: Promise<unknown> = Promise.resolve();

function normalize(raw: unknown): Client[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((c): c is Record<string, unknown> => !!c && typeof c === "object")
    .filter((c) => typeof c.id === "string" && typeof c.name === "string" && typeof c.logo === "string")
    .map((c) => ({
      id: c.id as string,
      name: c.name as string,
      logo: c.logo as string,
      width: Number(c.width) || LOGO_MAX_W,
      height: Number(c.height) || LOGO_MAX_H,
      ...(c.shape === "square" || c.shape === "tall" ? { shape: c.shape } : {}),
      ...(typeof c.createdAt === "string" ? { createdAt: c.createdAt } : {}),
      ...(typeof c.updatedAt === "string" ? { updatedAt: c.updatedAt } : {}),
    }));
}

/** null = nothing stored yet. Throws when the store can't be read. */
async function readStored(): Promise<Client[] | null> {
  if (USE_BLOB) {
    const text = await readBlobText(BLOB_FILE);
    return text === null ? null : normalize(JSON.parse(text));
  }
  try {
    return normalize(JSON.parse(await readFile(FILE, "utf8")));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

/** Empty, missing or unreadable store: the original hard-coded list, so /clients never goes blank. */
async function readUncached(): Promise<Client[]> {
  try {
    const stored = await readStored();
    return stored && stored.length ? stored : CLIENTS_SEED;
  } catch (err) {
    console.error("Failed to read clients, showing the built-in list", err);
    return CLIENTS_SEED;
  }
}

const readCached = unstable_cache(readUncached, ["eva-clients-v1"], {
  tags: [CLIENTS_TAG],
  revalidate: DATA_REVALIDATE_SECONDS,
});

export function getClients() {
  return readCached();
}

/** Uncached, for the admin so it never edits a stale copy. */
export function getClientsFresh() {
  return readUncached();
}

export async function getClientFresh(id: string) {
  return (await readUncached()).find((c) => c.id === id) ?? null;
}

async function writeAll(clients: Client[]) {
  const body = `${JSON.stringify(clients, null, 2)}\n`;
  if (USE_BLOB) {
    await writeBlob(BLOB_FILE, body, { contentType: "application/json", allowOverwrite: true, cacheControlMaxAge: 60 });
    return;
  }
  await mkdir(DATA_DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, body, "utf8");
  await rename(tmp, FILE);
}

/**
 * Read-modify-write. The first save starts from the built-in list, which migrates the original
 * clients into the store. Reads uncached and never falls back silently: a failed read aborts the save.
 */
function mutate<T>(fn: (clients: Client[]) => { next: Client[]; result: T }): Promise<T> {
  const run = writeQueue.then(async () => {
    const stored = await readStored();
    const { next, result } = fn(stored && stored.length ? stored : CLIENTS_SEED.map((c) => ({ ...c })));
    await writeAll(next);
    return result;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

type LogoMeta = { logo: string; width: number; height: number };

export function createClient(input: { name: string } & LogoMeta) {
  return mutate((clients) => {
    const now = new Date().toISOString();
    const client: Client = {
      id: randomUUID(),
      name: input.name,
      logo: input.logo,
      width: input.width,
      height: input.height,
      ...(clientShapeFor(input.width, input.height) ? { shape: clientShapeFor(input.width, input.height) } : {}),
      createdAt: now,
      updatedAt: now,
    };
    return { next: [...clients, client], result: client };
  });
}

/** Pass logo fields only when a new logo was uploaded. */
export function updateClient(id: string, input: { name: string } & Partial<LogoMeta>) {
  return mutate((clients) => {
    const index = clients.findIndex((c) => c.id === id);
    if (index === -1) return { next: clients, result: null };
    const current = clients[index];
    const updated: Client = { ...current, name: input.name, updatedAt: new Date().toISOString() };
    if (input.logo && input.width && input.height) {
      updated.logo = input.logo;
      updated.width = input.width;
      updated.height = input.height;
      const shape = clientShapeFor(input.width, input.height);
      if (shape) updated.shape = shape;
      else delete updated.shape;
    }
    const next = [...clients];
    next[index] = updated;
    return { next, result: { previous: current, client: updated } };
  });
}

export function deleteClient(id: string) {
  return mutate((clients) => {
    const removed = clients.find((c) => c.id === id) ?? null;
    return { next: clients.filter((c) => c.id !== id), result: removed };
  });
}

const slugPart = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "logo";

/**
 * The form sends an AVIF made by the shared poster upload control (or any small image). It is
 * resized to fit 600 x 300 with transparency kept so every logo on /clients stays a few KB.
 */
export async function saveClientLogo(
  file: File,
  name: string,
): Promise<({ ok: true } & LogoMeta) | { ok: false; error: string }> {
  if (file.size > POSTER_MAX_BYTES) return { ok: false, error: `Use a logo under ${POSTER_MAX_BYTES / 1024} KB.` };
  let out: { data: Buffer; info: OutputInfo };
  try {
    out = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize(LOGO_MAX_W, LOGO_MAX_H, { fit: "inside", withoutEnlargement: true })
      .avif({ quality: 60 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    return { ok: false, error: "That file isn't a readable image. Try a PNG, WebP, JPG or AVIF." };
  }
  const fileName = `client-${slugPart(name)}-${Date.now().toString(36)}.avif`;
  if (USE_BLOB) {
    await writeBlob(`client-logos/${fileName}`, out.data, {
      contentType: "image/avif",
      cacheControlMaxAge: ONE_YEAR,
      allowOverwrite: true,
    });
  } else {
    await mkdir(LOGO_DIR, { recursive: true });
    await writeFile(path.join(LOGO_DIR, fileName), out.data);
  }
  return { ok: true, logo: `${CLIENT_LOGO_URL_PREFIX}${fileName}`, width: out.info.width, height: out.info.height };
}

/** Removes an uploaded logo; the original /public logos are never deleted. */
export async function deleteClientLogoQuietly(logo: string | undefined) {
  if (!logo?.startsWith(CLIENT_LOGO_URL_PREFIX)) return;
  const name = logo.slice(CLIENT_LOGO_URL_PREFIX.length);
  if (!CLIENT_LOGO_FILE_PATTERN.test(name)) return;
  try {
    if (USE_BLOB) await deleteBlob(`client-logos/${name}`);
    else await unlink(path.join(LOGO_DIR, name));
  } catch (err) {
    console.error("Failed to delete client logo", name, err);
  }
}

export async function readClientLogo(name: string) {
  if (!CLIENT_LOGO_FILE_PATTERN.test(name)) return null;
  if (USE_BLOB) {
    const blob = await readBlob(`client-logos/${name}`);
    return blob ? { body: blob.stream as BodyInit, size: blob.size } : null;
  }
  try {
    const buf = await readFile(path.join(LOGO_DIR, name));
    return { body: new Uint8Array(buf) as BodyInit, size: buf.length };
  } catch {
    return null;
  }
}
