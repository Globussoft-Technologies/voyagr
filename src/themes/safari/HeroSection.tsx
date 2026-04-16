interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80";

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
}: HeroSectionProps) {
  const bgImage = backgroundImage ?? defaultImage;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-center px-6 py-32 md:py-44 overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Warm gradient overlay for landscape photos */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(101,67,33,0.55) 0%, rgba(85,107,47,0.45) 100%)",
        }}
      />

      {/* Horizontal rule accents */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <div
          className="w-16 h-0.5 mx-auto mb-6"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />
        <h1
          className="text-4xl md:text-6xl font-bold tracking-wider uppercase leading-tight"
          style={{ color: "#fff" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-5 text-lg md:text-xl font-light tracking-wide"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {subtitle}
          </p>
        )}
        <div
          className="w-16 h-0.5 mx-auto mt-6"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />
      </div>
    </section>
  );
}
