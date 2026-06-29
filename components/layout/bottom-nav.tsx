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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200/60 dark:border-slate-800 px-2 py-2 shadow-lg">
      <nav className="flex justify-around items-center">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 relative",
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-bold scale-105"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-0.5 transition-transform", isActive && "stroke-[2.5]")} />
              <span className="text-[11px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
