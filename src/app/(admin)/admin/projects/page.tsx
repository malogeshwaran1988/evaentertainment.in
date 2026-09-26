import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProjectsTable from "@@/components/admin/projects/ProjectsTable";
import PageHeader from "@@/components/admin/ui/PageHeader";
import { Button } from "@@/components/ui/button";
import { requireAdmin } from "@@/lib/admin-auth";
import { AdminRoutes } from "@@/lib/admin-session";
import { getProjects } from "@@/lib/projects-store";

export const metadata: Metadata = { title: "Our Projects" };

export default async function AdminProjectsPage() {
  await requireAdmin();
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        title="Our Projects"
        description="Projects listed on the public Our Projects page."
        actions={
          <Button asChild>
            <Link href={AdminRoutes.PROJECTS_NEW}>
              <Plus />
              Add project
            </Link>
          </Button>
        }
      />
      <ProjectsTable projects={projects} />
    </>
  );
}
