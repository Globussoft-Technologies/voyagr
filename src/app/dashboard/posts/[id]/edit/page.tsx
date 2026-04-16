"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  published: boolean;
  categories: { categoryId: string }[];
  tags: { tagId: string }[];
}

export default function EditPost() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<{
    message: string;
    field?: string;
  } | null>(null);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(true);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/posts/${id}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          setError({ message: "Failed to load post" });
          setLoading(false);
          return;
        }
        const post: PostData = await res.json();
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt ?? "");
        setContent(post.content);
        setFeaturedImage(post.featuredImage ?? "");
        setMetaTitle(post.metaTitle ?? "");
        setMetaDesc(post.metaDesc ?? "");
        setPublished(post.published);
      } catch {
        setError({ message: "Network error — could not load post" });
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

    const data = {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      metaTitle,
      metaDesc,
      published,
      categoryIds: [],
      tagIds: [],
    };

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
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

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-zinc-500">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/posts"
        className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        &larr; Back to posts
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Edit post</h1>

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
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
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
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className={inputClass}
          />
          {fieldError("featuredImage") && (
            <span className="mt-1 block text-xs text-red-600">
              {fieldError("featuredImage")}
            </span>
          )}
        </label>

        <label className="block">
          <span className="block text-sm font-medium">Meta title</span>
          <input
            name="metaTitle"
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="SEO title"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium">Meta description</span>
          <textarea
            name="metaDesc"
            rows={2}
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            placeholder="SEO description"
            className={inputClass}
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            name="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300"
          />
          <span className="text-sm">Published</span>
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
          <a
            href={`/dashboard/preview?type=post&id=${id}`}
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
            {pending ? "Saving..." : "Update post"}
          </button>
        </div>
      </form>
    </div>
  );
}
