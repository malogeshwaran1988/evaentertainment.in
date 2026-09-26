"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ProjectFormState } from "@@/app/(admin)/admin/projects/actions";
import { Button } from "@@/components/ui/button";
import { Checkbox } from "@@/components/ui/checkbox";
import { Input } from "@@/components/ui/input";
import { Label } from "@@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@@/components/ui/select";
import {
  PROJECT_CATEGORIES,
  PROJECT_LANGUAGES,
  type ProjectInput,
  type ProjectLanguage,
} from "@@/data/projects";
import { AdminRoutes } from "@@/lib/admin-session";
import PosterField, { type PickedPoster } from "./PosterField";
import ProjectCardPreview from "./ProjectCardPreview";

type ProjectFormProps = {
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  initial?: ProjectInput;
  submitLabel: string;
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-destructive">
      {message}
    </p>
  );
}

export default function ProjectForm({ action, initial, submitLabel }: ProjectFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, {});
  const [title, setTitle] = useState(initial?.title ?? "");
  const [posterAlt, setPosterAlt] = useState(initial?.posterAlt ?? "");
  const [from, setFrom] = useState<ProjectLanguage | "">(initial?.from ?? "");
  const [to, setTo] = useState<ProjectLanguage[]>(initial?.to ?? []);
  const [category, setCategory] = useState(initial?.category ?? PROJECT_CATEGORIES[0]);
  const [picked, setPicked] = useState<PickedPoster | null>(null);
  const [removePoster, setRemovePoster] = useState(false);
  const [posterClientError, setPosterClientError] = useState<string>();
  // Hides a server-side poster error once a different file has been picked.
  const [pickedAfter, setPickedAfter] = useState<ProjectFormState | null>(null);
  const pickedUrl = useRef<string | null>(null);
  const errors = state.fieldErrors ?? {};
  const posterError =
    posterClientError ?? (pickedAfter === state ? undefined : errors.poster);

  useEffect(
    () => () => {
      if (pickedUrl.current) URL.revokeObjectURL(pickedUrl.current);
    },
    [],
  );

  const pickPoster = (file: File | null) => {
    if (pickedUrl.current) URL.revokeObjectURL(pickedUrl.current);
    const next = file ? { file, url: URL.createObjectURL(file) } : null;
    pickedUrl.current = next?.url ?? null;
    setPicked(next);
    setPickedAfter(state);
  };

  // Submitting via `<form action>` resets the form afterwards, which also clears the Radix
  // Select/Checkbox state, so the action is dispatched manually to keep entries after an error.
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (picked) formData.set("poster", picked.file);
    else if (removePoster) formData.set("removePoster", "on");
    startTransition(() => formAction(formData));
  };

  useEffect(() => {
    if (state.ok) {
      toast.success(state.message);
      router.push(AdminRoutes.PROJECTS);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  const toggleTarget = (lang: ProjectLanguage, checked: boolean) =>
    setTo((prev) => (checked ? [...prev, lang] : prev.filter((l) => l !== lang)));

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_248px]">
      <form
        onSubmit={submit}
        className="min-w-0 space-y-6 rounded-xl border bg-surface p-4 shadow-card sm:p-6"
        noValidate
      >
        <PosterField
          current={initial?.poster}
          picked={picked}
          removed={removePoster}
          error={posterError}
          onPick={pickPoster}
          onClientError={setPosterClientError}
          onRemovedChange={setRemovePoster}
        />

        <div className="space-y-2">
          <Label htmlFor="posterAlt">ALT name</Label>
          <Input
            id="posterAlt"
            name="posterAlt"
            value={posterAlt}
            onChange={(e) => setPosterAlt(e.target.value)}
            maxLength={150}
            aria-invalid={errors.posterAlt ? true : undefined}
            aria-describedby={errors.posterAlt ? "posterAlt-error posterAlt-hint" : "posterAlt-hint"}
          />
          <p id="posterAlt-hint" className="text-sm text-muted-foreground">
            Describes the poster for screen readers and search engines, e.g. “Sardar 2 movie
            poster”. Leave blank to use “{title.trim() || "Project Name"} poster”.
          </p>
          <FieldError id="posterAlt-error" message={errors.posterAlt} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Project Name</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            required
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          <FieldError id="title-error" message={errors.title} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="from">Source language</Label>
            <Select
              name="from"
              value={from}
              onValueChange={(v) => {
                const next = v as ProjectLanguage;
                setFrom(next);
                setTo((prev) => prev.filter((l) => l !== next));
              }}
            >
              <SelectTrigger
                id="from"
                aria-invalid={errors.from ? true : undefined}
                aria-describedby={errors.from ? "from-error" : undefined}
              >
                <SelectValue placeholder="Choose language" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError id="from-error" message={errors.from} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" value={category} onValueChange={setCategory}>
              <SelectTrigger
                id="category"
                aria-invalid={errors.category ? true : undefined}
                aria-describedby={errors.category ? "category-error" : undefined}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError id="category-error" message={errors.category} />
          </div>
        </div>

        <fieldset
          className="space-y-3"
          aria-describedby={errors.to ? "to-error" : "to-hint"}
        >
          <legend className="text-sm font-medium leading-none">Dubbed into</legend>
          <p id="to-hint" className="text-sm text-muted-foreground">
            Choose every language this project was dubbed into.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PROJECT_LANGUAGES.map((lang) => {
              const disabled = lang === from;
              const id = `to-${lang}`;
              return (
                <div key={lang} className="flex items-center gap-2">
                  <Checkbox
                    id={id}
                    name="to"
                    value={lang}
                    checked={to.includes(lang)}
                    disabled={disabled}
                    onCheckedChange={(checked) => toggleTarget(lang, checked === true)}
                  />
                  <Label
                    htmlFor={id}
                    className={disabled ? "text-muted-foreground" : "font-normal"}
                  >
                    {lang}
                  </Label>
                </div>
              );
            })}
          </div>
          <FieldError id="to-error" message={errors.to} />
        </fieldset>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" asChild>
            <Link href={AdminRoutes.PROJECTS}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : null}
            {submitLabel}
          </Button>
        </div>
      </form>

      <aside aria-labelledby="preview-heading" className="space-y-3 lg:sticky lg:top-6">
        <div className="space-y-1">
          <h2 id="preview-heading" className="text-sm font-medium leading-none">
            Website preview
          </h2>
          <p className="text-sm text-muted-foreground">
            How this card appears on the Our Projects page.
          </p>
        </div>
        <ProjectCardPreview
          title={title}
          from={from}
          to={PROJECT_LANGUAGES.filter((l) => to.includes(l))}
          category={category}
          poster={picked?.url ?? (removePoster ? undefined : initial?.poster)}
          posterAlt={posterAlt}
        />
      </aside>
    </div>
  );
}
