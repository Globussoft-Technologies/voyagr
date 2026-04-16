"use client";

import { useEffect, useState, useCallback } from "react";
import ThemePicker from "@/components/theme/ThemePicker";

interface TenantSettings {
  id: string;
  name: string;
  slug: string;
  themeKey: string;
}

export default function ThemeSettingsPage() {
  const [tenant, setTenant] = useState<TenantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/tenant/settings")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load settings");
        return r.json();
      })
      .then((data) => setTenant(data))
      .catch(() => setMessage({ type: "error", text: "Failed to load tenant settings." }))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = useCallback(
    async (themeKey: string) => {
      if (!tenant || themeKey === tenant.themeKey) return;

      setSaving(true);
      setMessage(null);

      try {
        const res = await fetch("/api/tenant/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ themeKey }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Failed to save");
        }

        const updated = await res.json();
        setTenant(updated);
        setMessage({ type: "success", text: `Theme changed to "${themeKey}" successfully.` });
      } catch (e) {
        setMessage({
          type: "error",
          text: e instanceof Error ? e.message : "Something went wrong.",
        });
      } finally {
        setSaving(false);
      }
    },
    [tenant],
  );

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-zinc-500">
        Loading theme settings...
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="py-16 text-center text-sm text-red-600">
        Could not load tenant settings.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Theme Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Choose a theme for your travel site. The theme controls colors, fonts, and available layout features.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className={saving ? "pointer-events-none opacity-60" : ""}>
        <ThemePicker currentTheme={tenant.themeKey} onSelect={handleSelect} />
      </div>

      {saving && (
        <div className="mt-4 text-center text-sm text-zinc-500">Saving...</div>
      )}
    </div>
  );
}
