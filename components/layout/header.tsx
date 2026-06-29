"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Calendar, Building2, User, LogOut } from "lucide-react";
import { format } from "date-fns";
import { logoutHotel } from "@/actions/auth";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface HeaderProps {
  hotelName?: string;
  hotelType?: string;
  logoUrl?: string | null;
  ownerName?: string;
}

export function Header({ hotelName = "My Hotel", hotelType = "Hotel", logoUrl, ownerName }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutHotel();
  };

  return (
    <>
      <header className="h-16 shrink-0 sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="md:hidden w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 overflow-hidden border border-blue-500/30 active:scale-95 transition-transform" title="View Hotel Profile">
            {logoUrl ? (
              <img src={logoUrl} alt="Hotel Logo" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-5 h-5" />
            )}
          </Link>
          <div>
            <h1 className="text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {hotelName}
            </h1>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {hotelType} • Live Register
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
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

          {/* Small device Profile Icon Link */}
          <Link
            href="/profile"
            className="flex md:hidden p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer items-center justify-center shrink-0 border border-blue-200/50 dark:border-blue-800/50"
            aria-label="Hotel Profile"
            title="Hotel Profile"
          >
            <User className="w-4 h-4 stroke-[2.5]" />
          </Link>

          {/* Small device Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex md:hidden p-2 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors cursor-pointer items-center justify-center shrink-0 border border-rose-200/50 dark:border-rose-800/50"
            aria-label="Sign Out"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Mobile Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Sign Out Account"
        description="Are you sure you want to sign out of your HotelFlow register session?"
        confirmText="Yes, Sign Out"
        loading={loggingOut}
      />
    </>
  );
}
