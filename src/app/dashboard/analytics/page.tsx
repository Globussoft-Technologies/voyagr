import Link from "next/link";
import { requireMembership } from "@/lib/tenant";
import { db } from "@/lib/db";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { tenant } = await requireMembership();
  const { period: periodParam } = await searchParams;

  const period = periodParam === "7d" ? "7d" : periodParam === "90d" ? "90d" : "30d";
  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const tenantId = tenant.id;

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

  const maxDayCount = Math.max(...viewsByDay.map((d) => d.count), 1);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Page views for {tenant.name}
          </p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((p) => (
            <Link
              key={p}
              href={`/dashboard/analytics?period=${p}`}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                period === p
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "border border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              }`}
            >
              {p === "7d" ? "7 days" : p === "30d" ? "30 days" : "90 days"}
            </Link>
          ))}
        </div>
      </div>

      {/* Total views */}
      <div className="mt-8">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Total page views</div>
          <div className="mt-1 text-4xl font-semibold tracking-tight">{totalViews.toLocaleString()}</div>
        </div>
      </div>

      {/* Views chart */}
      {viewsByDay.length > 0 && (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-medium mb-4">Views by day</h2>
          <div className="flex items-end gap-1" style={{ height: 200 }}>
            {viewsByDay.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-zinc-400">{day.count}</span>
                <div
                  className="w-full rounded-t bg-zinc-900 dark:bg-white transition-all"
                  style={{
                    height: `${Math.max((day.count / maxDayCount) * 160, 2)}px`,
                  }}
                />
                <span className="text-[9px] text-zinc-400 rotate-[-45deg] origin-top-left whitespace-nowrap mt-1">
                  {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Top pages */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-medium mb-4">Top pages</h2>
          {topPages.length === 0 ? (
            <p className="text-sm text-zinc-500">No data yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="text-left pb-2 font-medium text-zinc-500 dark:text-zinc-400">Path</th>
                  <th className="text-right pb-2 font-medium text-zinc-500 dark:text-zinc-400">Views</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((p) => (
                  <tr key={p.path} className="border-b border-zinc-50 dark:border-zinc-900">
                    <td className="py-2 font-mono text-xs">{p.path}</td>
                    <td className="py-2 text-right tabular-nums">{p.count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top referrers */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-medium mb-4">Top referrers</h2>
          {referrers.length === 0 ? (
            <p className="text-sm text-zinc-500">No data yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="text-left pb-2 font-medium text-zinc-500 dark:text-zinc-400">Referrer</th>
                  <th className="text-right pb-2 font-medium text-zinc-500 dark:text-zinc-400">Views</th>
                </tr>
              </thead>
              <tbody>
                {referrers.map((r) => (
                  <tr key={r.referrer} className="border-b border-zinc-50 dark:border-zinc-900">
                    <td className="py-2 font-mono text-xs truncate max-w-[200px]">{r.referrer}</td>
                    <td className="py-2 text-right tabular-nums">{r.count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
