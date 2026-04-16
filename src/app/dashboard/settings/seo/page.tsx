"use client";

import { useEffect, useState } from "react";

export default function SeoSettingsPage() {
  const [titleTemplate, setTitleTemplate] = useState("");
  const [description, setDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/tenant/settings");
        if (res.ok) {
          const data = await res.json();
          setTitleTemplate(data.name ?? "");
          setDescription(data.description ?? "");
          setOgImage(data.logo ?? "");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/tenant/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: titleTemplate,
          description,
          logo: ogImage,
        }),
      });

      if (res.ok) {
        setMessage("SEO settings saved.");
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to save settings.");
      }
    } catch {
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-500">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">SEO Defaults</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Set default meta titles, descriptions, and social images for your site.
      </p>

      <form onSubmit={handleSave} className="mt-8 max-w-xl space-y-6">
        <div>
          <label
            htmlFor="titleTemplate"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Site Title Template
          </label>
          <input
            id="titleTemplate"
            type="text"
            value={titleTemplate}
            onChange={(e) => setTitleTemplate(e.target.value)}
            placeholder="My Travel Blog"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Used as the site name in page titles and meta tags.
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Default Meta Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="A brief description of your site for search engines..."
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Shown in search engine results when no page-specific description is
            set.
          </p>
        </div>

        <div>
          <label
            htmlFor="ogImage"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Default OG Image URL
          </label>
          <input
            id="ogImage"
            type="text"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            placeholder="https://example.com/og-image.jpg"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Used as the social sharing image when no page-specific image is set.
          </p>
          {ogImage && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ogImage}
                alt="OG preview"
                className="h-32 w-auto rounded-md border border-zinc-200 object-cover dark:border-zinc-700"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {saving ? "Saving..." : "Save SEO Settings"}
          </button>
          {message && (
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
