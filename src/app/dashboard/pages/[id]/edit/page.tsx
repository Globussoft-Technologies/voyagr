"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RichEditor from "@/components/editor/RichEditor";

interface PageData {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string | null;
  metaDesc: string | null;
  ogImage: string | null;
  published: boolean;
}

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<PageData | null>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/pages/${id}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          const data = await res.json();
          setError({ message: data.error ?? "Failed to load page" });
          return;
        }
        const pageData = await res.json();
        setPage(pageData);
        setContent(pageData.content ?? "");
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
      title: form.get("title"),
      slug: form.get("slug"),
      content: content,
      metaTitle: form.get("metaTitle") ?? "",
      metaDesc: form.get("metaDesc") ?? "",
      ogImage: form.get("ogImage") ?? "",
      published: form.get("published") === "true",
    };
    try {
      const res = await fetch(`/api/pages/${id}`, {
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

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-red-600">{error?.message ?? "Page not found"}</p>
        <Link
          href="/dashboard/pages"
          className="mt-3 inline-block text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Back to pages
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/pages"
        className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        &larr; Back to pages
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Edit page</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <label className="block">
          <span className="block text-sm font-medium">Title *</span>
          <input
            name="title"
            type="text"
            required
            defaultValue={page.title}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:focus:ring-zinc-200"
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
            defaultValue={page.slug}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:focus:ring-zinc-200"
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
          {fieldError("content") && (
            <span className="mt-1 block text-xs text-red-600">{fieldError("content")}</span>
          )}
        </div>

        <label className="block">
          <span className="block text-sm font-medium">Meta title</span>
          <input
            name="metaTitle"
            type="text"
            defaultValue={page.metaTitle ?? ""}
            placeholder="SEO title (optional)"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:focus:ring-zinc-200"
          />
          {fieldError("metaTitle") && (
            <span className="mt-1 block text-xs text-red-600">{fieldError("metaTitle")}</span>
          )}
        </label>

        <label className="block">
          <span className="block text-sm font-medium">Meta description</span>
          <textarea
            name="metaDesc"
            rows={2}
            defaultValue={page.metaDesc ?? ""}
            placeholder="SEO description (optional)"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:focus:ring-zinc-200"
          />
          {fieldError("metaDesc") && (
            <span className="mt-1 block text-xs text-red-600">{fieldError("metaDesc")}</span>
          )}
        </label>

        <label className="flex items-center gap-2">
          <input
            name="published"
            type="checkbox"
            value="true"
            defaultChecked={page.published}
            className="h-4 w-4 rounded border-zinc-300"
          />
          <span className="text-sm">Published</span>
        </label>

        {error && !error.field && (
          <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/dashboard/pages"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Cancel
          </Link>
          <a
            href={`/dashboard/preview?type=page&id=${id}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Preview
          </a>
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {pending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
