import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getTheme } from "@/lib/themes/registry";
import { getTemplateComponents } from "@/themes";
import { sanitizeHtml } from "@/lib/sanitize";

export const revalidate = 60;

const DESTINATIONS = [
  {
    name: "Bali",
    slug: "bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop",
  },
  {
    name: "Maldives",
    slug: "maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop",
  },
  {
    name: "Switzerland",
    slug: "switzerland",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop",
  },
  {
    name: "Kenya",
    slug: "kenya",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop",
  },
  {
    name: "Japan",
    slug: "japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop",
  },
  {
    name: "Iceland",
    slug: "iceland",
    image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&h=600&fit=crop",
  },
];

export default async function TenantHome({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const tenant = await db.tenant.findUnique({ where: { slug: domain } });
  if (!tenant) notFound();

  const homePage = await db.page.findFirst({
    where: { tenantId: tenant.id, slug: "home", published: true },
  });

  const recentPosts = await db.post.findMany({
    where: { tenantId: tenant.id, published: true },
    orderBy: { publishedAt: "desc" },
    take: 6,
    include: { author: true },
  });

  const { HeroSection } = await getTemplateComponents(tenant.themeKey);

  return (
    <>
      {/* Hero */}
      <HeroSection
        title={`Welcome to ${tenant.name}`}
        subtitle={tenant.description ?? "Discover our trips, stories, and travel inspiration."}
      />

      {/* Featured Destinations */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: "var(--theme-accent)" }}
            >
              Featured Destinations
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold"
              style={{
                color: "var(--theme-text)",
                fontFamily: "var(--theme-font-heading)",
              }}
            >
              Where Will You Go Next?
            </h2>
            <p className="mt-4 text-lg opacity-60 max-w-2xl mx-auto" style={{ color: "var(--theme-text)" }}>
              Handpicked destinations that promise unforgettable experiences,
              from pristine beaches to mountain adventures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESTINATIONS.map((dest) => (
              <a
                key={dest.slug}
                href="/destinations"
                className="group relative aspect-4/3 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${dest.image})` }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3
                    className="text-xl font-bold text-white drop-shadow-md"
                    style={{ fontFamily: "var(--theme-font-heading)" }}
                  >
                    {dest.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-sm text-white/80 mt-1 group-hover:text-white transition-colors duration-300">
                    Discover
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* About / Why Choose Us */}
      <section
        className="py-20 md:py-24"
        style={{ backgroundColor: "var(--theme-background)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image side */}
            <div className="relative">
              <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop"
                  alt="Travel experience"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Floating accent card */}
              <div
                className="absolute -bottom-6 -right-4 lg:-right-8 rounded-xl p-5 shadow-lg"
                style={{ backgroundColor: "var(--theme-primary)", color: "white" }}
              >
                <p className="text-3xl font-bold" style={{ fontFamily: "var(--theme-font-heading)" }}>500+</p>
                <p className="text-sm opacity-80">Happy Travelers</p>
              </div>
            </div>

            {/* Text side */}
            <div>
              <p
                className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--theme-accent)" }}
              >
                Why Choose Us
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{
                  color: "var(--theme-text)",
                  fontFamily: "var(--theme-font-heading)",
                }}
              >
                Crafting Journeys That Matter
              </h2>
              {homePage ? (
                <div
                  className="prose prose-lg max-w-none mb-8 opacity-80"
                  style={{ color: "var(--theme-text)" }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(homePage.content) }}
                />
              ) : (
                <p className="text-lg leading-relaxed opacity-80 mb-8" style={{ color: "var(--theme-text)" }}>
                  We believe travel is more than just visiting places. It is about
                  creating lasting memories, connecting with cultures, and discovering
                  yourself along the way. Our curated experiences are designed to
                  inspire and transform.
                </p>
              )}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Expert Local Guides" },
                  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Safe & Trusted" },
                  { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Best Price Guarantee" },
                  { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", label: "Tailored Experiences" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--theme-primary)", color: "white" }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                    </div>
                    <span className="text-sm font-medium mt-2" style={{ color: "var(--theme-text)" }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p
                  className="text-sm font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--theme-accent)" }}
                >
                  From the Blog
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold"
                  style={{
                    color: "var(--theme-text)",
                    fontFamily: "var(--theme-font-heading)",
                  }}
                >
                  Stories &amp; Inspiration
                </h2>
              </div>
              <a
                href="/blog"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3"
                style={{ color: "var(--theme-primary)" }}
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  style={{ backgroundColor: "var(--theme-background)" }}
                >
                  {post.featuredImage ? (
                    <div className="aspect-16/10 overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div
                      className="aspect-16/10 flex items-center justify-center"
                      style={{ backgroundColor: "var(--theme-primary)", opacity: 0.15 }}
                    >
                      <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-6">
                    <h3
                      className="text-lg font-bold leading-snug group-hover:underline underline-offset-4"
                      style={{
                        color: "var(--theme-text)",
                        fontFamily: "var(--theme-font-heading)",
                      }}
                    >
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed opacity-60" style={{ color: "var(--theme-text)" }}>
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-xs opacity-40" style={{ color: "var(--theme-text)" }}>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : ""}
                      </p>
                      <span
                        className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ color: "var(--theme-primary)" }}
                      >
                        Read more &rarr;
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section
        className="py-20 md:py-24 relative overflow-hidden"
        style={{ backgroundColor: "var(--theme-primary)" }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 -translate-y-1/2 translate-x-1/3"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 translate-y-1/2 -translate-x-1/3"
          style={{ backgroundColor: "var(--theme-secondary)" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--theme-font-heading)" }}
          >
            Start Planning Your Journey
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Let us help you create the perfect itinerary. From breathtaking
            destinations to unique local experiences, your dream trip is just
            a conversation away.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              style={{
                backgroundColor: "var(--theme-accent)",
                color: "var(--theme-primary)",
              }}
            >
              Contact Us
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="/destinations"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white border-2 border-white/30 transition-all duration-300 hover:bg-white/10 hover:border-white/60"
            >
              Browse Trips
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 md:py-24" style={{ backgroundColor: "var(--theme-background)" }}>
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{
              color: "var(--theme-text)",
              fontFamily: "var(--theme-font-heading)",
            }}
          >
            Stay Inspired
          </h2>
          <p className="text-base opacity-60 mb-8" style={{ color: "var(--theme-text)" }}>
            Subscribe to our newsletter for exclusive deals, travel tips, and destination guides.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-full text-sm border transition-all duration-300 focus:outline-none focus:ring-2"
              style={{
                borderColor: "var(--theme-primary)",
                color: "var(--theme-text)",
                backgroundColor: "var(--theme-background)",
              }}
            />
            <button
              type="button"
              className="px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-md"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-xs opacity-40" style={{ color: "var(--theme-text)" }}>
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  );
}
