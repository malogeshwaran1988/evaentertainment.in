"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
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
import { CategoryBadge, VisibilityBadge } from "@@/components/admin/ui/StatusBadge";
import { IndexBadge } from "@@/components/admin/projects/ProjectContentFields";
import { PROJECT_INDEX_MIN_WORDS, projectUniqueWordCount } from "@@/lib/project-content";
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
  projectLanguageLine,
  projectYearLabel,
  type Project,
} from "@@/data/projects";
import { projectEditPath } from "@@/lib/admin-session";
import {
  FILTER_ALL,
  facetOptions,
  matchesFacets,
  matchesSearch,
  sanitizeFacets,
} from "@@/lib/project-filters";

const ALL = FILTER_ALL;

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});


export default function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<string>(ALL);
  const [category, setCategory] = useState<string>(ALL);
  const [visibility, setVisibility] = useState<string>(ALL);
  const [seo, setSeo] = useState<string>(ALL);
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
              className="rounded-sm text-left font-medium text-foreground hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
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
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ getValue }) => <CategoryBadge category={getValue<string>()} />,
      },
      {
        id: "published",
        header: "Visibility",
        cell: ({ row }) =>
          <VisibilityBadge published={row.original.published !== false} />,
      },
      {
        id: "seo",
        header: "SEO",
        cell: ({ row }) => <IndexBadge words={projectUniqueWordCount(row.original)} />,
      },
      {
        id: "year",
        header: "Year",
        cell: ({ row }) =>
          row.original.year ? (
            <span className="whitespace-nowrap">{projectYearLabel(row.original.year)}</span>
          ) : (
            <span className="text-muted-foreground" aria-label="No year">
              –
            </span>
          ),
      },
      {
        id: "audioHours",
        header: "Hours",
        cell: ({ row }) =>
          row.original.audioHours != null ? (
            <span className="whitespace-nowrap tabular-nums">{row.original.audioHours}</span>
          ) : (
            <span className="text-muted-foreground" aria-label="No hours">
              –
            </span>
          ),
      },
      {
        id: "description",
        header: "Description",
        cell: ({ row }) => {
          const text = row.original.description?.trim();
          if (!text) {
            return (
              <span className="text-muted-foreground" aria-label="No description">
                –
              </span>
            );
          }
          const short = text.length > 60 ? `${text.slice(0, 60).trimEnd()}…` : text;
          return (
            <span className="line-clamp-2 max-w-56 text-muted-foreground" title={text}>
              {short}
            </span>
          );
        },
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
                  className="h-10 w-10"
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

  // Debounce typing so large lists stay responsive.
  useEffect(() => {
    const t = setTimeout(() => setQuery(search), 200);
    return () => clearTimeout(t);
  }, [search]);

  // Facets: options come from the projects actually present; stale selections fall back to All.
  const facets = useMemo(
    () => sanitizeFacets(projects, { language, category }),
    [projects, language, category],
  );
  const options = useMemo(() => facetOptions(projects, facets), [projects, facets]);

  // Filter before handing rows to the table. The old TanStack global filter only ran
  // when its value was non-empty and is cached on the filter state, so title search
  // never reliably re-ran; plain memoised filtering is predictable.
  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        if (!matchesSearch(p, query)) return false;
        if (!matchesFacets(p, facets)) return false;
        if (visibility !== ALL && (p.published !== false ? "public" : "private") !== visibility) return false;
        if (seo !== ALL) {
          const ok = projectUniqueWordCount(p) >= PROJECT_INDEX_MIN_WORDS;
          if ((ok ? "indexable" : "thin") !== seo) return false;
        }
        return true;
      }),
    [projects, query, facets, visibility, seo],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  });

  const filteredCount = filtered.length;
  const filtersActive =
    search !== "" || facets.language !== ALL || facets.category !== ALL || visibility !== ALL || seo !== ALL;
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
      <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search title, language, category"
            aria-label="Search projects by title, language or category"
            className="h-10 pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
          />
        </div>
        <FilterSelect
          label="Filter by original language"
          value={facets.language}
          onChange={(v) => {
            setLanguage(v);
            resetPage();
          }}
          options={[[ALL, "All languages"], ...options.languages.map((l) => [l, `From ${l}`] as [string, string])]}
        />
        <FilterSelect
          label="Filter by category"
          value={facets.category}
          onChange={(v) => {
            setCategory(v);
            resetPage();
          }}
          options={[[ALL, "All categories"], ...options.categories.map((c) => [c, c] as [string, string])]}
        />
        <FilterSelect
          label="Filter by visibility"
          value={visibility}
          onChange={(v) => {
            setVisibility(v);
            resetPage();
          }}
          options={[
            [ALL, "Any visibility"],
            ["public", "Public"],
            ["private", "Private"],
          ]}
        />
        <FilterSelect
          label="Filter by SEO status"
          value={seo}
          onChange={(v) => {
            setSeo(v);
            resetPage();
          }}
          options={[
            [ALL, "Any SEO status"],
            ["thin", "Thin (noindex)"],
            ["indexable", "Indexable"],
          ]}
        />
        {filtersActive ? (
          <Button
            type="button"
            variant="ghost"
            className="h-10 sm:ml-auto"
            onClick={() => {
              setSearch("");
              setQuery("");
              setLanguage(ALL);
              setCategory(ALL);
              setVisibility(ALL);
              setSeo(ALL);
              resetPage();
            }}
          >
            Clear filters
          </Button>
        ) : null}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {filteredCount} {filteredCount === 1 ? "project" : "projects"} shown
      </p>

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
                        ? "Try a different title or filter, or clear the filters."
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 w-full sm:w-44" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(([v, text]) => (
          <SelectItem key={v} value={v}>
            {text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
