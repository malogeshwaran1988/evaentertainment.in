import { readBlogImage } from "@@/lib/blog/images";

/** Serves uploaded blog images (private Blob store on Vercel, public/images/blog locally). */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const image = await readBlogImage(file);
  if (!image) return new Response("Not found", { status: 404 });
  return new Response(image.body, {
    headers: {
      "Content-Type": image.contentType,
      "Content-Length": String(image.size),
      // Stored URLs carry a `?v=` that changes on every upload, so each URL is immutable.
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
