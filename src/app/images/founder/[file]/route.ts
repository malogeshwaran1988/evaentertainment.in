import { readFounderPhoto } from "@@/lib/founder-store";

/** Serves the admin-uploaded founder photo (private Blob on Vercel, storage/ locally). */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const photo = await readFounderPhoto(file);
  if (!photo) return new Response("Not found", { status: 404 });
  return new Response(photo.body, {
    headers: {
      "Content-Type": "image/avif",
      "Content-Length": String(photo.size),
      // Each upload gets a new file name, so the URL is immutable.
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
