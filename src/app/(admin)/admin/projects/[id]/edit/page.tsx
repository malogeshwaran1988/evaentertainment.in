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
          services: project.services,
          poster: project.poster,
          posterAlt: project.posterAlt,
          description: project.description,
          audioHours: project.audioHours,
          year: project.year,
          published: project.published !== false,
          synopsis: project.synopsis,
          director: project.director,
          cast: project.cast,
          originalRelease: project.originalRelease,
          productionHouse: project.productionHouse,
          evaWork: project.evaWork,
          voiceCast: project.voiceCast,
          trailerUrl: project.trailerUrl,
          whereToWatch: project.whereToWatch,
          faqs: project.faqs,
        }}
        submitLabel="Save changes"
      />
    </div>
  );
}
