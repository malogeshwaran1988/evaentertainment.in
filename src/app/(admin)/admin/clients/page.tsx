import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import ClientsTable from "@@/components/admin/clients/ClientsTable";
import PageHeader from "@@/components/admin/ui/PageHeader";
import { Button } from "@@/components/ui/button";
import { requireAdmin } from "@@/lib/admin-auth";
import { AdminRoutes } from "@@/lib/admin-session";
import { getClientsFresh } from "@@/lib/clients-store";
import { getProjectsFresh } from "@@/lib/projects-store";

export const metadata: Metadata = { title: "Clients" };

export default async function AdminClientsPage() {
  await requireAdmin();
  const [clients, projects] = await Promise.all([getClientsFresh(), getProjectsFresh()]);
  const counts = new Map<string, number>();
  for (const p of projects) if (p.clientId) counts.set(p.clientId, (counts.get(p.clientId) ?? 0) + 1);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <PageHeader
        title="Clients"
        description="Logos on the public Our Clients page. Pick a client on any project to show its logo there."
        actions={
          <Button asChild>
            <Link href={AdminRoutes.CLIENTS_NEW}>
              <Plus />
              Add client
            </Link>
          </Button>
        }
      />
      <ClientsTable clients={clients.map((c) => ({ ...c, projectCount: counts.get(c.id) ?? 0 }))} />
    </div>
  );
}
