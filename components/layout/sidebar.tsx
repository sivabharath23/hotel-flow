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
  PanelLeftClose,
  PanelLeftOpen,
  Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutHotel } from "@/actions/auth";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, category: "MAIN" },
  { label: "Sales Entry", href: "/sales", icon: TrendingUp, category: "FINANCES" },
  { label: "Expense Entry", href: "/expenses", icon: TrendingDown, category: "FINANCES" },
  { label: "Investments", href: "/investments", icon: Coins, category: "FINANCES" },
  { label: "Daily Closing", href: "/closing", icon: Lock, category: "FINANCES" },
  { label: "Financial Reports", href: "/reports", icon: BarChart3, category: "MANAGEMENT" },
  { label: "Hotel Profile", href: "/profile", icon: User, category: "MANAGEMENT" },
];

const CATEGORIES = ["MAIN", "FINANCES", "MANAGEMENT"];

interface SidebarProps {
  logoUrl?: string | null;
  hotelName?: string;
  ownerName?: string;
}

export function Sidebar({ logoUrl, hotelName = "HotelFlow Register", ownerName }: SidebarProps) {
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
          "hidden md:flex flex-col shrink-0 select-none bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 h-screen sticky top-0 relative z-40 transition-all duration-300 ease-in-out justify-between shadow-sm",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Floating Toggle Button on Right Edge */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute top-5 -right-3.5 z-50 items-center justify-center h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-md cursor-pointer"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand menu" : "Collapse menu"}
        >
          {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>

        <div>
          {/* Brand Header */}
          <div className={cn("h-16 flex items-center border-b border-slate-100 dark:border-slate-800/80 transition-all duration-300", isCollapsed ? "justify-center px-2" : "px-5")}>
            <HotelFlowLogo size="sm" showText={!isCollapsed} />
          </div>

          {/* Categorized Navigation Links */}
          <nav className={cn("overflow-y-auto py-5 space-y-5 transition-all duration-300", isCollapsed ? "px-2" : "px-3")}>
            {CATEGORIES.map((cat, idx) => (
              <div key={cat} className="space-y-1">
                {isCollapsed ? (
                  idx > 0 && <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-3 mx-2" />
                ) : (
                  <span className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                    {cat}
                  </span>
                )}
                <div className="space-y-0.5">
                  {NAV_ITEMS.filter((item) => item.category === cat).map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={isCollapsed ? item.label : undefined}
                        className={cn(
                          "flex items-center transition-all duration-200 rounded-xl font-semibold text-sm",
                          isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5",
                          isActive
                            ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                        )}
                      >
                        <Icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "stroke-[2.5px] text-blue-600 dark:text-blue-400" : "stroke-2")} />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Info & Sign Out Footer */}
        <div className={cn("border-t border-slate-100 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50 transition-all duration-300", isCollapsed ? "p-2.5 items-center gap-3" : "p-4 gap-3")}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm border border-blue-200 dark:border-blue-800 shrink-0 overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Hotel Avatar" className="w-full h-full object-cover" />
              ) : (
                (ownerName || hotelName).charAt(0).toUpperCase()
              )}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{hotelName}</p>
                <p className="text-[11px] text-slate-400 truncate">{ownerName || "Live Register Session"}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            title={isCollapsed ? "Sign Out Account" : undefined}
            className={cn(
              "flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer",
              isCollapsed ? "p-2.5 w-9 h-9" : "gap-2 w-full py-2"
            )}
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
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
