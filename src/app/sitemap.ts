import type { MetadataRoute } from "next";
import { APP_BASE_URL } from "@@/constants/constants";
import { Routes } from "@@/constants/routes";

const lastModified = new Date("2026-09-23");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${APP_BASE_URL}${Routes.HOME}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${APP_BASE_URL}${Routes.ABOUT}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${APP_BASE_URL}${Routes.SERVICES}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${APP_BASE_URL}${Routes.EQUIPMENT}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${APP_BASE_URL}${Routes.CONTACT}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${APP_BASE_URL}${Routes.BOOK}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${APP_BASE_URL}${Routes.PRIVACY}`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${APP_BASE_URL}${Routes.TERMS}`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
