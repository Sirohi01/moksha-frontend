"use client";
import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, forwardRef } from "react";

// InputField
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helpText, className, id, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : `input-${Math.random().toString(36).substr(2, 9)}`);
    return (
      <div className="space-y-2 flex-1 w-full group">
        {label && (
          <label htmlFor={inputId} className="block text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ml-1 group-focus-within:text-gold-600 transition-colors">
            {label} {required && <span className="text-gold-600 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={cn(
            "w-full px-6 py-4 rounded-xl border border-stone-100 bg-[#FAFAFA] text-zinc-950 text-sm font-bold",
            "placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 focus:bg-white",
            "transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]",
            error && "border-red-400 focus:ring-red-400/10 focus:border-red-500",
            className
          )}
          aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-[9px] font-bold text-red-600 px-1 uppercase tracking-widest mt-1" role="alert">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={`${inputId}-help`} className="text-[9px] font-medium text-stone-500 px-1 italic">
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
  label?: string;
  error?: string;
  helpText?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, helpText, className, id, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : `textarea-${Math.random().toString(36).substr(2, 9)}`);
    return (
      <div className="space-y-2 flex-1 w-full group">
        {label && (
          <label htmlFor={inputId} className="block text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ml-1 group-focus-within:text-gold-600 transition-colors">
            {label} {required && <span className="text-gold-600 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          required={required}
          rows={4}
          className={cn(
            "w-full px-6 py-4 rounded-xl border border-stone-100 bg-[#FAFAFA] text-zinc-950 text-sm font-bold leading-relaxed",
            "placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 focus:bg-white",
            "transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none",
            error && "border-red-400 focus:border-red-500",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="text-[9px] font-bold text-red-600 px-1 uppercase tracking-widest mt-1">{error}</p>}
        {helpText && !error && <p className="text-[9px] font-medium text-stone-500 px-1 italic">{helpText}</p>}
      </div>
    );
  }
);
TextareaField.displayName = "TextareaField";

// SelectField
interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, placeholder, className, id, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : `select-${Math.random().toString(36).substr(2, 9)}`);
    return (
      <div className="space-y-2 flex-1 w-full group">
        {label && (
          <label htmlFor={inputId} className="block text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ml-1 group-focus-within:text-gold-600 transition-colors">
            {label} {required && <span className="text-gold-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            required={required}
            className={cn(
              "w-full px-6 py-4 rounded-xl border border-stone-100 bg-[#FAFAFA] text-zinc-950 text-sm appearance-none font-bold",
              "focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 focus:bg-white",
              "transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]",
              error && "border-red-400 focus:border-red-500",
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-zinc-950">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-300">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <p className="text-[9px] font-bold text-red-600 px-1 uppercase tracking-widest mt-1">{error}</p>}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";
