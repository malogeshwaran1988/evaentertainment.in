import { readPoster } from "@@/lib/project-posters";

/**
 * Serves admin-uploaded posters. On Vercel they live in the private Blob store, which
 * browsers can't read directly; locally they're on disk, and `next start` only serves
 * public/ files that existed at startup.
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
  return new Response(poster.body, {
    headers: {
      "Content-Type": poster.contentType,
      "Content-Length": String(poster.size),
      // Upload names are unique and never reused, so browsers and the CDN can keep them.
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
