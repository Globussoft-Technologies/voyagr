import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { validatePageSlug } from "@/lib/tenant";

const UpdatePostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().transform((v) => v.toLowerCase().trim()),
  excerpt: z.string().max(1000).optional().default(""),
  content: z.string().max(100_000).optional().default(""),
  featuredImage: z.string().max(500).optional().default(""),
  metaTitle: z.string().max(200).optional().default(""),
  metaDesc: z.string().max(500).optional().default(""),
  published: z.preprocess(
    (v) => v === "on" || v === "true" || v === true,
    z.boolean(),
  ),
  categoryIds: z.array(z.string()).optional().default([]),
  tagIds: z.array(z.string()).optional().default([]),
});

async function getMembershipAndPost(postId: string, userId: string) {
  const membership = await db.membership.findFirst({
    where: { userId },
    include: { tenant: true },
    orderBy: { createdAt: "asc" },
  });
  if (!membership) return { membership: null, post: null };

  const post = await db.post.findFirst({
    where: { id: postId, tenantId: membership.tenant.id },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      author: { select: { id: true, name: true, email: true } },
    },
  });

  return { membership, post };
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
  const { membership, post } = await getMembershipAndPost(id, session.user.id);
  if (!membership) {
    return NextResponse.json({ error: "No workspace found" }, { status: 403 });
  }
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
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
  const { membership, post } = await getMembershipAndPost(id, session.user.id);
  if (!membership) {
    return NextResponse.json({ error: "No workspace found" }, { status: 403 });
  }
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = UpdatePostSchema.safeParse(body);
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
    // Delete old category/tag relations and create new ones in a transaction
    const updated = await db.$transaction(async (tx) => {
      await tx.postCategory.deleteMany({ where: { postId: post.id } });
      await tx.postTag.deleteMany({ where: { postId: post.id } });

      // If transitioning from draft to published and no publishedAt, set it
      const publishedAt =
        parsed.data.published && !post.published
          ? new Date()
          : post.publishedAt;

      return tx.post.update({
        where: { id: post.id },
        data: {
          title: parsed.data.title,
          slug: parsed.data.slug,
          excerpt: parsed.data.excerpt || null,
          content: parsed.data.content,
          featuredImage: parsed.data.featuredImage || null,
          metaTitle: parsed.data.metaTitle || null,
          metaDesc: parsed.data.metaDesc || null,
          published: parsed.data.published,
          publishedAt,
          categories: {
            create: parsed.data.categoryIds.map((categoryId) => ({
              categoryId,
            })),
          },
          tags: {
            create: parsed.data.tagIds.map((tagId) => ({ tagId })),
          },
        },
      });
    });

    return NextResponse.json({ ok: true, id: updated.id });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A post with that slug already exists", field: "slug" },
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

  await db.post.deleteMany({
    where: { id, tenantId: membership.tenant.id },
  });

  return NextResponse.json({ ok: true });
}
