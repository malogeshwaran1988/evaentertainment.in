"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileUp, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  importProjectCsvAction,
  previewProjectCsvAction,
  type CsvPreviewState,
} from "@@/app/(admin)/admin/projects/actions";
import type { Project } from "@@/data/projects";
import { loadPosterFromUrl } from "@@/lib/admin/poster-from-url-client";
import type { CsvRowResult } from "@@/lib/admin/project-csv";
import {
  CSV_MAX_BYTES,
  CSV_MAX_ROWS,
  projectCsvGuide,
  projectCsvTemplate,
  projectsToCsv,
} from "@@/lib/admin/project-csv";
import { Button } from "@@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@@/components/ui/table";

function download(name: string, csv: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

type Phase = "idle" | "checking" | "importing";

export function ExportProjectsCsvButton({ projects }: { projects: Project[] }) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => download(`eva-projects-${new Date().toISOString().slice(0, 10)}.csv`, projectsToCsv(projects))}
    >
      <Download aria-hidden />
      Export CSV
    </Button>
  );
}

export default function ProjectCsvImport() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<Extract<CsvPreviewState, { ok: true }> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const fileId = useId();
  const hintId = useId();
  const errorId = useId();

  const reset = () => {
    setPhase("idle");
    setProgress("");
    setError("");
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  async function check() {
    const file = fileRef.current?.files?.[0];
    setError("");
    setPreview(null);
    if (!file) {
      setError("Choose a CSV file.");
      fileRef.current?.focus();
      return;
    }
    if (file.size > CSV_MAX_BYTES) {
      setError(`The file is ${Math.ceil(file.size / 1024)} KB. The maximum is ${CSV_MAX_BYTES / 1024} KB.`);
      return;
    }
    setPhase("checking");
    const fd = new FormData();
    fd.set("csv", file);
    try {
      const result = await previewProjectCsvAction(fd);
      if (result.ok) setPreview(result);
      else setError(result.error);
    } catch {
      setError("Couldn't check the file. Please try again.");
    } finally {
      setPhase("idle");
    }
  }

  async function runImport() {
    if (!preview) return;
    setPhase("importing");
    setError("");
    const fd = new FormData();
    fd.set("csvText", preview.csv);
    const withPoster = preview.rows.filter((r) => r.posterUrl);
    // One at a time, like a person using "Fetch from URL", so remote hosts aren't hammered.
    for (let i = 0; i < withPoster.length; i++) {
      const row = withPoster[i];
      setProgress(`Fetching poster ${i + 1} of ${withPoster.length}: ${row.title}`);
      try {
        const file = await loadPosterFromUrl(row.posterUrl!);
        fd.set(`poster-${row.row}`, file);
      } catch (err) {
        fd.set(`posterError-${row.row}`, err instanceof Error ? err.message : "Poster fetch failed.");
      }
    }
    setProgress("Saving projects…");
    try {
      const result = await importProjectCsvAction(fd);
      if (result.ok) {
        toast.success(result.message);
        if (result.posterIssues.length) {
          setPreview(null);
          setError(
            `${result.message} Posters that failed: ${result.posterIssues
              .map((p) => `row ${p.row} “${p.title}” (${p.reason})`)
              .join("; ")}.`,
          );
        } else {
          setOpen(false);
          reset();
        }
        router.refresh();
      } else {
        setError(result.error);
        if (result.rows?.length) {
          setPreview({
            ...preview,
            rows: result.rows,
            validCount: result.rows.filter((r) => !r.errors.length).length,
          });
        }
      }
    } catch {
      setError("Nothing was imported. Please try again.");
    } finally {
      setPhase("idle");
      setProgress("");
    }
  }

  const invalid = preview ? preview.rows.length - preview.validCount : 0;
  const busy = phase !== "idle";

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <Upload aria-hidden />
        Import CSV
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (busy) return;
          setOpen(next);
          if (!next) reset();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Import projects from CSV</DialogTitle>
            <DialogDescription>
              Up to {CSV_MAX_ROWS} rows and {CSV_MAX_BYTES / 1024} KB. Rows are checked with the same
              rules as Add project. Nothing is imported until every row is valid. New projects stay
              unpublished unless <code>published</code> is <code>true</code>.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => download("eva-projects-template.csv", projectCsvTemplate())}>
              <Download aria-hidden />
              Download template
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => download("eva-projects-columns.csv", projectCsvGuide())}>
              <Download aria-hidden />
              Column guide
            </Button>
          </div>

          <div className="space-y-2">
            <label htmlFor={fileId} className="text-sm font-medium text-ink">
              CSV file
            </label>
            <input
              ref={fileRef}
              id={fileId}
              type="file"
              accept=".csv,text/csv"
              disabled={busy}
              aria-describedby={`${hintId}${error ? ` ${errorId}` : ""}`}
              aria-invalid={error && !preview ? true : undefined}
              onChange={() => {
                setPreview(null);
                setError("");
              }}
              className="block w-full min-h-11 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <p id={hintId} className="text-sm text-ink-subtle">
              Lists use “;” (to, cast, voiceCast). FAQs go in one quoted cell as “Q: …” / “A: …” lines.
            </p>
            <Button type="button" onClick={check} disabled={busy} className="min-h-11">
              <FileUp aria-hidden />
              {phase === "checking" ? "Checking…" : "Check file"}
            </Button>
          </div>

          <div role="status" aria-live="polite" className="text-sm">
            {busy && progress ? progress : null}
            {preview && !busy
              ? invalid
                ? `${preview.validCount} of ${preview.rows.length} rows are valid. Fix ${invalid} row${invalid === 1 ? "" : "s"} and upload again.`
                : `All ${preview.rows.length} rows are valid and ready to import.`
              : null}
          </div>
          {error ? (
            <p id={errorId} role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-ink">
              {error}
            </p>
          ) : null}
          {preview?.warnings.map((w) => (
            <p key={w} className="text-sm text-ink-subtle">
              {w}
            </p>
          ))}

          {preview ? <PreviewTable rows={preview.rows} /> : null}

          <DialogFooter>
            <Button type="button" variant="outline" disabled={busy} onClick={() => { setOpen(false); reset(); }}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={busy || !preview || invalid > 0 || preview.rows.length === 0}
              onClick={runImport}
              className="min-h-11"
            >
              {phase === "importing"
                ? "Importing…"
                : `Import ${preview?.rows.length ?? 0} project${preview?.rows.length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PreviewTable({ rows }: { rows: CsvRowResult[] }) {
  return (
    <Table>
      <TableCaption className="sr-only">Validation preview, one line per CSV row</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Row</TableHead>
          <TableHead scope="col">Title</TableHead>
          <TableHead scope="col">Languages</TableHead>
          <TableHead scope="col">Category</TableHead>
          <TableHead scope="col">Year</TableHead>
          <TableHead scope="col">Visibility</TableHead>
          <TableHead scope="col">Poster</TableHead>
          <TableHead scope="col">Check</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.row}>
            <TableCell>{r.row}</TableCell>
            <TableCell className="font-medium">{r.title || "—"}</TableCell>
            <TableCell>
              {r.from || "?"} → {r.to || "?"}
            </TableCell>
            <TableCell>{r.category || "—"}</TableCell>
            <TableCell>{r.year || "—"}</TableCell>
            <TableCell>{r.published ? "Published" : "Unpublished"}</TableCell>
            <TableCell>{r.posterUrl ? "From URL" : "None"}</TableCell>
            <TableCell>
              {r.errors.length ? (
                <ul className="list-none space-y-1 text-sm">
                  <li className="font-medium text-destructive">✕ {r.errors.length} error{r.errors.length === 1 ? "" : "s"}</li>
                  {r.errors.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-sm font-medium">✓ Valid</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
