"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ClientFormState } from "@@/app/(admin)/admin/clients/actions";
import PosterField, { type PickedPoster } from "@@/components/admin/projects/PosterField";
import { Button } from "@@/components/ui/button";
import { Input } from "@@/components/ui/input";
import { Label } from "@@/components/ui/label";
import { CLIENT_NAME_MAX, type Client } from "@@/data/clients";
import { loadPosterFromUrl } from "@@/lib/admin/poster-from-url-client";
import { AdminRoutes } from "@@/lib/admin-session";

type ClientFormProps = {
  action: (state: ClientFormState, formData: FormData) => Promise<ClientFormState>;
  initial?: Pick<Client, "name" | "logo">;
  submitLabel: string;
};

export default function ClientForm({ action, initial, submitLabel }: ClientFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(action, {});
  const [name, setName] = useState(initial?.name ?? "");
  const [picked, setPicked] = useState<PickedPoster | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [urlBusy, setUrlBusy] = useState(false);
  const [logoError, setLogoError] = useState<string>();
  const nameError = state.fieldErrors?.name;
  const shownLogoError = logoError ?? state.fieldErrors?.logo;

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
      router.push(AdminRoutes.CLIENTS);
    } else toast.error(state.message);
  }, [state, router]);

  useEffect(() => () => { if (picked) URL.revokeObjectURL(picked.url); }, [picked]);

  const pick = (file: File | null) => {
    setPicked(file ? { file, url: URL.createObjectURL(file) } : null);
    if (file) setLogoError(undefined);
  };

  const loadFromUrl = async () => {
    if (!imageUrl.trim()) return null;
    setUrlBusy(true);
    setLogoError(undefined);
    try {
      const file = await loadPosterFromUrl(imageUrl);
      pick(file);
      setImageUrl("");
      return file;
    } catch (err) {
      setLogoError(err instanceof Error ? err.message : "Couldn't load that image.");
      return null;
    } finally {
      setUrlBusy(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let file = picked?.file ?? null;
    if (!file && imageUrl.trim()) {
      file = await loadFromUrl();
      if (!file) return;
    }
    if (!file && !initial?.logo) {
      setLogoError("Upload the client logo.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    if (file) formData.set("logo", file);
    startTransition(() => formAction(formData));
  };

  const busy = pending || urlBusy;

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6" noValidate>
      <PosterField
        fieldId="logo"
        label="Logo"
        noun="logo"
        previewClassName="h-24 w-48 bg-white"
        urlPlaceholder="https://example.com/logo.png"
        hint={
          <>
            PNG with a transparent background works best. It is converted to AVIF in your browser
            then saved at up to 600 × 300 px. Or paste a direct image URL below.
          </>
        }
        current={initial?.logo}
        picked={picked}
        removed={false}
        error={shownLogoError}
        imageUrl={imageUrl}
        onImageUrlChange={setImageUrl}
        onLoadFromUrl={loadFromUrl}
        urlBusy={urlBusy}
        onPick={pick}
        onClientError={setLogoError}
        onRemovedChange={() => undefined}
      />

      <div className="space-y-2">
        <Label htmlFor="client-name">
          Client name
          <span aria-hidden="true" className="text-destructive">*</span>
          <span className="sr-only">(required)</span>
        </Label>
        <Input
          id="client-name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={CLIENT_NAME_MAX}
          autoComplete="off"
          aria-invalid={nameError ? true : undefined}
          aria-describedby={nameError ? "client-name-error client-name-hint" : "client-name-hint"}
        />
        <p id="client-name-hint" className="text-sm text-muted-foreground">
          Shown under project views and used as the logo&apos;s alt text.
        </p>
        {nameError ? (
          <p id="client-name-error" className="text-sm text-destructive" role="alert">
            {nameError}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="ghost" asChild>
          <Link href={AdminRoutes.CLIENTS}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
