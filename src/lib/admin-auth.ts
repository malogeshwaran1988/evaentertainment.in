import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { Secret, TOTP } from "otpauth";
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

/** A real bcrypt hash used when the username is wrong, so timing doesn't reveal valid usernames. */
const DUMMY_HASH = "$2b$12$pLn/SQPLZPlG/UacQuZuPO3PIUuliBVnL0wbvreOP87MAKXUD8UVm";

/**
 * Checks the admin login. Prefers ADMIN_PASSWORD_HASH (bcrypt; generate with
 * `node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 12))" 'your-password'`).
 * Plain ADMIN_PASSWORD still works as a fallback but logs a warning; remove it once the hash is set.
 */
export async function checkAdminCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const plain = process.env.ADMIN_PASSWORD;
  if (!expectedUser || (!hash && !plain)) return false;
  if (password.length > 200) return false;
  const userOk = safeEqual(username.trim().toLowerCase(), expectedUser.toLowerCase());
  let passOk: boolean;
  if (hash) {
    passOk = await bcrypt.compare(password, userOk ? hash : DUMMY_HASH);
  } else {
    console.warn("[admin-auth] ADMIN_PASSWORD (plain text) in use; set ADMIN_PASSWORD_HASH instead.");
    passOk = safeEqual(password, plain as string);
  }
  return userOk && passOk;
}

/** True when TOTP 2FA is configured (ADMIN_TOTP_SECRET, base32). */
export function isTotpEnabled() {
  return Boolean(process.env.ADMIN_TOTP_SECRET);
}

/** Verifies a 6-digit authenticator code (±1 step of clock drift). Passes when 2FA is off. */
export function checkTotp(code: string) {
  const secret = process.env.ADMIN_TOTP_SECRET;
  if (!secret) return true;
  const clean = code.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(clean)) return false;
  try {
    const totp = new TOTP({
      issuer: "EVA Entertainment",
      label: process.env.ADMIN_USERNAME || "admin",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: Secret.fromBase32(secret),
    });
    return totp.validate({ token: clean, window: 1 }) !== null;
  } catch (err) {
    console.error("[admin-auth] invalid ADMIN_TOTP_SECRET", err);
    return false;
  }
}

export async function startAdminSession(username: string) {
  const token = await signAdminSession({ username });
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    priority: "high",
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
