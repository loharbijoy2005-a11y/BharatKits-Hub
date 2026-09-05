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
      "bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold shadow-md shadow-orange-500/20 border border-orange-400/30",
    secondary:
      "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-extrabold border border-emerald-300 dark:border-emerald-800 shadow-2xs",
    outline:
      "border-2 border-orange-500/60 dark:border-orange-500/40 hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-orange-900 dark:text-orange-200 font-extrabold shadow-2xs",
    ghost:
      "hover:bg-orange-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold",
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
