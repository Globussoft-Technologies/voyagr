interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80";

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
}: HeroSectionProps) {
  const bgImage = backgroundImage ?? defaultImage;

  return (
    <section className="relative min-h-screen flex items-center justify-center px-8 py-32 md:py-48 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)" }}
      />

      <div className="relative z-10 max-w-3xl text-center">
        {/* Single line of large text, pure typography */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-extralight leading-tight tracking-tight text-white drop-shadow-lg"
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-8 text-base font-light text-white/60 tracking-wide drop-shadow-md">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
