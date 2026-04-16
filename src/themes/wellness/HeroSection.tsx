interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=1920&q=80";

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
}: HeroSectionProps) {
  const bgImage = backgroundImage ?? defaultImage;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-center px-8 py-32 md:py-44 overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Soft gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(200,215,190,0.75) 0%, rgba(230,240,225,0.85) 100%)",
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto">
        {/* Decorative soft circle */}
        <div
          className="w-12 h-12 rounded-full mx-auto mb-6"
          style={{
            background: "linear-gradient(135deg, var(--theme-primary), var(--theme-accent))",
            opacity: 0.3,
          }}
        />

        <h1
          className="text-3xl md:text-5xl font-light leading-relaxed tracking-wide"
          style={{ color: "var(--theme-text)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-6 text-base md:text-lg font-light tracking-wider leading-relaxed"
            style={{
              color: "var(--theme-text)",
              opacity: 0.75,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
