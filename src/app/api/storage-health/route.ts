import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { blobPath, BLOB_CONFIGURED, BLOB_PREFIX, PRIMARY_STORE, R2_CONFIGURED, R2_MISSING_VARS, USE_BLOB } from "@@/lib/blob-path";
import { r2, r2Bucket } from "@@/lib/r2";

export const dynamic = "force-dynamic";

/**
 * Storage diagnostics for the R2 migration: env var NAMES and shape checks only, never values,
 * plus one HEAD probe of projects.json. Safe to leave public; remove once the migration is done.
 */
export async function GET() {
  const account = process.env.R2_ACCOUNT_ID ?? "";
  const bucket = process.env.R2_BUCKET ?? "";
  let r2Probe = "skipped";
  if (R2_CONFIGURED) {
    try {
      await r2().send(new HeadObjectCommand({ Bucket: r2Bucket(), Key: blobPath("projects.json") }));
      r2Probe = "ok";
    } catch (err) {
      const e = err as { name?: string; $metadata?: { httpStatusCode?: number } };
      r2Probe = `${e?.name ?? "error"} ${e?.$metadata?.httpStatusCode ?? ""}`.trim();
    }
  }
  return Response.json(
    {
      useRemote: USE_BLOB,
      primaryStore: PRIMARY_STORE,
      r2Configured: R2_CONFIGURED,
      r2MissingVars: R2_MISSING_VARS,
      r2AccountIdLooksValid: /^[0-9a-f]{32}$/.test(account),
      r2BucketLooksLikeName: /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(bucket),
      blobFallbackAvailable: BLOB_CONFIGURED,
      prefix: BLOB_PREFIX,
      onVercel: process.env.VERCEL === "1",
      r2Probe,
    },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
  );
}
