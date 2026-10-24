"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteClientAction } from "@@/app/(admin)/admin/clients/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@@/components/ui/alert-dialog";
import { Button } from "@@/components/ui/button";
import type { Client } from "@@/data/clients";
import { clientEditPath } from "@@/lib/admin-session";

type Row = Client & { projectCount: number };

export default function ClientsTable({ clients }: { clients: Row[] }) {
  const router = useRouter();
  const [target, setTarget] = useState<Row | null>(null);
  const [pending, startTransition] = useTransition();

  const confirmDelete = () => {
    if (!target) return;
    const row = target;
    startTransition(async () => {
      const result = await deleteClientAction(row.id);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
      setTarget(null);
      router.refresh();
    });
  };

  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Clients">
        {clients.map((c) => (
          <li key={c.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <span className="flex h-16 w-28 shrink-0 items-center justify-center rounded-md bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- small AVIF, served as-is */}
              <img src={c.logo} alt={c.name} className="max-h-full max-w-full object-contain" loading="lazy" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{c.name}</span>
              <span className="block text-xs text-muted-foreground">
                {c.projectCount === 1 ? "1 project" : `${c.projectCount} projects`}
              </span>
            </span>
            <Button variant="ghost" size="icon" asChild>
              <Link href={clientEditPath(c.id)} aria-label={`Edit ${c.name}`}>
                <Pencil />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              aria-label={`Delete ${c.name}`}
              onClick={() => setTarget(c)}
            >
              <Trash2 />
            </Button>
          </li>
        ))}
      </ul>

      <AlertDialog open={!!target} onOpenChange={(open) => (open ? null : setTarget(null))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {target?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              The logo is removed from the Our Clients page.
              {target?.projectCount
                ? ` ${target.projectCount === 1 ? "1 project" : `${target.projectCount} projects`} will stop showing this client.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={pending}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
