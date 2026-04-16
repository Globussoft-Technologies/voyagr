import Link from "next/link";
import { db } from "@/lib/db";

interface Props {
  tenantId: string;
}

export default async function PublicNav({ tenantId }: Props) {
  const items = await db.menuItem.findMany({
    where: { tenantId },
    orderBy: { position: "asc" },
  });

  const topLevel = items
    .filter((i) => !i.parentId)
    .sort((a, b) => a.position - b.position);

  function childrenOf(parentId: string) {
    return items
      .filter((i) => i.parentId === parentId)
      .sort((a, b) => a.position - b.position);
  }

  if (topLevel.length === 0) return null;

  return (
    <nav className="flex items-center gap-1">
      {topLevel.map((item) => {
        const children = childrenOf(item.id);
        if (children.length === 0) {
          return (
            <Link
              key={item.id}
              href={item.url}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              {item.label}
            </Link>
          );
        }

        return (
          <div key={item.id} className="group relative">
            <Link
              href={item.url}
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              {item.label}
              <svg
                className="h-3 w-3 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>
            <div className="invisible absolute left-0 top-full z-50 min-w-[180px] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg transition-all group-hover:visible dark:border-zinc-700 dark:bg-zinc-900">
              {children.map((child) => (
                <Link
                  key={child.id}
                  href={child.url}
                  className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
