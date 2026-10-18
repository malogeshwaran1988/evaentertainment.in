"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
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
  PROJECT_AUDIO_HOURS_MAX,
  PROJECT_CATEGORIES,
  PROJECT_DESCRIPTION_MAX,
  PROJECT_LANGUAGES,
  PROJECT_YEAR_ONGOING,
  projectYearOptions,
  type ProjectInput,
  type ProjectLanguage,
} from "@@/data/projects";
import {
  loadPosterFromUrl,
  type PosterBusyStep,
} from "@@/lib/admin/poster-from-url-client";
import { AdminRoutes } from "@@/lib/admin-session";
import {
  posterFileBaseName,
  projectPageSlugBase,
  projectSeoAlt,
  projectSeoTitle,
} from "@@/lib/project-seo";
import { cn } from "@@/lib/utils";
import PosterField, { type PickedPoster } from "./PosterField";
import ProjectCardPreview from "./ProjectCardPreview";

type ProjectFormProps = {
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  initial?: ProjectInput;
  submitLabel: string;
};

const STEP_LABEL: Record<PosterBusyStep, string> = {
  fetching: "Fetching image…",
  converting: "Converting to AVIF…",
  saving: "Saving project…",
};

const STEP_PROGRESS: Record<PosterBusyStep, number> = {
  fetching: 28,
  converting: 62,
  saving: 88,
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
  const [description, setDescription] = useState(initial?.description ?? "");
  const [audioHours, setAudioHours] = useState(
    initial?.audioHours != null ? String(initial.audioHours) : "",
  );
  const [from, setFrom] = useState<ProjectLanguage | "">(initial?.from ?? "");
  const [to, setTo] = useState<ProjectLanguage[]>(initial?.to ?? []);
  const [category, setCategory] = useState(initial?.category ?? PROJECT_CATEGORIES[0]);
  const [year, setYear] = useState(initial?.year ?? "");
  const [yearOptions] = useState(projectYearOptions);
  const [picked, setPicked] = useState<PickedPoster | null>(null);
  const [removePoster, setRemovePoster] = useState(false);
  const [posterClientError, setPosterClientError] = useState<string>();
  const [imageUrl, setImageUrl] = useState("");
  const [busyStep, setBusyStep] = useState<PosterBusyStep | null>(null);
  // Hides a server-side poster error once a different file has been picked.
  const [pickedAfter, setPickedAfter] = useState<ProjectFormState | null>(null);
  const pickedUrl = useRef<string | null>(null);
  const errors = state.fieldErrors ?? {};
  const posterError =
    posterClientError ?? (pickedAfter === state ? undefined : errors.poster);

  const overlayBusy = busyStep !== null || pending;
  const activeStep: PosterBusyStep | null = busyStep ?? (pending ? "saving" : null);

  useEffect(
    () => () => {
      if (pickedUrl.current) URL.revokeObjectURL(pickedUrl.current);
    },
    [],
  );

  useEffect(() => {
    if (!overlayBusy) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [overlayBusy]);

  useEffect(() => {
    if (!pending && busyStep === "saving") {
      setBusyStep(null);
    }
  }, [pending, busyStep]);

  const pickPoster = (file: File | null) => {
    if (pickedUrl.current) URL.revokeObjectURL(pickedUrl.current);
    const next = file ? { file, url: URL.createObjectURL(file) } : null;
    pickedUrl.current = next?.url ?? null;
    setPicked(next);
    setPickedAfter(state);
    if (file) {
      setRemovePoster(false);
      setPosterClientError(undefined);
    }
  };

  const runLoadFromUrl = async (): Promise<File | null> => {
    const url = imageUrl.trim();
    if (!url) {
      setPosterClientError("Paste an image URL first.");
      return null;
    }
    setPosterClientError(undefined);
    try {
      const file = await loadPosterFromUrl(url, setBusyStep);
      pickPoster(file);
      setImageUrl("");
      return file;
    } catch (err) {
      setPosterClientError(
        err instanceof Error ? err.message : "Could not load that image URL.",
      );
      return null;
    } finally {
      setBusyStep(null);
    }
  };

  // Submitting via `<form action>` resets the form afterwards, which also clears the Radix
  // Select/Checkbox state, so the action is dispatched manually to keep entries after an error.
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (overlayBusy) return;

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    let posterFile = picked?.file ?? null;
    if (!posterFile && imageUrl.trim()) {
      posterFile = await runLoadFromUrl();
      if (!posterFile) return;
    }

    if (posterFile) formData.set("poster", posterFile);
    else if (removePoster) formData.set("removePoster", "on");

    setBusyStep("saving");
    startTransition(() => formAction(formData));
  };

  useEffect(() => {
    if (state.ok) {
      toast.success(state.message);
      router.push(AdminRoutes.PROJECTS);
    } else if (state.message) {
      toast.error(state.message);
      setBusyStep(null);
    }
  }, [state, router]);

  const toggleTarget = (lang: ProjectLanguage, checked: boolean) =>
    setTo((prev) => (checked ? [...prev, lang] : prev.filter((l) => l !== lang)));

  const orderedTo = PROJECT_LANGUAGES.filter((l) => to.includes(l));
  const previewTitle = title.trim() || "Project Name";
  const seoPreviewReady = Boolean(from && orderedTo.length);
  const seoPreviewProject = seoPreviewReady
    ? {
        title: previewTitle,
        posterAlt: posterAlt.trim() || undefined,
        from: from as ProjectLanguage,
        to: orderedTo,
        year: year || undefined,
      }
    : null;
  const generatedFilename = seoPreviewProject
    ? `${posterFileBaseName(seoPreviewProject)}.avif`
    : null;
  const generatedAlt = seoPreviewProject ? projectSeoAlt(seoPreviewProject) : null;
  const generatedPageTitle = seoPreviewProject
    ? projectSeoTitle(seoPreviewProject)
    : null;
  const generatedPageSlug = seoPreviewProject
    ? projectPageSlugBase(seoPreviewProject)
    : null;

  return (
    <div className="relative grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_248px]">
      <form
        onSubmit={submit}
        className="relative min-w-0 space-y-6 rounded-xl border bg-surface p-4 shadow-card sm:p-6"
        noValidate
        aria-busy={overlayBusy || undefined}
      >
        <PosterField
          current={initial?.poster}
          picked={picked}
          removed={removePoster}
          error={posterError}
          imageUrl={imageUrl}
          onImageUrlChange={(url) => {
            setImageUrl(url);
            setPosterClientError(undefined);
          }}
          onLoadFromUrl={() => {
            void runLoadFromUrl();
          }}
          urlBusy={busyStep === "fetching" || busyStep === "converting"}
          onPick={pickPoster}
          onClientError={setPosterClientError}
          onRemovedChange={setRemovePoster}
        />

        <div className="space-y-2">
          <Label htmlFor="posterAlt">Custom ALT (optional)</Label>
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
            Leave blank to use the Final ALT in the SEO preview. Only fill this if the default
            needs an override.
          </p>
          <FieldError id="posterAlt-error" message={errors.posterAlt} />
          <div
            className="space-y-2 rounded-lg border border-dashed bg-muted/40 p-3 text-sm"
            aria-live="polite"
          >
            <p className="font-medium leading-none">SEO preview</p>
            {seoPreviewProject && generatedFilename && generatedAlt && generatedPageTitle ? (
              <dl className="space-y-2 text-muted-foreground">
                <div>
                  <dt className="text-xs uppercase tracking-wide">Filename</dt>
                  <dd className="break-all font-mono text-xs text-foreground">
                    {generatedFilename}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide">Final ALT</dt>
                  <dd className="text-foreground">{generatedAlt}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide">Page title</dt>
                  <dd className="text-foreground">{generatedPageTitle}</dd>
                </div>
                {generatedPageSlug ? (
                  <div>
                    <dt className="text-xs uppercase tracking-wide">Page URL</dt>
                    <dd className="break-all font-mono text-xs text-foreground">
                      /projects/{generatedPageSlug}
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : (
              <p className="text-muted-foreground">
                Choose a source language and at least one target to preview SEO fields.
              </p>
            )}
          </div>
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

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={PROJECT_DESCRIPTION_MAX}
            rows={5}
            className={cn(
              "flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-[color,box-shadow] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
              "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
            )}
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={
              errors.description ? "description-error description-hint" : "description-hint"
            }
          />
          <p id="description-hint" className="text-sm text-muted-foreground">
            Shown on the public project page. Optional — leave blank if you only want the title and
            languages. ({description.length}/{PROJECT_DESCRIPTION_MAX})
          </p>
          <FieldError id="description-error" message={errors.description} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audioHours">Hours of audio dubbed</Label>
          <Input
            id="audioHours"
            name="audioHours"
            type="number"
            inputMode="decimal"
            min={0.1}
            max={PROJECT_AUDIO_HOURS_MAX}
            step={0.1}
            value={audioHours}
            onChange={(e) => setAudioHours(e.target.value)}
            placeholder="e.g. 12.5"
            aria-invalid={errors.audioHours ? true : undefined}
            aria-describedby={
              errors.audioHours ? "audioHours-error audioHours-hint" : "audioHours-hint"
            }
          />
          <p id="audioHours-hint" className="text-sm text-muted-foreground">
            Finished hours of dubbed audio delivered (used for public impact totals on Home and Our
            Projects). Leave blank if unknown.
          </p>
          <FieldError id="audioHours-error" message={errors.audioHours} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select name="year" value={year} onValueChange={setYear}>
              <SelectTrigger
                id="year"
                aria-invalid={errors.year ? true : undefined}
                aria-describedby={errors.year ? "year-error" : undefined}
              >
                <SelectValue placeholder="Choose year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y === PROJECT_YEAR_ONGOING ? "Ongoing (in production)" : y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError id="year-error" message={errors.year} />
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
          <Button variant="outline" asChild disabled={overlayBusy}>
            <Link href={AdminRoutes.PROJECTS} onClick={(e) => overlayBusy && e.preventDefault()}>
              Cancel
            </Link>
          </Button>
          <Button type="submit" disabled={overlayBusy}>
            {overlayBusy ? <Loader2 className="animate-spin" /> : null}
            {submitLabel}
          </Button>
        </div>

        {overlayBusy && activeStep ? (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-xl bg-background/80 p-6 backdrop-blur-sm"
            role="status"
            aria-live="polite"
            aria-label={STEP_LABEL[activeStep]}
          >
            <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
            <div className="w-full max-w-xs space-y-2 text-center">
              <p className="text-sm font-medium">{STEP_LABEL[activeStep]}</p>
              <p className="text-xs text-muted-foreground">
                Please wait — do not refresh or close this page.
              </p>
              <div
                className="h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={STEP_PROGRESS[activeStep]}
              >
                <div
                  className={cn(
                    "h-full rounded-full bg-primary transition-[width] duration-500 ease-out",
                  )}
                  style={{ width: `${STEP_PROGRESS[activeStep]}%` }}
                />
              </div>
              <ol className="flex justify-between gap-1 pt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                {(["fetching", "converting", "saving"] as const).map((step) => (
                  <li
                    key={step}
                    className={cn(
                      activeStep === step && "font-semibold text-foreground",
                      STEP_PROGRESS[activeStep] > STEP_PROGRESS[step] && "text-foreground/70",
                    )}
                  >
                    {step === "fetching" ? "Fetch" : step === "converting" ? "Convert" : "Save"}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : null}
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
          to={orderedTo}
          category={category}
          year={year}
          poster={picked?.url ?? (removePoster ? undefined : initial?.poster)}
          posterAlt={posterAlt}
        />
      </aside>
    </div>
  );
}
