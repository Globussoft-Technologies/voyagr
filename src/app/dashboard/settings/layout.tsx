"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsNav = [
  { label: "General", href: "/dashboard/settings" },
  { label: "Navigation", href: "/dashboard/settings/navigation" },
  { label: "Theme", href: "/dashboard/settings/theme" },
  { label: "SEO", href: "/dashboard/settings/seo" },
  { label: "Domains", href: "/dashboard/settings/domain" },
  { label: "Email", href: "/dashboard/settings/email" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6 md:flex-row md:gap-8">
      {/* Mobile: horizontal scrolling tab bar */}
      <nav className="scrollbar-hide flex gap-1 overflow-x-auto border-b border-zinc-200 pb-2 md:hidden dark:border-zinc-800">
        {settingsNav.map((item) => {
          const isActive =
            item.href === "/dashboard/settings"
              ? pathname === "/dashboard/settings"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Desktop: sidebar */}
      <aside className="hidden w-48 shrink-0 md:block">
        <nav className="flex flex-col gap-1">
          {settingsNav.map((item) => {
            const isActive =
              item.href === "/dashboard/settings"
                ? pathname === "/dashboard/settings"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
