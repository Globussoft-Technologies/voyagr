interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1920&q=80";

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
}: HeroSectionProps) {
  const bgImage = backgroundImage ?? defaultImage;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-center px-6 py-28 md:py-40 overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)" }}
      />

      {/* Mosaic / pattern-bordered centered text block */}
      <div className="relative z-10 max-w-2xl mx-auto">
        <div
          className="p-8 md:p-12"
          style={{
            border: "4px double var(--theme-accent)",
            backgroundColor: "rgba(0,0,0,0.45)",
          }}
        >
          {/* Ornamental top accent */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span
              className="block w-8 h-px"
              style={{ backgroundColor: "var(--theme-accent)" }}
            />
            <span
              className="block w-2 h-2 rotate-45"
              style={{ backgroundColor: "var(--theme-accent)" }}
            />
            <span
              className="block w-8 h-px"
              style={{ backgroundColor: "var(--theme-accent)" }}
            />
          </div>

          <h1
            className="text-3xl md:text-5xl font-serif font-bold leading-tight"
            style={{ color: "#fff" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="mt-4 text-base md:text-lg font-serif italic"
              style={{
                color: "rgba(255,255,255,0.85)",
                opacity: 0.9,
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Ornamental bottom accent */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <span
              className="block w-8 h-px"
              style={{ backgroundColor: "var(--theme-accent)" }}
            />
            <span
              className="block w-2 h-2 rotate-45"
              style={{ backgroundColor: "var(--theme-accent)" }}
            />
            <span
              className="block w-8 h-px"
              style={{ backgroundColor: "var(--theme-accent)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
