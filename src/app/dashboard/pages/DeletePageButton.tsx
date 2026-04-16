"use client";

import ConfirmDelete from "@/components/ui/ConfirmDelete";

export default function DeletePageButton({
  pageId,
  pageTitle,
}: {
  pageId: string;
  pageTitle: string;
}) {
  return (
    <ConfirmDelete
      action={`/api/pages/${pageId}`}
      itemName={pageTitle}
      onDeleted={() => window.location.reload()}
    >
      <button
        type="button"
        className="text-xs text-red-600 hover:underline dark:text-red-400"
      >
        Delete
      </button>
    </ConfirmDelete>
  );
}
