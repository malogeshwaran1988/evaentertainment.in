"use client";

import { useCallback, useState, type FocusEvent, type FormEvent } from "react";

export type Validators = Record<string, (value: string, form: HTMLFormElement) => string | undefined>;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Postel's law: accept spaces, dashes, dots, brackets and a leading +; just count the digits. */
export function phoneError(value: string): string | undefined {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) {
    return "Enter a phone number with 7–15 digits, for example +91 98765 43210.";
  }
  return undefined;
}

function fieldValue(form: HTMLFormElement, name: string) {
  const el = form.elements.namedItem(name) as HTMLInputElement | null;
  return (el?.value ?? "").trim();
}

/**
 * Shared public-form validation (WCAG 3.3.1 / 3.3.3, Laws of UX: Postel, Doherty):
 * - validates a field when it loses focus and re-validates as the user fixes it,
 * - never shows an error while the user is still typing a field for the first time,
 * - on submit, validates everything and moves focus to the first invalid field.
 */
export function useFormValidation(validators: Validators) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const check = useCallback(
    (form: HTMLFormElement, name: string) => {
      const fn = validators[name];
      if (!fn) return;
      const message = fn(fieldValue(form, name), form);
      setErrors((prev) => {
        if ((prev[name] ?? undefined) === message) return prev;
        const next = { ...prev };
        if (message) next[name] = message;
        else delete next[name];
        return next;
      });
    },
    [validators],
  );

  const onBlur = useCallback(
    (e: FocusEvent<HTMLFormElement>) => {
      const name = (e.target as unknown as HTMLInputElement).name;
      if (!name || !validators[name]) return;
      // Skip when focus simply passes through an untouched, empty field.
      if (!touched[name] && !fieldValue(e.currentTarget, name)) return;
      setTouched((t) => (t[name] ? t : { ...t, [name]: true }));
      check(e.currentTarget, name);
    },
    [check, touched, validators],
  );

  const onChange = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      const name = (e.target as unknown as HTMLInputElement).name;
      if (name && (touched[name] || errors[name])) check(e.currentTarget, name);
    },
    [check, errors, touched],
  );

  /** Validates all fields; returns true when valid, else focuses the first invalid field. */
  const validateAll = useCallback(
    (form: HTMLFormElement) => {
      const next: Record<string, string> = {};
      for (const [name, fn] of Object.entries(validators)) {
        const message = fn(fieldValue(form, name), form);
        if (message) next[name] = message;
      }
      setErrors(next);
      setTouched(Object.fromEntries(Object.keys(validators).map((k) => [k, true])));
      const first = Object.keys(validators).find((k) => next[k]);
      if (first) {
        requestAnimationFrame(() =>
          (form.elements.namedItem(first) as HTMLElement | null)?.focus(),
        );
        return false;
      }
      return true;
    },
    [validators],
  );

  /** Props for an input: aria-invalid + aria-describedby (hint first, then the error). */
  const describe = (name: string, errorId: string, hintId?: string) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": [hintId, errors[name] ? errorId : undefined].filter(Boolean).join(" ") || undefined,
  });

  /** Shows a server-side error on one field (e.g. a blocked email domain). */
  const setFieldError = useCallback((name: string, message: string) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
    setTouched((t) => ({ ...t, [name]: true }));
  }, []);

  return { errors, onBlur, onChange, validateAll, describe, setFieldError };
}
