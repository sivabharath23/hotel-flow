import React from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  amount: number;
  isCurrency?: boolean;
  currencySymbol?: string;
  icon: LucideIcon;
  colorScheme: "blue" | "emerald" | "rose" | "indigo" | "amber" | "purple" | "violet";
  trendText?: string;
  actionButton?: React.ReactNode;
  subtitle?: string;
}

export function StatCard({
  title,
  amount,
  isCurrency = true,
  currencySymbol = "INR",
  icon: Icon,
  colorScheme,
  trendText,
  actionButton,
  subtitle,
}: StatCardProps) {
  const colorStyles = {
    blue: {
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
      icon: "text-blue-600 dark:text-blue-400",
      border: "border-blue-100 dark:border-blue-900/50",
    },
    emerald: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      icon: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/50",
    },
    rose: {
      bg: "bg-rose-500/10 dark:bg-rose-500/20",
      icon: "text-rose-600 dark:text-rose-400",
      border: "border-rose-100 dark:border-rose-900/50",
    },
    indigo: {
      bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      icon: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-100 dark:border-indigo-900/50",
    },
    amber: {
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
      icon: "text-amber-600 dark:text-amber-400",
      border: "border-amber-100 dark:border-amber-900/50",
    },
    purple: {
      bg: "bg-purple-500/10 dark:bg-purple-500/20",
      icon: "text-purple-600 dark:text-purple-400",
      border: "border-purple-100 dark:border-purple-900/50",
    },
    violet: {
      bg: "bg-violet-500/10 dark:bg-violet-500/20",
      icon: "text-violet-600 dark:text-violet-400",
      border: "border-violet-100 dark:border-violet-900/50",
    },
  }[colorScheme];

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-2xl p-4 border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group",
        colorStyles.border
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {title}
          </span>
          {subtitle && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal mt-0.5 truncate max-w-[140px]">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-105 shrink-0", colorStyles.bg)}>
          <Icon className={cn("w-5 h-5 stroke-[2.2]", colorStyles.icon)} />
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isCurrency ? formatCurrency(amount, currencySymbol) : `${amount}%`}
          </h2>
          {actionButton}
        </div>

        {trendText && (
          <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="truncate">{trendText}</span>
          </div>
        )}
      </div>
    </div>
  );
}
