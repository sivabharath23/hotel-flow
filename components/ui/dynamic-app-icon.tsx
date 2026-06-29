"use client";

import { useEffect } from "react";

interface DynamicAppIconProps {
  logoUrl?: string | null;
}

export function DynamicAppIcon({ logoUrl }: DynamicAppIconProps) {
  useEffect(() => {
    if (!logoUrl) return;

    // Update standard icon / favicon link tags
    const links = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
    if (links.length > 0) {
      links.forEach((link) => {
        link.href = logoUrl;
      });
    } else {
      const link = document.createElement("link");
      link.rel = "shortcut icon";
      link.href = logoUrl;
      document.getElementsByTagName("head")[0].appendChild(link);
    }

    // Update Apple Touch Icon
    let appleLink = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
    if (!appleLink) {
      appleLink = document.createElement("link");
      appleLink.rel = "apple-touch-icon";
      document.getElementsByTagName("head")[0].appendChild(appleLink);
    }
    appleLink.href = logoUrl;
  }, [logoUrl]);

  return null;
}
