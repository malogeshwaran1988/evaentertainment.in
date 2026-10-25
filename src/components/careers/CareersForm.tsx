"use client";

import { FormEvent, useEffect, useId, useRef, useState, type DragEvent } from "react";
import { useFormShield } from "@@/components/common/FormShield";
import { EMAIL_RE, useFormValidation, type Validators } from "@@/components/common/useFormValidation";
import { BLOCKED_EMAIL_MESSAGE, isBlockedEmail } from "@@/lib/blocked-email-domains";
import { claimAudio, registerAudio } from "@@/lib/audio-focus";
import {
  COUNTRIES,
  DIAL_CODES,
  FILES_TOTAL_MAX_BYTES,
  RESUME_ACCEPT,
  RESUME_MAX_BYTES,
  ROLE_OPTIONS,
  VOICE_ACCEPT,
  VOICE_MAX_FILES,
} from "@@/data/careers";

type FileField = "resume" | "voices";
const filesOf = (form: HTMLFormElement, name: string) =>
  Array.from((form.elements.namedItem(name) as HTMLInputElement | null)?.files ?? []);
const extOf = (f: File) => (f.name.split(".").pop() || "").toLowerCase();
const size = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);
const totalBytes = (form: HTMLFormElement) =>
  [...filesOf(form, "resume"), ...filesOf(form, "voices")].reduce((n, f) => n + f.size, 0);

const VALIDATORS: Validators = {
  role: (v) => (v ? undefined : "Select the role you are applying for."),
  resume: (_v, form) => {
    const [f] = filesOf(form, "resume");
    if (!f) return "Upload your resume.";
    if (!["pdf", "doc", "docx"].includes(extOf(f))) return "Use a PDF, DOC or DOCX file.";
    if (f.size > RESUME_MAX_BYTES) return `Your resume is ${size(f.size)}. Keep it to 1 MB or smaller.`;
    return undefined;
  },
  voices: (_v, form) => {
    const files = filesOf(form, "voices");
    if (!files.length) return "Upload at least one voice sample.";
    if (files.length > VOICE_MAX_FILES) return `Upload up to ${VOICE_MAX_FILES} voice samples.`;
    if (files.some((f) => !["mp3", "wav", "m4a"].includes(extOf(f)))) return "Use MP3, WAV or M4A files.";
    const total = totalBytes(form);
    if (total > FILES_TOTAL_MAX_BYTES) return `Your files add up to ${size(total)}. Keep all files to 3 MB or smaller.`;
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
    <p id={id} className="form-error-text eva-cf-error">
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
        <circle cx="8" cy="8" r="7" fill="currentColor" />
        <path d="M8 4.2v4.6M8 10.9v.9" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
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

/** Voice preview that follows the one-sound-at-a-time rule. */
function AudioPreview({ file, label }: { file: File; label: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [url, setUrl] = useState<string>();
  const pid = useId();
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  useEffect(() => registerAudio(`careers-${pid}`, () => ref.current?.pause()), [pid]);
  return (
    <audio
      ref={ref}
      className="eva-cf-audio"
      src={url}
      controls
      preload="metadata"
      data-audio-focus="1"
      aria-label={`Preview ${label}`}
      onPlay={() => claimAudio(`careers-${pid}`)}
    />
  );
}

export default function CareersForm() {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const inFlight = useRef(false);
  const doneRef = useRef<HTMLDivElement>(null);
  const shield = useFormShield();
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<FileField, File[]>>({ resume: [], voices: [] });
  const [drag, setDrag] = useState<FileField | null>(null);
  const [valid, setValid] = useState<Record<string, boolean>>({});
  const { errors, onBlur, onChange, validateAll, describe, setFieldError } = useFormValidation(VALIDATORS);
  const id = (name: string) => `${formId}-${name}`;

  /** Keep the real <input type=file> in sync so validation and submit read one source. */
  function setInputFiles(name: FileField, list: File[]) {
    const input = formRef.current?.elements.namedItem(name) as HTMLInputElement | null;
    if (input) {
      const dt = new DataTransfer();
      list.forEach((f) => dt.items.add(f));
      input.files = dt.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    setFiles((prev) => ({ ...prev, [name]: list }));
  }

  function addFiles(name: FileField, incoming: File[]) {
    if (!incoming.length) return;
    const next = name === "resume" ? incoming.slice(0, 1) : [...files.voices, ...incoming].slice(0, VOICE_MAX_FILES);
    setInputFiles(name, next);
  }

  function removeFile(name: FileField, i: number) {
    setInputFiles(name, files[name].filter((_, k) => k !== i));
    requestAnimationFrame(() => (formRef.current?.elements.namedItem(name) as HTMLElement | null)?.focus());
  }

  const dropProps = (name: FileField) => ({
    onDragOver: (e: DragEvent) => {
      e.preventDefault();
      setDrag(name);
    },
    onDragLeave: () => setDrag(null),
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      setDrag(null);
      addFiles(name, Array.from(e.dataTransfer.files));
    },
  });

  function trackValidity(form: HTMLFormElement, name: string) {
    const fn = VALIDATORS[name];
    if (!fn) return;
    const el = form.elements.namedItem(name) as HTMLInputElement | null;
    const ok = !fn((el?.value ?? "").trim(), form);
    setValid((v) => (v[name] === ok ? v : { ...v, [name]: ok }));
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
    const role = String(data.get("role") || "");
    try {
      const [resume, ...voices] = await Promise.all(
        [...filesOf(form, "resume"), ...filesOf(form, "voices")].map(readBase64),
      );
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...shieldValues,
          role,
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
      const title = ROLE_OPTIONS.find((r) => r.id === role)?.title ?? "";
      setDone(title);
      (window as unknown as { dataLayer?: object[] }).dataLayer?.push({
        event: "careers_application_submit",
        careers_role: title,
      });
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

  if (done !== null) {
    return (
      <div ref={doneRef} tabIndex={-1} className="eva-careers-success" role="status">
        <span className="eva-careers-success__icon" aria-hidden="true">✓</span>
        <h3>Application received</h3>
        <p>
          Thank you for applying{done ? ` as ${done}` : ""}. We have emailed you a confirmation. Our team listens to
          every voice sample and will contact you if your profile fits a current project.
        </p>
      </div>
    );
  }

  const fieldClass = (name: string) =>
    `eva-enquiry-field eva-cf-field${errors[name] ? " is-invalid" : valid[name] ? " is-valid" : ""}`;

  const zone = (name: FileField, label: string, accept: string, hint: string, multiple: boolean) => {
    const list = files[name];
    const full = name === "resume" ? list.length >= 1 : list.length >= VOICE_MAX_FILES;
    return (
      <div className={fieldClass(name)}>
        <span className="eva-cf-label" id={id(`${name}-label`)}>
          {label} <span aria-hidden="true">*</span>
        </span>
        <input
          id={id(name)}
          className="eva-cf-file-input"
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          required
          aria-labelledby={`${id(`${name}-label`)} ${id(`${name}-cta`)}`}
          {...describe(name, id(`${name}-error`), id(`${name}-hint`))}
          onChange={(ev) => {
            // Native picker: merge with the files already chosen.
            if (!ev.nativeEvent.isTrusted) return;
            const picked = Array.from(ev.currentTarget.files ?? []);
            addFiles(name, picked);
          }}
        />
        <label
          htmlFor={id(name)}
          className={`eva-cf-drop${drag === name ? " is-drag" : ""}${full ? " is-full" : ""}`}
          {...dropProps(name)}
        >
          <svg className="eva-cf-drop__icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
            {name === "resume" ? (
              <path fill="currentColor" d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.5V9h5.5L13 3.5ZM8 13h8v1.6H8V13Zm0 3.4h8V18H8v-1.6Z" />
            ) : (
              <path fill="currentColor" d="M12 15a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v7a3 3 0 0 0 3 3Zm5.3-3a5.3 5.3 0 0 1-10.6 0H5a7 7 0 0 0 6 6.9V22h2v-3.1a7 7 0 0 0 6-6.9h-1.7Z" />
            )}
          </svg>
          <span className="eva-cf-drop__text" id={id(`${name}-cta`)}>
            Drag and drop or <span className="eva-cf-drop__browse">browse</span>
          </span>
          <span className="eva-cf-drop__hint" id={id(`${name}-hint`)}>
            {hint}
          </span>
        </label>
        {list.length ? (
          <ul className="eva-cf-chips" aria-label={`Selected ${label.toLowerCase()}`}>
            {list.map((f, i) => (
              <li className="eva-cf-chip" key={`${f.name}-${i}`}>
                <div className="eva-cf-chip__row">
                  <span className="eva-cf-chip__name">{f.name}</span>
                  <span className="eva-cf-chip__size">{size(f.size)}</span>
                  <button
                    type="button"
                    className="eva-cf-chip__remove"
                    aria-label={`Remove ${f.name}`}
                    onClick={() => removeFile(name, i)}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                {name === "voices" ? <AudioPreview file={f} label={f.name} /> : null}
              </li>
            ))}
          </ul>
        ) : null}
        <FieldError id={id(`${name}-error`)} message={errors[name]} />
      </div>
    );
  };

  return (
    <form
      ref={formRef}
      id="careers-apply"
      className="eva-enquiry-form eva-careers-form"
      onSubmit={onSubmit}
      onBlur={(e) => {
        onBlur(e);
        const n = (e.target as unknown as HTMLInputElement).name;
        if (n && (e.target as unknown as HTMLInputElement).value) trackValidity(e.currentTarget, n);
      }}
      onChange={(e) => {
        onChange(e);
        const n = (e.target as unknown as HTMLInputElement).name;
        if (n) trackValidity(e.currentTarget, n);
      }}
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

        <div className="eva-cf-step">
          <div className={fieldClass("role")}>
            <label htmlFor={id("role")} className="eva-cf-label">
              Role applying for <span aria-hidden="true">*</span>
            </label>
            <select id={id("role")} name="role" defaultValue="" required {...describe("role", id("role-error"))}>
              <option value="" disabled>
                Select a role
              </option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
            <FieldError id={id("role-error")} message={errors.role} />
          </div>
        </div>

        <div className="eva-cf-step">
          {zone("resume", "Resume", RESUME_ACCEPT, "PDF, DOC or DOCX. Up to 1 MB.", false)}
          {zone(
            "voices",
            "Voice samples",
            VOICE_ACCEPT,
            `MP3, WAV or M4A. Up to ${VOICE_MAX_FILES} files, 3 MB in total with your resume.`,
            true,
          )}
        </div>

        <div className="eva-cf-step">
          <div className={fieldClass("name")}>
            <label htmlFor={id("name")} className="eva-cf-label">
              Full name <span aria-hidden="true">*</span>
            </label>
            <input id={id("name")} type="text" name="name" autoComplete="name" required {...describe("name", id("name-error"))} />
            <FieldError id={id("name-error")} message={errors.name} />
          </div>

          <div className={fieldClass("email")}>
            <label htmlFor={id("email")} className="eva-cf-label">
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

          <div className={fieldClass("phone")}>
            <label htmlFor={id("phone")} className="eva-cf-label">
              Mobile <span aria-hidden="true">*</span>
            </label>
            <div className="eva-cf-phone">
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
                placeholder="98765 43210"
                required
                {...describe("phone", id("phone-error"))}
              />
            </div>
            <FieldError id={id("phone-error")} message={errors.phone} />
          </div>

          <div className={fieldClass("country")}>
            <label htmlFor={id("country")} className="eva-cf-label">
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
        </div>

        {shield.fields}

        <button type="submit" className="eva-enquiry-submit eva-cf-submit" disabled={submitting} aria-busy={submitting || undefined}>
          {submitting ? (
            <>
              <span className="eva-cf-spinner" aria-hidden="true" /> Sending application
            </>
          ) : (
            "Submit application"
          )}
        </button>
        <p className="eva-cf-privacy">
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M8 1 3 3v4c0 3.3 2.1 6.3 5 7 2.9-.7 5-3.7 5-7V3L8 1Z" />
          </svg>
          <span>
            We use your details only to review your application. See our{" "}
            <a className="eva-copy-link" href="/privacy-policy">
              privacy policy
            </a>
            .
          </span>
        </p>
        <p className="sr-only" role="status" aria-live="polite">
          {submitting ? "Sending your application, please wait." : ""}
        </p>
      </fieldset>
    </form>
  );
}
