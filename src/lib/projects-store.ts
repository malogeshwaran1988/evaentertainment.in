import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Project, ProjectInput } from "@@/data/projects";
import { PROJECTS_SEED } from "@@/data/projects-seed";

const DATA_DIR = path.resolve(
  /*turbopackIgnore: true*/ process.env.EVA_DATA_DIR || "storage",
);
const FILE = path.join(DATA_DIR, "projects.json");

/** Serialises writes within this process so concurrent saves can't interleave. */
let writeQueue: Promise<unknown> = Promise.resolve();

async function writeAll(projects: Project[]) {
  await mkdir(DATA_DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
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

async function readAll(): Promise<Project[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Project[]) : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    const seeded = seedProjects();
    await writeAll(seeded);
    return seeded;
  }
}

function mutate<T>(fn: (projects: Project[]) => { next: Project[]; result: T }) {
  const run = writeQueue.then(async () => {
    const { next, result } = fn(await readAll());
    await writeAll(next);
    return result;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

/** Newest first. */
export async function getProjects(): Promise<Project[]> {
  const projects = await readAll();
  return [...projects].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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
