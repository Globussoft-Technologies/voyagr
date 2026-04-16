interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const DEFAULT_BG =
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80";

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
}: HeroSectionProps) {
  const bgUrl = backgroundImage || DEFAULT_BG;

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Gradient overlay — light top, dark bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-28 pt-40">
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-lg max-w-4xl"
          style={{ fontFamily: "var(--theme-font-heading)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-white/85 max-w-2xl leading-relaxed drop-shadow-md">
            {subtitle}
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/destinations"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
            style={{
              backgroundColor: "var(--theme-accent)",
              color: "var(--theme-primary)",
            }}
          >
            Explore Destinations
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white border-2 border-white/40 transition-all duration-300 hover:bg-white/10 hover:border-white/70"
          >
            Read Stories
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/60 text-xs uppercase tracking-widest">Scroll</span>
        <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
