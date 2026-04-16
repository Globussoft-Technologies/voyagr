"use client";

import { useEffect } from "react";

export default function TrackingScript() {
  useEffect(() => {
    try {
      const data = JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer || undefined,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics/track", new Blob([data], { type: "application/json" }));
      } else {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
          keepalive: true,
        });
      }
    } catch {
      // Silently fail — tracking should never break the page
    }
  }, []);

  return null;
}
