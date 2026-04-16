"use client";

import { useState } from "react";
import SharePreview from "./SharePreview";

interface SeoFieldsProps {
  metaTitle: string;
  metaDesc: string;
  ogImage: string;
  onChange: (field: "metaTitle" | "metaDesc" | "ogImage", value: string) => void;
  previewUrl?: string;
}

export default function SeoFields({
  metaTitle,
  metaDesc,
  ogImage,
  onChange,
  previewUrl = "https://example.com",
}: SeoFieldsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-700">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        <span>SEO Settings</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="space-y-4 border-t border-zinc-200 px-4 py-4 dark:border-zinc-700">
          {/* Meta Title */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Meta Title
              </label>
              <span
                className={`text-xs ${
                  metaTitle.length > 60
                    ? "text-red-500"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {metaTitle.length}/60
              </span>
            </div>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => onChange("metaTitle", e.target.value)}
              placeholder="Page title for search engines"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          {/* Meta Description */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Meta Description
              </label>
              <span
                className={`text-xs ${
                  metaDesc.length > 160
                    ? "text-red-500"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {metaDesc.length}/160
              </span>
            </div>
            <textarea
              value={metaDesc}
              onChange={(e) => onChange("metaDesc", e.target.value)}
              placeholder="Brief description for search results"
              rows={3}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          {/* OG Image URL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              OG Image URL
            </label>
            <input
              type="url"
              value={ogImage}
              onChange={(e) => onChange("ogImage", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          {/* Live Preview */}
          <div className="pt-2">
            <SharePreview
              title={metaTitle}
              description={metaDesc}
              image={ogImage || undefined}
              url={previewUrl}
            />
          </div>
        </div>
      )}
    </div>
  );
}
