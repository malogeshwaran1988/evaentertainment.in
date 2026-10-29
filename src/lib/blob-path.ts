/**
 * Where EVA's files live in the R2 bucket. No `server-only` import, because src/proxy.ts uses it
 * too (blog redirects); it only builds paths and never touches the keys.
 */
/**
 * Remote storage (Cloudflare R2) only on Vercel (VERCEL=1, set for builds and functions) or when
 * BLOB_USE_REMOTE=1, and only when the R2 keys are set. Local dev, tests and local builds use the
 * disk store even if .env.local has the keys.
 */
export const USE_BLOB =
  Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET,
  ) &&
  (process.env.VERCEL === "1" || process.env.BLOB_USE_REMOTE === "1");

/**
 * The bucket may be shared with other sites, so everything EVA writes lives under this folder.
 * Local tests against the real bucket set EVA_BLOB_PREFIX (e.g. "eva-test/") to keep off live data.
 */
export const BLOB_PREFIX = process.env.EVA_BLOB_PREFIX || "eva/";

export const blobPath = (pathname: string) => `${BLOB_PREFIX}${pathname}`;
