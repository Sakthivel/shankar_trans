"use client";

interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "default";
  children: React.ReactNode;
}

const variants = {
  success: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20",
  warning: "bg-amber-100 text-amber-700 ring-1 ring-amber-600/20",
  danger: "bg-red-100 text-red-700 ring-1 ring-red-600/20",
  info: "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-600/20",
  default: "bg-slate-100 text-slate-700 ring-1 ring-slate-600/20",
};

export function Badge({ variant = "default", children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}
