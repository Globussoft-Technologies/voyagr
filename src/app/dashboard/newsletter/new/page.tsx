"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCampaign() {
  const router = useRouter();
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const body = {
      subject: form.get("subject"),
      content: form.get("content"),
    };
    try {
      const res = await fetch("/api/newsletter/campaigns", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setError({ message: data.error ?? "Something went wrong", field: data.field });
        return;
      }
      router.push("/dashboard/newsletter");
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
        href="/dashboard/newsletter"
        className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        &larr; Back to newsletter
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        New campaign
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <label className="block">
          <span className="block text-sm font-medium">Subject *</span>
          <input
            name="subject"
            type="text"
            required
            placeholder="Your newsletter subject line"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:focus:ring-zinc-200"
          />
          {fieldError("subject") && (
            <span className="mt-1 block text-xs text-red-600">
              {fieldError("subject")}
            </span>
          )}
        </label>

        <label className="block">
          <span className="block text-sm font-medium">Content (HTML) *</span>
          <textarea
            name="content"
            rows={16}
            required
            placeholder="Write your newsletter content here. HTML is supported."
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:focus:ring-zinc-200"
          />
          {fieldError("content") && (
            <span className="mt-1 block text-xs text-red-600">
              {fieldError("content")}
            </span>
          )}
        </label>

        {error && !error.field && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {error.message}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/dashboard/newsletter"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {pending ? "Saving..." : "Save as draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
