import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";

export const revalidate = 60;

const POSTS_PER_PAGE = 10;

export default async function BlogListing({
  params,
  searchParams,
}: {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { domain } = await params;
  const { page: pageParam } = await searchParams;

  const tenant = await db.tenant.findUnique({ where: { slug: domain } });
  if (!tenant) notFound();

  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const skip = (currentPage - 1) * POSTS_PER_PAGE;

  const [posts, totalCount] = await Promise.all([
    db.post.findMany({
      where: { tenantId: tenant.id, published: true },
      orderBy: { publishedAt: "desc" },
      skip,
      take: POSTS_PER_PAGE,
      include: {
        categories: { include: { category: true } },
      },
    }),
    db.post.count({
      where: { tenantId: tenant.id, published: true },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <section className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-14">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--theme-accent)" }}
          >
            Our Blog
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{
              color: "var(--theme-text)",
              fontFamily: "var(--theme-font-heading)",
            }}
          >
            Stories &amp; Travel Inspiration
          </h1>
          <p className="mt-4 text-lg opacity-60 max-w-2xl" style={{ color: "var(--theme-text)" }}>
            Guides, stories, and inspiration to fuel your next adventure.
          </p>
          <div
            className="mt-6 w-20 h-1 rounded-full"
            style={{ backgroundColor: "var(--theme-primary)" }}
          />
        </div>

        {posts.length === 0 ? (
          <p className="mt-12 text-lg opacity-50" style={{ color: "var(--theme-text)" }}>
            No posts yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                style={{ backgroundColor: "var(--theme-background)" }}
              >
                {post.featuredImage ? (
                  <Link href={`/blog/${post.slug}`} className="block aspect-16/10 overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </Link>
                ) : (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex aspect-16/10 items-center justify-center"
                    style={{ backgroundColor: "var(--theme-primary)", opacity: 0.1 }}
                  >
                    <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </Link>
                )}
                <div className="p-6">
                  {post.categories.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {post.categories.map(({ category }) => (
                        <span
                          key={category.id}
                          className="rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300"
                          style={{
                            backgroundColor: "var(--theme-accent)",
                            color: "var(--theme-primary)",
                          }}
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link href={`/blog/${post.slug}`}>
                    <h2
                      className="text-lg font-bold leading-snug underline-offset-4 group-hover:underline"
                      style={{
                        color: "var(--theme-text)",
                        fontFamily: "var(--theme-font-heading)",
                      }}
                    >
                      {post.title}
                    </h2>
                  </Link>
                  {post.excerpt && (
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed opacity-60" style={{ color: "var(--theme-text)" }}>
                      {post.excerpt}
                    </p>
                  )}
                  {post.publishedAt && (
                    <div className="mt-4 flex items-center justify-between">
                      <time className="text-xs opacity-40" style={{ color: "var(--theme-text)" }}>
                        {post.publishedAt.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <span
                        className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ color: "var(--theme-primary)" }}
                      >
                        Read more &rarr;
                      </span>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-16 flex items-center justify-center gap-3">
            {currentPage > 1 && (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:shadow-md"
                style={{
                  border: "2px solid var(--theme-primary)",
                  color: "var(--theme-primary)",
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Link>
            )}
            <span className="px-4 text-sm opacity-50" style={{ color: "var(--theme-text)" }}>
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-md hover:opacity-90"
                style={{ backgroundColor: "var(--theme-primary)" }}
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
