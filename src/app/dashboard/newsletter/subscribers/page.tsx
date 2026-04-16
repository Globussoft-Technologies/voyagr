import Link from "next/link";
import { requireMembership } from "@/lib/tenant";
import { db } from "@/lib/db";
import { DeleteSubscriberButton } from "./delete-button";

export default async function SubscribersList() {
  const { tenant } = await requireMembership();

  const subscribers = await db.subscriber.findMany({
    where: { tenantId: tenant.id },
    orderBy: { subscribedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/newsletter"
            className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            &larr; Back to newsletter
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Subscribers
          </h1>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-950">
          <p className="text-zinc-600 dark:text-zinc-400">
            No subscribers yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Subscribed</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                >
                  <td className="px-4 py-3 font-medium">{s.email}</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {s.name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {s.status === "active" ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        Unsubscribed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(s.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteSubscriberButton id={s.id} />
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
