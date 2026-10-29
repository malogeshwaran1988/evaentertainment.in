/**
 * Where EVA's files live in remote storage. No `server-only` import, because src/proxy.ts uses it
 * too (blog redirects); it only builds paths and never touches the keys.
 */
const R2_VARS = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"] as const;

/** Names (never values) of the R2 vars that are missing or empty. */
export const R2_MISSING_VARS: string[] = R2_VARS.filter((name) => !process.env[name]);

/** Cloudflare R2 is the primary store once all four keys are set. */
export const R2_CONFIGURED = R2_MISSING_VARS.length === 0;

/** Vercel Blob stays as a read fallback during the migration, while its token still exists. */
export const BLOB_CONFIGURED = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/**
 * Remote storage only on Vercel (VERCEL=1, set for builds and functions) or when BLOB_USE_REMOTE=1.
 * Local dev, tests and local builds use the disk store even if .env.local has the keys.
 * Either store counts, so a missing R2 var can no longer silently switch production to the disk store.
 */
export const USE_BLOB =
  (R2_CONFIGURED || BLOB_CONFIGURED) &&
  (process.env.VERCEL === "1" || process.env.BLOB_USE_REMOTE === "1");

/** Which store takes writes: R2 when configured, otherwise Vercel Blob as before. */
export const PRIMARY_STORE: "r2" | "vercel-blob" = R2_CONFIGURED ? "r2" : "vercel-blob";

/**
 * The bucket may be shared with other sites, so everything EVA writes lives under this folder.
 * Local tests against the real bucket set EVA_BLOB_PREFIX (e.g. "eva-test/") to keep off live data.
 */
export const BLOB_PREFIX = process.env.EVA_BLOB_PREFIX || "eva/";

export const blobPath = (pathname: string) => `${BLOB_PREFIX}${pathname}`;
