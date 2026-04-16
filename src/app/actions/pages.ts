"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { requireMembership, validatePageSlug } from "@/lib/tenant";

const CreatePageSchema = z.object({
  slug: z.string().transform((v) => v.toLowerCase().trim()),
  title: z.string().min(1).max(200),
  content: z.string().max(50_000),
  published: z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean()),
});

export type CreatePageResult =
  | { ok: true; id: string }
  | { ok: false; error: string; field?: string };

export async function createPageAction(
  _prev: CreatePageResult | null,
  formData: FormData,
): Promise<CreatePageResult> {
  console.log("[createPageAction] entered");
  const { tenant } = await requireMembership();
  console.log("[createPageAction] tenant=", tenant.slug);
  const parsed = CreatePageSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    content: formData.get("content") ?? "",
    published: formData.get("published") ?? "false",
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    console.log("[createPageAction] validation failed", issue);
    return {
      ok: false,
      error: issue?.message ?? "Invalid input",
      field: issue?.path[0]?.toString(),
    };
  }
  const slugError = validatePageSlug(parsed.data.slug);
  if (slugError) {
    console.log("[createPageAction] slug invalid", slugError);
    return { ok: false, error: slugError, field: "slug" };
  }

  let id: string;
  try {
    const page = await db.page.create({
      data: {
        tenantId: tenant.id,
        slug: parsed.data.slug,
        title: parsed.data.title,
        content: parsed.data.content,
        published: parsed.data.published,
      },
    });
    id = page.id;
    console.log("[createPageAction] created page id=", id);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      console.log("[createPageAction] unique violation");
      return {
        ok: false,
        error: "A page with that slug already exists",
        field: "slug",
      };
    }
    console.log("[createPageAction] db error", e);
    throw e;
  }

  console.log("[createPageAction] revalidate + redirect /dashboard/pages");
  revalidatePath("/dashboard/pages");
  redirect("/dashboard/pages");
}

export async function deletePageAction(formData: FormData) {
  const { tenant } = await requireMembership();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await db.page.deleteMany({ where: { id, tenantId: tenant.id } });
  revalidatePath("/dashboard/pages");
}
