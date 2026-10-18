"use server";

import { redirect } from "next/navigation";
import { isAuthConfigured, signIn, signOut } from "@@/auth";
import { AdminRoutes, safeAdminPath } from "@@/lib/admin-session";

export async function googleSignInAction(formData: FormData) {
  if (!isAuthConfigured()) redirect(AdminRoutes.LOGIN);
  await signIn("google", { redirectTo: safeAdminPath(formData.get("backTo")) });
}

export async function logoutAction() {
  if (!isAuthConfigured()) redirect(AdminRoutes.LOGIN);
  await signOut({ redirectTo: AdminRoutes.LOGIN });
}
