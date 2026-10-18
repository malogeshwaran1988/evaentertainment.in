"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SendingIndicator from "@@/components/common/SendingIndicator";
import { markThankYou, thankYouHref } from "@@/lib/thank-you";
import { useFormShield } from "@@/components/common/FormShield";
import { COUNTRIES } from "@@/data/countries";
import {
  EMAIL_RE,
  phoneError,
  useFormValidation,
  type Validators,
} from "@@/components/common/useFormValidation";
import { BLOCKED_EMAIL_MESSAGE, isBlockedEmail } from "@@/lib/blocked-email-domains";

const SERVICES = [
  "Language Dubbing",
  "Subtitling",
  "Audio Description",
  "Engineering",
] as const;

const HOURS = [
  { value: "1", label: "1 Hour" },
  { value: "2", label: "2 Hours" },
  { value: "3", label: "4 Hours" },
  { value: "4", label: "6 Hours" },
] as const;

const VALIDATORS: Validators = {
  name: (v) => (v ? undefined : "First name is required."),
  email: (v) =>
    !v
      ? "Email is required."
      : !EMAIL_RE.test(v)
        ? "Enter a valid email address, like name@yourcompany.com."
        : isBlockedEmail(v)
          ? BLOCKED_EMAIL_MESSAGE
          : undefined,
  // Optional, but if given it must look like a phone number.
  phone: (v) => (v ? phoneError(v) : undefined),
  service: (v) => (v ? undefined : "Select a service."),
  date: (v) => {
    if (!v) return undefined;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(`${v}T00:00:00`) < today
      ? "Choose today or a later date."
      : undefined;
  },
};

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="form-error-text">
      {message}
    </p>
  );
}

export default function BookingForm() {
  const router = useRouter();
  const formId = useId();
  const [submitting, setSubmitting] = useState(false);
  // Synchronous guard: state updates are async, so a fast double click could slip past `submitting`.
  const inFlight = useRef(false);
  const shield = useFormShield();
  const [error, setError] = useState<string | null>(null);
  const {
    errors: fieldErrors,
    onBlur,
    onChange,
    validateAll,
    describe,
    setFieldError,
  } = useFormValidation(VALIDATORS);
  const [minDate] = useState(todayIso);

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
      lastname: String(data.get("lastname") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      address: String(data.get("address") || "").trim(),
      city: String(data.get("city") || "").trim(),
      service: String(data.get("service") || "").trim(),
      hours: String(data.get("hours") || "").trim(),
      date: String(data.get("date") || "").trim(),
      time: String(data.get("time") || "").trim(),
      language: String(data.get("language") || "").trim(),
      notes: String(data.get("notes") || "").trim(),
    };

    if (shield.enabled && !payload.turnstileToken) {
      setError("Please complete the verification check.");
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
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
      markThankYou("booking");
      router.push(thankYouHref("booking"));
    } catch (err) {
      setError(
        `${err instanceof Error ? err.message : "Something went wrong."} Your details are still here, so you can try again.`,
      );
      shield.reset();
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <div className="form-popup booking-form-panel">
      <div className="form-popup-inside">
        <h2 id={`${formId}-title`} className="heading-as-h3">
          Book Your Session
        </h2>
        <form
          className="form-custom"
          onSubmit={onSubmit}
          onBlur={onBlur}
          onChange={onChange}
          noValidate
          aria-busy={submitting || undefined}
          aria-labelledby={`${formId}-title`}
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
            <div className="form-row">
              <div className="form-group">
                <label className="label" htmlFor={`${formId}-name`}>
                  First Name <span aria-hidden="true">*</span>
                </label>
                <input
                  id={`${formId}-name`}
                  type="text"
                  className="input-custom input-full"
                  name="name"
                  autoComplete="given-name"
                  required
                  {...describe("name", `${formId}-name-error`)}
                />
                <FieldError
                  id={`${formId}-name-error`}
                  message={fieldErrors.name}
                />
              </div>
              <div className="form-group">
                <label className="label" htmlFor={`${formId}-lastname`}>
                  Last Name
                </label>
                <input
                  id={`${formId}-lastname`}
                  type="text"
                  className="input-custom input-full"
                  name="lastname"
                  autoComplete="family-name"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="label" htmlFor={`${formId}-email`}>
                  Email address <span aria-hidden="true">*</span>
                </label>
                <input
                  id={`${formId}-email`}
                  type="email"
                  className="input-custom input-full"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  required
                  {...describe("email", `${formId}-email-error`)}
                />
                <FieldError
                  id={`${formId}-email-error`}
                  message={fieldErrors.email}
                />
              </div>
              <div className="form-group">
                <label className="label" htmlFor={`${formId}-phone`}>
                  Phone number
                </label>
                <input
                  id={`${formId}-phone`}
                  type="tel"
                  className="input-custom input-full"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  {...describe("phone", `${formId}-phone-error`)}
                />
                <FieldError
                  id={`${formId}-phone-error`}
                  message={fieldErrors.phone}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="label" htmlFor={`${formId}-address`}>
                  Address
                </label>
                <input
                  id={`${formId}-address`}
                  type="text"
                  className="input-custom input-full"
                  name="address"
                  autoComplete="street-address"
                />
              </div>
              <div className="form-group">
                <label className="label" htmlFor={`${formId}-city`}>
                  Country
                </label>
                <div className="select-wrapper">
                  <select
                    id={`${formId}-city`}
                    name="city"
                    className="input-custom"
                    defaultValue="IND"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row-top-25">
              <div className="form-row">
                <div className="form-group sm-full">
                  <label className="label" htmlFor={`${formId}-service`}>
                    Studio Service:
                  </label>
                  <div className="select-wrapper">
                    <select
                      id={`${formId}-service`}
                      name="service"
                      className="input-custom"
                      {...describe("service", `${formId}-service-error`)}
                      defaultValue={SERVICES[0]}
                    >
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <FieldError
                    id={`${formId}-service-error`}
                    message={fieldErrors.service}
                  />
                </div>
                <div className="form-group">
                  <label className="label" htmlFor={`${formId}-hours`}>
                    Time:
                  </label>
                  <div className="select-wrapper">
                    <select
                      id={`${formId}-hours`}
                      name="hours"
                      className="input-custom"
                      defaultValue="1"
                    >
                      {HOURS.map((h) => (
                        <option key={h.value} value={h.value}>
                          {h.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="label" htmlFor={`${formId}-date`}>
                    Date:
                  </label>
                  <div className="datetimepicker-wrap">
                    <input
                      id={`${formId}-date`}
                      type="date"
                      name="date"
                      min={minDate}
                      className="form-control input-custom"
                      {...describe("date", `${formId}-date-error`)}
                    />
                  </div>
                  <FieldError
                    id={`${formId}-date-error`}
                    message={fieldErrors.date}
                  />
                </div>
              </div>
            </div>
            <div className="row-top-25">
              <div className="form-row">
                <div className="form-group">
                  <label className="label" htmlFor={`${formId}-time`}>
                    Preferred time:
                  </label>
                  <input
                    id={`${formId}-time`}
                    type="time"
                    name="time"
                    step={900}
                    className="input-custom input-full"
                  />
                </div>
                <div className="form-group">
                  <label className="label" htmlFor={`${formId}-language`}>
                    Language(s):
                  </label>
                  <input
                    id={`${formId}-language`}
                    type="text"
                    name="language"
                    maxLength={100}
                    placeholder="e.g. English to Hindi"
                    className="input-custom input-full"
                  />
                </div>
              </div>
            </div>
            <div className="row-top-25">
              <div className="form-group">
                <label className="label" htmlFor={`${formId}-notes`}>
                  Notes:
                </label>
                <textarea
                  id={`${formId}-notes`}
                  name="notes"
                  rows={3}
                  maxLength={2000}
                  placeholder="Project, runtime, deadline, anything we should know"
                  className="textarea-custom input-full"
                />
              </div>
            </div>
            {shield.fields}
            <div className="form-btn-wrap row-top-25">
              <button
                type="submit"
                className="btn btn--lg"
                disabled={submitting}
                aria-busy={submitting || undefined}
              >
                {submitting ? (
                  <SendingIndicator />
                ) : (
                  <>
                    <i className="icon icon-mic-3" aria-hidden="true" />
                    <span>Book session now</span>
                  </>
                )}
              </button>
              <p className="sr-only" role="status" aria-live="polite">
                {submitting ? "Sending your booking request, please wait." : ""}
              </p>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
