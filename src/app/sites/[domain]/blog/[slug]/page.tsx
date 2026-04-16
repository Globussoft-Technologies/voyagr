import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getTemplateComponents } from "@/themes";
import SocialShareButtons from "@/components/seo/SocialShareButtons";
import { sanitizeHtml } from "@/lib/sanitize";

export const revalidate = 60;

export default async function BlogPost({
  params,
}: {
  params: Promise<{ domain: string; slug: string }>;
}) {
  const { domain, slug } = await params;

  const tenant = await db.tenant.findUnique({ where: { slug: domain } });
  if (!tenant) notFound();

  const post = await db.post.findFirst({
    where: { tenantId: tenant.id, slug, published: true },
    include: {
      author: { select: { name: true } },
      categories: { include: { category: true } },
    },
  });
  if (!post) notFound();

  const { PageLayout } = await getTemplateComponents(tenant.themeKey);

  return (
    <PageLayout title={post.title}>
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        &larr; Back to blog
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
        {post.author.name && <span>By {post.author.name}</span>}
        {post.publishedAt && (
          <time dateTime={post.publishedAt.toISOString()}>
            {post.publishedAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.categories.map(({ category }) => (
              <span
                key={category.id}
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ backgroundColor: "var(--theme-accent)", color: "var(--theme-background)" }}
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {post.featuredImage && (
        <div className="mt-8 overflow-hidden rounded-xl">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-lg mt-10 max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:underline-offset-4 prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
      />

      <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm font-medium mb-4" style={{ color: "var(--theme-text)" }}>Share this article</p>
        <SocialShareButtons url={`https://${domain}.voyagr.globusdemos.com/blog/${slug}`} title={post.title} description={post.excerpt ?? ""} />
      </div>
    </PageLayout>
  );
}
