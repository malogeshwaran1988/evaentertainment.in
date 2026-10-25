import { readClientLogo } from "@@/lib/clients-store";

/** Serves admin-uploaded client logos (private Blob on Vercel, storage/ locally). */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const logo = await readClientLogo(file);
  if (!logo) return new Response("Not found", { status: 404 });
  return new Response(logo.body, {
    headers: {
      "Content-Type": "image/avif",
      "Content-Length": String(logo.size),
      // Each upload gets a new file name, so the URL is immutable.
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
