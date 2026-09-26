import type { Metadata } from "next";
import ProjectForm from "@@/components/admin/projects/ProjectForm";
import PageHeader from "@@/components/admin/ui/PageHeader";
import { requireAdmin } from "@@/lib/admin-auth";
import { createProjectAction } from "../actions";

export const metadata: Metadata = { title: "Add project" };

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader title="Add project" />
      <ProjectForm action={createProjectAction} submitLabel="Add project" />
    </div>
  );
}
