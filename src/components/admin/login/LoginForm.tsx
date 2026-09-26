"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAction, type LoginState } from "@@/app/(admin)/login/actions";
import { Button } from "@@/components/ui/button";
import { Input } from "@@/components/ui/input";
import { Label } from "@@/components/ui/label";

export default function LoginForm({ backTo }: { backTo: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border bg-card text-card-foreground shadow-card">
      <div className="flex items-center justify-center bg-[#181818] px-6 py-6">
        <Image
          src="/images/common/eva-logo.avif"
          alt="EVA Entertainment"
          width={160}
          height={45}
          priority
          sizes="160px"
        />
      </div>

      <form action={formAction} className="space-y-5 p-6" noValidate>
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Admin login</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage website content.
          </p>
        </div>

        <input type="hidden" name="backTo" value={backTo} />

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            autoComplete="username"
            defaultValue={state.username}
            required
            autoFocus
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "login-error" : undefined}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="pr-10"
              aria-invalid={state.error ? true : undefined}
              aria-describedby={state.error ? "login-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {state.error ? (
          <p
            id="login-error"
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {state.error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : null}
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
