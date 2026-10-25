import type { Metadata } from "next";
import ProjectForm from "@@/components/admin/projects/ProjectForm";
import PageHeader from "@@/components/admin/ui/PageHeader";
import { requireAdmin } from "@@/lib/admin-auth";
import { getClientsFresh } from "@@/lib/clients-store";
import { createProjectAction } from "../actions";

export const metadata: Metadata = { title: "Add project" };

export default async function NewProjectPage() {
  await requireAdmin();
  const clients = (await getClientsFresh()).map((c) => ({ id: c.id, name: c.name }));
  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader title="Add project" />
      <ProjectForm action={createProjectAction} submitLabel="Add project" clients={clients} />
    </div>
  );
}
