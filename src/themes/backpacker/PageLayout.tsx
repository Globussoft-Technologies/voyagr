import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
      <h1
        className="text-3xl md:text-4xl font-extrabold mb-8 text-center"
        style={{ color: "var(--theme-primary)" }}
      >
        {title}
      </h1>

      {/* Card-based content area */}
      <div
        className="rounded-2xl p-6 md:p-10 shadow-sm"
        style={{
          backgroundColor: "var(--theme-background)",
          border: "2px solid var(--theme-primary)",
        }}
      >
        <div className="prose prose-lg max-w-none" style={{ color: "var(--theme-text)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
