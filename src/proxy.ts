import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  AdminRoutes,
  verifyAdminSession,
} from "@@/lib/admin-session";
import { blogRedirectFor } from "@@/lib/blog/redirects";

const BLOG_POST_PATH = /^\/blog\/([^/]+)$/;

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const blogPost = BLOG_POST_PATH.exec(pathname);
  if (blogPost) {
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

  const session = await verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);

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
}

export const config = {
  matcher: ["/login", "/admin", "/admin/:path*", "/blog/:slug"],
};
