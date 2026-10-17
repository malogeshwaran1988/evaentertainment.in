import "server-only";

/** Match client poster source cap in poster-to-avif.ts. */
const POSTER_SOURCE_MAX_BYTES = 25 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 30_000;

const EXT_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  bmp: "image/bmp",
  avif: "image/avif",
};

export type FetchedPosterImage =
  | {
      ok: true;
      /** Base64 of the raw image bytes (no data: prefix). */
      base64: string;
      mime: string;
      filename: string;
      bytes: number;
    }
  | { ok: false; error: string };

/** Detects jpeg/png/webp/gif/bmp/avif from magic bytes. */
export function sniffSourceImage(bytes: Buffer): { ext: string; mime: string } | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { ext: "jpg", mime: "image/jpeg" };
  }
  if (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return { ext: "png", mime: "image/png" };
  }
  if (
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { ext: "webp", mime: "image/webp" };
  }
  if (bytes.length >= 6) {
    const head = bytes.toString("ascii", 0, 6);
    if (head === "GIF87a" || head === "GIF89a") {
      return { ext: "gif", mime: "image/gif" };
    }
  }
  if (bytes.length >= 2 && bytes[0] === 0x42 && bytes[1] === 0x4d) {
    return { ext: "bmp", mime: "image/bmp" };
  }
  if (bytes.length >= 12 && bytes.toString("ascii", 4, 8) === "ftyp") {
    const brand = bytes.toString("ascii", 8, 12);
    if (brand === "avif" || brand === "avis") {
      return { ext: "avif", mime: "image/avif" };
    }
  }
  return null;
}

function filenameFromUrl(url: URL, ext: string): string {
  const leaf = url.pathname.split("/").pop()?.split("?")[0]?.trim() || "poster";
  const decoded = decodeURIComponent(leaf);
  if (/\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(decoded)) return decoded;
  return `${decoded.replace(/\.[^.]+$/, "") || "poster"}.${ext}`;
}

/**
 * Downloads an image from a public http(s) URL for admin poster import.
 * Call only after requireAdmin().
 */
export async function fetchPosterImageFromUrl(rawUrl: string): Promise<FetchedPosterImage> {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { ok: false, error: "Paste an image URL." };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { ok: false, error: "That does not look like a valid URL." };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, error: "Use an http or https image URL." };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        Accept: "image/*,*/*;q=0.8",
        "User-Agent": "EVA-Entertainment-Admin/1.0",
      },
    });

    if (!res.ok) {
      return {
        ok: false,
        error: `Could not download the image (HTTP ${res.status}). Try another URL.`,
      };
    }

    const contentLength = Number(res.headers.get("content-length") || 0);
    if (contentLength > POSTER_SOURCE_MAX_BYTES) {
      return {
        ok: false,
        error: `Image is too large (max ${Math.round(POSTER_SOURCE_MAX_BYTES / (1024 * 1024))} MB).`,
      };
    }

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength === 0) {
      return { ok: false, error: "The URL returned an empty file." };
    }
    if (buf.byteLength > POSTER_SOURCE_MAX_BYTES) {
      return {
        ok: false,
        error: `Image is too large (max ${Math.round(POSTER_SOURCE_MAX_BYTES / (1024 * 1024))} MB).`,
      };
    }

    const sniffed = sniffSourceImage(buf);
    if (!sniffed) {
      const ct = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
      const fromHeader = Object.entries(EXT_MIME).find(([, mime]) => mime === ct);
      if (!fromHeader) {
        return {
          ok: false,
          error:
            "That URL is not a supported image. Use a direct link to a JPG, PNG, WebP, GIF, BMP or AVIF file.",
        };
      }
      return {
        ok: true,
        base64: buf.toString("base64"),
        mime: fromHeader[1],
        filename: filenameFromUrl(url, fromHeader[0] === "jpeg" ? "jpg" : fromHeader[0]),
        bytes: buf.byteLength,
      };
    }

    return {
      ok: true,
      base64: buf.toString("base64"),
      mime: sniffed.mime,
      filename: filenameFromUrl(url, sniffed.ext),
      bytes: buf.byteLength,
    };
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      return { ok: false, error: "Download timed out. Try another URL or upload the file instead." };
    }
    console.error("fetchPosterImageFromUrl", err);
    return {
      ok: false,
      error: "Could not download that image. Use a direct image URL (not a Google search page).",
    };
  } finally {
    clearTimeout(timer);
  }
}
