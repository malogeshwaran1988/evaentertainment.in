"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkAdminCredentials,
  checkTotp,
  endAdminSession,
  startAdminSession,
} from "@@/lib/admin-auth";
import { AdminRoutes, safeAdminPath } from "@@/lib/admin-session";
import { checkRateLimit, clientIp, resetRateLimit } from "@@/utils/rateLimit";

export type LoginState = { error?: string; username?: string };

/** Per-IP: 5 attempts / 15 min. Per account (any IP): 10 failures / hour, then locked. */
const IP_LIMIT = 5;
const IP_WINDOW_MS = 15 * 60_000;
const ACCOUNT_LIMIT = 10;
const ACCOUNT_WINDOW_MS = 60 * 60_000;

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").slice(0, 100);
  const password = String(formData.get("password") ?? "");
  const totp = String(formData.get("totp") ?? "");

  if (!username.trim() || !password) {
    return { error: "Enter your username and password.", username };
  }

  const ip = clientIp(await headers());
  const ipKey = `admin-login:ip:${ip}`;
  const accountKey = `admin-login:acct:${username.trim().toLowerCase()}`;

  const ipLimit = await checkRateLimit(ipKey, IP_LIMIT, IP_WINDOW_MS);
  if (!ipLimit.ok) {
    return {
      error: `Too many attempts. Try again in ${Math.ceil(ipLimit.retryAfterSec / 60)} minute(s).`,
      username,
    };
  }

  const credsOk = await checkAdminCredentials(username, password);
  const totpOk = credsOk && checkTotp(totp);
  if (!credsOk || !totpOk) {
    const acct = await checkRateLimit(accountKey, ACCOUNT_LIMIT, ACCOUNT_WINDOW_MS);
    console.warn(`[admin-login] failed login for "${username}" from ${ip}`);
    if (!acct.ok) {
      return { error: "This account is temporarily locked. Try again later.", username };
    }
    return {
      error: credsOk ? "Incorrect authenticator code." : "Incorrect username or password.",
      username,
    };
  }

  await resetRateLimit(ipKey);
  await resetRateLimit(accountKey);
  await startAdminSession(process.env.ADMIN_USERNAME ?? username.trim());
  redirect(safeAdminPath(formData.get("backTo")));
}

export async function logoutAction() {
  await endAdminSession();
  redirect(AdminRoutes.LOGIN);
}
