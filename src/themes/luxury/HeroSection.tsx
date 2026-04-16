interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const DEFAULT_BG =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80";

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
}: HeroSectionProps) {
  const bgUrl = backgroundImage || DEFAULT_BG;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Very dark, subtle gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Content — centered with generous spacing */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-8">
        {/* Decorative accent line above */}
        <div
          className="mx-auto w-12 h-px mb-10"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />

        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-white tracking-wide"
          style={{ fontFamily: "var(--theme-font-heading)" }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="mt-8 text-base sm:text-lg md:text-xl font-light tracking-[0.08em] text-white/60 max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--theme-font-body)" }}
          >
            {subtitle}
          </p>
        )}

        {/* Decorative accent line below */}
        <div
          className="mx-auto mt-10 w-12 h-px"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />

        {/* Refined CTA */}
        <div className="mt-12">
          <a
            href="/destinations"
            className="inline-block px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-white border border-white/30 hover:border-white/70 hover:bg-white/5 transition-all duration-500"
          >
            Discover More
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 animate-bounce">
        <span className="text-white/40 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-8 bg-white/20" />
      </div>
    </section>
  );
}
