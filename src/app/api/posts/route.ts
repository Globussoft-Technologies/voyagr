import { NextRequest, NextResponse } from "next/server";
import { jsonOrRedirect } from "@/lib/api-helpers";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { validatePageSlug } from "@/lib/tenant";

const CreatePostSchema = z.object({
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

export async function GET(req: NextRequest) {
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

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("limit") ?? "20", 10)),
  );
  const status = url.searchParams.get("status"); // "published" | "draft" | null

  const where: Prisma.PostWhereInput = {
    tenantId: membership.tenant.id,
  };
  if (status === "published") where.published = true;
  else if (status === "draft") where.published = false;

  const [posts, total] = await Promise.all([
    db.post.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, email: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.post.count({ where }),
  ]);

  return NextResponse.json({
    posts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

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

  const body = await req.json();
  const parsed = CreatePostSchema.safeParse(body);
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
    const post = await db.post.create({
      data: {
        tenantId: membership.tenant.id,
        authorId: session.user.id,
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt || null,
        content: parsed.data.content,
        featuredImage: parsed.data.featuredImage || null,
        metaTitle: parsed.data.metaTitle || null,
        metaDesc: parsed.data.metaDesc || null,
        published: parsed.data.published,
        publishedAt:
          parsed.data.published ? new Date() : null,
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
    return jsonOrRedirect(
      req,
      { ok: true, id: post.id },
      "/dashboard/posts",
    );
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
