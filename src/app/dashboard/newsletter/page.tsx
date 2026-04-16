import Link from "next/link";
import { requireMembership } from "@/lib/tenant";
import { db } from "@/lib/db";

export default async function NewsletterDashboard() {
  const { tenant } = await requireMembership();

  const [subscriberCount, newsletters] = await Promise.all([
    db.subscriber.count({
      where: { tenantId: tenant.id, status: "active" },
    }),
    db.newsletter.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Newsletter</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/newsletter/subscribers"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Manage subscribers
          </Link>
          <Link
            href="/dashboard/newsletter/new"
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            + New campaign
          </Link>
        </div>
      </div>

      {/* Subscriber summary */}
      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Active subscribers</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">{subscriberCount}</p>
      </div>

      {/* Campaigns table */}
      <h2 className="mt-8 text-lg font-semibold tracking-tight">Campaigns</h2>

      {newsletters.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-950">
          <p className="text-zinc-600 dark:text-zinc-400">No campaigns yet.</p>
          <Link
            href="/dashboard/newsletter/new"
            className="mt-3 inline-block text-sm font-medium underline"
          >
            Create your first campaign
          </Link>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Sent</th>
                <th className="px-4 py-3">Sent at</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {newsletters.map((n) => (
                <tr
                  key={n.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                >
                  <td className="px-4 py-3 font-medium">{n.subject}</td>
                  <td className="px-4 py-3">
                    {n.status === "sent" ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                        Sent
                      </span>
                    ) : n.status === "sending" ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                        Sending
                      </span>
                    ) : (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{n.sentCount}</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {n.sentAt
                      ? new Date(n.sentAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {n.status === "draft" && (
                      <Link
                        href={`/dashboard/newsletter/${n.id}/edit`}
                        className="mr-3 text-xs text-zinc-600 hover:underline dark:text-zinc-400"
                      >
                        Edit
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
