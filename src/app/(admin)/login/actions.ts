"use server";

import { signIn, signOut } from "@@/auth";
import { AdminRoutes, safeAdminPath } from "@@/lib/admin-session";

export async function googleSignInAction(formData: FormData) {
  await signIn("google", { redirectTo: safeAdminPath(formData.get("backTo")) });
}

export async function logoutAction() {
  await signOut({ redirectTo: AdminRoutes.LOGIN });
}
