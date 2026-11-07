/**
 * Read path shared by blob.ts and src/proxy.ts (no `server-only`, the proxy imports it).
 * Public reads are a plain fetch of the Cloudflare cdn URL (cdn.evaentertainment.in in front of R2),
 * so they cost no S3 operation and Cloudflare's cache absorbs repeats. Vercel Blob is no longer used.
 */
import { R2_CONFIGURED, R2_MISSING_VARS } from "@@/lib/blob-path";

export type RemoteObject = { stream: ReadableStream; contentType: string; size: number };

const CDN_BASE = (
  process.env.R2_PUBLIC_URL ||
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ||
  "https://cdn.evaentertainment.in"
).replace(/\/$/, "");

let warnedMissing = false;

/** Logs what went wrong without any secret: error name, HTTP status and the key. */
export function logR2Error(op: string, key: string, err: unknown) {
  const e = err as { name?: string; Code?: string; message?: string; $metadata?: { httpStatusCode?: number } };
  console.error(
    `[storage] R2 ${op} failed key=${key} name=${e?.name ?? "unknown"} code=${e?.Code ?? "-"} status=${e?.$metadata?.httpStatusCode ?? "-"}`,
  );
}

const cdnUrl = (key: string) => `${CDN_BASE}/${key.split("/").map(encodeURIComponent).join("/")}`;

/** Full key in; null when the object doesn't exist. */
export async function readRemote(key: string): Promise<RemoteObject | null> {
  if (!R2_CONFIGURED && !warnedMissing) {
    warnedMissing = true;
    console.error(`[storage] R2 write keys missing: ${R2_MISSING_VARS.join(",")}; reads still use the cdn`);
  }
  // no-store keeps Next/Vercel's data cache out of it; Cloudflare caches at the edge instead.
  const res = await fetch(cdnUrl(key), { cache: "no-store" });
  if (res.status === 404 || res.status === 403) return null;
  if (!res.ok || !res.body) {
    console.error(`[storage] cdn read failed key=${key} status=${res.status}`);
    throw new Error(`cdn read failed: ${res.status}`);
  }
  return {
    stream: res.body,
    contentType: res.headers.get("content-type") ?? "application/octet-stream",
    size: Number(res.headers.get("content-length") ?? 0),
  };
}

export async function readRemoteText(key: string): Promise<string | null> {
  const obj = await readRemote(key);
  return obj ? new Response(obj.stream).text() : null;
}
