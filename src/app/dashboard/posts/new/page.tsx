"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RichEditor from "@/components/editor/RichEditor";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewPost() {
  const router = useRouter();
  const [error, setError] = useState<{
    message: string;
    field?: string;
  } | null>(null);
  const [pending, setPending] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      slug: (form.elements.namedItem("slug") as HTMLInputElement).value,
      excerpt: (form.elements.namedItem("excerpt") as HTMLTextAreaElement)
        .value,
      content,
      featuredImage: (
        form.elements.namedItem("featuredImage") as HTMLInputElement
      ).value,
      published: (form.elements.namedItem("published") as HTMLInputElement)
        .checked,
      categoryIds: [],
      tagIds: [],
    };

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError({
          message: json.error ?? "Something went wrong",
          field: json.field,
        });
        return;
      }
      router.push("/dashboard/posts");
      router.refresh();
    } catch {
      setError({ message: "Network error — please try again" });
    } finally {
      setPending(false);
    }
  }

  const fieldError = (name: string) =>
    error?.field === name ? error.message : null;

  const inputClass =
    "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:focus:ring-zinc-200";

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/posts"
        className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        &larr; Back to posts
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">New post</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <label className="block">
          <span className="block text-sm font-medium">Title *</span>
          <input
            name="title"
            type="text"
            required
            placeholder="My first blog post"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={inputClass}
          />
          {fieldError("title") && (
            <span className="mt-1 block text-xs text-red-600">
              {fieldError("title")}
            </span>
          )}
        </label>

        <label className="block">
          <span className="block text-sm font-medium">URL slug *</span>
          <input
            name="slug"
            type="text"
            required
            placeholder="my-first-blog-post"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className={`${inputClass} font-mono`}
          />
          <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
            Lowercase letters, numbers, and hyphens.
          </span>
          {fieldError("slug") && (
            <span className="mt-1 block text-xs text-red-600">
              {fieldError("slug")}
            </span>
          )}
        </label>

        <label className="block">
          <span className="block text-sm font-medium">Excerpt</span>
          <textarea
            name="excerpt"
            rows={3}
            placeholder="A short summary of the post."
            className={inputClass}
          />
          {fieldError("excerpt") && (
            <span className="mt-1 block text-xs text-red-600">
              {fieldError("excerpt")}
            </span>
          )}
        </label>

        <div className="block">
          <span className="block text-sm font-medium">Content</span>
          <div className="mt-1">
            <RichEditor value={content} onChange={setContent} placeholder="Write your post content..." />
          </div>
          {fieldError("content") && (
            <span className="mt-1 block text-xs text-red-600">
              {fieldError("content")}
            </span>
          )}
        </div>

        <label className="block">
          <span className="block text-sm font-medium">Featured image URL</span>
          <input
            name="featuredImage"
            type="text"
            placeholder="https://example.com/image.jpg"
            className={inputClass}
          />
          {fieldError("featuredImage") && (
            <span className="mt-1 block text-xs text-red-600">
              {fieldError("featuredImage")}
            </span>
          )}
        </label>

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
          <p className="text-sm text-red-600 dark:text-red-400">
            {error.message}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/dashboard/posts"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {pending ? "Saving..." : "Create post"}
          </button>
        </div>
      </form>
    </div>
  );
}
