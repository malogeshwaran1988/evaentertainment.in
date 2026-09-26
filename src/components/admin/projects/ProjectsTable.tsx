"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn,
} from "@tanstack/react-table";
import { Eye, Film, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProjectAction } from "@@/app/(admin)/admin/projects/actions";
import ProjectPreviewDialog from "@@/components/admin/projects/ProjectPreviewDialog";
import DataTablePagination from "@@/components/admin/ui/DataTablePagination";
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
import { Badge } from "@@/components/ui/badge";
import { Button } from "@@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@@/components/ui/dropdown-menu";
import { Input } from "@@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@@/components/ui/table";
import {
  PROJECT_LANGUAGES,
  projectLanguageLine,
  type Project,
} from "@@/data/projects";
import { projectEditPath } from "@@/lib/admin-session";

const ALL = "all";

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** Matches the public gallery filter: a language counts if it is the source or a target. */
const languageFilter: FilterFn<Project> = (row, _id, value: string) =>
  value === ALL || row.original.from === value || row.original.to.includes(value as Project["from"]);

export default function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState<string>(ALL);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);
  const [viewing, setViewing] = useState<Project | null>(null);
  const [deleting, startDelete] = useTransition();

  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => setViewing(row.original)}
              className="flex h-[60px] w-10 shrink-0 items-center justify-center overflow-hidden rounded border bg-muted"
            >
              {row.original.poster ? (
                // Uploaded posters may be newer than the running server, so skip next/image.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={row.original.poster}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover"
                />
              ) : (
                <Film className="size-4 text-muted-foreground" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setViewing(row.original)}
              aria-label={`View ${row.original.title}`}
              data-view-project={row.original.id}
              className="rounded-sm text-left font-medium text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {row.original.title}
            </button>
          </div>
        ),
      },
      {
        id: "languages",
        header: "Languages",
        accessorFn: (p) => projectLanguageLine(p),
        filterFn: languageFilter,
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>()}</Badge>,
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {dateFormat.format(new Date(getValue<string>()))}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={`Actions for ${row.original.title}`}
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setViewing(row.original)}>
                  <Eye />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={projectEditPath(row.original.id)}>
                    <Pencil />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => setPendingDelete(row.original)}
                >
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: projects,
    columns,
    state: {
      globalFilter: search,
      columnFilters: [{ id: "languages", value: language }],
      pagination,
    },
    globalFilterFn: (row, _id, value: string) =>
      row.original.title.toLowerCase().includes(value.trim().toLowerCase()),
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  });

  const filteredCount = table.getFilteredRowModel().rows.length;
  const resetPage = () => setPagination((p) => ({ ...p, pageIndex: 0 }));

  const confirmDelete = () => {
    const target = pendingDelete;
    if (!target) return;
    startDelete(async () => {
      const result = await deleteProjectAction(target.id);
      if (result.ok) toast.success(`“${target.title}” deleted.`);
      else toast.error(result.message ?? "Could not delete the project.");
      setPendingDelete(null);
      router.refresh();
    });
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border bg-surface shadow-card">
      <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by title"
            aria-label="Search projects by title"
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
          />
        </div>
        <Select
          value={language}
          onValueChange={(v) => {
            setLanguage(v);
            resetPage();
          }}
        >
          <SelectTrigger className="w-full sm:w-44" aria-label="Filter by language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All languages</SelectItem>
            {PROJECT_LANGUAGES.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
                    <Film className="size-8 text-muted-foreground" aria-hidden="true" />
                    <p className="text-sm font-medium">No projects found</p>
                    <p className="text-sm text-muted-foreground">
                      {projects.length
                        ? "Try a different title or language."
                        : "Add your first project to get started."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        className="border-t"
        page={pagination.pageIndex + 1}
        pageSize={pagination.pageSize}
        total={filteredCount}
        onPageChange={(page) => setPagination((p) => ({ ...p, pageIndex: page - 1 }))}
        onPageSizeChange={(pageSize) => setPagination({ pageIndex: 0, pageSize })}
        showTotal={(total, [from, to]) =>
          total ? `${from}–${to} of ${total} projects` : "0 projects"
        }
      />

      <ProjectPreviewDialog project={viewing} onClose={() => setViewing(null)} />

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.title}” will be removed from the admin list and the
              public Our Projects page. This can’t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
