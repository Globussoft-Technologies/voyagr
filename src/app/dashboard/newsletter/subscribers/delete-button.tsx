"use client";

import { useRouter } from "next/navigation";
import ConfirmDelete from "@/components/ui/ConfirmDelete";

export function DeleteSubscriberButton({ id }: { id: string }) {
  const router = useRouter();

  return (
    <ConfirmDelete
      action={`/api/newsletter/subscribers/${id}`}
      itemName="this subscriber"
      onDeleted={() => router.refresh()}
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
