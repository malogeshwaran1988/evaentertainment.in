"use client";

import { fetchPosterFromUrlAction } from "@@/app/(admin)/admin/projects/actions";
import { POSTER_MAX_BYTES } from "@@/data/projects";
import { convertPosterToAvif } from "@@/lib/admin/poster-to-avif";

export type PosterBusyStep = "fetching" | "converting" | "saving";

function base64ToFile(base64: string, mime: string, filename: string): File {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}

/**
 * Server-fetch a remote image, then convert to AVIF in the browser.
 * Calls `onStep` before each phase.
 */
export async function loadPosterFromUrl(
  url: string,
  onStep?: (step: PosterBusyStep) => void,
): Promise<File> {
  onStep?.("fetching");
  const fetched = await fetchPosterFromUrlAction(url.trim());
  if (!fetched.ok) {
    throw new Error(fetched.error);
  }

  const source = base64ToFile(fetched.base64, fetched.mime, fetched.filename);
  onStep?.("converting");
  const result = await convertPosterToAvif(source);
  if (result.bytes > POSTER_MAX_BYTES) {
    throw new Error(
      `Converted poster is ${Math.ceil(result.bytes / 1024)} KB. The maximum is ${POSTER_MAX_BYTES / 1024} KB.`,
    );
  }
  return result.file;
}
