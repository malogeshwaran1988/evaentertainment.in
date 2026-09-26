"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@@/components/ui/dialog";
import { projectLanguageLine, type Project } from "@@/data/projects";
import { projectEditPath } from "@@/lib/admin-session";
import ProjectCardPreview from "./ProjectCardPreview";

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

type ProjectPreviewDialogProps = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectPreviewDialog({ project, onClose }: ProjectPreviewDialogProps) {
  // Keeps the last project rendered while the close animation plays.
  const [shown, setShown] = useState(project);
  if (project && project !== shown) setShown(project);

  return (
    <Dialog open={project !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
        // Opened without a Radix trigger, so hand focus back to the project's title button.
        onCloseAutoFocus={(e) => {
          if (!shown) return;
          e.preventDefault();
          document.querySelector<HTMLElement>(`[data-view-project="${shown.id}"]`)?.focus();
        }}
      >
        {shown ? (
          <>
            <DialogHeader>
              <DialogTitle className="pr-6">{shown.title}</DialogTitle>
              <DialogDescription>Preview on the Our Projects page</DialogDescription>
            </DialogHeader>

            <div className="grid items-start gap-6 sm:grid-cols-[248px_minmax(0,1fr)]">
              <ProjectCardPreview
                title={shown.title}
                from={shown.from}
                to={shown.to}
                category={shown.category}
                poster={shown.poster}
                posterAlt={shown.posterAlt}
              />
              <dl className="grid gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Languages</dt>
                  <dd className="font-medium">{projectLanguageLine(shown)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-medium">{shown.category}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Poster</dt>
                  <dd className="font-medium">{shown.poster ? "Uploaded" : "None"}</dd>
                </div>
                {shown.poster ? (
                  <div>
                    <dt className="text-muted-foreground">ALT name</dt>
                    <dd className="font-medium">
                      {shown.posterAlt || `Default (${shown.title} poster)`}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-muted-foreground">Last updated</dt>
                  <dd className="font-medium">{dateFormat.format(new Date(shown.updatedAt))}</dd>
                </div>
              </dl>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button asChild>
                <Link href={projectEditPath(shown.id)}>
                  <Pencil />
                  Edit
                </Link>
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
