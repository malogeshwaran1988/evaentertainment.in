import sharp from "sharp";
import { POSTER_URL_PREFIX, projectIsPublished } from "@@/data/projects";
import { posterFileName, readPoster } from "@@/lib/project-posters";
import { getProjectBySlug } from "@@/lib/projects-store";

/**
 * 1200×630 JPG share card per project: the poster centred on a blurred, darkened copy of
 * itself. Linked from og:image with ?v=<updatedAt> so caches refresh after edits.
 */
const W = 1200;
const H = 630;
const POSTER_H = 570;

/** Static /public files aren't bundled into the function, so they're fetched from our own origin. */
async function staticBytes(origin: string, rel: string): Promise<Buffer | null> {
  if (!rel.startsWith("/images/") || rel.includes("..")) return null;
  try {
    const res = await fetch(new URL(rel, origin), { signal: AbortSignal.timeout(8000) });
    return res.ok ? Buffer.from(await res.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

async function posterBytes(origin: string, poster: string | undefined): Promise<Buffer | null> {
  if (!poster) return null;
  if (poster.startsWith(POSTER_URL_PREFIX)) {
    const name = posterFileName(poster);
    const file = name ? await readPoster(name) : null;
    if (!file) return null;
    return Buffer.from(await new Response(file.body as BodyInit).arrayBuffer());
  }
  return staticBytes(origin, poster.split("?")[0]);
}

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || !projectIsPublished(project)) return new Response("Not found", { status: 404 });

  const origin = new URL(req.url).origin;
  const src = (await posterBytes(origin, project.poster)) ?? (await staticBytes(origin, "/images/og/projects.jpg"));
  if (!src) return new Response("Not found", { status: 404 });
  let out: Buffer;
  {
    const bg = await sharp(src)
      .resize(W, H, { fit: "cover" })
      .blur(28)
      .modulate({ brightness: 0.45, saturation: 1.1 })
      .toBuffer();
    const fg = await sharp(src).resize({ height: POSTER_H, width: 900, fit: "inside" }).toBuffer();
    const meta = await sharp(fg).metadata();
    out = await sharp(bg)
      .composite([
        {
          input: fg,
          left: Math.round((W - (meta.width ?? 380)) / 2),
          top: Math.round((H - (meta.height ?? POSTER_H)) / 2),
        },
      ])
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
  }
  return new Response(new Uint8Array(out), {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(out.length),
      "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
    },
  });
}
