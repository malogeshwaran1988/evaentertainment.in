"use client";

import { FormEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Routes } from "@@/constants/routes";

const SERVICES = [
  "Language Dubbing",
  "Subtitling",
  "Audio Description",
  "Engineering",
] as const;

const HOURS = [
  { value: "1", label: "1 Hour" },
  { value: "2", label: "2 Hour" },
  { value: "3", label: "4 Hour" },
  { value: "4", label: "6 Hour" },
] as const;

export default function BookingForm() {
  const router = useRouter();
  const formId = useId();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      lastname: String(data.get("lastname") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      address: String(data.get("address") || "").trim(),
      city: String(data.get("city") || "").trim(),
      service: String(data.get("service") || "").trim(),
      hours: String(data.get("hours") || "").trim(),
      date: String(data.get("date") || "").trim(),
    };

    const nextErrors: Record<string, string> = {};
    if (!payload.name) nextErrors.name = "First name is required.";
    if (!payload.email) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!payload.service) nextErrors.service = "Select a service.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

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
    <div className="form-popup booking-form-panel">
      <div className="form-popup-inside">
        <h2 id={`${formId}-title`} className="heading-as-h3">
          Book Your Session
        </h2>
        <form
          className="form-custom"
          onSubmit={onSubmit}
          noValidate
          aria-labelledby={`${formId}-title`}
        >
          {error ? (
            <div className="errorform" role="alert">
              <p>{error}</p>
            </div>
          ) : null}
          <div className="form-row">
            <div className="form-group">
              <label className="sr-only" htmlFor={`${formId}-name`}>
                First Name
              </label>
              <input
                id={`${formId}-name`}
                type="text"
                className="input-custom input-full"
                name="name"
                placeholder="First Name*"
                autoComplete="given-name"
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
            <div className="form-group">
              <label className="sr-only" htmlFor={`${formId}-lastname`}>
                Last Name
              </label>
              <input
                id={`${formId}-lastname`}
                type="text"
                className="input-custom input-full"
                name="lastname"
                placeholder="Last Name"
                autoComplete="family-name"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="sr-only" htmlFor={`${formId}-email`}>
                Email address
              </label>
              <input
                id={`${formId}-email`}
                type="email"
                className="input-custom input-full"
                name="email"
                placeholder="Email address*"
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
            <div className="form-group">
              <label className="sr-only" htmlFor={`${formId}-phone`}>
                Phone number
              </label>
              <input
                id={`${formId}-phone`}
                type="tel"
                className="input-custom input-full"
                name="phone"
                placeholder="Phone number"
                autoComplete="tel"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="sr-only" htmlFor={`${formId}-address`}>
                Address
              </label>
              <input
                id={`${formId}-address`}
                type="text"
                className="input-custom input-full"
                name="address"
                placeholder="Address"
                autoComplete="street-address"
              />
            </div>
            <div className="form-group">
              <label className="sr-only" htmlFor={`${formId}-city`}>
                Country
              </label>
              <div className="select-wrapper">
                <select
                  id={`${formId}-city`}
                  name="city"
                  className="input-custom"
                  defaultValue="IND"
                >
                  <option value="IND">India</option>
                  <option value="KY">Other</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row-top-25">
            <div className="form-row">
              <div className="form-group sm-full">
                <div className="label" id={`${formId}-service-label`}>
                  Studio Service:
                </div>
                <div className="select-wrapper">
                  <select
                    name="service"
                    className="input-custom"
                    aria-labelledby={`${formId}-service-label`}
                    aria-invalid={!!fieldErrors.service}
                    defaultValue={SERVICES[0]}
                  >
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                {fieldErrors.service ? (
                  <p className="form-error-text">{fieldErrors.service}</p>
                ) : null}
              </div>
              <div className="form-group">
                <div className="label" id={`${formId}-hours-label`}>
                  Time:
                </div>
                <div className="select-wrapper">
                  <select
                    name="hours"
                    className="input-custom"
                    aria-labelledby={`${formId}-hours-label`}
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
                    className="form-control input-custom"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-btn-wrap row-top-25">
            <button type="submit" className="btn btn--lg" disabled={submitting}>
              <i className="icon icon-mic-3" aria-hidden="true" />
              <span>{submitting ? "Sending…" : "Book session now"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
