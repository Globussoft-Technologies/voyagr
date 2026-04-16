interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80";

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
}: HeroSectionProps) {
  const bgImage = backgroundImage ?? defaultImage;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-center px-6 py-24 md:py-36 overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Bright, warm overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(255,183,77,0.7) 0%, rgba(255,138,128,0.6) 100%)",
        }}
      />

      {/* Fun decorative shapes */}
      <div
        className="absolute top-8 left-8 w-20 h-20 rounded-full opacity-15"
        style={{ backgroundColor: "var(--theme-accent)" }}
      />
      <div
        className="absolute bottom-12 right-12 w-32 h-32 rounded-full opacity-10"
        style={{ backgroundColor: "var(--theme-primary)" }}
      />
      <div
        className="absolute top-1/4 right-1/4 w-14 h-14 rounded-2xl rotate-12 opacity-10"
        style={{ backgroundColor: "var(--theme-accent)" }}
      />

      {/* Rounded content card */}
      <div
        className="relative z-10 max-w-2xl mx-auto rounded-3xl px-8 py-10 md:px-12 md:py-14"
        style={{
          backgroundColor: "rgba(255,255,255,0.92)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          className="text-3xl md:text-5xl font-bold leading-snug"
          style={{ color: "var(--theme-primary)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-4 text-base md:text-lg font-medium"
            style={{ color: "var(--theme-text)", opacity: 0.75 }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
