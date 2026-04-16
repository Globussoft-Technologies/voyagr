import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id || !["page", "post"].includes(type)) {
    return NextResponse.json(
      { error: "Missing or invalid type/id" },
      { status: 400 },
    );
  }

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    include: { tenant: true },
    orderBy: { createdAt: "asc" },
  });
  if (!membership) {
    return NextResponse.json({ error: "No workspace found" }, { status: 403 });
  }

  const tenantId = membership.tenant.id;

  if (type === "page") {
    const page = await db.page.findFirst({
      where: { id, tenantId },
    });
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    return NextResponse.json({
      title: page.title,
      content: page.content,
      slug: page.slug,
      published: page.published,
    });
  }

  // type === "post"
  const post = await db.post.findFirst({
    where: { id, tenantId },
  });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json({
    title: post.title,
    content: post.content,
    slug: post.slug,
    published: post.published,
  });
}
