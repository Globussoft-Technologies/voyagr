interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1920&q=80";

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

      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)" }}
      />

      {/* Full-bleed image with thin text overlay bar at bottom */}
      <div
        className="relative z-10 w-full px-8 py-5 flex items-center justify-between backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-light text-white tracking-wide">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-white/60 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className="hidden md:block w-2 h-2 rounded-full"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />
      </div>
    </section>
  );
}
