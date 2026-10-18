import sharp from "sharp";
import { blogImageFileName, readBlogImage } from "@@/lib/blog/images";
import { BLOG_ENABLED } from "@@/lib/blog/enabled";
import { findPublicBlogPost } from "@@/lib/blog/store";

/** 1200×630 JPG share card from a post's cover. Linked with ?v=<updatedAt> so caches refresh. */
const W = 1200;
const H = 630;

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!BLOG_ENABLED) return new Response("Not found", { status: 404 });
  const { slug } = await params;
  const found = await findPublicBlogPost(slug);
  const name = blogImageFileName(found?.post?.cover);
  const image = name ? await readBlogImage(name) : null;
  if (!image) return new Response("Not found", { status: 404 });
  const src = Buffer.from(await new Response(image.body as BodyInit).arrayBuffer());
  const out = await sharp(src).resize(W, H, { fit: "cover" }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(out), {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(out.length),
      "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
    },
  });
}
