import "server-only";
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { blobPath, USE_BLOB } from "@@/lib/blob-path";
import { isNotFound, isPreconditionFailed, r2, r2Bucket, readR2Text } from "@@/lib/r2";

/** Remote storage is Cloudflare R2; without its keys (local dev) data stays on disk. */
export { USE_BLOB };

/** Thrown when a conditional write loses: ifMatch no longer matches, or the key exists and overwrite isn't allowed. */
export class BlobPreconditionFailedError extends Error {
  constructor() {
    super("Precondition failed: the object changed or already exists");
    this.name = "BlobPreconditionFailedError";
  }
}

/** Returns null when the object doesn't exist. */
export async function readBlob(pathname: string) {
  try {
    const res = await r2().send(new GetObjectCommand({ Bucket: r2Bucket(), Key: blobPath(pathname) }));
    if (!res.Body) return null;
    return {
      stream: res.Body.transformToWebStream(),
      contentType: res.ContentType ?? "application/octet-stream",
      size: res.ContentLength ?? 0,
    };
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

/** Plain text read for the public (cached) path. */
export function readBlobText(pathname: string): Promise<string | null> {
  return readR2Text(blobPath(pathname));
}

/** Write path only (admin saves): text plus the ETag that `writeBlob({ ifMatch })` expects. */
export async function readBlobVersioned(pathname: string) {
  try {
    const res = await r2().send(new GetObjectCommand({ Bucket: r2Bucket(), Key: blobPath(pathname) }));
    if (!res.Body || !res.ETag) return null;
    return { text: await res.Body.transformToString(), etag: res.ETag };
  } catch (err) {
    if (isNotFound(err)) return null;
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
    throw err;
  }
}

export async function deleteBlob(pathname: string) {
  await r2().send(new DeleteObjectCommand({ Bucket: r2Bucket(), Key: blobPath(pathname) }));
}

/** True when the object exists (a HEAD request; nothing is downloaded). */
export async function blobExists(pathname: string) {
  try {
    await r2().send(new HeadObjectCommand({ Bucket: r2Bucket(), Key: blobPath(pathname) }));
    return true;
  } catch (err) {
    if (isNotFound(err)) return false;
    throw err;
  }
}
