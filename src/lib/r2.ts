import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 through its S3 API. No `server-only` import, because src/proxy.ts reads blog.json
 * through readR2Text; the keys only come from server env vars and never reach the browser.
 */
let client: S3Client | null = null;

export function r2(): S3Client {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
      },
    });
  }
  return client;
}

export const r2Bucket = () => process.env.R2_BUCKET ?? "";

export function isNotFound(err: unknown) {
  const e = err as { name?: string; $metadata?: { httpStatusCode?: number } };
  return e?.name === "NoSuchKey" || e?.name === "NotFound" || e?.$metadata?.httpStatusCode === 404;
}

export function isPreconditionFailed(err: unknown) {
  const e = err as { name?: string; $metadata?: { httpStatusCode?: number } };
  return e?.name === "PreconditionFailed" || e?.$metadata?.httpStatusCode === 412;
}

/** Full key in, text out; null when the object doesn't exist. */
export async function readR2Text(key: string): Promise<string | null> {
  try {
    const res = await r2().send(new GetObjectCommand({ Bucket: r2Bucket(), Key: key }));
    return res.Body ? await res.Body.transformToString() : null;
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}
