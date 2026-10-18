import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { Routes, SERVICE_SLUGS, serviceHref } from "@@/constants/routes";
import { getProjects } from "@@/lib/projects-store";
import { projectHref } from "@@/lib/project-seo";
import { absoluteUrl } from "@@/lib/seo";

const lastModified = new Date("2026-10-18");

type Entry = [path: string, changeFrequency: "weekly" | "monthly" | "yearly", priority: number];

/** All public indexable routes. Admin (/login, /admin) stays out. */
const ENTRIES: Entry[] = [
  [Routes.HOME, "weekly", 1],
  ...SERVICE_SLUGS.map((slug): Entry => [serviceHref(slug), "monthly", 0.9]),
  [Routes.PROJECTS, "weekly", 0.8],
  [Routes.ABOUT, "monthly", 0.8],
  [Routes.EQUIPMENT, "monthly", 0.7],
  [Routes.CONTACT, "monthly", 0.8],
  [Routes.BOOK, "monthly", 0.8],
  [Routes.THANK_YOU, "yearly", 0.2],
  [Routes.PRIVACY, "yearly", 0.3],
  [Routes.TERMS, "yearly", 0.3],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Projects change from the admin panel without a redeploy.
  await connection();

  const staticEntries = ENTRIES.map(([path, changeFrequency, priority]) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));

  const projects = await getProjects();
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(projectHref(project.slug)),
    lastModified: new Date(project.updatedAt || project.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...projectEntries];
}
