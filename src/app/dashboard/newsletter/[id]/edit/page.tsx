"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface NewsletterData {
  id: string;
  subject: string;
  content: string;
  status: string;
}

export default function EditCampaign() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);
  const [pending, setPending] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newsletter, setNewsletter] = useState<NewsletterData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/newsletter/campaigns/${id}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          const data = await res.json();
          setError({ message: data.error ?? "Failed to load campaign" });
          return;
        }
        setNewsletter(await res.json());
      } catch {
        setError({ message: "Network error — please try again" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

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
      const res = await fetch(`/api/newsletter/campaigns/${id}`, {
        method: "PUT",
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

  async function handleSend() {
    if (!confirm("Send this newsletter to all active subscribers? This cannot be undone.")) {
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/newsletter/campaigns/${id}`, {
        method: "POST",
        body: JSON.stringify({ action: "send" }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setError({ message: data.error ?? "Failed to send" });
        return;
      }
      router.push("/dashboard/newsletter");
      router.refresh();
    } catch {
      setError({ message: "Network error — please try again" });
    } finally {
      setSending(false);
    }
  }

  const fieldError = (name: string) =>
    error?.field === name ? error.message : null;

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-red-600">
          {error?.message ?? "Campaign not found"}
        </p>
        <Link
          href="/dashboard/newsletter"
          className="mt-3 inline-block text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Back to newsletter
        </Link>
      </div>
    );
  }

  const isDraft = newsletter.status === "draft";

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/newsletter"
        className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        &larr; Back to newsletter
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        Edit campaign
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
            defaultValue={newsletter.subject}
            disabled={!isDraft}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:focus:ring-zinc-200"
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
            defaultValue={newsletter.content}
            disabled={!isDraft}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:focus:ring-zinc-200"
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
          {isDraft && (
            <>
              <button
                type="button"
                onClick={handleSend}
                disabled={sending}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send now"}
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {pending ? "Saving..." : "Save changes"}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
