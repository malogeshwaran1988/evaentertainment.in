"use client";

import { SeoBadge } from "@@/components/admin/ui/StatusBadge";
import { useMemo, useState } from "react";
import { Checkbox } from "@@/components/ui/checkbox";
import { Input } from "@@/components/ui/input";
import { Label } from "@@/components/ui/label";
import { PROJECT_SYNOPSIS_MAX, type ProjectInput } from "@@/data/projects";
import {
  formatFaqs,
  formatVoiceCast,
  parseFaqs,
  parseLines,
  parseVoiceCast,
  PROJECT_INDEX_MIN_WORDS,
  projectUniqueWordCount,
} from "@@/lib/project-content";
import { cn } from "@@/lib/utils";

const TEXTAREA = cn(
  "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground md:text-sm dark:bg-input/30",
  "focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "aria-invalid:border-destructive",
);

type Errors = Partial<Record<keyof ProjectInput, string>>;

function Err({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}

/** Badge used in the form and the projects table. */
export function IndexBadge({ words }: { words: number }) {
  return <SeoBadge words={words} min={PROJECT_INDEX_MIN_WORDS} />;
}

/**
 * Optional per-film page content. Fields are plain form inputs (read by the server action);
 * local state only drives the live word count / index badge.
 */
export default function ProjectContentFields({
  initial,
  errors,
  description,
}: {
  initial?: ProjectInput;
  errors: Errors;
  description: string;
}) {
  const ew = initial?.evaWork;
  const [v, setV] = useState({
    synopsis: initial?.synopsis ?? "",
    director: initial?.director ?? "",
    cast: (initial?.cast ?? []).join("\n"),
    originalRelease: initial?.originalRelease ?? "",
    productionHouse: initial?.productionHouse ?? "",
    evaMix: ew?.mix ?? "",
    evaDubbingDirector: ew?.dubbingDirector ?? "",
    evaNotes: ew?.notes ?? "",
    voiceCast: formatVoiceCast(initial?.voiceCast),
    trailerUrl: initial?.trailerUrl ?? "",
    whereToWatch: initial?.whereToWatch ?? "",
    faqs: formatFaqs(initial?.faqs),
  });
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) =>
    setV((s) => ({ ...s, [k]: e.target.value }));

  const words = useMemo(
    () =>
      projectUniqueWordCount({
        description,
        synopsis: v.synopsis,
        director: v.director,
        cast: parseLines(v.cast),
        originalRelease: v.originalRelease,
        productionHouse: v.productionHouse,
        evaWork: { mix: v.evaMix, dubbingDirector: v.evaDubbingDirector, notes: v.evaNotes },
        voiceCast: parseVoiceCast(v.voiceCast),
        whereToWatch: v.whereToWatch,
        faqs: parseFaqs(v.faqs),
      }),
    [v, description],
  );

  const text = (k: keyof typeof v, label: string, hint?: string, placeholder?: string, err?: string) => (
    <div className="space-y-2">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} name={k} value={v[k]} onChange={set(k)} placeholder={placeholder} aria-invalid={err ? true : undefined} />
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      <Err message={err} />
    </div>
  );
  const area = (k: keyof typeof v, label: string, rows: number, hint?: string, placeholder?: string, err?: string, max?: number) => (
    <div className="space-y-2">
      <Label htmlFor={k}>{label}</Label>
      <textarea id={k} name={k} rows={rows} value={v[k]} onChange={set(k)} placeholder={placeholder} maxLength={max} className={TEXTAREA} aria-invalid={err ? true : undefined} />
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      <Err message={err} />
    </div>
  );

  return (
    <fieldset className="space-y-5 rounded-lg border p-4">
      <legend className="flex flex-wrap items-center gap-2 px-1 text-sm font-medium">
        Page content (SEO) <IndexBadge words={words} />
      </legend>
      <p className="text-sm text-muted-foreground">
        All optional. Write in your own words (don&apos;t copy Wikipedia/IMDb). Pages with fewer than{" "}
        {PROJECT_INDEX_MIN_WORDS} words here (including the description) stay out of Google until
        enriched.
      </p>
      {area("synopsis", "Synopsis", 5, `About the film in 60–150 words. (${v.synopsis.length}/${PROJECT_SYNOPSIS_MAX})`, undefined, errors.synopsis, PROJECT_SYNOPSIS_MAX)}
      <div className="grid gap-4 sm:grid-cols-2">
        {text("director", "Director")}
        {text("productionHouse", "Production house")}
        {text("originalRelease", "Original release date", "YYYY-MM-DD (or YYYY-MM / YYYY)", "2025-07-04", errors.originalRelease)}
        {text("whereToWatch", "Where to watch (dubbed version)", undefined, "e.g. Prime Video, Zee Cinema")}
      </div>
      {area("cast", "Lead cast (original film)", 3, "One actor per line.")}

      <div className="space-y-3 rounded-md border border-dashed p-3">
        <p className="text-sm font-medium">What EVA did</p>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox name="evaLipSync" defaultChecked={ew?.lipSync} /> Full lip-sync dubbing
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox name="evaSongs" defaultChecked={ew?.songs} /> Songs dubbed
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {text("evaMix", "Mix", undefined, "5.1 and stereo")}
          <div className="space-y-2">
            <Label htmlFor="evaVoiceArtists">Voice artists</Label>
            <Input id="evaVoiceArtists" name="evaVoiceArtists" type="number" min={1} max={999} defaultValue={ew?.voiceArtists ?? ""} />
          </div>
          {text("evaDubbingDirector", "Dubbing director")}
        </div>
        <Err message={errors.evaWork} />
        {area("evaNotes", "Notes on the work", 3, "Scope, challenges, turnaround, delivery (OTT/satellite).")}
      </div>

      {area("voiceCast", "Hindi voice cast", 4, "One per line: Role — Voice artist", "Surya — Rajesh Kumar")}
      {text("trailerUrl", "Dubbed trailer (YouTube link)", undefined, "https://www.youtube.com/watch?v=…", errors.trailerUrl)}
      {area("faqs", "FAQs", 6, "Blocks of “Q: …” and “A: …”, separated by a blank line.", "Q: Who dubbed the film in Hindi?\nA: …")}
    </fieldset>
  );
}
