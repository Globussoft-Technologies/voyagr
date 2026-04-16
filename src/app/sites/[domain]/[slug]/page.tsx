import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getTemplateComponents } from "@/themes";
import { sanitizeHtml } from "@/lib/sanitize";

export const revalidate = 60;

export default async function TenantPage({
  params,
}: {
  params: Promise<{ domain: string; slug: string }>;
}) {
  const { domain, slug } = await params;
  const tenant = await db.tenant.findUnique({ where: { slug: domain } });
  if (!tenant) notFound();

  const page = await db.page.findFirst({
    where: { tenantId: tenant.id, slug, published: true },
  });
  if (!page) notFound();

  const { PageLayout } = await getTemplateComponents(tenant.themeKey);

  return (
    <PageLayout title={page.title}>
      <div
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content) }}
      />
    </PageLayout>
  );
}
