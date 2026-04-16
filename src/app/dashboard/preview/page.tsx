"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface PreviewData {
  title: string;
  content: string;
  slug: string;
  published: boolean;
}

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  const [data, setData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!type || !id) {
      setError("Missing type or id parameters");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch(
          `/api/preview?type=${encodeURIComponent(type!)}&id=${encodeURIComponent(id!)}`,
        );
        if (!res.ok) {
          const json = await res.json();
          setError(json.error ?? "Failed to load preview");
          return;
        }
        const json = await res.json();
        setData(json);
      } catch {
        setError("Network error — please try again");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [type, id]);

  const backHref =
    type === "post"
      ? `/dashboard/posts/${id}/edit`
      : `/dashboard/pages/${id}/edit`;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-zinc-500">Loading preview...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-600">{error || "Not found"}</p>
        <Link
          href={backHref}
          className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Back to editor
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Preview banner */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-amber-300 bg-amber-50 px-4 py-2 dark:border-amber-700 dark:bg-amber-950">
        <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
          PREVIEW — This content is not published
        </span>
        <Link
          href={backHref}
          className="rounded-md border border-amber-300 bg-white px-3 py-1 text-sm text-amber-800 hover:bg-amber-50 dark:border-amber-700 dark:bg-amber-900 dark:text-amber-200 dark:hover:bg-amber-800"
        >
          Back to editor
        </Link>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {data.title}
        </h1>
        {!data.published && (
          <span className="mt-2 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            Draft
          </span>
        )}
        <div
          className="prose prose-zinc mt-8 max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>
    </div>
  );
}
