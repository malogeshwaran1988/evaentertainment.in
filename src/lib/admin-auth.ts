import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  AdminRoutes,
  signAdminSession,
  verifyAdminSession,
  type AdminSession,
} from "@@/lib/admin-session";

/** Hashing first gives equal-length buffers, so the comparison is constant-time. */
function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkAdminCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) return false;
  const userOk = safeEqual(username.trim().toLowerCase(), expectedUser.toLowerCase());
  const passOk = safeEqual(password, expectedPass);
  return userOk && passOk;
}

export async function startAdminSession(username: string) {
  const token = await signAdminSession({ username });
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
}

export async function endAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return verifyAdminSession(store.get(ADMIN_COOKIE)?.value);
}

/** Use in every admin page, layout and server action — the proxy alone is not a security boundary. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect(AdminRoutes.LOGIN);
  return session;
}
