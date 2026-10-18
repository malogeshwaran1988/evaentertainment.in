/**
 * Where EVA's files live in the Blob store. No `server-only` import, because src/proxy.ts uses it
 * too (blog redirects); it only builds paths and never touches the token.
 */
/**
 * Remote Blob only on Vercel (VERCEL=1, set for builds and functions) or when BLOB_USE_REMOTE=1.
 * Local dev, tests and local builds use the disk store even if .env.local has the token, so they
 * never spend the (Hobby: 10k Simple / 2k Advanced per month) Blob operation quota.
 */
export const USE_BLOB =
  Boolean(process.env.BLOB_READ_WRITE_TOKEN) &&
  (process.env.VERCEL === "1" || process.env.BLOB_USE_REMOTE === "1");

/**
 * The store may be shared with other sites, so everything EVA writes lives under this folder.
 * Local tests against the real store set EVA_BLOB_PREFIX (e.g. "eva-test/") to keep off live data.
 */
export const BLOB_PREFIX = process.env.EVA_BLOB_PREFIX || "eva/";

export const blobPath = (pathname: string) => `${BLOB_PREFIX}${pathname}`;
