import { readPoster } from "@@/lib/project-posters";

/**
 * `next start` only serves public/ files that existed at startup, so posters uploaded
 * later from the admin fall through to this handler and are read from disk.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const poster = await readPoster(file);
  if (!poster) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(new Uint8Array(poster.bytes), {
    headers: {
      "Content-Type": poster.contentType,
      "Content-Length": String(poster.bytes.length),
      // Upload names are unique and never reused.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
