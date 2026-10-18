/**
 * Public blog switch. Off (default): /blog shows "Coming soon" (noindex, follow), /blog/<slug>
 * redirects to /blog, the OG card route 404s and no blog URL is in the sitemap. The admin blog and
 * /preview/blog always work. Turn on with NEXT_PUBLIC_BLOG_ENABLED=true (it is read at build time,
 * so redeploy after changing it).
 */
export const BLOG_ENABLED = process.env.NEXT_PUBLIC_BLOG_ENABLED === "true";
