import { cookies } from "next/headers";
import AdminShell from "@@/components/admin/shell/AdminShell";
import { requireAdmin } from "@@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdmin();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <AdminShell defaultOpen={defaultOpen} username={session.username}>
      {children}
    </AdminShell>
  );
}
