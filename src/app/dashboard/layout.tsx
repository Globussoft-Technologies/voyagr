import Link from "next/link";
import { requireMembership } from "@/lib/tenant";
import { signOutAction } from "@/app/actions/auth";
import { ROOT_DOMAIN } from "@/lib/domain";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tenant, session } = await requireMembership();
  const protocol =
    ROOT_DOMAIN.includes("localhost") || ROOT_DOMAIN.includes("lvh.me")
      ? "http"
      : "https";
  const liveUrl = `${protocol}://${tenant.slug}.${ROOT_DOMAIN}`;

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/dashboard" className="shrink-0 text-lg font-semibold tracking-tight">
              Voyagr
            </Link>
            <nav className="scrollbar-hide flex flex-nowrap items-center gap-4 overflow-x-auto text-sm">
              <Link href="/dashboard" className="whitespace-nowrap text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                Overview
              </Link>
              <Link href="/dashboard/pages" className="whitespace-nowrap text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                Pages
              </Link>
              <Link href="/dashboard/posts" className="whitespace-nowrap text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                Blog Posts
              </Link>
              <Link href="/dashboard/media" className="whitespace-nowrap text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                Media
              </Link>
              <Link href="/dashboard/newsletter" className="whitespace-nowrap text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                Newsletter
              </Link>
              <Link href="/dashboard/team" className="whitespace-nowrap text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                Team
              </Link>
              <Link href="/dashboard/analytics" className="whitespace-nowrap text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                Analytics
              </Link>
              <Link href="/dashboard/settings" className="whitespace-nowrap text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm md:gap-4">
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="whitespace-nowrap text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              View site ↗
            </a>
            <span className="hidden text-zinc-400 md:inline">|</span>
            <span className="hidden text-zinc-700 dark:text-zinc-300 sm:inline">{session.user.email}</span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-md border border-zinc-300 px-3 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-3 text-xs text-zinc-500 sm:px-6 dark:text-zinc-400">
          Workspace: <span className="font-medium text-zinc-700 dark:text-zinc-300">{tenant.name}</span>
          {" · "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-900">{tenant.slug}.{ROOT_DOMAIN}</code>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
