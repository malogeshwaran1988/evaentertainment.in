import { jwtVerify, SignJWT } from "jose";

/** Shared by src/proxy.ts and server code, so it must not import `server-only` or next/headers. */
export const ADMIN_COOKIE = "eva_admin";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

export const AdminRoutes = {
  LOGIN: "/login",
  HOME: "/admin",
  PROJECTS: "/admin/projects",
  PROJECTS_NEW: "/admin/projects/new",
  PROFILE: "/admin/profile",
} as const;

export const projectEditPath = (id: string) =>
  `${AdminRoutes.PROJECTS}/${encodeURIComponent(id)}/edit`;

export type AdminSession = { username: string };

function secretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be set (32+ characters).");
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminSession(session: AdminSession) {
  return new SignJWT({ username: session.username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE}s`)
    .setSubject("eva-admin")
    .sign(secretKey());
}

export async function verifyAdminSession(
  token: string | undefined,
): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
      subject: "eva-admin",
    });
    return typeof payload.username === "string"
      ? { username: payload.username }
      : null;
  } catch {
    return null;
  }
}

/** Only same-site /admin paths are accepted as post-login destinations. */
export function safeAdminPath(value: unknown): string {
  if (typeof value !== "string") return AdminRoutes.PROJECTS;
  if (!value.startsWith("/admin") || value.startsWith("//") || value.includes("\\")) {
    return AdminRoutes.PROJECTS;
  }
  return value;
}
