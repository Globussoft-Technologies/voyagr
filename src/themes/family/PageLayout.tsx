import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
      {/* Friendly page title with rounded accent */}
      <div className="text-center mb-12">
        <h1
          className="text-3xl md:text-4xl font-bold"
          style={{ color: "var(--theme-primary)" }}
        >
          {title}
        </h1>
        <div className="flex justify-center gap-1.5 mt-4">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "var(--theme-primary)" }}
          />
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "var(--theme-accent)" }}
          />
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "var(--theme-secondary)" }}
          />
        </div>
      </div>

      {/* Card-grid layout with rounded corners and soft shadows */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ color: "var(--theme-text)" }}
      >
        {children}
      </div>
    </div>
  );
}
