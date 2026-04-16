import Link from "next/link";
import { requireMembership } from "@/lib/tenant";

const sections = [
  {
    title: "Navigation",
    description: "Manage your site's menu links and ordering.",
    href: "/dashboard/settings/navigation",
  },
  {
    title: "Theme",
    description: "Customize colors, fonts, and layout for your site.",
    href: "/dashboard/settings/theme",
  },
  {
    title: "SEO Defaults",
    description: "Set default meta titles, descriptions, and social images.",
    href: "/dashboard/settings/seo",
  },
];

export default async function SettingsPage() {
  await requireMembership();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Configure your site settings.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
          >
            <h2 className="font-medium">{s.title}</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {s.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
