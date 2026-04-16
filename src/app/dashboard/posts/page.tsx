import Link from "next/link";
import { requireMembership } from "@/lib/tenant";
import { db } from "@/lib/db";
import DeletePostButton from "./DeletePostButton";

export default async function PostsList() {
  const { tenant } = await requireMembership();
  const posts = await db.post.findMany({
    where: { tenantId: tenant.id },
    include: {
      author: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
        <Link
          href="/dashboard/posts/new"
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-950">
          <p className="text-zinc-600 dark:text-zinc-400">No posts yet.</p>
          <Link
            href="/dashboard/posts/new"
            className="mt-3 inline-block text-sm font-medium underline"
          >
            Create your first post
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
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                >
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                      /{p.slug}
                    </span>
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
                    {p.publishedAt
                      ? new Date(p.publishedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {p.author.name ?? p.author.email}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/posts/${p.id}/edit`}
                      className="mr-3 text-xs text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      Edit
                    </Link>
                    <DeletePostButton postId={p.id} postTitle={p.title} />
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
