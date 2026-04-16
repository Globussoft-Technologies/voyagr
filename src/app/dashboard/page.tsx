import Link from "next/link";
import { redirect } from "next/navigation";
import { requireMembership } from "@/lib/tenant";
import { db } from "@/lib/db";

export default async function DashboardHome() {
  const { tenant } = await requireMembership();

  if (!tenant.onboardingCompleted) redirect("/dashboard/onboarding");
  const [pageCount, publishedCount] = await Promise.all([
    db.page.count({ where: { tenantId: tenant.id } }),
    db.page.count({ where: { tenantId: tenant.id, published: true } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Here&apos;s what&apos;s happening with {tenant.name}.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Total pages" value={pageCount} />
        <Stat label="Published" value={publishedCount} />
        <Stat label="Drafts" value={pageCount - publishedCount} />
      </div>

      <div className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-medium">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/pages/new"
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            + New page
          </Link>
          <Link
            href="/dashboard/pages"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Manage pages
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-sm text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
