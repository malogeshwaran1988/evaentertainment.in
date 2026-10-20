"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { saveFounderAction, type FounderFormState } from "@@/app/(admin)/admin/founder/actions";
import { Button } from "@@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@@/components/ui/card";
import { Input } from "@@/components/ui/input";
import { Label } from "@@/components/ui/label";
import {
  FOUNDER_FEATURED_MAX,
  FOUNDER_HIGHLIGHTS_MAX,
  type FounderContent,
} from "@@/data/founder";

type Option = { id: string; title: string; year: string };

const textareaClass =
  "flex min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export default function FounderForm({ founder, projects }: { founder: FounderContent; projects: Option[] }) {
  const [state, formAction, pending] = useActionState<FounderFormState, FormData>(saveFounderAction, {});
  const [featured, setFeatured] = useState<string[]>(founder.featuredProjectIds);
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const byId = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const matches = query.trim()
    ? projects
        .filter((p) => !featured.includes(p.id) && p.title.toLowerCase().includes(query.trim().toLowerCase()))
        .slice(0, 8)
    : [];
  const full = featured.length >= FOUNDER_FEATURED_MAX;

  const move = (i: number, d: -1 | 1) =>
    setFeatured((f) => {
      const n = [...f];
      [n[i], n[i + d]] = [n[i + d], n[i]];
      return n;
    });

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview ?? founder.photo} alt="" className="h-24 w-24 rounded-full object-cover" />
            <div className="space-y-2">
              <Label htmlFor="founder-photo">Photo</Label>
              <Input
                id="founder-photo"
                name="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setPreview(f ? URL.createObjectURL(f) : null);
                }}
              />
              <p className="text-xs text-muted-foreground">Cropped to a square and saved as AVIF under 150 KB.</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="founder-photo-alt">Photo description (alt text)</Label>
            <Input id="founder-photo-alt" name="photoAlt" defaultValue={founder.photoAlt} maxLength={200} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="founder-name">Name</Label>
              <Input id="founder-name" name="name" defaultValue={founder.name} required maxLength={120} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="founder-title">Title / role</Label>
              <Input id="founder-title" name="title" defaultValue={founder.title} maxLength={160} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="founder-linkedin">LinkedIn URL</Label>
            <Input
              id="founder-linkedin"
              name="linkedinUrl"
              type="url"
              defaultValue={founder.linkedinUrl}
              placeholder="https://www.linkedin.com/in/…"
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground">Leave empty to hide the LinkedIn button.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="founder-bio">Bio</Label>
            <textarea
              id="founder-bio"
              name="bio"
              className={textareaClass}
              defaultValue={founder.bio.join("\n\n")}
              maxLength={3000}
            />
            <p className="text-xs text-muted-foreground">Leave a blank line between paragraphs.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Highlights</CardTitle>
          <CardDescription>Up to {FOUNDER_HIGHLIGHTS_MAX}. Leave both boxes empty to remove one.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: FOUNDER_HIGHLIGHTS_MAX }, (_, i) => (
            <fieldset key={i} className="grid gap-3 sm:grid-cols-2">
              <legend className="sr-only">Highlight {i + 1}</legend>
              <div className="space-y-1">
                <Label htmlFor={`hv${i}`}>Highlight {i + 1}</Label>
                <Input id={`hv${i}`} name={`highlightValue${i}`} defaultValue={founder.highlights[i]?.value ?? ""} placeholder="Since 2018" maxLength={60} />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`hl${i}`}>Description</Label>
                <Input id={`hl${i}`} name={`highlightLabel${i}`} defaultValue={founder.highlights[i]?.label ?? ""} placeholder="Leading EVA Entertainment" maxLength={120} />
              </div>
            </fieldset>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent work</CardTitle>
          <CardDescription>
            Pick up to {FOUNDER_FEATURED_MAX} published projects. With none picked, the latest {FOUNDER_FEATURED_MAX} show automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {featured.map((id) => (
            <input key={id} type="hidden" name="featured" value={id} />
          ))}
          {featured.length > 0 ? (
            <ol className="space-y-2">
              {featured.map((id, i) => {
                const p = byId.get(id);
                const title = p?.title ?? "Unpublished project";
                return (
                  <li key={id} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                    <span className="w-5 text-muted-foreground">{i + 1}.</span>
                    <span className="flex-1 truncate">{title}{p?.year ? ` (${p.year})` : ""}</span>
                    <Button type="button" size="icon" variant="ghost" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${title} up`}>
                      <ArrowUp />
                    </Button>
                    <Button type="button" size="icon" variant="ghost" disabled={i === featured.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${title} down`}>
                      <ArrowDown />
                    </Button>
                    <Button type="button" size="icon" variant="ghost" onClick={() => setFeatured((f) => f.filter((x) => x !== id))} aria-label={`Remove ${title}`}>
                      <X />
                    </Button>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">Automatic: latest {FOUNDER_FEATURED_MAX} published projects.</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="founder-project-search">Add a project</Label>
            <Input
              id="founder-project-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={full ? `Maximum of ${FOUNDER_FEATURED_MAX} reached` : "Search by title"}
              disabled={full}
              autoComplete="off"
            />
            {matches.length > 0 ? (
              <ul className="rounded-md border text-sm">
                {matches.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-muted focus-visible:bg-muted"
                      onClick={() => {
                        setFeatured((f) => (f.length >= FOUNDER_FEATURED_MAX ? f : [...f, p.id]));
                        setQuery("");
                      }}
                    >
                      {p.title}{p.year ? ` (${p.year})` : ""}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : null}
          Save
        </Button>
      </div>
    </form>
  );
}
