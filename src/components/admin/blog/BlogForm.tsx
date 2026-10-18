"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useId, useMemo, useRef, useState } from "react";
import { Loader2, Lock, RotateCcw, Unlock } from "lucide-react";
import { toast } from "sonner";
import { uploadBlogImageAction, type BlogFormState } from "@@/app/(admin)/admin/blog/actions";
import BlogEditor from "@@/components/admin/blog/BlogEditor";
import { Button } from "@@/components/ui/button";
import { Input } from "@@/components/ui/input";
import { Label } from "@@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@@/components/ui/select";
import { APP_BASE_URL } from "@@/constants/constants";
import {
  BLOG_AUTHOR_MAX,
  BLOG_CATEGORIES,
  BLOG_COVER_ALT_MAX,
  BLOG_DEFAULT_AUTHOR,
  BLOG_EXCERPT_MAX,
  BLOG_META_DESCRIPTION_MAX,
  BLOG_META_TITLE_MAX,
  BLOG_TITLE_MAX,
  type BlogCategory,
  type BlogPost,
  type BlogStatus,
} from "@@/data/blog";
import { convertPosterToAvif, POSTER_SOURCE_ACCEPT } from "@@/lib/admin/poster-to-avif";
import { AdminRoutes } from "@@/lib/admin-session";
import { blogCoverAlt, blogImageBaseName, blogSeoDescription, blogSeoTitle } from "@@/lib/blog/seo";
import { blogHref, BLOG_SLUG_MAX, slugifyBlog, uniqueBlogSlug, validateBlogSlug } from "@@/lib/blog/slug";
import { cn } from "@@/lib/utils";

type FieldKey = keyof NonNullable<BlogFormState["fieldErrors"]>;

export type BlogFormInitial = Pick<
  BlogPost,
  | "title"
  | "slug"
  | "excerpt"
  | "content"
  | "cover"
  | "coverAlt"
  | "author"
  | "publishDate"
  | "category"
  | "tags"
  | "metaTitle"
  | "metaDescription"
  | "status"
  | "firstPublishedAt"
  | "previousSlugs"
>;

type BlogFormProps = {
  action: (state: BlogFormState, formData: FormData) => Promise<BlogFormState>;
  initial?: BlogFormInitial;
  submitLabel: string;
  /** Today in India, from the server, so the default date can't differ between server and browser. */
  today: string;
  /** Slugs other posts use now or used before (each still redirects). */
  takenSlugs: string[];
};

const TEXTAREA = cn(
  "flex min-h-[96px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
  "focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
);

function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="text-destructive">*</span>
      <span className="sr-only">(required)</span>
    </>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-destructive">
      {message}
    </p>
  );
}

const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(" ") || undefined;

export default function BlogForm({ action, initial, submitLabel, today, takenSlugs }: BlogFormProps) {
  const router = useRouter();
  const formId = useId();
  const [state, formAction, pending] = useActionState(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  // New posts: the slug follows the title until it is typed. Saved posts keep theirs.
  const [slugMode, setSlugMode] = useState<"auto" | "manual">(initial ? "manual" : "auto");
  const [slugInput, setSlugInput] = useState(initial?.slug ?? "");
  const wasPublished = Boolean(initial?.firstPublishedAt);
  const [slugUnlocked, setSlugUnlocked] = useState(false);
  const slugLocked = wasPublished && !slugUnlocked;
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [author, setAuthor] = useState(initial?.author ?? BLOG_DEFAULT_AUTHOR);
  const [publishDate, setPublishDate] = useState(initial?.publishDate ?? today);
  const [category, setCategory] = useState<BlogCategory>(initial?.category ?? BLOG_CATEGORIES[0]);
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.metaDescription ?? "");
  const [status, setStatus] = useState<BlogStatus>(initial?.status ?? "draft");
  const [coverAlt, setCoverAlt] = useState(initial?.coverAlt ?? "");
  const [cover, setCover] = useState<{ file: File; url: string } | null>(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [converting, setConverting] = useState(false);
  const [clientErrors, setClientErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [checkedOnce, setCheckedOnce] = useState(false);
  const coverUrl = useRef<string | null>(null);
  const busy = pending || converting;

  const taken = useMemo(() => new Set(takenSlugs), [takenSlugs]);
  const autoSlug = uniqueBlogSlug(slugifyBlog(title) || "", taken);
  const slug = slugMode === "auto" ? autoSlug : slugInput;

  const slugError = (value: string) =>
    validateBlogSlug(value) ??
    (taken.has(value) ? "Another post already uses this URL (now or in the past). Choose a different slug." : null);

  const validate = () => {
    const e: Partial<Record<FieldKey, string>> = {};
    if (!title.trim()) e.title = "Enter the post title.";
    if (!excerpt.trim()) e.excerpt = "Write a short excerpt for the blog list and search results.";
    if (!content.replace(/<[^>]+>/g, "").trim() && !/<(img|iframe)\b/.test(content)) {
      e.content = "Write the article before saving.";
    }
    if (!slugLocked) {
      const err = title.trim() || slugMode === "manual" ? slugError(slug) : null;
      if (err) e.slug = err;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(publishDate)) e.publishDate = "Choose a publish date.";
    return e;
  };

  // Server errors win for the fields they name; client checks fill in as the user types.
  const errors: Partial<Record<FieldKey, string>> = {
    ...(checkedOnce ? clientErrors : {}),
    ...(state.ok ? {} : state.fieldErrors),
  };

  useEffect(() => {
    if (checkedOnce) setClientErrors(validate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, excerpt, content, slug, publishDate, checkedOnce]);

  useEffect(
    () => () => {
      if (coverUrl.current) URL.revokeObjectURL(coverUrl.current);
    },
    [],
  );

  useEffect(() => {
    if (!busy) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [busy]);

  const focusFirstError = () =>
    requestAnimationFrame(() => {
      const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      (first ?? formRef.current?.querySelector<HTMLElement>("#blog-form-error-summary"))?.focus();
    });

  useEffect(() => {
    if (state.ok) {
      toast.success(state.message);
      router.push(AdminRoutes.BLOG);
    } else if (state.message) {
      toast.error(state.message);
      focusFirstError();
    }
  }, [state, router]);

  const pickCover = async (file: File | null) => {
    if (!file) return;
    setConverting(true);
    setClientErrors((e) => ({ ...e, cover: undefined }));
    try {
      const { file: avif } = await convertPosterToAvif(file);
      if (coverUrl.current) URL.revokeObjectURL(coverUrl.current);
      const url = URL.createObjectURL(avif);
      coverUrl.current = url;
      setCover({ file: avif, url });
      setRemoveCover(false);
    } catch (err) {
      setClientErrors((e) => ({ ...e, cover: err instanceof Error ? err.message : "Could not use that image." }));
      setCheckedOnce(true);
    } finally {
      setConverting(false);
    }
  };

  const uploadInlineImage = async (file: File) => {
    const { file: avif } = await convertPosterToAvif(file);
    const body = new FormData();
    body.set("file", avif);
    body.set("stem", title.trim() || "blog image");
    const result = await uploadBlogImageAction(body);
    if (!result.ok) {
      toast.error(result.error);
      throw new Error(result.error);
    }
    return result.url;
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const found = validate();
    setClientErrors(found);
    setCheckedOnce(true);
    if (Object.keys(found).length) {
      toast.error("Please fix the highlighted fields.");
      focusFirstError();
      return;
    }
    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    formData.set("slug", slug);
    formData.set("slugMode", slugMode);
    if (slugUnlocked) formData.set("slugEdit", "on");
    if (cover) formData.set("cover", cover.file);
    else if (removeCover) formData.set("removeCover", "on");
    startTransition(() => formAction(formData));
  };

  const scheduled = status === "published" && publishDate > today;
  const previewPost = { title: title.trim() || "Post title", coverAlt, metaTitle, metaDescription, excerpt };
  const currentCover = cover?.url ?? (removeCover ? undefined : initial?.cover);
  const errorCount = Object.keys(state.fieldErrors ?? {}).length;
  const id = (name: string) => `${formId}-${name}`;

  return (
    <div className="relative grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <form
        ref={formRef}
        onSubmit={submit}
        noValidate
        aria-busy={busy || undefined}
        className="relative min-w-0 space-y-6 rounded-xl border bg-surface p-4 shadow-card sm:p-6"
      >
        {!state.ok && state.message ? (
          <div
            id="blog-form-error-summary"
            role="alert"
            tabIndex={-1}
            className="rounded-md border border-red-700/60 bg-red-50 px-4 py-3 text-sm text-red-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-red-400/60 dark:bg-red-950 dark:text-red-200"
          >
            <p className="font-semibold">{state.message}</p>
            {errorCount ? (
              <p className="mt-1">
                Fix the {errorCount === 1 ? "highlighted field" : `${errorCount} highlighted fields`} below, then
                save again.
              </p>
            ) : null}
          </div>
        ) : null}
        <p className="text-sm text-muted-foreground">
          Fields marked <span aria-hidden="true" className="font-semibold text-destructive">*</span>
          <span className="sr-only">with an asterisk</span> are required.
        </p>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor={id("title")}>
            Title <RequiredMark />
          </Label>
          <Input
            id={id("title")}
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={BLOG_TITLE_MAX}
            required
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={describedBy(errors.title && id("title-error"))}
          />
          <FieldError id={id("title-error")} message={errors.title} />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor={id("slug")}>
            URL slug <RequiredMark />
          </Label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1">
              <span
                className="inline-flex h-10 shrink-0 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 font-mono text-xs text-muted-foreground"
                aria-hidden="true"
              >
                /blog/
              </span>
              <Input
                id={id("slug")}
                value={slug}
                readOnly={slugLocked}
                maxLength={BLOG_SLUG_MAX + 20}
                className="h-10 min-w-0 flex-1 rounded-l-none font-mono read-only:bg-muted/50 read-only:text-muted-foreground"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                onChange={(e) => {
                  setSlugMode("manual");
                  setSlugInput(e.target.value.toLowerCase());
                }}
                // Tidy on leave, not per keystroke, so typing "-" or a space never fights the user.
                onBlur={() => {
                  if (slugMode === "manual") setSlugInput(slugifyBlog(slugInput));
                }}
                aria-invalid={errors.slug ? true : undefined}
                aria-describedby={describedBy(id("slug-hint"), errors.slug && id("slug-error"), slugUnlocked && id("slug-warning"))}
              />
            </div>
            {slugLocked ? (
              <Button type="button" variant="outline" className="h-10" onClick={() => setSlugUnlocked(true)}>
                <Unlock />
                Change URL
              </Button>
            ) : wasPublished ? (
              <Button
                type="button"
                variant="ghost"
                className="h-10"
                onClick={() => {
                  setSlugUnlocked(false);
                  setSlugMode("manual");
                  setSlugInput(initial?.slug ?? "");
                }}
              >
                <Lock />
                Keep current URL
              </Button>
            ) : slugMode === "manual" && !initial ? (
              <Button type="button" variant="ghost" className="h-10" onClick={() => setSlugMode("auto")}>
                <RotateCcw />
                Use title
              </Button>
            ) : null}
          </div>
          <p id={id("slug-hint")} className="text-sm text-muted-foreground">
            {slugLocked
              ? "Locked because this post has been published, so links to it keep working."
              : slugMode === "auto"
                ? "Made from the title. Lowercase letters, numbers and hyphens; type here to choose your own."
                : `Lowercase letters, numbers and single hyphens, up to ${BLOG_SLUG_MAX} characters.`}{" "}
            <span className="break-all font-mono text-xs">
              {APP_BASE_URL}
              {blogHref(slug || "…")}
            </span>
          </p>
          {slugUnlocked ? (
            <p
              id={id("slug-warning")}
              className="rounded-md border border-amber-700/60 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-500/60 dark:bg-amber-950 dark:text-amber-200"
            >
              The old address {blogHref(initial?.slug ?? "")} will permanently redirect (301) to the new one, so
              shared links keep working. Search engines take a few days to switch.
            </p>
          ) : null}
          <FieldError id={id("slug-error")} message={errors.slug} />
          {initial?.previousSlugs?.length ? (
            <p className="text-sm text-muted-foreground">
              Old URLs that redirect here: {initial.previousSlugs.map((s) => blogHref(s)).join(", ")}
            </p>
          ) : null}
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor={id("excerpt")}>
            Excerpt <RequiredMark />
          </Label>
          <textarea
            id={id("excerpt")}
            name="excerpt"
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            maxLength={BLOG_EXCERPT_MAX}
            className={TEXTAREA}
            required
            aria-invalid={errors.excerpt ? true : undefined}
            aria-describedby={describedBy(id("excerpt-hint"), errors.excerpt && id("excerpt-error"))}
          />
          <p id={id("excerpt-hint")} className="text-sm text-muted-foreground">
            One or two sentences for the blog list, and the search snippet if Meta description is empty. (
            {excerpt.length}/{BLOG_EXCERPT_MAX})
          </p>
          <FieldError id={id("excerpt-error")} message={errors.excerpt} />
        </div>

        {/* Article */}
        <div className="space-y-2">
          <p id={id("content-label")} className="text-sm font-medium leading-none">
            Article <RequiredMark />
          </p>
          <BlogEditor
            value={content}
            onChange={setContent}
            onImageUpload={uploadInlineImage}
            labelledBy={id("content-label")}
            describedBy={describedBy(id("content-hint"), errors.content && id("content-error"))}
            invalid={Boolean(errors.content)}
            disabled={pending}
          />
          <p id={id("content-hint")} className="text-sm text-muted-foreground">
            Start sections with Heading 2 (the title is the page’s only H1). Images are converted to AVIF and saved
            with branded file names; give each one ALT text in the image dialog.
          </p>
          <FieldError id={id("content-error")} message={errors.content} />
        </div>

        {/* Cover */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium leading-none">Cover image</legend>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex aspect-[1200/630] w-full max-w-60 items-center justify-center overflow-hidden rounded-md border bg-muted text-xs text-muted-foreground">
              {currentCover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentCover} alt="" className="h-full w-full object-cover" />
              ) : (
                "No cover"
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor={id("cover")}>Upload</Label>
              <input
                id={id("cover")}
                type="file"
                accept={POSTER_SOURCE_ACCEPT}
                disabled={busy}
                onChange={(e) => void pickCover(e.target.files?.[0] ?? null)}
                className="block w-full text-sm file:mr-3 file:h-10 file:cursor-pointer file:rounded-md file:border file:border-input file:bg-background file:px-3 file:text-sm file:font-medium"
                aria-invalid={errors.cover ? true : undefined}
                aria-describedby={describedBy(id("cover-hint"), errors.cover && id("cover-error"))}
              />
              <p id={id("cover-hint")} className="text-sm text-muted-foreground" aria-live="polite">
                {converting
                  ? "Converting to AVIF…"
                  : "Landscape works best (1200 × 630). Converted to AVIF under 150 KB; also used as the share image."}
              </p>
              <FieldError id={id("cover-error")} message={errors.cover} />
              {initial?.cover || cover ? (
                <label className="flex min-h-6 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={removeCover && !cover}
                    onChange={(e) => {
                      setRemoveCover(e.target.checked);
                      if (e.target.checked) setCover(null);
                    }}
                  />
                  Remove cover
                </label>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={id("coverAlt")}>Cover ALT (optional)</Label>
            <Input
              id={id("coverAlt")}
              name="coverAlt"
              value={coverAlt}
              onChange={(e) => setCoverAlt(e.target.value)}
              maxLength={BLOG_COVER_ALT_MAX}
              aria-describedby={id("coverAlt-hint")}
            />
            <p id={id("coverAlt-hint")} className="text-sm text-muted-foreground">
              Describe the picture. Leave blank to use the title. “EVA Entertainment” is added automatically.
            </p>
          </div>
        </fieldset>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={id("author")}>Author</Label>
            <Input
              id={id("author")}
              name="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={BLOG_AUTHOR_MAX}
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={id("publishDate")}>
              Publish date <RequiredMark />
            </Label>
            <Input
              id={id("publishDate")}
              name="publishDate"
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              required
              className="h-10"
              aria-invalid={errors.publishDate ? true : undefined}
              aria-describedby={describedBy(id("publishDate-hint"), errors.publishDate && id("publishDate-error"))}
            />
            <p id={id("publishDate-hint")} className="text-sm text-muted-foreground">
              India time. A published post with a future date stays hidden until that day.
            </p>
            <FieldError id={id("publishDate-error")} message={errors.publishDate} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={id("category")}>
              Category <RequiredMark />
            </Label>
            <input type="hidden" name="category" value={category} />
            <Select value={category} onValueChange={(v) => setCategory(v as BlogCategory)}>
              <SelectTrigger id={id("category")} className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLOG_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={id("tags")}>Tags</Label>
            <Input
              id={id("tags")}
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              aria-invalid={errors.tags ? true : undefined}
              aria-describedby={describedBy(id("tags-hint"), errors.tags && id("tags-error"))}
            />
            <p id={id("tags-hint")} className="text-sm text-muted-foreground">
              Comma-separated, up to 8 (e.g. Hindi dubbing, lip sync).
            </p>
            <FieldError id={id("tags-error")} message={errors.tags} />
          </div>
        </div>

        <fieldset className="space-y-4 rounded-lg border p-4">
          <legend className="px-1 text-sm font-medium">Search engines</legend>
          <div className="space-y-2">
            <Label htmlFor={id("metaTitle")}>Meta title (optional)</Label>
            <Input
              id={id("metaTitle")}
              name="metaTitle"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              maxLength={BLOG_META_TITLE_MAX}
              aria-invalid={errors.metaTitle ? true : undefined}
              aria-describedby={describedBy(id("metaTitle-hint"), errors.metaTitle && id("metaTitle-error"))}
            />
            <p id={id("metaTitle-hint")} className="text-sm text-muted-foreground">
              Leave blank to use the title. ({metaTitle.length}/{BLOG_META_TITLE_MAX})
            </p>
            <FieldError id={id("metaTitle-error")} message={errors.metaTitle} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={id("metaDescription")}>Meta description (optional)</Label>
            <textarea
              id={id("metaDescription")}
              name="metaDescription"
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              maxLength={BLOG_META_DESCRIPTION_MAX}
              className={TEXTAREA}
              aria-invalid={errors.metaDescription ? true : undefined}
              aria-describedby={describedBy(
                id("metaDescription-hint"),
                errors.metaDescription && id("metaDescription-error"),
              )}
            />
            <p id={id("metaDescription-hint")} className="text-sm text-muted-foreground">
              Leave blank to use the excerpt. ({metaDescription.length}/{BLOG_META_DESCRIPTION_MAX})
            </p>
            <FieldError id={id("metaDescription-error")} message={errors.metaDescription} />
          </div>
          <p className="text-sm text-muted-foreground">
            The canonical URL is always this post’s own address; it can’t be pointed elsewhere by mistake.
          </p>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium leading-none">
            Status <RequiredMark />
          </legend>
          <div className="flex flex-col gap-2 sm:flex-row">
            {(
              [
                ["draft", "Draft", "Only visible here. Not on the site, in search or the sitemap."],
                ["published", "Published", "On the blog and in the sitemap from the publish date."],
              ] as const
            ).map(([value, label, hint]) => (
              <label
                key={value}
                className={cn(
                  "flex min-h-11 flex-1 cursor-pointer gap-3 rounded-lg border p-3 text-sm",
                  status === value && "border-primary ring-1 ring-primary",
                )}
              >
                <input
                  type="radio"
                  name="status"
                  value={value}
                  checked={status === value}
                  onChange={() => setStatus(value)}
                  className="mt-0.5 size-4 accent-[hsl(var(--primary))]"
                />
                <span>
                  <span className="block font-medium">{label}</span>
                  <span className="block text-muted-foreground">{hint}</span>
                </span>
              </label>
            ))}
          </div>
          {scheduled ? (
            <p className="text-sm text-muted-foreground" role="status">
              Scheduled: this post goes live on {publishDate}.
            </p>
          ) : null}
        </fieldset>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" asChild disabled={busy}>
            <Link href={AdminRoutes.BLOG} onClick={(e) => busy && e.preventDefault()}>
              Cancel
            </Link>
          </Button>
          <Button type="submit" disabled={busy} className="min-h-11">
            {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            {pending ? "Saving…" : submitLabel}
          </Button>
        </div>
        {pending ? (
          <p className="sr-only" role="status">
            Saving post…
          </p>
        ) : null}
      </form>

      <aside aria-labelledby={id("preview-heading")} className="space-y-3 lg:sticky lg:top-6">
        <h2 id={id("preview-heading")} className="text-sm font-medium leading-none">
          Search preview
        </h2>
        <div className="space-y-1 rounded-xl border bg-surface p-4 text-sm shadow-card">
          <p className="break-all text-xs text-muted-foreground">
            evaentertainment.in › blog › {slug || "…"}
          </p>
          <p className="text-base font-medium text-link">{blogSeoTitle(previewPost)}</p>
          <p className="text-muted-foreground">
            {blogSeoDescription(previewPost) || "The excerpt or meta description appears here."}
          </p>
        </div>
        <dl className="space-y-2 rounded-xl border border-dashed bg-muted/40 p-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Cover ALT</dt>
            <dd>{blogCoverAlt(previewPost)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Cover file name</dt>
            <dd className="break-all font-mono text-xs">
              {blogImageBaseName(coverAlt.trim() || title.trim() || "blog image")}.avif
            </dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
