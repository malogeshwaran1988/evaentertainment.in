import { NextResponse } from "next/server";
import { auth, isAllowedAdminEmail } from "@@/auth";
import { AdminRoutes } from "@@/lib/admin-session";
import { BLOG_ENABLED } from "@@/lib/blog/enabled";
import { blogRedirectFor } from "@@/lib/blog/redirects";

const BLOG_POST_PATH = /^\/blog\/([^/]+)$/;

export const proxy = auth(async (request) => {
  const { pathname, search } = request.nextUrl;

  const blogPost = BLOG_POST_PATH.exec(pathname);
  if (blogPost) {
    // Blog off: the page itself sends every post URL to /blog ("Coming soon").
    if (!BLOG_ENABLED) return NextResponse.next();
    let slug: string;
    try {
      slug = decodeURIComponent(blogPost[1]);
    } catch {
      return NextResponse.next();
    }
    const target = await blogRedirectFor(slug);
    if (target) {
      // A real 301 (moved permanently) from a renamed post's old URL.
      return NextResponse.redirect(new URL(`/blog/${target}${search}`, request.url), 301);
    }
    return NextResponse.next();
  }

  // UX redirect only; every admin page/action re-checks with requireAdmin().
  const session = isAllowedAdminEmail(request.auth?.user?.email);

  if (pathname === AdminRoutes.LOGIN) {
    return session
      ? NextResponse.redirect(new URL(AdminRoutes.PROJECTS, request.url))
      : NextResponse.next();
  }

  if (!session) {
    const url = new URL(AdminRoutes.LOGIN, request.url);
    url.searchParams.set("backTo", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/login", "/admin", "/admin/:path*", "/blog/:slug"],
};
