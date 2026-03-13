"use client";
import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, forwardRef } from "react";

// InputField
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helpText, className, id, required, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="block text-sm font-medium text-stone-700">
          {label} {required && <span className="text-saffron-600">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={cn(
            "w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm",
            "placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-transparent",
            "transition duration-150",
            error && "border-red-400 focus:ring-red-400",
            className
          )}
          aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={`${inputId}-help`} className="text-xs text-stone-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);
InputField.displayName = "InputField";

// TextareaField
interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helpText?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, helpText, className, id, required, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="block text-sm font-medium text-stone-700">
          {label} {required && <span className="text-saffron-600">*</span>}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          required={required}
          rows={4}
          className={cn(
            "w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm",
            "placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-transparent",
            "transition duration-150 resize-vertical",
            error && "border-red-400",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        {helpText && !error && <p className="text-xs text-stone-500">{helpText}</p>}
      </div>
    );
  }
);
TextareaField.displayName = "TextareaField";

// SelectField
interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, placeholder, className, id, required, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="block text-sm font-medium text-stone-700">
          {label} {required && <span className="text-saffron-600">*</span>}
        </label>
        <select
          ref={ref}
          id={inputId}
          required={required}
          className={cn(
            "w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-transparent",
            "transition duration-150",
            error && "border-red-400",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";
