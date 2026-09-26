import { Film, type LucideIcon } from "lucide-react";
import { AdminRoutes } from "@@/lib/admin-session";

export type AdminNavItem = { label: string; href: string; icon: LucideIcon };

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Our Projects", href: AdminRoutes.PROJECTS, icon: Film },];

type Crumb = { label: string; href?: string };

/** Breadcrumb trail for the current admin path. */
export function breadcrumbsFor(pathname: string): Crumb[] {
  if (pathname.startsWith(AdminRoutes.PROJECTS)) {
    const trail: Crumb[] = [{ label: "Our Projects", href: AdminRoutes.PROJECTS }];
    if (pathname === AdminRoutes.PROJECTS_NEW) trail.push({ label: "Add project" });
    else if (pathname.endsWith("/edit")) trail.push({ label: "Edit project" });
    return trail;
  }
  if (pathname.startsWith(AdminRoutes.PROFILE)) return [{ label: "Profile" }];
  return [{ label: "Admin" }];
}
