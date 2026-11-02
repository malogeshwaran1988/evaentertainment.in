/**
 * next/image loader: no Vercel image optimization. Site media is already sized AVIF on the
 * public R2 bucket (cdn.evaentertainment.in), so the URL is returned as is and Cloudflare caches it.
 * Admin uploads (/images/<folder>/<file>) map to the same key under eva/ on the cdn in production;
 * the /images/... routes stay as a fallback. Local dev keeps the disk-backed routes.
 */
const UPLOAD_FOLDERS = ["our-projects", "founder", "blog", "client-logos"];
const BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "https://cdn.evaentertainment.in").replace(/\/$/, "");

export function cdnUploadUrl(src: string): string {
  if (process.env.NODE_ENV !== "production") return src;
  for (const folder of UPLOAD_FOLDERS) {
    const prefix = `/images/${folder}/`;
    if (src.startsWith(prefix)) return `${BASE}/eva/${folder}/${src.slice(prefix.length)}`;
  }
  return src;
}

export default function imageLoader({ src }: { src: string; width: number; quality?: number }): string {
  return cdnUploadUrl(src);
}
