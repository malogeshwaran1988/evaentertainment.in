#!/usr/bin/env node
/**
 * One-off copy of EVA's Vercel Blob files to Cloudflare R2, keeping the same keys.
 *
 *   node --env-file=.env.migrate scripts/migrate-blob-to-r2.mjs            copy (safe to re-run)
 *   node --env-file=.env.migrate scripts/migrate-blob-to-r2.mjs --verify   compare both stores
 *
 * Env: BLOB_READ_WRITE_TOKEN, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET,
 * optional EVA_BLOB_PREFIX (default eva/). Objects already in R2 with the same size are skipped.
 * Writes a JSON log to migrate-blob-to-r2-<mode>-<timestamp>.json in the current folder.
 */
import { writeFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { get, list } from "@vercel/blob";
import { GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const VERIFY = process.argv.includes("--verify");
const PREFIX = process.env.EVA_BLOB_PREFIX || "eva/";
const JSON_FILES = ["projects.json", "blog.json", "clients.json", "founder.json"].map((f) => PREFIX + f);

const missing = ["BLOB_READ_WRITE_TOKEN", "R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"].filter(
  (k) => !process.env[k],
);
if (missing.length) {
  console.error(`Missing env: ${missing.join(", ")}`);
  process.exit(1);
}

const Bucket = process.env.R2_BUCKET;
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});

const notFound = (e) => e?.name === "NotFound" || e?.name === "NoSuchKey" || e?.$metadata?.httpStatusCode === 404;

async function listBlobs() {
  const all = [];
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
    all.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return all;
}

async function listR2() {
  const all = new Map();
  let ContinuationToken;
  do {
    const page = await s3.send(new ListObjectsV2Command({ Bucket, Prefix: PREFIX, ContinuationToken }));
    for (const o of page.Contents ?? []) all.set(o.Key, o.Size ?? 0);
    ContinuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return all;
}

async function r2Size(Key) {
  try {
    return (await s3.send(new HeadObjectCommand({ Bucket, Key }))).ContentLength ?? 0;
  } catch (e) {
    if (notFound(e)) return null;
    throw e;
  }
}

async function copyOne(b) {
  const existing = await r2Size(b.pathname);
  if (existing === b.size) return { key: b.pathname, size: b.size, status: "skipped" };
  const res = await get(b.pathname, { access: "private", useCache: false });
  if (!res || res.statusCode !== 200) throw new Error(`Blob read failed (${res?.statusCode})`);
  const cacheControl = res.headers?.get?.("cache-control") || res.blob.cacheControl || undefined;
  await s3.send(
    new PutObjectCommand({
      Bucket,
      Key: b.pathname,
      Body: Readable.fromWeb(res.stream),
      ContentLength: b.size,
      ContentType: res.blob.contentType || "application/octet-stream",
      CacheControl: cacheControl,
    }),
  );
  return { key: b.pathname, size: b.size, status: existing === null ? "copied" : "replaced" };
}

async function bodyText(stream) {
  return new Response(stream).text();
}

async function runCopy(blobs) {
  const log = [];
  const queue = [...blobs];
  const workers = Array.from({ length: 6 }, async () => {
    for (let b = queue.shift(); b; b = queue.shift()) {
      try {
        const r = await copyOne(b);
        log.push(r);
        console.log(`${r.status.padEnd(8)} ${r.key} (${r.size} B)`);
      } catch (e) {
        log.push({ key: b.pathname, size: b.size, status: "error", error: String(e?.message ?? e) });
        console.error(`error    ${b.pathname}: ${e?.message ?? e}`);
      }
    }
  });
  await Promise.all(workers);
  const count = (s) => log.filter((r) => r.status === s).length;
  const summary = {
    mode: "copy",
    prefix: PREFIX,
    blobCount: blobs.length,
    blobBytes: blobs.reduce((n, b) => n + b.size, 0),
    copied: count("copied"),
    replaced: count("replaced"),
    skipped: count("skipped"),
    errors: count("error"),
  };
  return { summary, log };
}

async function runVerify(blobs) {
  const r2 = await listR2();
  const problems = [];
  for (const b of blobs) {
    const size = r2.get(b.pathname);
    if (size === undefined) problems.push({ key: b.pathname, problem: "missing in R2" });
    else if (size !== b.size) problems.push({ key: b.pathname, problem: `size ${size} in R2, ${b.size} in Blob` });
  }
  const blobKeys = new Set(blobs.map((b) => b.pathname));
  const extra = [...r2.keys()].filter((k) => !blobKeys.has(k));
  const json = [];
  for (const key of JSON_FILES) {
    if (!blobKeys.has(key)) {
      json.push({ key, result: "not in Blob" });
      continue;
    }
    const a = await get(key, { access: "private", useCache: false });
    const aText = a && a.statusCode === 200 ? await bodyText(a.stream) : null;
    let bText = null;
    try {
      const b = await s3.send(new GetObjectCommand({ Bucket, Key: key }));
      bText = await b.Body.transformToString();
    } catch (e) {
      if (!notFound(e)) throw e;
    }
    json.push({ key, result: aText !== null && aText === bText ? "identical" : "DIFFERENT" });
  }
  const summary = {
    mode: "verify",
    prefix: PREFIX,
    blobCount: blobs.length,
    blobBytes: blobs.reduce((n, b) => n + b.size, 0),
    r2Count: r2.size,
    r2Bytes: [...r2.values()].reduce((n, s) => n + s, 0),
    problems: problems.length,
    extraInR2: extra.length,
    json,
    ok: problems.length === 0 && json.every((j) => j.result !== "DIFFERENT"),
  };
  return { summary, log: { problems, extra } };
}

const blobs = await listBlobs();
console.log(`Vercel Blob: ${blobs.length} files under ${PREFIX}`);
const result = VERIFY ? await runVerify(blobs) : await runCopy(blobs);
const file = `migrate-blob-to-r2-${VERIFY ? "verify" : "copy"}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
await writeFile(file, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result.summary, null, 2));
console.log(`Log: ${file}`);
process.exit(VERIFY ? (result.summary.ok ? 0 : 2) : result.summary.errors ? 2 : 0);
