"use client";

import { useState, useCallback } from "react";

interface ConfirmDeleteProps {
  action: string;
  itemName: string;
  children: React.ReactNode;
  onDeleted?: () => void;
}

export default function ConfirmDelete({
  action,
  itemName,
  children,
  onDeleted,
}: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleTriggerClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    },
    [],
  );

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(action, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setOpen(false);
        if (onDeleted) {
          onDeleted();
        } else {
          window.location.reload();
        }
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <span onClick={handleTriggerClick} className="inline">{children}</span>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => !deleting && setOpen(false)}
          />

          {/* Card */}
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Confirm deletion
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Are you sure you want to delete {itemName}? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setOpen(false)}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
