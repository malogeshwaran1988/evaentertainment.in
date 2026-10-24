"use client";

import { useRef, useState } from "react";
import { ImageIcon, Link2, Loader2, Trash2, Undo2, Upload } from "lucide-react";
import { Button } from "@@/components/ui/button";
import { Input } from "@@/components/ui/input";
import { Label } from "@@/components/ui/label";
import { POSTER_MAX_BYTES } from "@@/data/projects";
import {
  POSTER_AVIF_MAX_KB,
  POSTER_AVIF_MIN_KB,
  POSTER_SOURCE_ACCEPT,
  convertPosterToAvif,
  validatePosterSource,
} from "@@/lib/admin/poster-to-avif";
import { cn } from "@@/lib/utils";

export type PickedPoster = { file: File; url: string };

type PosterFieldProps = {
  current?: string;
  picked: PickedPoster | null;
  removed: boolean;
  error?: string;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  onLoadFromUrl: () => void;
  urlBusy?: boolean;
  onPick: (file: File | null) => void;
  onClientError: (message: string | undefined) => void;
  onRemovedChange: (removed: boolean) => void;
  /** Reuse for other uploads (client logos): ids, wording and preview box. Defaults keep the poster field. */
  fieldId?: string;
  label?: string;
  noun?: string;
  hint?: React.ReactNode;
  previewClassName?: string;
  urlPlaceholder?: string;
};

const SERVER_MAX_KB = POSTER_MAX_BYTES / 1024;

export default function PosterField({
  current,
  picked,
  removed,
  error,
  imageUrl,
  onImageUrlChange,
  onLoadFromUrl,
  urlBusy = false,
  onPick,
  onClientError,
  onRemovedChange,
  fieldId = "poster",
  label = "Poster (optional)",
  noun = "poster",
  hint,
  previewClassName = "aspect-2/3 w-32",
  urlPlaceholder = "https://example.com/poster.jpg",
}: PosterFieldProps) {
  const Noun = noun.charAt(0).toUpperCase() + noun.slice(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const convertGen = useRef(0);
  const [converting, setConverting] = useState(false);
  const previewSrc = picked?.url ?? (removed ? undefined : current);
  const localBusy = converting || urlBusy;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;

    const validationError = validatePosterSource(file);
    if (validationError) {
      onClientError(validationError);
      return;
    }

    const gen = ++convertGen.current;
    setConverting(true);
    onClientError(undefined);
    onImageUrlChange("");

    try {
      const result = await convertPosterToAvif(file);
      if (gen !== convertGen.current) return;
      if (result.bytes > POSTER_MAX_BYTES) {
        onClientError(
          `Converted poster is ${Math.ceil(result.bytes / 1024)} KB. The maximum is ${SERVER_MAX_KB} KB.`,
        );
        return;
      }
      onPick(result.file);
    } catch (err) {
      if (gen !== convertGen.current) return;
      onClientError(
        err instanceof Error ? err.message : "Could not convert this image to AVIF.",
      );
    } finally {
      if (gen === convertGen.current) setConverting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted",
            previewClassName,
            error && "border-destructive",
          )}
        >
          {previewSrc ? (
            // Blob URLs and freshly uploaded files can't go through next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewSrc} alt={`${Noun} preview`} className={fieldId === "poster" ? "size-full object-cover" : "size-full object-contain p-2"} />
          ) : (
            <ImageIcon className="size-8 text-muted-foreground" aria-hidden />
          )}
          {localBusy ? (
            <div
              className="absolute inset-0 flex items-center justify-center bg-background/70"
              aria-live="polite"
              aria-busy="true"
            >
              <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden />
              <span className="sr-only">Working on {noun}</span>
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <p id={`${fieldId}-hint`} className="text-sm text-muted-foreground">
            {hint ?? (<>
            JPG, PNG, WebP, GIF or BMP — converted to AVIF under {POSTER_AVIF_MAX_KB} KB
            (aim ~{POSTER_AVIF_MIN_KB}–{POSTER_AVIF_MAX_KB} KB). Very large images are resized
            automatically. Portrait 2:3, e.g. 600 × 900 px. Or paste a direct image URL below.
            </>)}
          </p>

          <input
            ref={inputRef}
            id={fieldId}
            type="file"
            accept={POSTER_SOURCE_ACCEPT}
            className="sr-only"
            onChange={handleChange}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fieldId}-error ${fieldId}-hint` : `${fieldId}-hint`}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              <Upload />
              {previewSrc || localBusy ? "Replace image" : "Choose image"}
            </Button>

            {picked ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  convertGen.current += 1;
                  setConverting(false);
                  onPick(null);
                }}
              >
                <Undo2 />
                {current && !removed ? `Keep current ${noun}` : "Clear selection"}
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
                Remove {noun}
              </Button>
            ) : current && removed ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => onRemovedChange(false)}>
                <Undo2 />
                Undo remove
              </Button>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${fieldId}Url`}>Image URL (optional)</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id={`${fieldId}Url`}
                type="url"
                inputMode="url"
                placeholder={urlPlaceholder}
                value={imageUrl}
                onChange={(e) => onImageUrlChange(e.target.value)}
                aria-describedby={`${fieldId}Url-hint`}
                className="min-w-0 flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="shrink-0"
                disabled={!imageUrl.trim()}
                onClick={onLoadFromUrl}
              >
                <Link2 />
                Load from URL
              </Button>
            </div>
            <p id={`${fieldId}Url-hint`} className="text-sm text-muted-foreground">
              Use a direct link to the image file, not a Google search or gallery page.
            </p>
          </div>

          {converting ? (
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Converting to AVIF…
            </p>
          ) : picked ? (
            <p className="truncate text-sm" title={picked.file.name}>
              {picked.file.name}{" "}
              <span className="text-muted-foreground">
                ({Math.ceil(picked.file.size / 1024)} KB AVIF)
              </span>
            </p>
          ) : removed ? (
            <p className="text-sm text-muted-foreground">The {noun} will be removed when you save.</p>
          ) : null}

          {error ? (
            <p id={`${fieldId}-error`} className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
