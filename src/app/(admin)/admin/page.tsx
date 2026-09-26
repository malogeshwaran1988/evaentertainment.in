import { redirect } from "next/navigation";
import { AdminRoutes } from "@@/lib/admin-session";

export default function AdminIndex() {
  redirect(AdminRoutes.PROJECTS);
}
