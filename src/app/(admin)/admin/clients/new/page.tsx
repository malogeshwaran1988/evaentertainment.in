import type { Metadata } from "next";
import ClientForm from "@@/components/admin/clients/ClientForm";
import PageHeader from "@@/components/admin/ui/PageHeader";
import { requireAdmin } from "@@/lib/admin-auth";
import { createClientAction } from "../actions";

export const metadata: Metadata = { title: "Add client" };

export default async function NewClientPage() {
  await requireAdmin();
  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageHeader title="Add client" description="Upload the logo and enter the client name." />
      <ClientForm action={createClientAction} submitLabel="Add client" />
    </div>
  );
}
