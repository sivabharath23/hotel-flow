"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Calendar, Building2 } from "lucide-react";
import { format } from "date-fns";

interface HeaderProps {
  hotelName?: string;
  hotelType?: string;
  logoUrl?: string | null;
}

export function Header({ hotelName = "My Hotel", hotelType = "Hotel", logoUrl }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <div className="md:hidden w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 overflow-hidden">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
            {hotelName}
          </h1>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {hotelType} • Live Register
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>{format(new Date(), "EEEE, dd MMM yyyy")}</span>
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label="Toggle Theme"
        >
          <Sun className="w-4 h-4 hidden dark:block text-amber-400" />
          <Moon className="w-4 h-4 block dark:hidden text-slate-600" />
        </button>
      </div>
    </header>
  );
}
