import "server-only";
import { redirect } from "next/navigation";
import { auth, isAllowedAdminEmail } from "@@/auth";
import { AdminRoutes, type AdminSession } from "@@/lib/admin-session";

/**
 * Current admin from the Auth.js session. The allowlist is re-checked on every call, so
 * removing an address from ADMIN_ALLOWED_EMAILS locks it out without waiting for expiry.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await auth();
  const email = session?.user?.email;
  return isAllowedAdminEmail(email) ? { username: email } : null;
}

/** Use in every admin page, layout, server action and admin API route — the proxy alone is not a security boundary. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect(AdminRoutes.LOGIN);
  return session;
}
