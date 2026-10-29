import "server-only";
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  BlobNotFoundError,
  BlobPreconditionFailedError as VercelBlobPreconditionFailedError,
  del,
  get,
  head,
  put,
} from "@vercel/blob";
import { blobPath, PRIMARY_STORE, USE_BLOB } from "@@/lib/blob-path";
import { isNotFound, isPreconditionFailed, r2, r2Bucket } from "@@/lib/r2";
import { logR2Error, readRemote, readRemoteText } from "@@/lib/storage-read";

/**
 * Remote storage: Cloudflare R2 when its four keys are set, Vercel Blob otherwise. Reads fall back
 * to Vercel Blob when R2 misses or errors (see storage-read.ts). Writes go to one store only, so
 * an ETag from readBlobVersioned always matches the store writeBlob uses.
 */
export { USE_BLOB };

/** Thrown when a conditional write loses: ifMatch no longer matches, or the key exists and overwrite isn't allowed. */
export class BlobPreconditionFailedError extends Error {
  constructor() {
    super("Precondition failed: the object changed or already exists");
    this.name = "BlobPreconditionFailedError";
  }
}

/** Returns null when the object doesn't exist in either store. */
export function readBlob(pathname: string) {
  return readRemote(blobPath(pathname));
}

/** Plain text read for the public (cached) path. */
export function readBlobText(pathname: string): Promise<string | null> {
  return readRemoteText(blobPath(pathname));
}

/** Write path only (admin saves): text plus the ETag that `writeBlob({ ifMatch })` expects. */
export async function readBlobVersioned(pathname: string) {
  const key = blobPath(pathname);
  if (PRIMARY_STORE === "vercel-blob") {
    let etag: string;
    try {
      ({ etag } = await head(key));
    } catch (err) {
      if (err instanceof BlobNotFoundError) return null;
      throw err;
    }
    const result = await get(key, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return { text: await new Response(result.stream).text(), etag };
  }
  try {
    const res = await r2().send(new GetObjectCommand({ Bucket: r2Bucket(), Key: key }));
    if (!res.Body || !res.ETag) return null;
    return { text: await res.Body.transformToString(), etag: res.ETag };
  } catch (err) {
    if (isNotFound(err)) return null;
    logR2Error("versioned read", key, err);
    throw err;
  }
}

type WriteOptions = {
  contentType: string;
  /** Overwrite only if the object still has this ETag; throws BlobPreconditionFailedError otherwise. */
  ifMatch?: string;
  allowOverwrite?: boolean;
  cacheControlMaxAge?: number;
};

export async function writeBlob(pathname: string, body: Buffer | string, options: WriteOptions) {
  const key = blobPath(pathname);
  if (PRIMARY_STORE === "vercel-blob") {
    try {
      const res = await put(key, body, { access: "private", addRandomSuffix: false, ...options });
      return { pathname: res.pathname, etag: res.etag };
    } catch (err) {
      if (err instanceof VercelBlobPreconditionFailedError) throw new BlobPreconditionFailedError();
      throw err;
    }
  }
  try {
    const res = await r2().send(
      new PutObjectCommand({
        Bucket: r2Bucket(),
        Key: key,
        Body: body,
        ContentType: options.contentType,
        CacheControl:
          options.cacheControlMaxAge !== undefined ? `public, max-age=${options.cacheControlMaxAge}` : undefined,
        IfMatch: options.ifMatch,
        // Same default as Vercel Blob: refuse to replace an existing object unless asked to.
        IfNoneMatch: !options.ifMatch && !options.allowOverwrite ? "*" : undefined,
      }),
    );
    return { pathname: key, etag: res.ETag ?? "" };
  } catch (err) {
    if (isPreconditionFailed(err)) throw new BlobPreconditionFailedError();
    logR2Error("write", key, err);
    throw err;
  }
}

export async function deleteBlob(pathname: string) {
  const key = blobPath(pathname);
  if (PRIMARY_STORE === "vercel-blob") return del(key);
  try {
    await r2().send(new DeleteObjectCommand({ Bucket: r2Bucket(), Key: key }));
  } catch (err) {
    logR2Error("delete", key, err);
    throw err;
  }
}

/** True when the object exists in the write store (a HEAD request; nothing is downloaded). */
export async function blobExists(pathname: string) {
  const key = blobPath(pathname);
  try {
    if (PRIMARY_STORE === "vercel-blob") await head(key);
    else await r2().send(new HeadObjectCommand({ Bucket: r2Bucket(), Key: key }));
    return true;
  } catch (err) {
    if (err instanceof BlobNotFoundError || isNotFound(err)) return false;
    if (PRIMARY_STORE === "r2") logR2Error("head", key, err);
    throw err;
  }
}
