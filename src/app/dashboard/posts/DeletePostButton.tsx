"use client";

import ConfirmDelete from "@/components/ui/ConfirmDelete";

export default function DeletePostButton({
  postId,
  postTitle,
}: {
  postId: string;
  postTitle: string;
}) {
  return (
    <ConfirmDelete
      action={`/api/posts/${postId}`}
      itemName={postTitle}
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
