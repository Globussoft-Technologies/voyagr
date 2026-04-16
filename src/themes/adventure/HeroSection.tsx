interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const DEFAULT_BG =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80";

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
}: HeroSectionProps) {
  const bgUrl = backgroundImage || DEFAULT_BG;

  return (
    <section
      className="relative min-h-screen flex items-end overflow-hidden"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 92%, 0 100%)",
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Strong gradient from bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)",
        }}
      />

      {/* Content — bottom-left positioned */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-32 md:pb-40 pt-40">
        {/* Accent bar */}
        <div
          className="w-16 h-1.5 mb-6"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />

        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase leading-[0.9] text-white drop-shadow-2xl max-w-5xl"
          style={{ fontFamily: "var(--theme-font-heading)" }}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="mt-6 text-lg sm:text-xl md:text-2xl font-medium text-white/75 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/destinations"
            className="inline-flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{ backgroundColor: "var(--theme-accent)" }}
          >
            Start Your Adventure
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white border-2 border-white/30 hover:border-white/70 hover:bg-white/10 transition-all duration-300"
          >
            Read Stories
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-16 right-8 z-10 flex flex-col items-center gap-2 animate-bounce">
        <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
