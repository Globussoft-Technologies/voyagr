import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="max-w-2xl mx-auto px-8 py-16 md:py-24">
      {/* Zen-like centered title */}
      <div className="text-center mb-16">
        <div
          className="w-8 h-8 rounded-full mx-auto mb-6"
          style={{
            background: "linear-gradient(135deg, var(--theme-primary), var(--theme-accent))",
            opacity: 0.25,
          }}
        />
        <h1
          className="text-3xl md:text-4xl font-light tracking-wide"
          style={{ color: "var(--theme-primary)" }}
        >
          {title}
        </h1>
        <div
          className="w-12 h-px mx-auto mt-6"
          style={{ backgroundColor: "var(--theme-accent)", opacity: 0.5 }}
        />
      </div>

      {/* Single column with generous spacing */}
      <div
        className="prose prose-lg max-w-none leading-loose"
        style={{
          color: "var(--theme-text)",
          lineHeight: "2",
        }}
      >
        {children}
      </div>
    </div>
  );
}
