import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientForm from "@@/components/admin/clients/ClientForm";
import PageHeader from "@@/components/admin/ui/PageHeader";
import { requireAdmin } from "@@/lib/admin-auth";
import { getClientFresh } from "@@/lib/clients-store";
import { updateClientAction } from "../../actions";

export const metadata: Metadata = { title: "Edit client" };

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const client = await getClientFresh(id);
  if (!client) notFound();
  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageHeader title="Edit client" description={client.name} />
      <ClientForm
        action={updateClientAction.bind(null, client.id)}
        initial={{ name: client.name, logo: client.logo }}
        submitLabel="Save changes"
      />
    </div>
  );
}
