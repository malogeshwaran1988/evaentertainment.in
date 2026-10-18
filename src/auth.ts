import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { ADMIN_SESSION_MAX_AGE, AdminRoutes } from "@@/lib/admin-session";

/** Only Google Workspace accounts on this domain can sign in. */
export const ADMIN_DOMAIN = "lasmind.com";

/** ADMIN_ALLOWED_EMAILS: comma-separated allowlist; defaults to info@lasmind.com. */
function allowedEmails(): string[] {
  const raw = process.env.ADMIN_ALLOWED_EMAILS?.trim() || `info@${ADMIN_DOMAIN}`;
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** The single access rule, used at sign-in and re-checked on every request. */
export function isAllowedAdminEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  const e = email.trim().toLowerCase();
  return e.endsWith(`@${ADMIN_DOMAIN}`) && allowedEmails().includes(e);
}

/** True when Google sign-in has everything it needs; without it, auth() is never called. */
export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.AUTH_GOOGLE_ID?.trim() &&
      process.env.AUTH_GOOGLE_SECRET?.trim() &&
      process.env.AUTH_SECRET?.trim(),
  );
}

const config = {
  // Google: authorization code flow with PKCE + state (state added explicitly; Auth.js defaults to PKCE only).
  // Reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET.
  providers: [
    Google({
      checks: ["pkce", "state"],
      authorization: { params: { hd: ADMIN_DOMAIN, prompt: "select_account" } },
    }),
  ],
  // JWT session in an encrypted httpOnly cookie (Secure + __Secure- prefix on https).
  session: { strategy: "jwt", maxAge: ADMIN_SESSION_MAX_AGE },
  pages: { signIn: AdminRoutes.LOGIN, error: AdminRoutes.LOGIN },
  callbacks: {
    signIn({ account, profile }) {
      if (account?.provider !== "google" || !profile) return false;
      return (
        profile.email_verified === true &&
        profile.hd === ADMIN_DOMAIN &&
        isAllowedAdminEmail(profile.email)
      );
    },
    jwt({ token, profile }) {
      if (profile?.email) token.email = profile.email.toLowerCase();
      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.email === "string") session.user.email = token.email;
      return session;
    },
    // Keep redirects on this site only.
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return new URL(url).origin === baseUrl ? url : baseUrl;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
