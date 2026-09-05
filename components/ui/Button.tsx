import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl text-xs font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variants = {
    primary:
      "bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-600/20 border border-brand-500/30",
    secondary:
      "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold border border-slate-300 dark:border-slate-700 shadow-2xs",
    outline:
      "border-2 border-slate-300 dark:border-slate-700 hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold shadow-2xs",
    ghost:
      "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold",
    danger:
      "bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-500/20 border border-red-500/30",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[11px]",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-sm",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
