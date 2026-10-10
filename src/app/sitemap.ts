import type { MetadataRoute } from "next";
import { Routes, SERVICE_SLUGS, serviceHref } from "@@/constants/routes";
import { absoluteUrl } from "@@/lib/seo";

const lastModified = new Date("2026-10-11");

type Entry = [path: string, changeFrequency: "weekly" | "monthly" | "yearly", priority: number];

/** Thank You is noindex and old URLs redirect, so neither is listed. */
const ENTRIES: Entry[] = [
  [Routes.HOME, "weekly", 1],
  [Routes.SERVICES, "monthly", 0.9],
  ...SERVICE_SLUGS.map((slug): Entry => [serviceHref(slug), "monthly", 0.9]),
  [Routes.PROJECTS, "weekly", 0.8],
  [Routes.ABOUT, "monthly", 0.8],
  [Routes.EQUIPMENT, "monthly", 0.7],
  [Routes.CONTACT, "monthly", 0.8],
  [Routes.BOOK, "monthly", 0.8],
  [Routes.PRIVACY, "yearly", 0.3],
  [Routes.TERMS, "yearly", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ENTRIES.map(([path, changeFrequency, priority]) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));
}
