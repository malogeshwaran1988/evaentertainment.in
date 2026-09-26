"use client";

import { useRef } from "react";
import { ImageIcon, Trash2, Undo2, Upload } from "lucide-react";
import { Button } from "@@/components/ui/button";
import { Label } from "@@/components/ui/label";
import { POSTER_ACCEPT, POSTER_MAX_BYTES, POSTER_TYPES } from "@@/data/projects";
import { cn } from "@@/lib/utils";

export type PickedPoster = { file: File; url: string };

type PosterFieldProps = {
  current?: string;
  picked: PickedPoster | null;
  removed: boolean;
  error?: string;
  onPick: (file: File | null) => void;
  onClientError: (message: string | undefined) => void;
  onRemovedChange: (removed: boolean) => void;
};

const MAX_KB = POSTER_MAX_BYTES / 1024;

export default function PosterField({
  current,
  picked,
  removed,
  error,
  onPick,
  onClientError,
  onRemovedChange,
}: PosterFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewSrc = picked?.url ?? (removed ? undefined : current);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;
    if (!(POSTER_TYPES as readonly string[]).includes(file.type)) {
      onClientError("Choose a JPG, PNG, WebP or AVIF image.");
      return;
    }
    if (file.size > POSTER_MAX_BYTES) {
      onClientError(
        `This image is ${Math.ceil(file.size / 1024)} KB. The maximum is ${MAX_KB} KB — please compress it and try again.`,
      );
      return;
    }
    onClientError(undefined);
    onPick(file);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="poster">Poster (optional)</Label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={cn(
            "relative flex aspect-[2/3] w-32 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted",
            error && "border-destructive",
          )}
        >
          {previewSrc ? (
            // Blob URLs and freshly uploaded files can't go through next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewSrc} alt="Poster preview" className="size-full object-cover" />
          ) : (
            <ImageIcon className="size-8 text-muted-foreground" aria-hidden />
          )}
        </div>

        <div className="min-w-0 space-y-3">
          <p id="poster-hint" className="text-sm text-muted-foreground">
            JPG, PNG, WebP or AVIF, max {MAX_KB} KB. Portrait 2:3, e.g. 600 × 900 px.
          </p>

          <input
            ref={inputRef}
            id="poster"
            type="file"
            accept={POSTER_ACCEPT}
            className="sr-only"
            onChange={handleChange}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "poster-error poster-hint" : "poster-hint"}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              <Upload />
              {previewSrc ? "Replace image" : "Choose image"}
            </Button>

            {picked ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => onPick(null)}>
                <Undo2 />
                {current && !removed ? "Keep current poster" : "Clear selection"}
              </Button>
            ) : current && !removed ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onRemovedChange(true)}
              >
                <Trash2 />
                Remove poster
              </Button>
            ) : current && removed ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => onRemovedChange(false)}>
                <Undo2 />
                Undo remove
              </Button>
            ) : null}
          </div>

          {picked ? (
            <p className="truncate text-sm" title={picked.file.name}>
              {picked.file.name}{" "}
              <span className="text-muted-foreground">
                ({Math.ceil(picked.file.size / 1024)} KB)
              </span>
            </p>
          ) : removed ? (
            <p className="text-sm text-muted-foreground">The poster will be removed when you save.</p>
          ) : null}

          {error ? (
            <p id="poster-error" className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
