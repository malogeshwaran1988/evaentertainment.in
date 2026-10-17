import "server-only";
import { lookup as dnsLookup, type LookupAddress } from "node:dns";
import http from "node:http";
import https from "node:https";
import { BlockList, isIP } from "node:net";

/** Match client poster source cap in poster-to-avif.ts. */
const POSTER_SOURCE_MAX_BYTES = 25 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 20_000;
const MAX_REDIRECTS = 3;
const MAX_URL_LENGTH = 2048;

/** Private, loopback, link-local (incl. cloud metadata 169.254.169.254), CGNAT, multicast, reserved. */
const BLOCKED = new BlockList();
for (const [net, prefix] of [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8], ["169.254.0.0", 16],
  ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.0.2.0", 24], ["192.88.99.0", 24], ["192.168.0.0", 16],
  ["198.18.0.0", 15], ["198.51.100.0", 24], ["203.0.113.0", 24], ["224.0.0.0", 4], ["240.0.0.0", 4],
] as const) BLOCKED.addSubnet(net, prefix, "ipv4");
for (const [net, prefix] of [
  ["::", 128], ["::1", 128], ["64:ff9b::", 96], ["100::", 64], ["2001:db8::", 32],
  ["fc00::", 7], ["fe80::", 10], ["ff00::", 8],
] as const) BLOCKED.addSubnet(net, prefix, "ipv6");

export function isBlockedAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 0) return true;
  if (family === 6) {
    const mapped = address.toLowerCase().match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return BLOCKED.check(mapped[1], "ipv4");
    return BLOCKED.check(address, "ipv6");
  }
  return BLOCKED.check(address, "ipv4");
}

/**
 * DNS lookup used for the actual socket connection, so the IP that is checked is the IP that is
 * connected to (no DNS-rebinding gap between check and fetch).
 */
function safeLookup(
  hostname: string,
  options: object,
  callback: (err: NodeJS.ErrnoException | null, address: string | LookupAddress[], family?: number) => void,
) {
  dnsLookup(hostname, { all: true }, (err, addresses) => {
    if (err) return callback(err, "");
    const list = addresses as LookupAddress[];
    if (!list.length || list.some((a) => isBlockedAddress(a.address))) {
      const e = new Error("BLOCKED_ADDRESS") as NodeJS.ErrnoException;
      e.code = "EBLOCKED";
      return callback(e, "");
    }
    if ((options as { all?: boolean }).all) return callback(null, list);
    callback(null, list[0].address, list[0].family);
  });
}

class FetchError extends Error {}

type RawResponse = { status: number; headers: http.IncomingHttpHeaders; body: Buffer };

function validateTarget(url: URL): string | null {
  if (url.protocol !== "http:" && url.protocol !== "https:") return "Use an http or https image URL.";
  if (url.username || url.password) return "URLs with credentials are not allowed.";
  if (url.port && url.port !== "80" && url.port !== "443") return "Only standard ports (80/443) are allowed.";
  const host = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    return "That address is not allowed.";
  }
  if (isIP(host) && isBlockedAddress(host)) return "That address is not allowed.";
  return null;
}

/** One GET with a byte cap; never follows redirects itself. */
function getOnce(url: URL, signal: AbortSignal): Promise<RawResponse> {
  return new Promise((resolve, reject) => {
    const mod = url.protocol === "https:" ? https : http;
    const req = mod.request(
      url,
      {
        method: "GET",
        lookup: safeLookup as never,
        signal,
        headers: {
          Accept: "image/avif,image/webp,image/png,image/jpeg,image/gif,image/bmp;q=0.9",
          "User-Agent": "EVA-Entertainment-Admin/1.0",
        },
      },
      (res) => {
        const status = res.statusCode || 0;
        if (status >= 300 && status < 400) {
          res.resume();
          return resolve({ status, headers: res.headers, body: Buffer.alloc(0) });
        }
        const declared = Number(res.headers["content-length"] || 0);
        if (declared > POSTER_SOURCE_MAX_BYTES) {
          res.destroy();
          return reject(new FetchError("TOO_LARGE"));
        }
        const chunks: Buffer[] = [];
        let total = 0;
        res.on("data", (c: Buffer) => {
          total += c.length;
          if (total > POSTER_SOURCE_MAX_BYTES) {
            res.destroy();
            reject(new FetchError("TOO_LARGE"));
            return;
          }
          chunks.push(c);
        });
        res.on("end", () => resolve({ status, headers: res.headers, body: Buffer.concat(chunks) }));
        res.on("error", reject);
      },
    );
    req.on("error", reject);
    req.end();
  });
}

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
  let decoded = leaf;
  try {
    decoded = decodeURIComponent(leaf);
  } catch {
    /* keep raw */
  }
  decoded = decoded.replace(/[^\w.\- ]+/g, "_").slice(0, 100);
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

  if (trimmed.length > MAX_URL_LENGTH) {
    return { ok: false, error: "That URL is too long." };
  }
  const invalid = validateTarget(url);
  if (invalid) return { ok: false, error: invalid };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    let res: RawResponse | null = null;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      res = await getOnce(url, controller.signal);
      if (res.status < 300 || res.status >= 400) break;
      const loc = res.headers.location;
      if (!loc || hop === MAX_REDIRECTS) {
        return { ok: false, error: "Too many redirects. Use a direct image URL." };
      }
      url = new URL(loc, url);
      const bad = validateTarget(url);
      if (bad) return { ok: false, error: bad };
    }
    if (!res || res.status < 200 || res.status >= 300) {
      return {
        ok: false,
        error: `Could not download the image (HTTP ${res?.status ?? 0}). Try another URL.`,
      };
    }

    const buf = res.body;
    if (buf.byteLength === 0) {
      return { ok: false, error: "The URL returned an empty file." };
    }

    const sniffed = sniffSourceImage(buf);
    if (!sniffed) {
      return {
        ok: false,
        error:
          "That URL is not a supported image. Use a direct link to a JPG, PNG, WebP, GIF, BMP or AVIF file.",
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
    if (err instanceof FetchError && err.message === "TOO_LARGE") {
      return {
        ok: false,
        error: `Image is too large (max ${Math.round(POSTER_SOURCE_MAX_BYTES / (1024 * 1024))} MB).`,
      };
    }
    if ((err as NodeJS.ErrnoException).code === "EBLOCKED") {
      return { ok: false, error: "That address is not allowed." };
    }
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
