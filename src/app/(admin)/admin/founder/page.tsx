import type { Metadata } from "next";
import FounderForm from "@@/components/admin/founder/FounderForm";
import PageHeader from "@@/components/admin/ui/PageHeader";
import { projectIsPublished } from "@@/data/projects";
import { requireAdmin } from "@@/lib/admin-auth";
import { getFounderFresh } from "@@/lib/founder-store";
import { getProjectsFresh } from "@@/lib/projects-store";

export const metadata: Metadata = { title: "Founder" };

export default async function FounderAdminPage() {
  await requireAdmin();
  const [founder, projects] = await Promise.all([getFounderFresh(), getProjectsFresh()]);
  const options = projects
    .filter(projectIsPublished)
    .map((p) => ({ id: p.id, title: p.title, year: p.year ?? "" }));

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageHeader
        title="Founder"
        description="The founder card and Recent work row on the About page."
      />
      <FounderForm founder={founder} projects={options} />
    </div>
  );
}
