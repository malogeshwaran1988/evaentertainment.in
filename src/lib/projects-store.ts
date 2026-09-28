import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { compareProjects, type Project, type ProjectInput } from "@@/data/projects";
import { PROJECTS_SEED } from "@@/data/projects-seed";
import { BlobPreconditionFailedError, readBlobVersioned, USE_BLOB, writeBlob } from "@@/lib/blob";

const DATA_DIR = path.resolve(
  /*turbopackIgnore: true*/ process.env.EVA_DATA_DIR || "storage",
);
const FILE = path.join(DATA_DIR, "projects.json");
const BLOB_FILE = "projects.json";
const MAX_WRITE_ATTEMPTS = 3;

/** Serialises writes within this process so concurrent saves can't interleave. */
let writeQueue: Promise<unknown> = Promise.resolve();

/** `etag` is the Blob version that was read; writes fail if another instance saved since. */
type Snapshot = { projects: Project[]; etag?: string };

const serialize = (projects: Project[]) => `${JSON.stringify(projects, null, 2)}\n`;

function parseProjects(raw: string): Project[] {
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? (parsed as Project[]) : [];
}

/** Returns the new Blob ETag (undefined on disk). */
async function writeAll(projects: Project[], etag?: string): Promise<string | undefined> {
  if (USE_BLOB) {
    const saved = await writeBlob(BLOB_FILE, serialize(projects), {
      contentType: "application/json",
      ...(etag ? { ifMatch: etag } : { allowOverwrite: false }),
    });
    return saved.etag;
  }
  await mkdir(DATA_DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, serialize(projects), "utf8");
  await rename(tmp, FILE);
}

function seedProjects(): Project[] {
  // Seed order is newest first, so give earlier entries later timestamps.
  const base = Date.now();
  return PROJECTS_SEED.map((p, i) => {
    const at = new Date(base - i * 1000).toISOString();
    return { ...p, id: randomUUID(), createdAt: at, updatedAt: at };
  });
}

async function fetchBlobSnapshot(): Promise<Snapshot | null> {
  const blob = await readBlobVersioned(BLOB_FILE);
  if (!blob) return null;
  return { projects: parseProjects(blob.text), etag: blob.etag };
}

async function readBlobSnapshot(): Promise<Snapshot> {
  const existing = await fetchBlobSnapshot();
  if (existing) return existing;
  const seeded = seedProjects();
  try {
    return { projects: seeded, etag: await writeAll(seeded) };
  } catch (err) {
    // Another instance seeded first; use its copy.
    const theirs = await fetchBlobSnapshot();
    if (!theirs) throw err;
    return theirs;
  }
}

async function readSnapshot(): Promise<Snapshot> {
  if (USE_BLOB) return readBlobSnapshot();
  try {
    return { projects: parseProjects(await readFile(FILE, "utf8")) };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    const seeded = seedProjects();
    await writeAll(seeded);
    return { projects: seeded };
  }
}

async function readAll(): Promise<Project[]> {
  return (await readSnapshot()).projects;
}

function mutate<T>(fn: (projects: Project[]) => { next: Project[]; result: T }) {
  const run = writeQueue.then(async () => {
    for (let attempt = 1; ; attempt++) {
      const { projects, etag } = await readSnapshot();
      const { next, result } = fn(projects);
      try {
        await writeAll(next, etag);
        return result;
      } catch (err) {
        const conflict = err instanceof BlobPreconditionFailedError;
        if (!conflict || attempt >= MAX_WRITE_ATTEMPTS) throw err;
      }
    }
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

/** Ongoing first, then newest year; see compareProjects. */
export async function getProjects(): Promise<Project[]> {
  const projects = await readAll();
  return [...projects].sort(compareProjects);
}

export async function getProject(id: string) {
  return (await readAll()).find((p) => p.id === id) ?? null;
}

export function createProject(input: ProjectInput) {
  return mutate((projects) => {
    const now = new Date().toISOString();
    const project: Project = { ...input, id: randomUUID(), createdAt: now, updatedAt: now };
    if (!project.poster) delete project.poster;
    if (!project.posterAlt) delete project.posterAlt;
    return { next: [...projects, project], result: project };
  });
}

/** `input.poster` and `input.posterAlt` are final values: pass `undefined` to clear them. */
export function updateProject(id: string, input: ProjectInput) {
  return mutate((projects) => {
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return { next: projects, result: null };
    const updated: Project = {
      ...projects[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    if (!updated.poster) delete updated.poster;
    if (!updated.posterAlt) delete updated.posterAlt;
    const next = [...projects];
    next[index] = updated;
    return { next, result: updated };
  });
}

/** Returns the removed project, or null if it didn't exist. */
export function deleteProject(id: string) {
  return mutate((projects) => {
    const removed = projects.find((p) => p.id === id) ?? null;
    const next = projects.filter((p) => p.id !== id);
    return { next, result: removed };
  });
}
