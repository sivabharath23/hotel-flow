"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Calendar, Building2, Menu } from "lucide-react";
import { format } from "date-fns";

interface HeaderProps {
  hotelName?: string;
  hotelType?: string;
}

export function Header({ hotelName = "My Hotel", hotelType = "Hotel" }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-6 py-2.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-xs border border-blue-100 dark:border-blue-900 shrink-0">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 dark:text-white text-sm md:text-base leading-tight">
            {hotelName}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {hotelType} • Live Daily Register
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>{format(new Date(), "EEEE, dd MMM yyyy")}</span>
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle Theme"
        >
          <Sun className="w-4 h-4 hidden dark:block text-amber-400" />
          <Moon className="w-4 h-4 block dark:hidden text-slate-600" />
        </button>
      </div>
    </header>
  );
}
