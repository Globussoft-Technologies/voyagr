"use client";

interface SharePreviewProps {
  title: string;
  description: string;
  image?: string;
  url: string;
}

export default function SharePreview({
  title,
  description,
  image,
  url,
}: SharePreviewProps) {
  const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const truncatedTitle = title.length > 60 ? title.slice(0, 60) + "..." : title;
  const truncatedDesc =
    description.length > 160 ? description.slice(0, 160) + "..." : description;

  return (
    <div className="space-y-6">
      {/* Google Search Result Preview */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Google Search Preview
        </p>
        <div className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {displayUrl}
          </p>
          <p className="mt-0.5 text-lg text-blue-700 dark:text-blue-400">
            {truncatedTitle || "Page Title"}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {truncatedDesc || "Page description will appear here..."}
          </p>
        </div>
      </div>

      {/* Social Card Preview */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Social Card Preview
        </p>
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          {image ? (
            <div className="aspect-[1.91/1] w-full bg-zinc-100 dark:bg-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="OG preview"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[1.91/1] w-full items-center justify-center bg-zinc-100 text-sm text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              No image set
            </div>
          )}
          <div className="border-t border-zinc-200 p-3 dark:border-zinc-700">
            <p className="text-xs uppercase text-zinc-500 dark:text-zinc-400">
              {displayUrl}
            </p>
            <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
              {truncatedTitle || "Page Title"}
            </p>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              {truncatedDesc || "Page description will appear here..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
