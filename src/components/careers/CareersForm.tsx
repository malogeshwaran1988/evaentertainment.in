"use client";

import { FormEvent, useId, useRef, useState } from "react";
import SendingIndicator from "@@/components/common/SendingIndicator";
import { useFormShield } from "@@/components/common/FormShield";
import { EMAIL_RE, useFormValidation, type Validators } from "@@/components/common/useFormValidation";
import { BLOCKED_EMAIL_MESSAGE, isBlockedEmail } from "@@/lib/blocked-email-domains";
import {
  COUNTRIES,
  DIAL_CODES,
  FILES_TOTAL_MAX_BYTES,
  RESUME_ACCEPT,
  RESUME_MAX_BYTES,
  VOICE_ACCEPT,
  VOICE_MAX_FILES,
} from "@@/data/careers";

const filesOf = (form: HTMLFormElement, name: string) =>
  Array.from((form.elements.namedItem(name) as HTMLInputElement | null)?.files ?? []);
const extOf = (f: File) => (f.name.split(".").pop() || "").toLowerCase();
const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const totalBytes = (form: HTMLFormElement) =>
  [...filesOf(form, "resume"), ...filesOf(form, "voices")].reduce((n, f) => n + f.size, 0);

const VALIDATORS: Validators = {
  resume: (_v, form) => {
    const [f] = filesOf(form, "resume");
    if (!f) return "Upload your resume.";
    if (!["pdf", "doc", "docx"].includes(extOf(f))) return "Use a PDF, DOC or DOCX file.";
    if (f.size > RESUME_MAX_BYTES) return `Your resume is ${mb(f.size)}. Keep it to 1 MB or smaller.`;
    return undefined;
  },
  voices: (_v, form) => {
    const files = filesOf(form, "voices");
    if (!files.length) return "Upload at least one voice sample.";
    if (files.length > VOICE_MAX_FILES) return `Upload up to ${VOICE_MAX_FILES} voice samples.`;
    if (files.some((f) => !["mp3", "wav", "m4a"].includes(extOf(f)))) return "Use MP3, WAV or M4A files.";
    const total = totalBytes(form);
    if (total > FILES_TOTAL_MAX_BYTES) return `Your files add up to ${mb(total)}. Keep all files to 3 MB or smaller.`;
    return undefined;
  },
  name: (v) => (v ? undefined : "Full name is required."),
  email: (v) =>
    !v
      ? "Email is required."
      : !EMAIL_RE.test(v)
        ? "Enter a valid email address, like name@example.in."
        : isBlockedEmail(v)
          ? BLOCKED_EMAIL_MESSAGE
          : undefined,
  phone: (v) => {
    if (!v) return "Mobile number is required.";
    const digits = v.replace(/\D/g, "");
    return /^[\d\s()\-.]+$/.test(v) && digits.length >= 6 && digits.length <= 14
      ? undefined
      : "Enter your mobile number without the country code, for example 98765 43210.";
  },
  country: (v) => (v ? undefined : "Select your country."),
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="form-error-text">
      {message}
    </p>
  );
}

function readBase64(file: File): Promise<{ name: string; data: string }> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve({ name: file.name, data: String(r.result).split(",")[1] ?? "" });
    r.onerror = () => reject(new Error("Could not read one of your files."));
    r.readAsDataURL(file);
  });
}

export default function CareersForm() {
  const formId = useId();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const inFlight = useRef(false);
  const doneRef = useRef<HTMLDivElement>(null);
  const shield = useFormShield();
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState<{ resume: string[]; voices: string[] }>({ resume: [], voices: [] });
  const { errors, onBlur, onChange, validateAll, describe, setFieldError } = useFormValidation(VALIDATORS);
  const id = (name: string) => `${formId}-${name}`;

  function onFiles(name: "resume" | "voices", input: HTMLInputElement) {
    setPicked((p) => ({ ...p, [name]: Array.from(input.files ?? []).map((f) => `${f.name} (${mb(f.size)})`) }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    setError(null);
    const form = e.currentTarget;
    if (!validateAll(form)) return;
    const data = new FormData(form);
    const shieldValues = shield.values(form);
    if (shield.enabled && !shieldValues.turnstileToken) {
      setError("Please complete the verification check.");
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    try {
      const [resume, ...voices] = await Promise.all(
        [...filesOf(form, "resume"), ...filesOf(form, "voices")].map(readBase64),
      );
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...shieldValues,
          name: String(data.get("name") || "").trim(),
          email: String(data.get("email") || "").trim(),
          dialCode: String(data.get("dialCode") || ""),
          phone: String(data.get("phone") || "").trim(),
          country: String(data.get("country") || ""),
          resume,
          voices,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string; field?: string } | null;
        if (res.status === 400 && body?.field && body.error && body.field in VALIDATORS) {
          setFieldError(body.field, body.error);
          shield.reset();
          inFlight.current = false;
          setSubmitting(false);
          requestAnimationFrame(() => (form.elements.namedItem(body.field!) as HTMLElement | null)?.focus());
          return;
        }
        throw new Error(body?.error || "Something went wrong.");
      }
      setDone(true);
      (window as unknown as { dataLayer?: object[] }).dataLayer?.push({ event: "careers_application_submit" });
      requestAnimationFrame(() => doneRef.current?.focus());
    } catch (err) {
      setError(
        `${err instanceof Error ? err.message : "Something went wrong."} Your details are still here, so you can try again.`,
      );
      shield.reset();
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div ref={doneRef} tabIndex={-1} className="eva-careers-success" role="status">
        <h3>Application received</h3>
        <p>Thank you for applying. Our team listens to every voice sample. We will contact you by email or phone if your profile fits a current role.</p>
      </div>
    );
  }

  return (
    <form
      className="eva-enquiry-form eva-careers-form"
      onSubmit={onSubmit}
      onBlur={onBlur}
      onChange={onChange}
      noValidate
      aria-busy={submitting || undefined}
    >
      <fieldset className="eva-form-fieldset" disabled={submitting} aria-disabled={submitting || undefined}>
        {error ? (
          <div className="errorform" role="alert">
            <p>{error}</p>
          </div>
        ) : null}

        <p className="eva-enquiry-required-note">
          <span aria-hidden="true">*</span> All fields are required
        </p>

        <div className="eva-enquiry-field">
          <label htmlFor={id("resume")}>
            Resume <span aria-hidden="true">*</span>
          </label>
          <input
            id={id("resume")}
            type="file"
            name="resume"
            accept={RESUME_ACCEPT}
            required
            {...describe("resume", id("resume-error"), id("resume-hint"))}
            onChange={(ev) => onFiles("resume", ev.currentTarget)}
          />
          <p id={id("resume-hint")} className="eva-enquiry-count">
            PDF, DOC or DOCX, up to 1 MB.{picked.resume.length ? ` Selected: ${picked.resume.join(", ")}` : ""}
          </p>
          <FieldError id={id("resume-error")} message={errors.resume} />
        </div>

        <div className="eva-enquiry-field">
          <label htmlFor={id("voices")}>
            Voice samples <span aria-hidden="true">*</span>
          </label>
          <input
            id={id("voices")}
            type="file"
            name="voices"
            accept={VOICE_ACCEPT}
            multiple
            required
            {...describe("voices", id("voices-error"), id("voices-hint"))}
            onChange={(ev) => onFiles("voices", ev.currentTarget)}
          />
          <p id={id("voices-hint")} className="eva-enquiry-count">
            MP3, WAV or M4A. Up to {VOICE_MAX_FILES} files, 3 MB in total with your resume.
            {picked.voices.length ? ` Selected: ${picked.voices.join(", ")}` : ""}
          </p>
          <FieldError id={id("voices-error")} message={errors.voices} />
        </div>

        <div className="eva-enquiry-field">
          <label htmlFor={id("name")}>
            Full name <span aria-hidden="true">*</span>
          </label>
          <input id={id("name")} type="text" name="name" autoComplete="name" required {...describe("name", id("name-error"))} />
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
            Mobile <span aria-hidden="true">*</span>
          </label>
          <div className="eva-careers-phone">
            <select
              id={id("dialCode")}
              name="dialCode"
              defaultValue="+91"
              autoComplete="tel-country-code"
              aria-label="Country code"
              required
            >
              {DIAL_CODES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <input
              id={id("phone")}
              type="tel"
              name="phone"
              autoComplete="tel-national"
              inputMode="tel"
              required
              {...describe("phone", id("phone-error"))}
            />
          </div>
          <FieldError id={id("phone-error")} message={errors.phone} />
        </div>

        <div className="eva-enquiry-field">
          <label htmlFor={id("country")}>
            Country <span aria-hidden="true">*</span>
          </label>
          <select
            id={id("country")}
            name="country"
            defaultValue="IN"
            autoComplete="country"
            required
            {...describe("country", id("country-error"))}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          <FieldError id={id("country-error")} message={errors.country} />
        </div>

        {shield.fields}

        <button type="submit" className="eva-enquiry-submit" disabled={submitting} aria-busy={submitting || undefined}>
          {submitting ? <SendingIndicator /> : "Submit application"}
        </button>
        <p className="sr-only" role="status" aria-live="polite">
          {submitting ? "Sending your application, please wait." : ""}
        </p>
      </fieldset>
    </form>
  );
}
