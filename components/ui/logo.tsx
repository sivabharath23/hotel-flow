import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function HotelFlowLogo({ size = "md", showText = true, className = "" }: LogoProps) {
  const dimensions = {
    sm: { box: 36, icon: 20, font: "text-lg" },
    md: { box: 48, icon: 28, font: "text-xl" },
    lg: { box: 64, icon: 36, font: "text-3xl" },
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-float flex items-center justify-center p-2.5 relative overflow-hidden transition-transform duration-300 hover:scale-105"
        style={{ width: dimensions.box, height: dimensions.box }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-white"
        >
          {/* Wallet Icon */}
          <path d="M19 7-[2] 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
          <path d="M3 7s0-2 2-2h12s2 0 2 2" />
          <path d="M16 12h.01" />
          {/* Green Upward Arrow overlay */}
          <path d="M12 17V9" stroke="#10B981" strokeWidth="2.5" />
          <path d="m8 13 4-4 4 4" stroke="#10B981" strokeWidth="2.5" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight text-slate-900 dark:text-white ${dimensions.font}`}>
            Hotel<span className="text-blue-600 dark:text-blue-400">Flow</span>
          </span>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 -mt-1">
            Cash Management
          </span>
        </div>
      )}
    </div>
  );
}
