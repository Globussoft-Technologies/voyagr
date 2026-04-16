interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80";

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
}: HeroSectionProps) {
  const bgImage = backgroundImage ?? defaultImage;

  return (
    <section
      className="relative flex items-end px-6 py-20 md:py-32 overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)",
        }}
      />

      {/* Grid overlay for urban feel */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(var(--theme-accent) 1px, transparent 1px), linear-gradient(90deg, var(--theme-accent) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Bold city-style typography, aligned bottom-left */}
      <div className="relative z-10 max-w-3xl">
        <h1
          className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight"
          style={{ color: "#fff" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 flex items-center gap-3">
            <span
              className="block w-8 h-0.5"
              style={{ backgroundColor: "var(--theme-accent)" }}
            />
            <span
              className="text-sm md:text-base font-bold uppercase tracking-widest"
              style={{ color: "var(--theme-accent)" }}
            >
              {subtitle}
            </span>
          </p>
        )}
      </div>
    </section>
  );
}
