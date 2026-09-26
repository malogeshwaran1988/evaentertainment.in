import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectForm from "@@/components/admin/projects/ProjectForm";
import PageHeader from "@@/components/admin/ui/PageHeader";
import { requireAdmin } from "@@/lib/admin-auth";
import { getProject } from "@@/lib/projects-store";
import { updateProjectAction } from "../../actions";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader title="Edit project" description={project.title} />
      <ProjectForm
        action={updateProjectAction.bind(null, project.id)}
        initial={{
          title: project.title,
          from: project.from,
          to: project.to,
          category: project.category,
          poster: project.poster,
          posterAlt: project.posterAlt,
        }}
        submitLabel="Save changes"
      />
    </div>
  );
}
