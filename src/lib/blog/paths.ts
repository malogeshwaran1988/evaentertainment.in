import path from "node:path";

/** Shared by the store and the proxy's redirect lookup (no `server-only`, see src/lib/blob-path.ts). */
export const BLOG_BLOB_FILE = "blog.json";
export const BLOG_DISK_FILE = path.join(
  path.resolve(/*turbopackIgnore: true*/ process.env.EVA_DATA_DIR || "storage"),
  "blog.json",
);
