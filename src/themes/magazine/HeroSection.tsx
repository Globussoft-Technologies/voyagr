interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80";

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
}: HeroSectionProps) {
  const bgImage = backgroundImage ?? defaultImage;

  return (
    <section
      className="relative min-h-screen flex items-end"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark gradient overlay for editorial feel */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div className="relative z-10 max-w-4xl px-8 py-12 md:py-16">
        <span
          className="inline-block text-xs uppercase tracking-[0.2em] font-semibold mb-4 px-3 py-1"
          style={{ backgroundColor: "var(--theme-accent)", color: "var(--theme-background)" }}
        >
          Featured
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight text-white drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed drop-shadow-md">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
