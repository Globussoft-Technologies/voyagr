"use client";

import { useRef, useState } from "react";

interface MediaItem {
  id: string;
  url: string;
  alt: string | null;
}

interface MediaUploadButtonProps {
  onUploaded: (media: MediaItem) => void;
}

export default function MediaUploadButton({ onUploaded }: MediaUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/media", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      setStatus("idle");
      onUploaded(data.media);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }

    // Reset input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        disabled={status === "uploading"}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-700 disabled:opacity-50 transition-colors"
      >
        {status === "uploading" ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
            Uploading...
          </>
        ) : (
          "Upload Image"
        )}
      </button>
      {status === "error" && error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
