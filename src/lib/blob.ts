import "server-only";
import { BlobPreconditionFailedError, del, get, put } from "@vercel/blob";

/** Vercel sets the token when the Blob store is connected; without it (local dev) data stays on disk. */
export const USE_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** The store may be shared with other sites, so everything EVA writes lives under this folder. */
const BLOB_PREFIX = "eva/";

const blobPath = (pathname: string) => `${BLOB_PREFIX}${pathname}`;

export { BlobPreconditionFailedError };

/** Returns null when the blob doesn't exist. Pass `fresh` to skip the CDN cache. */
export async function readBlob(pathname: string, { fresh = false } = {}) {
  const result = await get(blobPath(pathname), { access: "private", useCache: !fresh });
  if (!result || result.statusCode !== 200) return null;
  return {
    stream: result.stream,
    contentType: result.blob.contentType,
    size: result.blob.size,
    etag: result.blob.etag,
  };
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
