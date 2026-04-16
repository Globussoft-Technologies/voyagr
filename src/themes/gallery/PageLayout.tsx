import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <h1
        className="text-2xl font-light tracking-wide mb-10"
        style={{ color: "var(--theme-primary)" }}
      >
        {title}
      </h1>
      {/* Masonry-style grid layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        <div
          className="break-inside-avoid rounded-lg overflow-hidden aspect-[4/3]"
          style={{ backgroundColor: "var(--theme-secondary)" }}
        />
        <div
          className="break-inside-avoid rounded-lg overflow-hidden aspect-square"
          style={{ backgroundColor: "var(--theme-primary)" }}
        />
        <div
          className="break-inside-avoid rounded-lg overflow-hidden aspect-[3/4]"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />
      </div>
      <div className="mt-12 prose prose-lg max-w-none" style={{ color: "var(--theme-text)" }}>
        {children}
      </div>
    </div>
  );
}
