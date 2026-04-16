import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  return session;
}

export async function requireMembership() {
  const session = await requireSession();
  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    include: { tenant: true },
    orderBy: { createdAt: "asc" },
  });
  if (!membership) redirect("/sign-up");
  return { session, membership, tenant: membership.tenant };
}

const RESERVED_SLUGS = new Set([
  "www", "api", "admin", "dashboard", "sign-in", "sign-up",
  "_sites", "_next", "static", "public", "app", "voyagr", "mail",
  "ftp", "blog", "docs", "help", "support", "status", "auth",
  "assets", "cdn", "img", "images", "files",
]);

const TENANT_SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/;

export function validateTenantSlug(slug: string): string | null {
  if (!slug) return "Subdomain is required";
  if (slug.length < 3) return "Subdomain must be at least 3 characters";
  if (slug.length > 32) return "Subdomain must be at most 32 characters";
  if (!TENANT_SLUG_RE.test(slug)) {
    return "Use lowercase letters, numbers, and hyphens (no leading or trailing hyphen)";
  }
  if (RESERVED_SLUGS.has(slug)) return "That subdomain is reserved";
  return null;
}

const PAGE_SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

export function validatePageSlug(slug: string): string | null {
  if (!slug) return "Slug is required";
  if (!PAGE_SLUG_RE.test(slug)) {
    return "Use lowercase letters, numbers, and hyphens";
  }
  return null;
}
