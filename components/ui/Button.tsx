"use client";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "white";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, children, disabled, ...props },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-black uppercase tracking-tighter transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-center";

    const variants = {
      primary:
        "bg-[#b45309] hover:bg-[#92400e] text-white shadow-xl",
      secondary:
        "bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white",
      outline:
        "border-2 border-[#b45309] text-[#b45309] hover:bg-[#b45309] hover:text-white",
      white:
        "border-2 border-white text-white hover:bg-white hover:text-[#1c1917]",
      ghost:
        "text-[#b45309] hover:bg-[#b45309]/10",
      danger:
        "bg-red-600 hover:bg-red-700 text-white",
    };

    const sizes = {
      sm: "px-6 py-2.5 text-[11px]",
      md: "px-8 py-3.5 text-xs",
      lg: "px-12 py-5 text-base md:text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
