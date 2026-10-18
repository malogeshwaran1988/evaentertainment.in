import type { Metadata } from "next";
import LoginForm from "@@/components/admin/login/LoginForm";
import { isAuthConfigured } from "@@/auth";
import { safeAdminPath } from "@@/lib/admin-session";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false, nocache: true },
};

const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);

/** Auth.js error codes (?error=) mapped to plain messages. */
function errorMessage(code?: string): string | undefined {
  if (!code) return undefined;
  if (code === "AccessDenied") {
    return "This Google account isn't allowed to use the EVA admin. Sign in with an approved @lasmind.com account.";
  }
  if (code === "Configuration") return "Sign-in isn't set up on the server yet. Contact the site admin.";
  return "Sign-in didn't complete. Please try again.";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ backTo?: string | string[]; callbackUrl?: string | string[]; error?: string | string[] }>;
}) {
  const sp = await searchParams;
  const backTo = first(sp.backTo) ?? first(sp.callbackUrl);
  let path = backTo;
  try {
    if (backTo && /^https?:/.test(backTo)) path = new URL(backTo).pathname;
  } catch {
    path = undefined;
  }
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4 sm:p-6">
      <LoginForm
        notice={isAuthConfigured() ? undefined : process.env.NODE_ENV === "production" ? "Sign-in is temporarily unavailable. Please contact the site administrator." : "Google sign-in isn't configured yet. Add AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET and AUTH_SECRET to the environment."}
        backTo={safeAdminPath(path)} error={errorMessage(first(sp.error))} />
    </main>
  );
}
