"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RichEditor from "@/components/editor/RichEditor";

export default function NewPage() {
  const router = useRouter();
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);
  const [pending, setPending] = useState(false);
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        body: form,
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        setError({ message: data.error ?? "Something went wrong", field: data.field });
        return;
      }
      router.push("/dashboard/pages");
      router.refresh();
    } catch {
      setError({ message: "Network error — please try again" });
    } finally {
      setPending(false);
    }
  }

  const fieldError = (name: string) =>
    error?.field === name ? error.message : null;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/pages"
        className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to pages
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">New page</h1>

      <form method="post" action="/api/pages" onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <label className="block">
          <span className="block text-sm font-medium">Title *</span>
          <input
            name="title"
            type="text"
            required
            placeholder="About our trips"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 sm:py-2 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:focus:ring-zinc-200"
          />
          {fieldError("title") && (
            <span className="mt-1 block text-xs text-red-600">{fieldError("title")}</span>
          )}
        </label>

        <label className="block">
          <span className="block text-sm font-medium">URL slug *</span>
          <input
            name="slug"
            type="text"
            required
            placeholder="about"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 font-mono text-base shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 sm:py-2 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:focus:ring-zinc-200"
          />
          <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
            Lowercase letters, numbers, and hyphens.
          </span>
          {fieldError("slug") && (
            <span className="mt-1 block text-xs text-red-600">{fieldError("slug")}</span>
          )}
        </label>

        <div className="block">
          <span className="block text-sm font-medium">Content</span>
          <div className="mt-1">
            <RichEditor value={content} onChange={setContent} placeholder="Write your page content..." />
          </div>
          <input type="hidden" name="content" value={content} />
          {fieldError("content") && (
            <span className="mt-1 block text-xs text-red-600">{fieldError("content")}</span>
          )}
        </div>

        <label className="flex items-center gap-2">
          <input
            name="published"
            type="checkbox"
            value="true"
            className="h-4 w-4 rounded border-zinc-300"
          />
          <span className="text-sm">Publish immediately</span>
        </label>

        {error && !error.field && (
          <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
        )}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
          <Link
            href="/dashboard/pages"
            className="rounded-md border border-zinc-300 px-4 py-2.5 text-center text-sm hover:bg-zinc-50 sm:py-2 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 sm:py-2 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {pending ? "Saving…" : "Create page"}
          </button>
        </div>
      </form>
    </div>
  );
}
