import Link from "next/link";
import { requireMembership } from "@/lib/tenant";
import { db } from "@/lib/db";
import { ROOT_DOMAIN } from "@/lib/domain";
import DeletePageButton from "./DeletePageButton";

export default async function PagesList() {
  const { tenant } = await requireMembership();
  const pages = await db.page.findMany({
    where: { tenantId: tenant.id },
    orderBy: { updatedAt: "desc" },
  });
  const protocol =
    ROOT_DOMAIN.includes("localhost") || ROOT_DOMAIN.includes("lvh.me")
      ? "http"
      : "https";
  const tenantBase = `${protocol}://${tenant.slug}.${ROOT_DOMAIN}`;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Pages</h1>
        <Link
          href="/dashboard/pages/new"
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          + New page
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-950">
          <p className="text-zinc-600 dark:text-zinc-400">No pages yet.</p>
          <Link
            href="/dashboard/pages/new"
            className="mt-3 inline-block text-sm font-medium underline"
          >
            Create your first page
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                >
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`${tenantBase}/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      /{p.slug}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/pages/${p.id}/edit`}
                      className="text-xs text-zinc-600 hover:underline dark:text-zinc-400 mr-3"
                    >
                      Edit
                    </Link>
                    <DeletePageButton pageId={p.id} pageTitle={p.title} />
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
