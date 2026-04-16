import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q")?.trim();
  const domain = searchParams.get("domain")?.trim();

  if (!q || !domain) {
    return NextResponse.json({ pages: [], posts: [] });
  }

  const tenant = await db.tenant.findFirst({
    where: {
      OR: [{ slug: domain }, { customDomain: domain }],
    },
  });
  if (!tenant) {
    return NextResponse.json({ pages: [], posts: [] });
  }

  const [pages, posts] = await Promise.all([
    db.page.findMany({
      where: {
        tenantId: tenant.id,
        published: true,
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
        ],
      },
      select: { id: true, slug: true, title: true, content: true },
      take: 10,
    }),
    db.post.findMany({
      where: {
        tenantId: tenant.id,
        published: true,
        OR: [
          { title: { contains: q } },
          { excerpt: { contains: q } },
          { content: { contains: q } },
        ],
      },
      select: { id: true, slug: true, title: true, excerpt: true, content: true },
      take: 10,
    }),
  ]);

  return NextResponse.json({
    pages: pages.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.content.replace(/<[^>]*>/g, "").slice(0, 100),
    })),
    posts: posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt || p.content.replace(/<[^>]*>/g, "").slice(0, 100),
    })),
  });
}
