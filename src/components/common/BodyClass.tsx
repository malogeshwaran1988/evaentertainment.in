"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Routes } from "@@/constants/routes";

/** Applies legacy body classes used by Glory CSS (`home-page`, `is-loaded`). */
export default function BodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.add("is-loaded");
    const isHome = pathname === Routes.HOME;
    document.body.classList.toggle("home-page", isHome);
    return () => document.body.classList.remove("home-page");
  }, [pathname]);

  return null;
}
