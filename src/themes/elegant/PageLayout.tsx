import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
      <h1
        className="text-3xl md:text-4xl font-serif italic text-center mb-12"
        style={{ color: "var(--theme-primary)" }}
      >
        {title}
      </h1>
      {/* Centered narrow column with drop-cap first letter, serif prose */}
      <div
        className="prose prose-lg max-w-none font-serif leading-[1.85] first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1"
        style={{
          color: "var(--theme-text)",
          "--tw-prose-links": "var(--theme-accent)",
        } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
