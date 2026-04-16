import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
      {/* Earth-toned title area */}
      <div className="mb-10">
        <h1
          className="text-3xl md:text-4xl font-bold tracking-wider uppercase"
          style={{ color: "var(--theme-primary)" }}
        >
          {title}
        </h1>
        <div
          className="w-20 h-1 mt-3"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />
      </div>

      {/* Photo-gallery-friendly grid layout */}
      <div
        className="prose prose-lg max-w-none"
        style={{
          color: "var(--theme-text)",
          // Gallery-friendly: images within this area get responsive grid treatment
          // via Tailwind prose defaults with earth-toned accents
        }}
      >
        <div
          className="rounded-lg p-6 md:p-8"
          style={{
            backgroundColor: "var(--theme-secondary)",
            border: "1px solid var(--theme-accent)",
            opacity: 0.15,
            position: "absolute",
            inset: 0,
            zIndex: 0,
            borderRadius: "0.5rem",
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
