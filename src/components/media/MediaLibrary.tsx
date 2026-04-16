"use client";

import { useCallback, useEffect, useState } from "react";
import MediaUploadButton from "./MediaUploadButton";

interface MediaItem {
  id: string;
  url: string;
  alt: string | null;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface MediaLibraryProps {
  onSelect?: (media: { id: string; url: string; alt: string | null }) => void;
  selectable?: boolean;
}

export default function MediaLibrary({ onSelect, selectable = false }: MediaLibraryProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMedia = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?page=${p}&limit=20`);
      const data = await res.json();
      if (data.ok) {
        setMedia(data.media);
        setPagination(data.pagination);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia(page);
  }, [page, fetchMedia]);

  function handleSelect(item: MediaItem) {
    if (selectable && onSelect) {
      setSelectedId(item.id);
      onSelect({ id: item.id, url: item.url, alt: item.alt });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  function handleUploaded(uploaded: { id: string; url: string; alt: string | null }) {
    // Refresh current page to show new upload
    fetchMedia(1);
    setPage(1);
    if (selectable && onSelect) {
      setSelectedId(uploaded.id);
      onSelect(uploaded);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-100">Media Library</h2>
        <MediaUploadButton onUploaded={handleUploaded} />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
        </div>
      ) : media.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-700 py-12 text-center text-sm text-zinc-500">
          No images yet. Upload one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {media.map((item) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-lg border bg-zinc-900 transition-colors ${
                selectedId === item.id
                  ? "border-blue-500 ring-2 ring-blue-500/30"
                  : "border-zinc-800 hover:border-zinc-600"
              }`}
            >
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="block aspect-square w-full cursor-pointer"
                disabled={!selectable}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.alt ?? item.originalName}
                  className="h-full w-full object-cover"
                />
              </button>

              {/* Overlay with info + delete */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="truncate text-xs text-zinc-300">
                  {item.originalName}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  disabled={deletingId === item.id}
                  className="ml-1 shrink-0 rounded bg-red-600/80 px-1.5 py-0.5 text-xs text-white hover:bg-red-500 disabled:opacity-50"
                >
                  {deletingId === item.id ? "..." : "Del"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300 hover:bg-zinc-700 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-zinc-400">
            {page} / {pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300 hover:bg-zinc-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
