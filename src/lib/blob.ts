import "server-only";
import { BlobNotFoundError, BlobPreconditionFailedError, del, get, head, put } from "@vercel/blob";
import { blobPath, USE_BLOB } from "@@/lib/blob-path";

/** Vercel sets the token when the Blob store is connected; without it (local dev) data stays on disk. */
export { USE_BLOB };

export { BlobPreconditionFailedError };

/** Returns null when the blob doesn't exist. */
export async function readBlob(pathname: string) {
  const result = await get(blobPath(pathname), { access: "private" });
  if (!result || result.statusCode !== 200) return null;
  return { stream: result.stream, contentType: result.blob.contentType, size: result.blob.size };
}

/**
 * Plain text read for the public (cached) path: one get() that Blob's CDN cache can answer, so a
 * HIT costs no Simple Operation. No head(): the ETag is only needed when writing.
 */
export async function readBlobText(pathname: string): Promise<string | null> {
  const result = await get(blobPath(pathname), { access: "private" });
  if (!result || result.statusCode !== 200) return null;
  return new Response(result.stream).text();
}

/**
 * Write path only (admin saves). Reads a blob's text with the ETag that `writeBlob({ ifMatch })` expects. The download's
 * own `etag` header is a different format and never matches, so the ETag comes from head(),
 * read before the content: a save landing in between makes our write fail and retry.
 */
export async function readBlobVersioned(pathname: string) {
  let etag: string;
  try {
    ({ etag } = await head(blobPath(pathname)));
  } catch (err) {
    if (err instanceof BlobNotFoundError) return null;
    throw err;
  }
  const result = await get(blobPath(pathname), { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return { text: await new Response(result.stream).text(), etag };
}

type WriteOptions = {
  contentType: string;
  /** Overwrite only if the blob still has this ETag; throws BlobPreconditionFailedError otherwise. */
  ifMatch?: string;
  allowOverwrite?: boolean;
  cacheControlMaxAge?: number;
};

export function writeBlob(pathname: string, body: Buffer | string, options: WriteOptions) {
  return put(blobPath(pathname), body, {
    access: "private",
    addRandomSuffix: false,
    ...options,
  });
}

export function deleteBlob(pathname: string) {
  return del(blobPath(pathname));
}

/** True when the blob exists (a HEAD request; nothing is downloaded). */
export async function blobExists(pathname: string) {
  try {
    await head(blobPath(pathname));
    return true;
  } catch (err) {
    if (err instanceof BlobNotFoundError) return false;
    throw err;
  }
}
