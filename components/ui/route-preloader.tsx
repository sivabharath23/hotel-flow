"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function RoutePreloader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-blue-100 dark:bg-slate-800 overflow-hidden">
      <div className="h-full bg-blue-600 dark:bg-blue-500 animate-pulse w-full origin-left transform transition-transform duration-300 ease-out" />
    </div>
  );
}
