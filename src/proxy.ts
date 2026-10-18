import { NextResponse, type NextRequest } from "next/server";
import { auth, isAllowedAdminEmail, isAuthConfigured } from "@@/auth";
import { AdminRoutes } from "@@/lib/admin-session";
import { BLOG_ENABLED } from "@@/lib/blog/enabled";
import { blogRedirectFor } from "@@/lib/blog/redirects";

const BLOG_POST_PATH = /^\/blog\/([^/]+)$/;

async function handle(request: NextRequest, email: unknown) {
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
  const session = isAllowedAdminEmail(email);

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

const withAuth = auth((request) => handle(request, request.auth?.user?.email));

/** Without the Google/AUTH env vars, skip Auth.js so nothing crashes: admin just goes to /login. */
export async function proxy(request: NextRequest) {
  if (!isAuthConfigured()) return handle(request, null);
  return withAuth(request, {} as never);
}

export const config = {
  matcher: ["/login", "/admin", "/admin/:path*", "/blog/:slug"],
};
