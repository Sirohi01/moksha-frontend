import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

// Badge
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "saffron" | "green" | "yellow" | "red" | "stone";
}

export function Badge({ variant = "saffron", className, children, ...props }: BadgeProps) {
  const variants = {
    saffron: "bg-saffron-100 text-saffron-700 border border-saffron-200",
    green: "bg-green-100 text-green-700 border border-green-200",
    yellow: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    red: "bg-red-100 text-red-700 border border-red-200",
    stone: "bg-stone-100 text-stone-700 border border-stone-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Alert
interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
}

export function Alert({ variant = "info", title, className, children, ...props }: AlertProps) {
  const variants = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };
  return (
    <div
      className={cn("border rounded-lg p-4", variants[variant], className)}
      role="alert"
      {...props}
    >
      {title && <p className="font-semibold mb-1">{title}</p>}
      <p className="text-sm">{children}</p>
    </div>
  );
}

// StatsCard
interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export function StatsCard({ label, value, icon, description, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl p-6 border border-cream-200 shadow-sm text-center",
        className
      )}
    >
      {icon && (
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center text-saffron-600">
            {icon}
          </div>
        </div>
      )}
      <p className="font-serif text-3xl font-bold text-saffron-600 mb-1">{value}</p>
      <p className="font-medium text-stone-700 text-sm">{label}</p>
      {description && <p className="text-xs text-stone-500 mt-1">{description}</p>}
    </div>
  );
}

// SectionHeader
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  tag?: string;
}

export function SectionHeader({ title, subtitle, centered = true, className, tag }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12", centered && "text-center", className)}>
      {tag && (
        <span className="inline-block text-saffron-600 text-sm font-medium tracking-widest uppercase mb-3">
          ✦ {tag} ✦
        </span>
      )}
      <h2 className={cn("font-serif text-3xl md:text-4xl font-bold mb-4", !className?.includes('text-') && "text-stone-800")}>{title}</h2>
      {subtitle && (
        <p className={cn("text-lg max-w-2xl mx-auto leading-relaxed", !className?.includes('text-') && "text-stone-500")}>{subtitle}</p>
      )}
      <div className={cn("mt-4 h-0.5 w-16 bg-gradient-to-r from-saffron-500 to-gold-500 rounded", centered && "mx-auto")} />
    </div>
  );
}

// Container
interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({ size = "xl", className, children, ...props }: ContainerProps) {
  const sizes = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-[1400px]",
    full: "max-w-full",
  };
  return (
    <div
      className={cn("mx-auto px-2 sm:px-3 lg:px-4", sizes[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}
