"use client";

import { useEffect } from "react";
import { LEGACY_SERVICE_HASHES, serviceHref } from "@@/constants/routes";

/** Sends old `/services#Lip-Sync`-style links to the matching service page (hashes never reach the server). */
export default function LegacyServiceHash() {
  useEffect(() => {
    const slug = LEGACY_SERVICE_HASHES[decodeURIComponent(window.location.hash.slice(1))];
    if (slug) window.location.replace(serviceHref(slug));
  }, []);
  return null;
}
