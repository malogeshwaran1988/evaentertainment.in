import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  AdminRoutes,
  verifyAdminSession,
} from "@@/lib/admin-session";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
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
  matcher: ["/login", "/admin", "/admin/:path*"],
};
