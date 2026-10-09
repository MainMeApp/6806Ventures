import type { ReactNode } from "react";

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-navy-200 bg-white px-3.5 py-2.5 text-base text-ink shadow-xs placeholder:text-navy-700/50 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-200 aria-invalid:border-alert";

type BaseProps = {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  errors?: string[];
  className?: string;
};

function FieldShell({ name, label, hint, required, errors, className = "", children }: BaseProps & { children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block font-semibold text-navy-900">
        {label}
        {required && <span className="text-alert"> *</span>}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="text-sm text-navy-700">
          {hint}
        </p>
      )}
      {children}
      {errors?.length ? (
        <p id={`${name}-error`} className="mt-1 text-sm font-medium text-alert">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(p: BaseProps) {
  return [p.hint && `${p.name}-hint`, p.errors?.length && `${p.name}-error`].filter(Boolean).join(" ") || undefined;
}

export function TextField(
  props: BaseProps & {
    type?: string;
    autoComplete?: string;
    defaultValue?: string;
    maxLength?: number;
    placeholder?: string;
    min?: string;
  },
) {
  return (
    <FieldShell {...props}>
      <input
        id={props.name}
        name={props.name}
        type={props.type ?? "text"}
        required={props.required}
        autoComplete={props.autoComplete}
        defaultValue={props.defaultValue}
        maxLength={props.maxLength}
        min={props.min}
        placeholder={props.placeholder}
        aria-invalid={props.errors?.length ? true : undefined}
        aria-describedby={describedBy(props)}
        className={inputClass}
      />
    </FieldShell>
  );
}

export function TextArea(props: BaseProps & { rows?: number; defaultValue?: string; maxLength?: number }) {
  return (
    <FieldShell {...props}>
      <textarea
        id={props.name}
        name={props.name}
        rows={props.rows ?? 4}
        required={props.required}
        defaultValue={props.defaultValue}
        maxLength={props.maxLength}
        aria-invalid={props.errors?.length ? true : undefined}
        aria-describedby={describedBy(props)}
        className={inputClass}
      />
    </FieldShell>
  );
}

export function SelectField(
  props: BaseProps & {
    options: { value: string; label: string }[];
    defaultValue?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
  },
) {
  return (
    <FieldShell {...props}>
      <select
        id={props.name}
        name={props.name}
        required={props.required}
        defaultValue={props.defaultValue ?? ""}
        onChange={props.onChange ? (ev) => props.onChange!(ev.target.value) : undefined}
        aria-invalid={props.errors?.length ? true : undefined}
        aria-describedby={describedBy(props)}
        className={inputClass}
      >
        <option value="" disabled={props.required}>
          {props.placeholder ?? "Select..."}
        </option>
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function YesNoField(props: BaseProps & { defaultValue?: string }) {
  const options = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "unsure", label: "Not sure" },
  ];
  return (
    <fieldset className={props.className} aria-describedby={describedBy(props)}>
      <legend className="font-semibold text-navy-900">
        {props.label}
        {props.required && <span className="text-alert"> *</span>}
      </legend>
      {props.hint && (
        <p id={`${props.name}-hint`} className="text-sm text-navy-700">
          {props.hint}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-3">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-navy-200 bg-white px-4 py-2 has-checked:border-navy-600 has-checked:bg-navy-50"
          >
            <input
              type="radio"
              name={props.name}
              value={o.value}
              required={props.required}
              defaultChecked={props.defaultValue === o.value}
              className="accent-navy-700"
            />
            {o.label}
          </label>
        ))}
      </div>
      {props.errors?.length ? (
        <p id={`${props.name}-error`} className="mt-1 text-sm font-medium text-alert">
          {props.errors[0]}
        </p>
      ) : null}
    </fieldset>
  );
}

// Off-screen field that only bots fill in.
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Company website
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormStatus({ status, message }: { status: string; message?: string }) {
  if (!message || status === "idle") return null;
  const ok = status === "success";
  return (
    <div
      role={ok ? "status" : "alert"}
      className={`rounded-xl px-5 py-4 font-medium ${ok ? "bg-navy-100 text-navy-900" : "bg-red-50 text-alert"}`}
    >
      {message}
    </div>
  );
}
