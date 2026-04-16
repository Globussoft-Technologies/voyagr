"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireMembership } from "@/lib/tenant";

export async function deletePostAction(formData: FormData) {
  const { tenant } = await requireMembership();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await db.post.deleteMany({ where: { id, tenantId: tenant.id } });
  revalidatePath("/dashboard/posts");
}
