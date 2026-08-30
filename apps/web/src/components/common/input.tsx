"use client";

import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface FieldProps {
  label: string;
  helpText?: string;
  error?: string;
}

type InputProps = FieldProps & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Input({
  label,
  helpText,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;

  return (
    <label className="stays-field" htmlFor={inputId}>
      <span className="stays-label">{label}</span>
      <input
        id={inputId}
        className={`stays-input ${className}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
        {...props}
      />
      {helpText ? (
        <span id={`${inputId}-help`} className="text-sm text-[var(--text-muted)]">
          {helpText}
        </span>
      ) : null}
      {error ? (
        <span id={`${inputId}-error`} className="text-sm font-medium text-[var(--danger)]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function Textarea({
  label,
  helpText,
  error,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? props.name ?? generatedId;

  return (
    <label className="stays-field" htmlFor={textareaId}>
      <span className="stays-label">{label}</span>
      <textarea
        id={textareaId}
        className={`stays-textarea min-h-32 ${className}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${textareaId}-error` : helpText ? `${textareaId}-help` : undefined
        }
        {...props}
      />
      {helpText ? (
        <span id={`${textareaId}-help`} className="text-sm text-[var(--text-muted)]">
          {helpText}
        </span>
      ) : null}
      {error ? (
        <span id={`${textareaId}-error`} className="text-sm font-medium text-[var(--danger)]">
          {error}
        </span>
      ) : null}
    </label>
  );
}
