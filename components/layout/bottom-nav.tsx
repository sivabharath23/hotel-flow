"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TrendingUp, TrendingDown, BarChart3, User, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Sales", href: "/sales", icon: TrendingUp },
  { label: "Expenses", href: "/expenses", icon: TrendingDown },
  { label: "Closing", href: "/closing", icon: Lock },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Profile", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 pt-2 pb-5 shadow-2xl">
      <nav className="flex items-center justify-between gap-1 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 min-h-[48px] py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 relative active:scale-95 touch-manipulation",
                isActive
                  ? "bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-bold shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-0.5 shrink-0 transition-transform", isActive ? "stroke-[2.5px] scale-110" : "stroke-2")} />
              <span className="text-[10px] leading-tight tracking-tight font-semibold truncate max-w-full px-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
