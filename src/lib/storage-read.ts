/**
 * Read path shared by blob.ts and src/proxy.ts (no `server-only`, the proxy imports it).
 * R2 first; when R2 has no such key or errors, the same key is read from Vercel Blob so the site
 * keeps working while the migration settles. Every R2 failure is logged by error name only.
 */
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { get } from "@vercel/blob";
import { BLOB_CONFIGURED, R2_CONFIGURED, R2_MISSING_VARS } from "@@/lib/blob-path";
import { isNotFound, r2, r2Bucket } from "@@/lib/r2";

export type RemoteObject = { stream: ReadableStream; contentType: string; size: number };

let warnedMissing = false;

/** Logs what went wrong without any secret: error name, HTTP status and the key. */
export function logR2Error(op: string, key: string, err: unknown) {
  const e = err as { name?: string; Code?: string; message?: string; $metadata?: { httpStatusCode?: number } };
  console.error(
    `[storage] R2 ${op} failed key=${key} name=${e?.name ?? "unknown"} code=${e?.Code ?? "-"} status=${e?.$metadata?.httpStatusCode ?? "-"}`,
  );
}

async function readFromR2(key: string): Promise<RemoteObject | null> {
  const res = await r2().send(new GetObjectCommand({ Bucket: r2Bucket(), Key: key }));
  if (!res.Body) return null;
  return {
    stream: res.Body.transformToWebStream() as ReadableStream,
    contentType: res.ContentType ?? "application/octet-stream",
    size: res.ContentLength ?? 0,
  };
}

async function readFromVercelBlob(key: string): Promise<RemoteObject | null> {
  const result = await get(key, { access: "private" });
  if (!result || result.statusCode !== 200) return null;
  return { stream: result.stream, contentType: result.blob.contentType, size: result.blob.size };
}

/** Full key in; null only when neither store has it. */
export async function readRemote(key: string): Promise<RemoteObject | null> {
  if (R2_CONFIGURED) {
    try {
      const obj = await readFromR2(key);
      if (obj) return obj;
      console.error(`[storage] R2 read returned no body key=${key}`);
    } catch (err) {
      logR2Error(isNotFound(err) ? "read (not found)" : "read", key, err);
      if (!BLOB_CONFIGURED) {
        if (isNotFound(err)) return null;
        throw err;
      }
    }
  } else if (!warnedMissing) {
    warnedMissing = true;
    console.error(`[storage] R2 not configured, missing env: ${R2_MISSING_VARS.join(",")}; using Vercel Blob`);
  }
  if (!BLOB_CONFIGURED) return null;
  const obj = await readFromVercelBlob(key);
  if (obj && R2_CONFIGURED) console.error(`[storage] served from Vercel Blob fallback key=${key}`);
  return obj;
}

export async function readRemoteText(key: string): Promise<string | null> {
  const obj = await readRemote(key);
  return obj ? new Response(obj.stream).text() : null;
}
