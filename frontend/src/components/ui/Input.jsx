import React, { useState } from "react";
import { FaChevronDown, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

export function FieldWrapper({ label, error, hint, required, id, children, className = "" }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="lum-label">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
          {label && !required && hint === undefined ? null : null}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

const Input = React.forwardRef(function Input(
  { label, error, hint, required, icon: Icon, id, className = "", wrapperClassName = "", ...rest },
  ref
) {
  const inputId = id || rest.name;
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required} id={inputId} className={wrapperClassName}>
      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={15} />
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            "lum-input",
            Icon && "pl-10",
            error && "border-red-400 focus:border-red-400 focus:ring-red-500/20",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={Boolean(error)}
          {...rest}
        />
      </div>
    </FieldWrapper>
  );
});

export function Textarea({ label, error, hint, required, id, className = "", rows = 4, ...rest }) {
  const inputId = id || rest.name;
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required} id={inputId}>
      <textarea
        id={inputId}
        rows={rows}
        className={`lum-input resize-y ${error ? "border-red-400" : ""} ${className}`}
        aria-invalid={Boolean(error)}
        {...rest}
      />
    </FieldWrapper>
  );
}

export function PasswordInput({ label, error, hint, required, id, ...rest }) {
  const [visible, setVisible] = useState(false);
  const inputId = id || rest.name;
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required} id={inputId}>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <FaLock size={15} />
        </span>
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={`lum-input pl-10 pr-11 ${error ? "border-red-400" : ""}`}
          aria-invalid={Boolean(error)}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink-800"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
        </button>
      </div>
    </FieldWrapper>
  );
}

export function Checkbox({ label, id, className = "", ...rest }) {
  const inputId = id || rest.name;
  return (
    <label htmlFor={inputId} className={`flex cursor-pointer select-none items-start gap-2.5 text-sm text-ink-700 ${className}`}>
      <input
        id={inputId}
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500/40"
        {...rest}
      />
      <span>{label}</span>
    </label>
  );
}

export function Select({ label, error, hint, required, id, className = "", children, ...rest }) {
  const inputId = id || rest.name;
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required} id={inputId}>
      <div className="relative">
        <select
          id={inputId}
          className={`lum-input appearance-none pr-10 ${error ? "border-red-400" : ""} ${className}`}
          aria-invalid={Boolean(error)}
          {...rest}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <FaChevronDown size={12} />
        </span>
      </div>
    </FieldWrapper>
  );
}

export default Input;
