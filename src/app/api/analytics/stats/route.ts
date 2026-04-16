import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

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

  const period = req.nextUrl.searchParams.get("period") || "30d";
  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const tenantId = membership.tenant.id;

  // Total views
  const totalViews = await db.pageView.count({
    where: { tenantId, createdAt: { gte: since } },
  });

  // Views by day
  const viewsByDayRaw = await db.$queryRaw<
    { date: string; count: bigint }[]
  >`SELECT DATE(createdAt) as date, COUNT(*) as count
    FROM PageView
    WHERE tenantId = ${tenantId} AND createdAt >= ${since}
    GROUP BY DATE(createdAt)
    ORDER BY date ASC`;

  const viewsByDay = viewsByDayRaw.map((r) => ({
    date: String(r.date),
    count: Number(r.count),
  }));

  // Top pages
  const topPagesRaw = await db.$queryRaw<
    { path: string; count: bigint }[]
  >`SELECT path, COUNT(*) as count
    FROM PageView
    WHERE tenantId = ${tenantId} AND createdAt >= ${since}
    GROUP BY path
    ORDER BY count DESC
    LIMIT 10`;

  const topPages = topPagesRaw.map((r) => ({
    path: r.path,
    count: Number(r.count),
  }));

  // Top referrers
  const referrersRaw = await db.$queryRaw<
    { referrer: string; count: bigint }[]
  >`SELECT referrer, COUNT(*) as count
    FROM PageView
    WHERE tenantId = ${tenantId} AND createdAt >= ${since} AND referrer IS NOT NULL AND referrer != ''
    GROUP BY referrer
    ORDER BY count DESC
    LIMIT 10`;

  const referrers = referrersRaw.map((r) => ({
    referrer: r.referrer,
    count: Number(r.count),
  }));

  return NextResponse.json({ totalViews, viewsByDay, topPages, referrers });
}
