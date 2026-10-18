"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAction, type LoginState } from "@@/app/(admin)/login/actions";
import { Button } from "@@/components/ui/button";
import { Input } from "@@/components/ui/input";
import { Label } from "@@/components/ui/label";

export default function LoginForm({ backTo, totp = false }: { backTo: string; totp?: boolean }) {
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
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-muted-foreground hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Show password"
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {totp ? (
          <div className="space-y-2">
            <Label htmlFor="totp">Authenticator code</Label>
            <Input
              id="totp"
              name="totp"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              aria-describedby={state.error ? "totp-hint login-error" : "totp-hint"}
              aria-invalid={state.error ? true : undefined}
            />
            <p id="totp-hint" className="text-sm text-muted-foreground">
              The 6-digit code from your authenticator app.
            </p>
          </div>
        ) : null}

        {state.error ? (
          <p
            id="login-error"
            role="alert"
            className="rounded-md border border-red-700/60 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-400/60 dark:bg-red-950 dark:text-red-200"
          >
            {state.error}
          </p>
        ) : null}

        <Button type="submit" className="h-11 w-full" disabled={pending} aria-disabled={pending}>
          {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
