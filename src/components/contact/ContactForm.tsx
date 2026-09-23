"use client";

import { FormEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Routes } from "@@/constants/routes";
import { SERVICE_BLOCKS } from "@@/data/services";

const SERVICE_OPTIONS = [
  "General Enquiry",
  ...SERVICE_BLOCKS.map((s) => s.title),
] as const;

const MESSAGE_MIN = 20;

export default function ContactForm() {
  const router = useRouter();
  const formId = useId();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [messageLen, setMessageLen] = useState(0);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get("name") || "").trim(),
      lastname: "",
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      service: String(data.get("service") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };

    const nextErrors: Record<string, string> = {};
    if (!payload.name) nextErrors.name = "Name is required.";
    if (!payload.email) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!payload.phone) nextErrors.phone = "Phone is required.";
    if (!payload.service) nextErrors.service = "Select a service.";
    if (!payload.message) nextErrors.message = "Message is required.";
    else if (payload.message.length < MESSAGE_MIN) {
      nextErrors.message = `Message must be at least ${MESSAGE_MIN} characters.`;
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

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
        } | null;
        throw new Error(body?.error || "Something went wrong.");
      }
      router.push(Routes.THANK_YOU);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="eva-enquiry-form" onSubmit={onSubmit} noValidate>
      {error ? (
        <div className="errorform" role="alert">
          <p>{error}</p>
        </div>
      ) : null}

      <div className="eva-enquiry-field">
        <label htmlFor={`${formId}-name`}>
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${formId}-name`}
          type="text"
          name="name"
          autoComplete="name"
          aria-invalid={!!fieldErrors.name}
          aria-describedby={
            fieldErrors.name ? `${formId}-name-error` : undefined
          }
        />
        {fieldErrors.name ? (
          <p id={`${formId}-name-error`} className="form-error-text">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="eva-enquiry-field">
        <label htmlFor={`${formId}-email`}>
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${formId}-email`}
          type="email"
          name="email"
          autoComplete="email"
          aria-invalid={!!fieldErrors.email}
          aria-describedby={
            fieldErrors.email ? `${formId}-email-error` : undefined
          }
        />
        {fieldErrors.email ? (
          <p id={`${formId}-email-error`} className="form-error-text">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="eva-enquiry-field">
        <label htmlFor={`${formId}-phone`}>
          Phone <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${formId}-phone`}
          type="tel"
          name="phone"
          autoComplete="tel"
          aria-invalid={!!fieldErrors.phone}
          aria-describedby={
            fieldErrors.phone ? `${formId}-phone-error` : undefined
          }
        />
        {fieldErrors.phone ? (
          <p id={`${formId}-phone-error`} className="form-error-text">
            {fieldErrors.phone}
          </p>
        ) : null}
      </div>

      <div className="eva-enquiry-field">
        <label htmlFor={`${formId}-service`}>
          Service Interest <span aria-hidden="true">*</span>
        </label>
        <select
          id={`${formId}-service`}
          name="service"
          defaultValue=""
          aria-invalid={!!fieldErrors.service}
          aria-describedby={
            fieldErrors.service ? `${formId}-service-error` : undefined
          }
        >
          <option value="" disabled>
            Select a service
          </option>
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {fieldErrors.service ? (
          <p id={`${formId}-service-error`} className="form-error-text">
            {fieldErrors.service}
          </p>
        ) : null}
      </div>

      <div className="eva-enquiry-field">
        <label htmlFor={`${formId}-message`}>
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={5}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={`${formId}-message-count${
            fieldErrors.message ? ` ${formId}-message-error` : ""
          }`}
          onChange={(ev) => setMessageLen(ev.target.value.length)}
        />
        <p id={`${formId}-message-count`} className="eva-enquiry-count">
          {messageLen} / {MESSAGE_MIN} characters
        </p>
        {fieldErrors.message ? (
          <p id={`${formId}-message-error`} className="form-error-text">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="eva-enquiry-submit"
        disabled={submitting}
      >
        {submitting ? "Sending…" : "Submit Enquiry"}
      </button>
    </form>
  );
}
