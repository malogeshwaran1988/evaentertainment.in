"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SendingIndicator from "@@/components/common/SendingIndicator";
import { markThankYou, thankYouHref } from "@@/lib/thank-you";
import { useFormShield } from "@@/components/common/FormShield";
import {
  EMAIL_RE,
  phoneError,
  useFormValidation,
  type Validators,
} from "@@/components/common/useFormValidation";
import { BLOCKED_EMAIL_MESSAGE, isBlockedEmail } from "@@/lib/blocked-email-domains";

const MESSAGE_MIN = 20;

const VALIDATORS: Validators = {
  name: (v) => (v ? undefined : "Name is required."),
  email: (v) =>
    !v
      ? "Email is required."
      : !EMAIL_RE.test(v)
        ? "Enter a valid email address, like name@yourcompany.com."
        : isBlockedEmail(v)
          ? BLOCKED_EMAIL_MESSAGE
          : undefined,
  phone: (v) => (v ? phoneError(v) : "Phone is required."),
  service: (v) => (v ? undefined : "Select a service."),
  message: (v) =>
    !v
      ? "Message is required."
      : v.length < MESSAGE_MIN
        ? `Message must be at least ${MESSAGE_MIN} characters (${MESSAGE_MIN - v.length} more).`
        : undefined,
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="form-error-text">
      {message}
    </p>
  );
}

export default function ContactForm({ services }: { services: string[] }) {
  const router = useRouter();
  const formId = useId();
  const [submitting, setSubmitting] = useState(false);
  // Synchronous guard: state updates are async, so a fast double click could slip past `submitting`.
  const inFlight = useRef(false);
  const shield = useFormShield();
  const [error, setError] = useState<string | null>(null);
  const [messageLen, setMessageLen] = useState(0);
  const { errors, onBlur, onChange, validateAll, describe, setFieldError } =
    useFormValidation(VALIDATORS);
  const id = (name: string) => `${formId}-${name}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    setError(null);
    const form = e.currentTarget;
    if (!validateAll(form)) return;
    const data = new FormData(form);
    const payload = {
      ...shield.values(form),
      name: String(data.get("name") || "").trim(),
      lastname: "",
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      service: String(data.get("service") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };
    if (shield.enabled && !payload.turnstileToken) {
      setError("Please complete the verification check.");
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
          field?: string;
        } | null;
        if (body?.field === "email" && body.error) {
          // Field-level error (blocked email): show it on the field and unlock the form.
          setFieldError("email", body.error);
          shield.reset();
          inFlight.current = false;
          setSubmitting(false);
          requestAnimationFrame(() =>
            (form.elements.namedItem("email") as HTMLElement | null)?.focus(),
          );
          return;
        }
        throw new Error(body?.error || "Something went wrong.");
      }
      // Stay disabled while navigating away.
      markThankYou("contact");
      router.push(thankYouHref("contact"));
    } catch (err) {
      setError(
        `${err instanceof Error ? err.message : "Something went wrong."} Your message is still here, so you can try again or reach us on WhatsApp.`,
      );
      shield.reset();
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form
      className="eva-enquiry-form"
      onSubmit={onSubmit}
      onBlur={onBlur}
      onChange={onChange}
      noValidate
      aria-busy={submitting || undefined}
    >
      <fieldset
        className="eva-form-fieldset"
        disabled={submitting}
        aria-disabled={submitting || undefined}
      >
        {error ? (
          <div className="errorform" role="alert">
            <p>{error}</p>
          </div>
        ) : null}

        <p className="eva-enquiry-required-note">
          <span aria-hidden="true">*</span> Required field
        </p>

        <div className="eva-enquiry-field">
          <label htmlFor={id("name")}>
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id={id("name")}
            type="text"
            name="name"
            autoComplete="name"
            required
            {...describe("name", id("name-error"))}
          />
          <FieldError id={id("name-error")} message={errors.name} />
        </div>

        <div className="eva-enquiry-field">
          <label htmlFor={id("email")}>
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id={id("email")}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            required
            {...describe("email", id("email-error"))}
          />
          <FieldError id={id("email-error")} message={errors.email} />
        </div>

        <div className="eva-enquiry-field">
          <label htmlFor={id("phone")}>
            Phone <span aria-hidden="true">*</span>
          </label>
          <input
            id={id("phone")}
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            required
            {...describe("phone", id("phone-error"))}
          />
          <FieldError id={id("phone-error")} message={errors.phone} />
        </div>

        <div className="eva-enquiry-field">
          <label htmlFor={id("service")}>
            Service Interest <span aria-hidden="true">*</span>
          </label>
          <select
            id={id("service")}
            name="service"
            defaultValue=""
            required
            {...describe("service", id("service-error"))}
          >
            <option value="" disabled>
              Select a service
            </option>
            {["General Enquiry", ...services].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <FieldError id={id("service-error")} message={errors.service} />
        </div>

        <div className="eva-enquiry-field">
          <label htmlFor={id("message")}>
            Message <span aria-hidden="true">*</span>
          </label>
          <textarea
            id={id("message")}
            name="message"
            rows={5}
            required
            minLength={MESSAGE_MIN}
            {...describe("message", id("message-error"), id("message-count"))}
            onChange={(ev) => setMessageLen(ev.target.value.trim().length)}
          />
          <p id={id("message-count")} className="eva-enquiry-count">
            {messageLen} / {MESSAGE_MIN} characters minimum
          </p>
          <FieldError id={id("message-error")} message={errors.message} />
        </div>

        {shield.fields}

        <button
          type="submit"
          className="eva-enquiry-submit"
          disabled={submitting}
          aria-busy={submitting || undefined}
        >
          {submitting ? <SendingIndicator /> : "Submit Enquiry"}
        </button>
        <p
          id={id("status")}
          className="sr-only"
          role="status"
          aria-live="polite"
        >
          {submitting ? "Sending your enquiry, please wait." : ""}
        </p>
      </fieldset>
    </form>
  );
}
