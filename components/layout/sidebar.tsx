"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HotelFlowLogo } from "@/components/ui/logo";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Lock,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutHotel } from "@/actions/auth";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Sales Entry", href: "/sales", icon: TrendingUp },
  { label: "Expense Entry", href: "/expenses", icon: TrendingDown },
  { label: "Daily Closing", href: "/closing", icon: Lock },
  { label: "Financial Reports", href: "/reports", icon: BarChart3 },
  { label: "Hotel Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutHotel();
  };

  return (
    <>
      <aside
        className={cn(
          "hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 h-screen sticky top-0 p-3 justify-between shadow-sm transition-all duration-300 relative z-30",
          isCollapsed ? "w-16" : "w-56"
        )}
      >
        <div>
          {/* Header with Logo & Menu / X toggle icon */}
          <div className={cn("py-1.5 mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3", isCollapsed && "flex-col gap-2 px-0")}>
            <HotelFlowLogo size="sm" showText={!isCollapsed} />
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all shadow-xs flex items-center justify-center shrink-0 border border-blue-200/50 dark:border-blue-800/50"
              title={isCollapsed ? "Open Menu" : "Close Menu"}
              aria-label="Toggle Sidebar Menu"
            >
              {isCollapsed ? (
                <Menu className="w-4 h-4 stroke-[2.2]" />
              ) : (
                <X className="w-4 h-4 stroke-[2.2]" />
              )}
            </button>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-2.5 py-2.5 rounded-xl transition-all duration-200 font-medium text-xs",
                    isCollapsed ? "justify-center px-2" : "px-3",
                    isActive
                      ? "bg-blue-600 text-white shadow-xs font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "stroke-[2.5]" : "stroke-[1.75]")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setShowLogoutModal(true)}
            title={isCollapsed ? "Sign Out" : undefined}
            className={cn(
              "flex items-center gap-2.5 w-full py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-all duration-200 font-medium text-xs",
              isCollapsed ? "justify-center px-2" : "px-3"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0 stroke-[1.75]" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
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
