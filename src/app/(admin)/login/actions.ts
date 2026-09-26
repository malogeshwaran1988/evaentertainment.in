"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkAdminCredentials,
  endAdminSession,
  startAdminSession,
} from "@@/lib/admin-auth";
import { AdminRoutes, safeAdminPath } from "@@/lib/admin-session";
import { checkRateLimit } from "@@/utils/rateLimit";

export type LoginState = { error?: string; username?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!username.trim() || !password) {
    return { error: "Enter your username and password.", username };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const limit = checkRateLimit(`admin-login:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return {
      error: `Too many attempts. Try again in ${limit.retryAfterSec} seconds.`,
      username,
    };
  }

  if (!checkAdminCredentials(username, password)) {
    return { error: "Incorrect username or password.", username };
  }

  await startAdminSession(process.env.ADMIN_USERNAME ?? username.trim());
  redirect(safeAdminPath(formData.get("backTo")));
}

export async function logoutAction() {
  await endAdminSession();
  redirect(AdminRoutes.LOGIN);
}
