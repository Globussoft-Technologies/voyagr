interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80";

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
}: HeroSectionProps) {
  const bgImage = backgroundImage ?? defaultImage;
  // Split title to accent the last word
  const words = title.split(" ");
  const lastWord = words.pop();
  const restOfTitle = words.join(" ");

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
      style={{
        backgroundColor: "var(--theme-background, #000000)",
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)" }}
      />

      {/* Content — massive typography */}
      <div className="relative z-10 text-center max-w-6xl mx-auto">
        {/* Accent line above */}
        <div
          className="mx-auto w-16 h-1 mb-12"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />

        <h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.85] tracking-tighter"
          style={{ fontFamily: "var(--theme-font-heading)" }}
        >
          {restOfTitle && (
            <span className="text-white">{restOfTitle} </span>
          )}
          <span style={{ color: "var(--theme-accent)" }}>{lastWord}</span>
        </h1>

        {subtitle && (
          <p className="mt-10 text-lg sm:text-xl md:text-2xl font-light text-white/50 max-w-2xl mx-auto leading-relaxed tracking-wide">
            {subtitle}
          </p>
        )}

        {/* Accent line below */}
        <div
          className="mx-auto mt-12 w-16 h-1"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />

        {/* CTA */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="/destinations"
            className="inline-block px-10 py-4 text-sm font-bold uppercase tracking-widest text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{ backgroundColor: "var(--theme-accent)" }}
          >
            Explore
          </a>
          <a
            href="/blog"
            className="inline-block px-10 py-4 text-sm font-bold uppercase tracking-widest text-white border border-white/20 hover:border-white/60 hover:bg-white/5 transition-all duration-300"
          >
            Stories
          </a>
        </div>
      </div>

      {/* Minimal scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-px h-12" style={{ backgroundColor: "var(--theme-accent)", opacity: 0.4 }} />
      </div>
    </section>
  );
}
