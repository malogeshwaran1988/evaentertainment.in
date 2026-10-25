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
} from "@tanstack/react-table";
import { ExternalLink, MoreHorizontal, Newspaper, Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteBlogPostAction } from "@@/app/(admin)/admin/blog/actions";
import DataTablePagination from "@@/components/admin/ui/DataTablePagination";
import { BlogStatusBadge, StatusBadge } from "@@/components/admin/ui/StatusBadge";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@@/components/ui/table";
import { BLOG_CATEGORIES, type BlogPost, type BlogPublicState } from "@@/data/blog";
import { blogEditPath } from "@@/lib/admin-session";
import { blogHref } from "@@/lib/blog/slug";
import { formatBlogDate } from "@@/lib/blog/seo";

const ALL = "all";

/** `state` is worked out on the server, so the badge can't flip during hydration. */
export type BlogRow = Pick<
  BlogPost,
  "id" | "title" | "slug" | "category" | "publishDate" | "author" | "updatedAt" | "previousSlugs"
> & { state: BlogPublicState };

export default function BlogTable({ posts }: { posts: BlogRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(ALL);
  const [category, setCategory] = useState<string>(ALL);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [pendingDelete, setPendingDelete] = useState<BlogRow | null>(null);
  const [deleting, startDelete] = useTransition();

  const columns = useMemo<ColumnDef<BlogRow>[]>(
    () => [
      {
        id: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="min-w-56 max-w-md space-y-1">
            <Link
              href={blogEditPath(row.original.id)}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {row.original.title}
            </Link>
            <p className="break-all font-mono text-xs text-muted-foreground">{blogHref(row.original.slug)}</p>
            {row.original.previousSlugs?.length ? (
              <p className="text-xs text-muted-foreground">
                Redirects from {row.original.previousSlugs.map((s) => blogHref(s)).join(", ")}
              </p>
            ) : null}
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => <BlogStatusBadge state={row.original.state} />,
      },
      {
        id: "category",
        header: "Category",
        cell: ({ row }) => (
          <StatusBadge tone="violet" icon={Newspaper}>
            {row.original.category}
          </StatusBadge>
        ),
      },
      {
        id: "publishDate",
        header: "Publish date",
        cell: ({ row }) => <span className="whitespace-nowrap">{formatBlogDate(row.original.publishDate)}</span>,
      },
      {
        id: "author",
        header: "Author",
        cell: ({ row }) => <span className="whitespace-nowrap">{row.original.author}</span>,
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
                <DropdownMenuItem asChild>
                  <Link href={blogEditPath(row.original.id)}>
                    <Pencil />
                    Edit
                  </Link>
                </DropdownMenuItem>
                {row.original.state === "published" ? (
                  <DropdownMenuItem asChild>
                    <a href={blogHref(row.original.slug)} target="_blank" rel="noopener noreferrer">
                      <ExternalLink />
                      View on site
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </DropdownMenuItem>
                ) : null}
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
    data: posts,
    columns,
    state: { pagination, globalFilter: `${search}\u0000${status}\u0000${category}` },
    onPaginationChange: setPagination,
    globalFilterFn: (row) => {
      const q = search.trim().toLowerCase();
      if (q && !`${row.original.title} ${row.original.slug}`.toLowerCase().includes(q)) return false;
      if (status !== ALL && row.original.state !== status) return false;
      if (category !== ALL && row.original.category !== category) return false;
      return true;
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const filteredCount = table.getFilteredRowModel().rows.length;
  const filtersActive = Boolean(search) || status !== ALL || category !== ALL;
  const resetPage = () => setPagination((p) => ({ ...p, pageIndex: 0 }));

  const confirmDelete = () => {
    const target = pendingDelete;
    if (!target) return;
    startDelete(async () => {
      const result = await deleteBlogPostAction(target.id);
      if (result.ok) toast.success(`“${target.title}” deleted.`);
      else toast.error(result.message ?? "Could not delete the post.");
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
            placeholder="Search by title or URL"
            aria-label="Search posts by title or URL"
            className="h-10 pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
          />
        </div>
        <FilterSelect
          label="Filter by status"
          value={status}
          onChange={(v) => {
            setStatus(v);
            resetPage();
          }}
          options={[
            [ALL, "Any status"],
            ["draft", "Draft"],
            ["scheduled", "Scheduled"],
            ["published", "Published"],
          ]}
        />
        <FilterSelect
          label="Filter by category"
          value={category}
          onChange={(v) => {
            setCategory(v);
            resetPage();
          }}
          options={[[ALL, "All categories"], ...BLOG_CATEGORIES.map((c) => [c, c] as [string, string])]}
        />
        {filtersActive ? (
          <Button
            type="button"
            variant="ghost"
            className="h-10 sm:ml-auto"
            onClick={() => {
              setSearch("");
              setStatus(ALL);
              setCategory(ALL);
              resetPage();
            }}
          >
            Clear filters
          </Button>
        ) : null}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {filteredCount} {filteredCount === 1 ? "post" : "posts"} shown
      </p>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
                    <Newspaper className="size-8 text-muted-foreground" aria-hidden="true" />
                    <p className="text-sm font-medium">No posts found</p>
                    <p className="text-sm text-muted-foreground">
                      {posts.length
                        ? "Try a different search or filter or clear the filters."
                        : "Write your first post to get started."}
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
        showTotal={(total, [from, to]) => (total ? `${from}–${to} of ${total} posts` : "0 posts")}
      />

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.title}” will be removed from the blog and its URL
              {pendingDelete?.previousSlugs?.length ? " and old redirecting URLs" : ""} will stop working. This
              can’t be undone. To hide it instead, set it to Draft.
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
