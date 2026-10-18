/** Shared by src/proxy.ts and server code, so it must not import `server-only` or next/headers. */
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

export const AdminRoutes = {
  LOGIN: "/login",
  HOME: "/admin",
  PROJECTS: "/admin/projects",
  PROJECTS_NEW: "/admin/projects/new",
  PROFILE: "/admin/profile",
  BLOG: "/admin/blog",
  BLOG_NEW: "/admin/blog/new",
} as const;

export const projectEditPath = (id: string) =>
  `${AdminRoutes.PROJECTS}/${encodeURIComponent(id)}/edit`;

export const blogEditPath = (id: string) =>
  `${AdminRoutes.BLOG}/${encodeURIComponent(id)}/edit`;

/** `username` is the signed-in Google email. */
export type AdminSession = { username: string };

/** Only same-site /admin paths are accepted as post-login destinations. */
export function safeAdminPath(value: unknown): string {
  if (typeof value !== "string") return AdminRoutes.PROJECTS;
  if (!value.startsWith("/admin") || value.startsWith("//") || value.includes("\\")) {
    return AdminRoutes.PROJECTS;
  }
  return value;
}
