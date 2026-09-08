"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FieldWrapper({ label, htmlFor, error, hint, required, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-navy-800">
        {label}
        {required && <span className="ml-0.5 text-coral-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-navy-500">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs font-medium text-coral-600">
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-navy-900 placeholder:text-navy-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/60 disabled:bg-navy-50";

export const TextField = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string; required?: boolean }
>(({ label, error, hint, required, className, id, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <FieldWrapper label={label} htmlFor={inputId} error={error} hint={hint} required={required}>
      <input
        id={inputId}
        ref={ref}
        aria-invalid={Boolean(error)}
        className={cn(inputBase, error ? "border-coral-400" : "border-navy-200", className)}
        {...props}
      />
    </FieldWrapper>
  );
});
TextField.displayName = "TextField";

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; hint?: string; required?: boolean }
>(({ label, error, hint, required, className, id, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <FieldWrapper label={label} htmlFor={inputId} error={error} hint={hint} required={required}>
      <textarea
        id={inputId}
        ref={ref}
        aria-invalid={Boolean(error)}
        rows={4}
        className={cn(inputBase, "resize-none", error ? "border-coral-400" : "border-navy-200", className)}
        {...props}
      />
    </FieldWrapper>
  );
});
TextAreaField.displayName = "TextAreaField";

export const SelectField = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    error?: string;
    hint?: string;
    required?: boolean;
    placeholder?: string;
  }
>(({ label, error, hint, required, className, id, placeholder, children, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <FieldWrapper label={label} htmlFor={inputId} error={error} hint={hint} required={required}>
      <select
        id={inputId}
        ref={ref}
        aria-invalid={Boolean(error)}
        className={cn(inputBase, "appearance-none bg-no-repeat pr-10", error ? "border-coral-400" : "border-navy-200", className)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23363a63' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundPosition: "right 0.9rem center",
        }}
        defaultValue={props.defaultValue ?? ""}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    </FieldWrapper>
  );
});
SelectField.displayName = "SelectField";

export function CheckboxChip({
  checked,
  onChange,
  label,
  name,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  name: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        checked
          ? "border-cyan-400 bg-cyan-50 text-cyan-700"
          : "border-navy-200 bg-white text-navy-600 hover:border-navy-300"
      )}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-navy-300 text-cyan-500 focus:ring-cyan-400"
      />
      {label}
    </label>
  );
}

export function RadioCard({
  checked,
  onChange,
  label,
  name,
  value,
}: {
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  name: string;
  value: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
        checked
          ? "border-cyan-400 bg-cyan-50 text-cyan-700"
          : "border-navy-200 bg-white text-navy-700 hover:border-navy-300"
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="h-4 w-4 border-navy-300 text-cyan-500 focus:ring-cyan-400"
      />
      {label}
    </label>
  );
}
