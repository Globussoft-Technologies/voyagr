import { NextRequest, NextResponse } from "next/server";
import { jsonOrRedirect } from "@/lib/api-helpers";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { validatePageSlug } from "@/lib/tenant";

const CreatePageSchema = z.object({
  slug: z.string().transform((v) => v.toLowerCase().trim()),
  title: z.string().min(1).max(200),
  content: z.string().max(50_000),
  published: z.preprocess(
    (v) => v === "on" || v === "true" || v === true,
    z.boolean(),
  ),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    include: { tenant: true },
    orderBy: { createdAt: "asc" },
  });
  if (!membership) {
    return NextResponse.json({ error: "No workspace found" }, { status: 403 });
  }

  const body = await req.formData();
  const parsed = CreatePageSchema.safeParse({
    slug: body.get("slug"),
    title: body.get("title"),
    content: body.get("content") ?? "",
    published: body.get("published") ?? "false",
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "Invalid input", field: issue?.path[0] },
      { status: 422 },
    );
  }
  const slugError = validatePageSlug(parsed.data.slug);
  if (slugError) {
    return NextResponse.json(
      { error: slugError, field: "slug" },
      { status: 422 },
    );
  }

  try {
    const page = await db.page.create({
      data: {
        tenantId: membership.tenant.id,
        slug: parsed.data.slug,
        title: parsed.data.title,
        content: parsed.data.content,
        published: parsed.data.published,
      },
    });
    return jsonOrRedirect(req, { ok: true, id: page.id }, "/dashboard/pages");
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A page with that slug already exists", field: "slug" },
        { status: 409 },
      );
    }
    throw e;
  }
}
