interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80";

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
}: HeroSectionProps) {
  const bgImage = backgroundImage ?? defaultImage;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-center px-6 py-28 md:py-40"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)" }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Ornamental divider above */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="block w-12 h-px" style={{ backgroundColor: "var(--theme-accent)" }} />
          <span className="text-xs tracking-[0.3em] uppercase opacity-50 font-serif text-white">&#10045;</span>
          <span className="block w-12 h-px" style={{ backgroundColor: "var(--theme-accent)" }} />
        </div>

        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-serif italic leading-tight text-white drop-shadow-lg"
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-6 text-lg md:text-xl font-serif leading-relaxed text-white/80 drop-shadow-md"
          >
            {subtitle}
          </p>
        )}

        {/* Ornamental divider below */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className="block w-12 h-px" style={{ backgroundColor: "var(--theme-accent)" }} />
          <span className="text-xs tracking-[0.3em] uppercase opacity-50 font-serif text-white">&#10045;</span>
          <span className="block w-12 h-px" style={{ backgroundColor: "var(--theme-accent)" }} />
        </div>
      </div>
    </section>
  );
}
