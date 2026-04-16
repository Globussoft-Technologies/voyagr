interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80";

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
}: HeroSectionProps) {
  const bgImage = backgroundImage ?? defaultImage;

  return (
    <section
      className="relative min-h-screen w-full px-6 py-20 md:py-28 overflow-hidden"
    >
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

      {/* Collage-style tilted card backgrounds */}
      <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-20 pointer-events-none">
        <div
          className="w-48 h-64 rounded-2xl rotate-[-6deg] shadow-lg"
          style={{
            backgroundColor: "var(--theme-background)",
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="w-48 h-64 rounded-2xl rotate-[3deg] shadow-lg translate-y-8"
          style={{
            backgroundColor: "var(--theme-background)",
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "left center",
          }}
        />
        <div
          className="w-48 h-64 rounded-2xl rotate-[-4deg] shadow-lg -translate-y-4"
          style={{
            backgroundColor: "var(--theme-background)",
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "right center",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <h1
          className="text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-lg"
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-4 text-lg md:text-xl font-medium text-white/80 drop-shadow-md"
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
