"use client";

import { useEffect, useState } from "react";

interface TenantSettings {
  id: string;
  name: string;
  slug: string;
  themeKey: string;
  customDomain: string | null;
}

export default function DomainSettingsPage() {
  const [tenant, setTenant] = useState<TenantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/tenant/settings")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load settings");
        return r.json();
      })
      .then((data: TenantSettings) => {
        setTenant(data);
        setCustomDomain(data.customDomain ?? "");
      })
      .catch(() => setMessage({ type: "error", text: "Failed to load tenant settings." }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!tenant) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/tenant/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customDomain: customDomain.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save");
      }

      const updated = await res.json();
      setTenant(updated);
      setCustomDomain(updated.customDomain ?? "");
      setMessage({ type: "success", text: "Custom domain saved successfully." });
    } catch (e) {
      setMessage({
        type: "error",
        text: e instanceof Error ? e.message : "Something went wrong.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-zinc-500">
        Loading domain settings...
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

  const subdomainUrl = `${tenant.slug}.voyagr.globusdemos.com`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Domain Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage how visitors access your site.
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

      {/* Current subdomain */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Default Subdomain
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Your site is always accessible at this address.
        </p>
        <div className="mt-3">
          <code className="rounded bg-zinc-100 px-2 py-1 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            {subdomainUrl}
          </code>
        </div>
      </div>

      {/* Custom domain */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Custom Domain
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Connect your own domain to this site.
        </p>

        <div className="mt-4">
          <label
            htmlFor="customDomain"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Domain
          </label>
          <input
            id="customDomain"
            type="text"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="mybrand.com"
            className="mt-1 block w-full max-w-md rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
          />
        </div>

        <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            DNS Configuration
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Point your domain&apos;s DNS records to our server:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>A record:</strong> Point <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">@</code> to your server IP address
            </li>
            <li>
              <strong>CNAME record:</strong> Point <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">www</code> to <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">voyagr.globusdemos.com</code>
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {saving ? "Saving..." : "Save Domain"}
          </button>
        </div>
      </div>
    </div>
  );
}
