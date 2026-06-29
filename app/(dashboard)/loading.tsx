import React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-28 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl p-4 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-slate-300 dark:bg-slate-700 rounded-full" />
          <div className="h-6 w-56 bg-slate-300 dark:bg-slate-700 rounded-lg" />
        </div>
        <div className="h-3 w-72 bg-slate-300 dark:bg-slate-700 rounded-full" />
      </div>

      {/* 4 Stat Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="h-8 w-8 bg-slate-300 dark:bg-slate-700 rounded-xl" />
            </div>
            <div className="h-7 w-36 bg-slate-300 dark:bg-slate-700 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Content Split Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-40 bg-slate-300 dark:bg-slate-700 rounded-md" />
              <div className="h-4 w-16 bg-slate-300 dark:bg-slate-700 rounded-md" />
            </div>
            <div className="space-y-2.5 pt-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-12 bg-slate-300/60 dark:bg-slate-700/60 rounded-xl w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
