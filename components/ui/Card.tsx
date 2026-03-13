import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered" | "spiritual";
  padding?: "sm" | "md" | "lg" | "none";
}

export function Card({
  className,
  variant = "default",
  padding = "md",
  children,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-white rounded-xl shadow-sm",
    elevated: "bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300",
    bordered: "bg-white rounded-xl border border-cream-300",
    spiritual:
      "bg-gradient-to-br from-cream-50 to-white rounded-xl border border-saffron-200 shadow-sm",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(variants[variant], paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("font-serif text-xl font-semibold text-stone-800", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-stone-600 leading-relaxed", className)} {...props}>
      {children}
    </div>
  );
}
