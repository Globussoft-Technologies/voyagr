import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { validatePageSlug } from "@/lib/tenant";

const UpdatePageSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().transform((v) => v.toLowerCase().trim()),
  content: z.string().max(50_000),
  metaTitle: z.string().max(200).optional().default(""),
  metaDesc: z.string().max(500).optional().default(""),
  ogImage: z.string().max(500).optional().default(""),
  published: z.preprocess(
    (v) => v === "on" || v === "true" || v === true,
    z.boolean(),
  ),
});

async function getMembershipAndPage(
  pageId: string,
  userId: string,
) {
  const membership = await db.membership.findFirst({
    where: { userId },
    include: { tenant: true },
    orderBy: { createdAt: "asc" },
  });
  if (!membership) return { membership: null, page: null };

  const page = await db.page.findFirst({
    where: { id: pageId, tenantId: membership.tenant.id },
  });

  return { membership, page };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const { membership, page } = await getMembershipAndPage(id, session.user.id);
  if (!membership) {
    return NextResponse.json({ error: "No workspace found" }, { status: 403 });
  }
  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json(page);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const { membership, page } = await getMembershipAndPage(id, session.user.id);
  if (!membership) {
    return NextResponse.json({ error: "No workspace found" }, { status: 403 });
  }
  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = UpdatePageSchema.safeParse(body);
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
    const updated = await db.page.update({
      where: { id: page.id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        content: parsed.data.content,
        metaTitle: parsed.data.metaTitle || null,
        metaDesc: parsed.data.metaDesc || null,
        ogImage: parsed.data.ogImage || null,
        published: parsed.data.published,
      },
    });
    return NextResponse.json({ ok: true, id: updated.id });
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    include: { tenant: true },
    orderBy: { createdAt: "asc" },
  });
  if (!membership) {
    return NextResponse.json({ error: "No workspace found" }, { status: 403 });
  }

  await db.page.deleteMany({
    where: { id, tenantId: membership.tenant.id },
  });

  return NextResponse.json({ ok: true });
}
